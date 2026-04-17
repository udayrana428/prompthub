"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Form, Formik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { z } from "zod";
import { commentApi } from "@/shared/api";
import { useAppSelector } from "@/shared/redux/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { FormikTextareaField } from "@/shared/components/ui/formik-field";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { createFormikValidator } from "@/shared/lib/formik";
import { ROUTES } from "@/shared/lib/routes";
import { appToast } from "@/shared/lib/toastify/toast";
import { useRouter } from "next/navigation";

interface PromptCommentsProps {
  promptId: string;
}

const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(1000, "Comment must be 1000 characters or fewer."),
});

export function PromptComments({ promptId }: PromptCommentsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["comments", promptId],
    queryFn: () =>
      commentApi.client.listComments(promptId, { limit: 20, page: 1 }),
    staleTime: 1000 * 60,
  });

  const createComment = useMutation({
    mutationFn: (content: string) =>
      commentApi.client.createComment(promptId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", promptId] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });

  const comments = useMemo(() => data?.data.data ?? [], [data]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Discussion ({comments.length})</span>
                <Badge variant="secondary" className="text-xs">
                  Community Guidelines Apply
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-card-foreground">
                  Share your experience with this prompt
                </h3>
                <Formik
                  initialValues={{ content: "" }}
                  validate={createFormikValidator(commentSchema)}
                  onSubmit={async (values, helpers) => {
                    if (!isAuthenticated) {
                      appToast.info("Sign in to join the discussion.");
                      helpers.setSubmitting(false);
                      router.push(ROUTES.LOGIN);
                      return;
                    }

                    try {
                      await createComment.mutateAsync(values.content.trim());
                      helpers.resetForm();
                      // appToast.success("Comment posted.");
                    } catch (err: any) {
                      if (err?.errors?.length > 0) {
                        err?.errors[0]?.message &&
                          appToast.error(err?.errors[0]?.message);
                      } else if (err?.message) {
                        appToast.error(
                          err?.message || "Your comment could not be posted.",
                        );
                      }
                    } finally {
                      helpers.setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting, values }) => (
                    <Form className="space-y-4" noValidate>
                      <FormikTextareaField
                        name="content"
                        placeholder="Share your results, tips, or ask questions about this prompt..."
                        className="min-h-[100px]"
                        disabled={!isAuthenticated || createComment.isPending}
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {isAuthenticated
                            ? "Be respectful and constructive. Share your results and help others."
                            : "Sign in to join the discussion."}
                        </p>
                        <Button
                          type="submit"
                          disabled={
                            !isAuthenticated ||
                            !values.content.trim() ||
                            isSubmitting ||
                            createComment.isPending
                          }
                        >
                          {isSubmitting || createComment.isPending
                            ? "Posting..."
                            : "Post Comment"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              <div className="space-y-6">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">
                    Loading comments...
                  </div>
                ) : isError ? (
                  <div className="text-sm text-destructive">
                    Comments could not be loaded.
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No comments yet. Start the conversation.
                  </div>
                ) : (
                  comments.map((comment) => {
                    const authorName =
                      comment.user.profile?.displayName ||
                      comment.user.username;

                    return (
                      <div key={comment.id} className="space-y-4">
                        <div className="flex justify-between">
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage
                                src={
                                  comment.user.profile?.avatarUrl ||
                                  "/placeholder.svg"
                                }
                                alt={authorName}
                              />
                              <AvatarFallback>{authorName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={ROUTES.PROFILE(comment.user.slug)}
                                  className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                  {authorName}
                                </Link>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.createdOn).toLocaleString()}
                                </span>
                                {comment.edited ? (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px]"
                                  >
                                    Edited
                                  </Badge>
                                ) : null}
                              </div>
                              <p className="text-sm text-foreground">
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-4">
                                {comment.repliesCount > 0 ? (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {comment.repliesCount} repl
                                    {comment.repliesCount === 1 ? "y" : "ies"}
                                  </Badge>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="ml-10">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              disabled
                            >
                              <Heart className="mr-1 h-3 w-3" />
                              {comment.likesCount}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
