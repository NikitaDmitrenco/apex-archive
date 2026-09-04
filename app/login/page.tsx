import Link from "next/link";

import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { LoginForm } from "@/app/login/login-form";

export const metadata = {
  title: "Sign in",
};

type SearchParams = Promise<{ error?: string; message?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, message } = await searchParams;

  return (
    <Container>
      <Section className="max-w-md">
        <Eyebrow>Account</Eyebrow>
        <Display as="h1" size="md" className="mt-6">
          Sign in
        </Display>
        <Lede className="mt-6">
          Saved cars, drivers and more across visits.
        </Lede>

        {message ? (
          <p className="border-border text-muted-foreground mt-10 border-t pt-6 leading-relaxed">
            {message}
          </p>
        ) : null}

        <LoginForm error={error} />

        <p className="text-muted-foreground mt-10 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          No account?{" "}
          <Link
            href="/signup"
            className="text-foreground hover:text-primary transition-colors"
          >
            Sign up
          </Link>
        </p>
      </Section>
    </Container>
  );
}
