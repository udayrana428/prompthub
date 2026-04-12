"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Flag,
  Tags,
  FolderOpen,
  BarChart3,
  Bell,
  FileCheck,
  Home,
  Shield,
  Menu,
  Lock,
  ChevronRight,
  DollarSign,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  name: string;
  code: string;
  path: string | null;
  icon: string | null;
  order: number;
  isVisible: boolean;
  isActive: boolean;
  parentId: string | null;
  children?: MenuItem[];
}

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  users: Users,
  prompts: FileText,
  reports: Flag,
  tags: Tags,
  categories: FolderOpen,
  analytics: BarChart3,
  notifications: Bell,
  audit: FileCheck,
  "access-control": Shield,
  menus: Menu,
  permissions: Lock,
  monetization: DollarSign,
};

const DEFAULT_ICON = FileText;

function getIcon(iconCode: string | null): React.ElementType {
  if (!iconCode) return DEFAULT_ICON;
  return ICON_MAP[iconCode.toLowerCase()] ?? DEFAULT_ICON;
}

// ─── Dummy Data (replace with useQuery once API is ready) ─────────────────────

const DUMMY_MENUS: MenuItem[] = [
  {
    id: "1",
    name: "Dashboard",
    code: "dashboard",
    path: "/admin",
    icon: "dashboard",
    order: 1,
    isVisible: true,
    isActive: true,
    parentId: null,
  },
  {
    id: "2",
    name: "User Management",
    code: "users",
    path: "/admin/users",
    icon: "users",
    order: 2,
    isVisible: true,
    isActive: true,
    parentId: null,
  },
  {
    id: "3",
    name: "Prompt Management",
    code: "prompts",
    path: "/admin/prompts",
    icon: "prompts",
    order: 3,
    isVisible: true,
    isActive: true,
    parentId: null,
  },
  {
    id: "4",
    name: "Reports & Moderation",
    code: "reports",
    path: "/admin/reports",
    icon: "reports",
    order: 4,
    isVisible: true,
    isActive: true,
    parentId: null,
  },
  {
    id: "5",
    name: "Categories",
    code: "categories",
    path: "/admin/categories",
    icon: "categories",
    order: 5,
    isVisible: true,
    isActive: true,
    parentId: null,
  },
  {
    id: "6",
    name: "Tags",
    code: "tags",
    path: "/admin/tags",
    icon: "tags",
    order: 6,
    isVisible: true,
    isActive: true,
    parentId: null,
  },
  {
    id: "7",
    name: "Monetization",
    code: "monetization",
    path: "/admin/monetization",
    icon: "monetization",
    order: 7,
    isVisible: true,
    isActive: true,
    parentId: null,
  },
  {
    id: "8",
    name: "Access Control",
    code: "access-control",
    path: null,
    icon: "access-control",
    order: 8,
    isVisible: true,
    isActive: true,
    parentId: null,
  },
  {
    id: "8-1",
    name: "Roles",
    code: "roles",
    path: "/admin/access-control/roles",
    icon: "access-control",
    order: 1,
    isVisible: true,
    isActive: true,
    parentId: "8",
  },
  {
    id: "8-2",
    name: "Permissions",
    code: "permissions",
    path: "/admin/access-control/permissions",
    icon: "permissions",
    order: 2,
    isVisible: true,
    isActive: true,
    parentId: "8",
  },
  {
    id: "8-3",
    name: "Menus",
    code: "menus",
    path: "/admin/access-control/menus",
    icon: "menus",
    order: 3,
    isVisible: true,
    isActive: true,
    parentId: "8",
  },
];

// ─── Tree Builder ─────────────────────────────────────────────────────────────

function buildMenuTree(flat: MenuItem[]): MenuItem[] {
  const map = new Map<string, MenuItem>();
  const roots: MenuItem[] = [];

  flat
    .filter((m) => m.isActive && m.isVisible)
    .sort((a, b) => a.order - b.order)
    .forEach((item) => map.set(item.id, { ...item, children: [] }));

  map.forEach((item) => {
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(item);
    } else {
      roots.push(item);
    }
  });

  return roots;
}

// ─── Sub Menu Item ────────────────────────────────────────────────────────────

