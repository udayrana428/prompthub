// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Standalone client — seed runs as isolated process, not alongside the app server
// Do NOT import from ../../src/db/index.js — that module assumes Express app context
const prisma = new PrismaClient({
  log: ["warn", "error"], // see warnings during seed without query noise
});

// ── 1. ALL PERMISSIONS ─────────────────────────────────────────────────────────
const permissions = [
  // Roles
  { code: "ROLE_CREATE", name: "Create Role", module: "ACCESS_CONTROL" },
  { code: "ROLE_READ", name: "Read Roles", module: "ACCESS_CONTROL" },
  { code: "ROLE_UPDATE", name: "Update Role", module: "ACCESS_CONTROL" },
  { code: "ROLE_DELETE", name: "Delete Role", module: "ACCESS_CONTROL" },

  // Permissions
  {
    code: "PERMISSION_CREATE",
    name: "Create Permission",
    module: "ACCESS_CONTROL",
  },
  {
    code: "PERMISSION_READ",
    name: "Read Permissions",
    module: "ACCESS_CONTROL",
  },
  {
    code: "PERMISSION_UPDATE",
    name: "Update Permission",
    module: "ACCESS_CONTROL",
  },
  {
    code: "PERMISSION_DELETE",
    name: "Delete Permission",
    module: "ACCESS_CONTROL",
  },

  // Menus
  { code: "MENU_CREATE", name: "Create Menu", module: "ACCESS_CONTROL" },
  { code: "MENU_READ", name: "Read Menus", module: "ACCESS_CONTROL" },
  { code: "MENU_UPDATE", name: "Update Menu", module: "ACCESS_CONTROL" },
  { code: "MENU_DELETE", name: "Delete Menu", module: "ACCESS_CONTROL" },

  // User Role Assignment
  { code: "USER_ROLE_READ", name: "Read User Roles", module: "ACCESS_CONTROL" },
  {
    code: "USER_ROLE_ASSIGN",
    name: "Assign Roles to User",
    module: "ACCESS_CONTROL",
  },

  // Users
  { code: "USER_READ", name: "Read Users", module: "USER_MANAGEMENT" },
  { code: "USER_UPDATE", name: "Update User", module: "USER_MANAGEMENT" },
  { code: "USER_DELETE", name: "Delete User", module: "USER_MANAGEMENT" },
  { code: "USER_SUSPEND", name: "Suspend User", module: "USER_MANAGEMENT" },
  { code: "USER_BAN", name: "Ban User", module: "USER_MANAGEMENT" },

  // Prompts
  { code: "PROMPT_READ", name: "Read All Prompts", module: "CONTENT" },
  { code: "PROMPT_UPDATE", name: "Update Any Prompt", module: "CONTENT" },
  { code: "PROMPT_DELETE", name: "Delete Any Prompt", module: "CONTENT" },
  { code: "PROMPT_APPROVE", name: "Approve Prompt", module: "CONTENT" },
  { code: "PROMPT_REJECT", name: "Reject Prompt", module: "CONTENT" },
  { code: "PROMPT_FEATURE", name: "Feature a Prompt", module: "CONTENT" },

  // Categories
  { code: "CATEGORY_CREATE", name: "Create Category", module: "CONTENT" },
  { code: "CATEGORY_READ", name: "Read Categories", module: "CONTENT" },
  { code: "CATEGORY_UPDATE", name: "Update Category", module: "CONTENT" },
  { code: "CATEGORY_DELETE", name: "Delete Category", module: "CONTENT" },

  // Tags
  { code: "TAG_READ", name: "Read Tags", module: "CONTENT" },
  { code: "TAG_CREATE", name: "Create Tag", module: "CONTENT" },
  { code: "TAG_UPDATE", name: "Update Tag", module: "CONTENT" },
  { code: "TAG_APPROVE", name: "Approve Tag", module: "CONTENT" },
  { code: "TAG_REJECT", name: "Reject Tag", module: "CONTENT" },
  { code: "TAG_DELETE", name: "Delete Tag", module: "CONTENT" },

  // Comments
  { code: "COMMENT_READ", name: "Read All Comments", module: "CONTENT" },
  { code: "COMMENT_HIDE", name: "Hide Comment", module: "CONTENT" },
  { code: "COMMENT_DELETE", name: "Delete Any Comment", module: "CONTENT" },

  // Reports
  { code: "REPORT_READ", name: "Read Reports", module: "MODERATION" },
  { code: "REPORT_RESOLVE", name: "Resolve Report", module: "MODERATION" },

  // Dashboard
  { code: "DASHBOARD_READ", name: "View Admin Dashboard", module: "DASHBOARD" },
];

