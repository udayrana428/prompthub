import prisma from "../../db/index.js";

const commentSelect = {
  id: true,
  content: true,
  status: true,
  edited: true,
  likesCount: true,
  repliesCount: true,
  parentId: true,
  createdOn: true,
  modifiedOn: true,
  user: {
    select: {
      id: true,
      username: true,
      slug: true,
      profile: { select: { displayName: true, avatarUrl: true } },
    },
  },
};

export const findComments = ({ promptId, where, skip, take }) =>
  prisma.promptComment.findMany({
    where: {
      promptId,
      deletedOn: null,
      status: "VISIBLE",
      parentId: null, // top-level only
      ...where,
    },
    skip,
    take,
    orderBy: { createdOn: "desc" },
    select: commentSelect,
  });

export const countComments = (promptId, where) =>
  prisma.promptComment.count({
    where: {
      promptId,
      deletedOn: null,
      status: "VISIBLE",
      parentId: null,
      ...where,
    },
  });

export const findReplies = ({ parentId, skip, take }) =>
  prisma.promptComment.findMany({
    where: { parentId, deletedOn: null, status: "VISIBLE" },
    skip,
    take,
    orderBy: { createdOn: "asc" }, // replies oldest first
    select: commentSelect,
  });

export const countReplies = (parentId) =>
  prisma.promptComment.count({
    where: { parentId, deletedOn: null, status: "VISIBLE" },
  });

export const findCommentById = (id) =>
  prisma.promptComment.findFirst({ where: { id, deletedOn: null } });

export const createComment = (data) =>
  prisma.$transaction(async (tx) => {
    const comment = await tx.promptComment.create({
      data,
      select: commentSelect,
    });

    // Increment prompt comment count
    await tx.prompt.update({
      where: { id: data.promptId },
      data: { commentsCount: { increment: 1 } },
    });

    // If it's a reply, increment parent repliesCount
    if (data.parentId) {
      await tx.promptComment.update({
        where: { id: data.parentId },
        data: { repliesCount: { increment: 1 } },
      });
    }

    return comment;
  });

export const updateComment = (id, content) =>
  prisma.promptComment.update({
    where: { id },
    data: { content, edited: true },
    select: commentSelect,
  });

export const softDeleteComment = (id, deletedById, promptId, parentId) =>
  prisma.$transaction(async (tx) => {
    await tx.promptComment.update({
      where: { id },
      data: {
        deletedOn: new Date(),
        deletedById,
        status: "DELETED",
      },
    });

    await tx.prompt.update({
      where: { id: promptId },
      data: { commentsCount: { decrement: 1 } },
    });

    if (parentId) {
      await tx.promptComment.update({
        where: { id: parentId },
        data: { repliesCount: { decrement: 1 } },
      });
    }
  });

// Like operations
export const findCommentLike = (commentId, userId) =>
  prisma.commentLike.findFirst({ where: { commentId, userId } });

export const createCommentLike = (commentId, userId) =>
  prisma.$transaction([
    prisma.commentLike.create({ data: { commentId, userId } }),
    prisma.promptComment.update({
      where: { id: commentId },
      data: { likesCount: { increment: 1 } },
    }),
  ]);

export const deleteCommentLike = (commentId, userId) =>
  prisma.$transaction([
    prisma.commentLike.deleteMany({ where: { commentId, userId } }),
    prisma.promptComment.update({
      where: { id: commentId },
      data: { likesCount: { decrement: 1 } },
    }),
  ]);
