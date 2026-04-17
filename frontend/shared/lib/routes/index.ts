export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROMPTS: "/prompts",
  PROMPT: (slug: string) => `/prompts/${slug}`,
  PROFILE: (username: string) => `/profile/${username}`,
  ACCOUNT: "/account",
  ACCOUNT_NOTIFICATIONS: "/account/notifications",
  ADMIN: {
    ROOT: "/admin",
    LOGIN: "/admin/login",
    USERS: "/admin/users",
    PROMPTS: "/admin/prompts",
    TAGS: "/admin/tags",
    ROLES: "/admin/access-control/roles",
  },
} as const;
