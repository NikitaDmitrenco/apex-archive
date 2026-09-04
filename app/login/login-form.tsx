"use client";

import { useTransition } from "react";

import { signIn } from "@/lib/auth/actions";

export function LoginForm({ error }: { error?: string }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      await signIn(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div>
        <label
          htmlFor="login-email"
          className="text-muted-foreground block font-mono text-[0.7rem] tracking-[0.14em] uppercase"
        >
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border-border bg-background focus:border-foreground mt-3 block w-full border-b px-0 py-2 font-sans text-base focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="text-muted-foreground block font-mono text-[0.7rem] tracking-[0.14em] uppercase"
        >
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="border-border bg-background focus:border-foreground mt-3 block w-full border-b px-0 py-2 font-sans text-base focus:outline-none"
        />
      </div>

      {error ? (
        <p className="text-destructive font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="border-border hover:border-foreground border px-4 py-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors disabled:pointer-events-none disabled:opacity-50"
      >
        Sign in
      </button>
    </form>
  );
}
