import { requireAuth } from "../../middlewares/auth.middleware.js";
import { Router } from "express";

import permissionRoutes from "./access-control/permission/permission.routes.js";
import roleRoutes from "./access-control/role/role.routes.js";
import menuRoutes from "./access-control/menu/menu.routes.js";
import userRoleRoutes from "./access-control/user-role/user-role.routes.js";

import categoryRoutes from "./category/admin.category.routes.js";
import tagRoutes from "./tag/admin.tag.routes.js";
import promptRoutes from "./prompt/admin.prompt.routes.js";

const adminRoutes = Router();

adminRoutes.use(requireAuth);

// Access Control
adminRoutes.use("/access-control/permissions", permissionRoutes);
adminRoutes.use("/access-control/roles", roleRoutes);
adminRoutes.use("/access-control/menus", menuRoutes);
adminRoutes.use("/access-control/users", userRoleRoutes);

adminRoutes.use("/categories", categoryRoutes);
adminRoutes.use("/tags", tagRoutes);
adminRoutes.use("/prompts", promptRoutes);

export default adminRoutes;
