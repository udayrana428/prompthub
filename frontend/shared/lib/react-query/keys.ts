export const queryKeys = {
  prompts: {
    all: ["prompts"] as const,
    list: (params: object) => ["prompts", "list", params] as const,
    trending: (params: object = {}) => ["prompts", "trending", params] as const,
    detail: (slug: string) => ["prompts", "detail", slug] as const,
    byUser: (userId: string) => ["prompts", "user", userId] as const,
  },
  tags: {
    all: ["tags"] as const,
    list: (params: object) => ["tags", "list", params] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: (params: object = {}) => ["categories", "list", params] as const,
  },
  user: {
    profile: (username: string) => ["user", "profile", username] as const,
    me: () => ["user", "me"] as const,
  },
  admin: {
    users: (params: object) => ["admin", "users", params] as const,
    prompts: (params: object) => ["admin", "prompts", params] as const,
    tags: (params: object) => ["admin", "tags", params] as const,
  },
} as const;
