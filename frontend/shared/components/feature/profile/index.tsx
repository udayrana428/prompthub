import type { UserAccount, UserPrompt } from "@/shared/api/modules/user.api";
import { PublicProfileHero } from "./components/public-profile-hero";
import { PublicProfilePrompts } from "./components/public-profile-prompts";

interface PublicProfileProps {
  user: UserAccount;
}

export function PublicProfilePage({ user }: PublicProfileProps) {
  return (
    <div className="pb-12">
      <PublicProfileHero user={user} />

      <section className="container mx-auto px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Public Prompts
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Published prompts from this creator.
            </p>
          </div>
        </div>

        <PublicProfilePrompts slug={user.slug} />
      </section>
    </div>
  );
}
