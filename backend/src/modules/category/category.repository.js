import prisma from "../../db/index.js";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  isActive: true,
  isSystem: true,
  parentId: true,
  parent: { select: { id: true, name: true, slug: true } },
  children: {
    where: { deletedOn: null, isActive: true },
    select: { id: true, name: true, slug: true },
  },
  createdOn: true,
};

export const findCategories = ({ where, skip, take }) =>
  prisma.category.findMany({
    where,
    skip,
    take,
    orderBy: { name: "asc" },
    select: categorySelect,
  });

export const countCategories = (where) => prisma.category.count({ where });

export const findCategoryBySlug = (slug) =>
  prisma.category.findFirst({
    where: { slug, deletedOn: null },
    select: categorySelect,
  });

export const findCategoryById = (id) =>
  prisma.category.findFirst({
    where: { id, deletedOn: null },
  });

export const createCategory = (data) =>
  prisma.category.create({ data, select: categorySelect });

export const updateCategory = (id, data) =>
  prisma.category.update({ where: { id }, data, select: categorySelect });

export const softDeleteCategory = (id, deletedById) =>
  prisma.category.update({
    where: { id },
    data: { deletedOn: new Date(), deletedById },
  });

export const findCategoryByName = (name) =>
  prisma.category.findFirst({ where: { name, deletedOn: null } });

export const findCategoryByNameExcluding = (name, excludeId) =>
  prisma.category.findFirst({
    where: { name, deletedOn: null, NOT: { id: excludeId } },
  });

export const getCategoryPrompts = ({
  categoryId,
  where,
  skip,
  take,
  orderBy,
}) =>
  prisma.prompt.findMany({
    where: { categoryId, deletedOn: null, status: "APPROVED", ...where },
    skip,
    take,
    orderBy,
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      imageUrl: true,
      modelType: true,
      likesCount: true,
      viewsCount: true,
      commentsCount: true,
      favoritesCount: true,
      featured: true,
      createdOn: true,
      createdBy: {
        select: {
          id: true,
          username: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
      tags: {
        select: { tag: { select: { id: true, name: true, slug: true } } },
      },
    },
  });

export const countCategoryPrompts = (categoryId, where) =>
  prisma.prompt.count({
    where: { categoryId, deletedOn: null, status: "APPROVED", ...where },
  });
