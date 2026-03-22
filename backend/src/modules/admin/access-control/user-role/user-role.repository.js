import prisma from "../../../../db/index.js";

export const getUserRoles = (userId) =>
  prisma.userRoleMap.findMany({
    where: { userId },
    select: {
      role: {
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          isActive: true,
        },
      },
      assignedOn: true,
      assignedBy: {
        select: { id: true, username: true },
      },
    },
  });

export const findUserRole = (userId, roleId) =>
  prisma.userRoleMap.findFirst({ where: { userId, roleId } });

export const addUserRole = (userId, roleId, actorId, tx = prisma) =>
  tx.userRoleMap.create({
    data: { userId, roleId, assignedById: actorId },
  });

export const removeUserRole = (userId, roleId) =>
  prisma.userRoleMap.delete({
    where: { userId_roleId: { userId, roleId } },
  });

export const replaceUserRoles = async (
  userId,
  roleIds,
  actorId,
  tx = prisma,
) => {
  await tx.userRoleMap.deleteMany({ where: { userId } });
  if (roleIds.length) {
    await tx.userRoleMap.createMany({
      data: roleIds.map((roleId) => ({
        userId,
        roleId,
        assignedById: actorId,
      })),
      skipDuplicates: true,
    });
  }
};
