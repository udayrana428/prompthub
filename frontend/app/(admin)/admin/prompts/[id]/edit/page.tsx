import { PromptCreate } from "@/shared/components/feature/admin/prompts/prompt-create";

export default function AdminPromptEditPage({
  params,
}: {
  params: { id: string };
}) {
  return <PromptCreate id={params.id} />;
}