// ── 2. ROLE → PERMISSION MAPPING ──────────────────────────────────────────────
const rolePermissions = {
  SUPER_ADMIN: permissions.map((p) => p.code), // all permissions

  ADMIN: [
    "ROLE_READ",
    "USER_ROLE_READ",
    "USER_ROLE_ASSIGN",
    "USER_READ",
    "USER_UPDATE",
    "USER_SUSPEND",
    "USER_BAN",
    "PROMPT_READ",
    "PROMPT_UPDATE",
    "PROMPT_DELETE",
    "PROMPT_APPROVE",
    "PROMPT_REJECT",
    "PROMPT_FEATURE",
    "CATEGORY_CREATE",
    "CATEGORY_READ",
    "CATEGORY_UPDATE",
    "CATEGORY_DELETE",
    "TAG_READ",
    "TAG_CREATE",
    "TAG_UPDATE",
    "TAG_APPROVE",
    "TAG_REJECT",
    "TAG_DELETE",
    "COMMENT_READ",
    "COMMENT_HIDE",
    "COMMENT_DELETE",
    "REPORT_READ",
    "REPORT_RESOLVE",
    "DASHBOARD_READ",
    "MENU_READ",
    "PERMISSION_READ",
  ],

  MODERATOR: [
    "PROMPT_READ",
    "PROMPT_APPROVE",
    "PROMPT_REJECT",
    "TAG_READ",
    "TAG_APPROVE",
    "TAG_REJECT",
    "COMMENT_READ",
    "COMMENT_HIDE",
    "COMMENT_DELETE",
    "REPORT_READ",
    "REPORT_RESOLVE",
    "DASHBOARD_READ",
  ],

  USER: [], // no admin permissions — all their access is handled at route level by requireAuth only
};

// ── 3. ROLES ───────────────────────────────────────────────────────────────────
const roles = [
  {
    name: "Super Admin",
    code: "SUPER_ADMIN",
    description:
      "Full unrestricted access to all system features including roles, permissions, and menus.",
    isSystem: true,
    isActive: true,
  },
  {
    name: "Admin",
    code: "ADMIN",
    description:
      "Manages users, content moderation, categories, and tags. Cannot touch system-level access control.",
    isSystem: true,
    isActive: true,
  },
  {
    name: "Moderator",
    code: "MODERATOR",
    description:
      "Reviews and moderates prompts, comments, and tags. No user management or system access.",
    isSystem: true,
    isActive: true,
  },
  {
    name: "User",
    code: "USER",
    description:
      "Default role for all registered users. Can create prompts, interact with content, and manage their own profile.",
    isSystem: true,
    isActive: true,
  },
];

