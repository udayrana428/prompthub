// Mirror of backend ROLE_HIERARCHY for UI decisions
export const canAccess = (userPermissions: string[], required: string) =>
  userPermissions.includes(required);

export const isAdmin = (roles: string[]) =>
  roles.some((r) => ["ADMIN", "SUPER_ADMIN"].includes(r));

export const isSuperAdmin = (roles: string[]) => roles.includes("SUPER_ADMIN");

export const isModerator = (roles: string[]) => roles.includes("MODERATOR");

export const isUser = (roles: string[]) => roles.includes("USER");