function SubMenuItem({
  item,
  depth = 1,
  isExpanded,
}: {
  item: MenuItem;
  depth?: number;
  isExpanded: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = getIcon(item.icon);

  const isActive = item.path
    ? pathname === item.path || pathname.startsWith(item.path + "/")
    : false;

  const isParentOfActive = hasChildren
    ? item.children!.some((c) => c.path && pathname.startsWith(c.path))
    : false;

  const shouldBeOpen = open || isParentOfActive;

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => setOpen((p) => !p)}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            isParentOfActive && "text-foreground",
            !isExpanded && "justify-center",
          )}
          style={{ paddingLeft: isExpanded ? `${depth * 12 + 12}px` : "12px" }}
          title={!isExpanded ? item.name : undefined}
        >
          <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
          {isExpanded && (
            <>
              <span className="flex-1 text-left leading-none">{item.name}</span>
              <ChevronRight
                className={cn(
                  "h-3 w-3 shrink-0 opacity-50 transition-transform duration-200",
                  shouldBeOpen && "rotate-90",
                )}
              />
            </>
          )}
        </button>
        {shouldBeOpen && isExpanded && (
          <ul className="mt-0.5 space-y-0.5">
            {item.children!.map((child) => (
              <SubMenuItem
                key={child.id}
                item={child}
                depth={depth + 1}
                isExpanded={isExpanded}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.path ?? "#"}
        title={!isExpanded ? item.name : undefined}
        className={cn(
          "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
          !isExpanded && "justify-center",
        )}
        style={{ paddingLeft: isExpanded ? `${depth * 12 + 12}px` : "12px" }}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
        {isExpanded && <span className="leading-none">{item.name}</span>}
      </Link>
    </li>
  );
}

// ─── Top Level Menu Item ───────────────────────────────────────────────────────

function TopMenuItem({
  item,
  isExpanded,
}: {
  item: MenuItem;
  isExpanded: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = getIcon(item.icon);

  const isActive = item.path
    ? pathname === item.path || pathname.startsWith(item.path + "/")
    : false;

  const isParentOfActive = hasChildren
    ? item.children!.some((c) => c.path && pathname.startsWith(c.path))
    : false;

  // Close children when sidebar is collapsed
  const shouldBeOpen = (open || isParentOfActive) && isExpanded;

  if (hasChildren) {
    return (
      <li>
        <button
          onClick={() => isExpanded && setOpen((p) => !p)}
          title={!isExpanded ? item.name : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            isParentOfActive && "text-foreground font-medium",
            !isExpanded && "justify-center",
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {isExpanded && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 shrink-0 opacity-50 transition-transform duration-200",
                  shouldBeOpen && "rotate-90",
                )}
              />
            </>
          )}
        </button>
        {shouldBeOpen && (
          <ul className="mt-1 space-y-0.5 border-l border-border/50 ml-[22px] pl-2">
            {item.children!.map((child) => (
              <SubMenuItem
                key={child.id}
                item={child}
                depth={0}
                isExpanded={isExpanded}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.path ?? "#"}
        title={!isExpanded ? item.name : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
          isActive
            ? "bg-primary text-primary-foreground font-medium shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
          !isExpanded && "justify-center",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {isExpanded && <span>{item.name}</span>}
      </Link>
    </li>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SidebarSkeleton({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div className="space-y-1 px-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-9 rounded-lg bg-muted/50 animate-pulse",
            isExpanded ? "w-full" : "w-9 mx-auto",
          )}
          style={{ opacity: 1 - i * 0.1 }}
        />
      ))}
    </div>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}
export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const [hoverExpanded, setHoverExpanded] = useState(false);

  // Sidebar is expanded when: not collapsed, OR collapsed but mouse is inside
  const isExpanded = !collapsed || hoverExpanded;

  // TODO: uncomment when API is ready, delete DUMMY_MENUS
  // const { data: flatMenus, isLoading, isError } = useQuery({
  //   queryKey: ["admin", "menus", "sidebar"],
  //   queryFn: fetchAdminMenus,
  //   staleTime: 5 * 60 * 1000,
  // });

  const flatMenus = DUMMY_MENUS;
  const isLoading = false;
  const isError = false;

  const menuTree = buildMenuTree(flatMenus);

  return (
    <aside
      className={cn(
        "h-full flex flex-col bg-background border-r border-border",
        "transition-all duration-300 ease-in-out",
        !collapsed && "w-64",
        collapsed && !hoverExpanded && "w-16",
        collapsed && hoverExpanded && "absolute z-50 w-64 shadow-xl",
      )}
      onMouseEnter={() => collapsed && setHoverExpanded(true)}
      onMouseLeave={() => collapsed && setHoverExpanded(false)}
    >
      {/* header row */}
      <div
        className={cn(
          "shrink-0 flex items-center px-3 py-4 border-b border-border/60 gap-2",
          isExpanded ? "justify-between" : "justify-center",
        )}
      >
        {isExpanded && (
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Back to site</span>
          </Link>
        )}
        <button
          onClick={() => {
            onToggle();
            setHoverExpanded(false);
          }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Back to site icon — shown only when fully collapsed (no hover) */}
      {!isExpanded && (
        <div className="flex justify-center py-2 border-b border-border/60">
          <Link
            href="/"
            title="Back to site"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {isLoading ? (
          <SidebarSkeleton isExpanded={isExpanded} />
        ) : isError ? (
          isExpanded ? (
            <p className="text-xs text-destructive px-3">
              Failed to load menu.
            </p>
          ) : null
        ) : (
          <ul className="space-y-0.5">
            {menuTree.map((item) => (
              <TopMenuItem key={item.id} item={item} isExpanded={isExpanded} />
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
