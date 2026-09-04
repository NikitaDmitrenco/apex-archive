"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, type FormEvent, type ReactNode } from "react";

const selectClass =
  "border-border bg-background text-foreground focus-visible:ring-ring w-full appearance-none border px-3 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase focus-visible:ring-2 focus-visible:outline-none";

const labelClass =
  "text-muted-foreground mb-2 block font-mono text-[0.65rem] tracking-[0.14em] uppercase";

export function FilterSelect({
  label,
  name,
  value,
  placeholder,
  children,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={`filter-${name}`}>
        {label}
      </label>
      <select
        id={`filter-${name}`}
        name={name}
        defaultValue={value}
        className={selectClass}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </div>
  );
}

export function FilterToggle({
  label,
  name,
  checked,
}: {
  label: string;
  name: string;
  checked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 font-mono text-[0.7rem] tracking-[0.12em] uppercase">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={checked}
        className="border-border accent-primary size-4 border"
      />
      {label}
    </label>
  );
}

type FilterBarProps = {
  /** Route the form submits to, e.g. "/cars". */
  action: string;
  hasFilters: boolean;
  resultCount: number;
  countNoun: [singular: string, plural: string];
  /** Select fields, laid out in the responsive grid. */
  children: ReactNode;
  /** Checkboxes and anything else that sits on the control row. */
  toggles?: ReactNode;
};

/**
 * A plain GET form, so filtering works with scripting disabled. Where scripting is
 * available the submission is intercepted for two reasons: empty selects would otherwise
 * submit as `field=` and clutter the URL, and the filters can then apply on change without
 * the extra click. The Apply button stays for the no-script path.
 */
export function FilterBar({
  action,
  hasFilters,
  resultCount,
  countNoun,
  children,
  toggles,
}: FilterBarProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget).entries()) {
      if (typeof value === "string" && value !== "") params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `${action}?${query}` : action);
  }

  return (
    <form
      ref={formRef}
      method="get"
      action={action}
      onSubmit={handleSubmit}
      onChange={() => formRef.current?.requestSubmit()}
      className="border-border border-b pb-10"
    >
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {children}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6">{toggles}</div>

        <div className="flex items-center gap-6">
          <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.12em] uppercase">
            {resultCount} {resultCount === 1 ? countNoun[0] : countNoun[1]}
          </span>
          <button
            type="submit"
            className="border-border hover:bg-accent focus-visible:ring-ring border px-4 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Apply
          </button>
          {hasFilters ? (
            <Link
              href={action}
              className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.12em] uppercase transition-colors"
            >
              Reset
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}
