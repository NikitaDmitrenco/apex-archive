import Link from "next/link";

import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { SignupForm } from "@/app/signup/signup-form";

export const metadata = {
  title: "Sign up",
};

type SearchParams = Promise<{ error?: string }>;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;

  return (
    <Container>
      <Section className="max-w-md">
        <Eyebrow>Account</Eyebrow>
        <Display as="h1" size="md" className="mt-6">
          Sign up
        </Display>
        <Lede className="mt-6">
          Saved cars, drivers and more across visits. Confirm your email to
          finish creating the account.
        </Lede>

        <SignupForm error={error} />

        <p className="text-muted-foreground mt-10 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-foreground hover:text-primary transition-colors"
          >
            Sign in
          </Link>
        </p>
      </Section>
    </Container>
  );
}
