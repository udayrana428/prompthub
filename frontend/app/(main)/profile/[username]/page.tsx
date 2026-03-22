import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfilePage } from "@/shared/components/feature/profile";
import { userApi } from "@/shared/api";
import { buildMetadata, notFoundMetadata } from "@/shared/lib/seo";
import { env } from "@/shared/lib/env";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const result = await userApi.server.getPublicProfile(params.username);

  if (!result.success) return notFoundMetadata;

  const user = result.data.user;
  const profile = user.profile;
  const displayName = profile?.displayName || profile?.firstName || user.username;
  const description =
    profile?.bio ||
    `Explore public AI prompts shared by ${displayName} on PromptHub.`;

  return buildMetadata({
    title: `${displayName} (@${user.username}) | PromptHub`,
    description,
    keywords: [
      displayName,
      user.username,
      "PromptHub creator",
      "AI prompts",
      "public profile",
    ],
    image: profile?.avatarUrl || "/og-default.png",
    url: `${env.NEXT_PUBLIC_APP_URL}/profile/${user.slug}`,
    noIndex: false,
  });
}

export const revalidate = 300;

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const [profileResult, promptsResult] = await Promise.all([
    userApi.server.getPublicProfile(params.username),
    userApi.server.getUserPrompts(params.username, { page: 1, limit: 12 }),
  ]);

  if (!profileResult.success) {
    notFound();
  }

  return (
    <PublicProfilePage
      user={profileResult.data.user}
      prompts={promptsResult.success ? promptsResult.data.data : []}
      pagination={promptsResult.success ? promptsResult.data.pagination : undefined}
    />
  );
}
