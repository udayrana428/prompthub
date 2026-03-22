import { AccountOverviewPage } from "@/shared/components/feature/account";

export const metadata = {
  title: "My Profile - PromptHub | Manage Your AI Prompts",
  description:
    "Manage your saved prompts, view your prompt history, and track your AI art journey. Access your bookmarked prompts and shared creations.",
  keywords:
    "user profile, saved prompts, bookmarks, AI art profile, prompt history",
};

export default function Page() {
  return <AccountOverviewPage />;
}
