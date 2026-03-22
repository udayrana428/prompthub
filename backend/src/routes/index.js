import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import promptRoutes from "../modules/prompt/prompt.routes.js";
import commentRoutes from "../modules/comment/comment.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";
import tagRoutes from "../modules/tag/tag.routes.js";
import trendingRoutes from "../modules/trending/trending.routes.js";
import notificationRoutes from "../modules/notification/notification.routes.js";
import socialRoutes from "../modules/social/social.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";

export const apiRouter = Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────
apiRouter.use("/auth", authRoutes);

// ─── Users ────────────────────────────────────────────────────────────────────
apiRouter.use("/users", userRoutes);
apiRouter.use("/users", socialRoutes); // follow/unfollow lives under /users/:userId/follow

// ─── Prompts + nested comments ────────────────────────────────────────────────
apiRouter.use("/prompts", promptRoutes);
apiRouter.use("/prompts/:promptId/comments", commentRoutes); // nested resource

// ─── Discovery ────────────────────────────────────────────────────────────────
apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/tags", tagRoutes);
apiRouter.use("/trending", trendingRoutes);

// ─── Authenticated user features ──────────────────────────────────────────────
apiRouter.use("/notifications", notificationRoutes);

// ─── Admin (to be built) ──────────────────────────────────────────────────────
apiRouter.use("/admin", adminRoutes);

// ─── 404 catch-all ────────────────────────────────────────────────────────────
// apiRouter.use("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     statusCode: 404,
//     message: `Route ${req.method} ${req.originalUrl} not found.`,
//   });
// });
