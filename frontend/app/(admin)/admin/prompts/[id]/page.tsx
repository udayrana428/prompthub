import { PromptDetail } from "@/shared/components/feature/admin/prompts/prompt-detail";

export default function AdminPromptDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <PromptDetail id={params.id} />;
}