// ── MAIN ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Starting seed...\n");

  // Step 1: Seed permissions — parallel upserts instead of sequential
  console.log("📝 Seeding permissions...");
  await Promise.all(
    permissions.map((perm) =>
      prisma.permission.upsert({
        where: { code: perm.code },
        update: { name: perm.name, module: perm.module, isSystem: true },
        create: {
          name: perm.name,
          code: perm.code,
          module: perm.module,
          isSystem: true,
          isActive: true,
        },
      }),
    ),
  );
  console.log(`   ✅ ${permissions.length} permissions upserted.\n`);

  // Step 2: Seed roles — parallel upserts
  console.log("👑 Seeding roles...");
  await Promise.all(
    roles.map((role) =>
      prisma.role.upsert({
        where: { code: role.code },
        update: {
          name: role.name,
          description: role.description,
          isSystem: true,
        },
        create: role,
      }),
    ),
  );
  console.log(`   ✅ ${roles.length} roles upserted.\n`);

  // Step 3: Role-permission assignment — still sequential per role but batch per role
  console.log("🔗 Assigning permissions to roles...");
  for (const [roleCode, permCodes] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUnique({ where: { code: roleCode } });
    if (!role) continue;

    await prisma.rolePermissionMap.deleteMany({ where: { roleId: role.id } });

    if (permCodes.length) {
      const perms = await prisma.permission.findMany({
        where: { code: { in: permCodes } },
        select: { id: true },
      });

      await prisma.rolePermissionMap.createMany({
        data: perms.map((p) => ({ roleId: role.id, permissionId: p.id })),
        skipDuplicates: true,
      });
    }

    console.log(
      `   ✅ ${roleCode} → ${permCodes.length} permissions assigned.`,
    );
  }
  console.log();

  // ── Step 4: Create super admin user ──────────────────────────────────────────
  console.log("👤 Seeding super admin user...");

  const SUPER_ADMIN_EMAIL =
    process.env.SUPER_ADMIN_EMAIL || "superadmin@prompthub.com";
  const SUPER_ADMIN_USERNAME = process.env.SUPER_ADMIN_USERNAME || "superadmin";
  const SUPER_ADMIN_PASSWORD =
    process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";

  const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

  const superAdminUser = await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: {},
    create: {
      email: SUPER_ADMIN_EMAIL,
      username: SUPER_ADMIN_USERNAME,
      slug: SUPER_ADMIN_USERNAME,
      password: passwordHash,
      status: "ACTIVE",
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      loginType: "EMAIL",
      profile: {
        create: {
          displayName: "Super Admin",
        },
      },
    },
  });

  console.log(`   ✅ Super admin user: ${SUPER_ADMIN_EMAIL}\n`);

  // ── Step 5: Assign SUPER_ADMIN role to that user ─────────────────────────────
  console.log("🎭 Assigning SUPER_ADMIN role to super admin user...");

  const superAdminRole = await prisma.role.findUnique({
    where: { code: "SUPER_ADMIN" },
  });

  await prisma.userRoleMap.upsert({
    where: {
      userId_roleId: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: superAdminUser.id,
      roleId: superAdminRole.id,
    },
  });

  console.log(`   ✅ SUPER_ADMIN role assigned.\n`);
  console.log("🎉 Seed complete!\n");
  console.log("─────────────────────────────────────────");
  console.log(`  Email    : ${SUPER_ADMIN_EMAIL}`);
  console.log(`  Password : ${SUPER_ADMIN_PASSWORD}`);
  console.log("─────────────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

//   PS D:\Projects\promptly\backend> npm run db:seed

// > chai_backend@1.0.0 db:seed
// > node -r dotenv/config ./prisma/seed.js

// 🌱 Starting seed...

// 📝 Seeding permissions...
//    ✅ 39 permissions upserted.

// 👑 Seeding roles...
//    ✅ 4 roles upserted.

// 🔗 Assigning permissions to roles...
//    ✅ SUPER_ADMIN → 39 permissions assigned.
//    ✅ ADMIN → 29 permissions assigned.
//    ✅ MODERATOR → 12 permissions assigned.
//    ✅ USER → 0 permissions assigned.

// 👤 Seeding super admin user...
//    ✅ Super admin user: superadmin@prompthub.com

// 🎭 Assigning SUPER_ADMIN role to super admin user...
//    ✅ SUPER_ADMIN role assigned.

// 🎉 Seed complete!

// ─────────────────────────────────────────
//   Email    : superadmin@prompthub.com
//   Password : SuperAdmin@123
// ─────────────────────────────────────────
