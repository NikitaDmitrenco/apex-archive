import { redirect } from "next/navigation";

import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { FavoritesList } from "@/components/account/favorites-list";
import { SignOutButton } from "@/app/account/sign-out-button";
import { getCurrentUser } from "@/lib/auth/queries";
import { listFavorites } from "@/lib/db/queries/favorites";
import { orDash } from "@/lib/format";

export const metadata = {
  title: "Your archive",
};

/**
 * The account page is gated: an anonymous visitor gets redirected to /login so the
 * favourites list never renders as "you have nothing" when actually nothing was fetched.
 */
export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const favorites = await listFavorites(user.id);

  return (
    <Container>
      <Section className="max-w-2xl">
        <Eyebrow>Account</Eyebrow>
        <Display as="h1" size="md" className="mt-6">
          Your archive
        </Display>
        <Lede className="mt-6">
          Everything you have saved in one place. Sign out below to clear the
          session.
        </Lede>

        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-6">
          <div>
            <Eyebrow>Signed in as</Eyebrow>
            <p className="mt-4 font-mono text-sm">{orDash(user.email)}</p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-16">
          <Eyebrow>Saved</Eyebrow>
          <FavoritesList favorites={favorites} />
        </div>
      </Section>
    </Container>
  );
}
