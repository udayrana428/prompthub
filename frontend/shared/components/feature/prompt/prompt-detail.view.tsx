"use client";

import { PromptDetail } from "./components/prompt-detail";
import { RelatedPrompts } from "./components/related-prompts";
import { PromptComments } from "./components/prompt-comments";
import { usePromptDetail } from "./hooks/use-prompts";
import type { PromptDetail as PromptDetailType } from "./types";

const PromptDetailPage = ({ prompt }: { prompt: PromptDetailType }) => {
  const { data } = usePromptDetail(prompt.slug);
  const resolvedPrompt = data?.data.prompt ?? prompt;

  return (
    <>
      <PromptDetail prompt={resolvedPrompt} />
      <RelatedPrompts
        currentPromptId={resolvedPrompt.id}
        currentPromptSlug={resolvedPrompt.slug}
        categorySlug={resolvedPrompt.category.slug}
        categoryName={resolvedPrompt.category.name}
      />
      <PromptComments promptId={resolvedPrompt.id} />
    </>
  );
};

export default PromptDetailPage;
