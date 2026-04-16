"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { TableColumn, TableProps } from "react-data-table-component";
const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
}) as <T>(props: TableProps<T>) => JSX.Element;
const DataTableExtensions = dynamic(
  () => import("react-data-table-component-extensions"),
  { ssr: false },
);
import { format } from "date-fns";
import {
  Eye,
  MoreHorizontal,
  PenSquare,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import type { AdminPromptListItem } from "@/shared/api/modules/admin-prompt.api";
import { ROUTES } from "@/shared/lib/routes";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { appToast } from "@/shared/lib/toastify/toast";
import {
  useAdminPrompts,
  useDeleteAdminPrompt,
  useToggleAdminPromptFeatured,
  useUpdateAdminPromptStatus,
} from "./hooks/use-admin-prompts";
import { PromptStatusBadge } from "./components/prompt-status-badge";
import { globalTableStyles } from "@/shared/components/common/common-styles";

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "APPROVED", label: "Approved" },
  { value: "PENDING", label: "Pending" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "DRAFT", label: "Draft" },
] as const;

const featuredOptions = [
  { value: "all", label: "All prompt types" },
  { value: "true", label: "Featured only" },
  { value: "false", label: "Non-featured" },
] as const;

const modelOptions = [
  { value: "all", label: "All models" },
  { value: "DALL_E", label: "DALL-E" },
  { value: "STABLE_DIFFUSION", label: "Stable Diffusion" },
  { value: "MIDJOURNEY", label: "MidJourney" },
  { value: "GEMINI", label: "Gemini" },
  { value: "OTHER", label: "Other" },
] as const;

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most liked" },
  { value: "mostViewed", label: "Most viewed" },
] as const;

const parsePageNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export function PromptsIndex() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const deletePrompt = useDeleteAdminPrompt();
  const updateStatus = useUpdateAdminPromptStatus();
  const toggleFeatured = useToggleAdminPromptFeatured();

  const [promptToDelete, setPromptToDelete] =
    useState<AdminPromptListItem | null>(null);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  const params = useMemo(
    () => ({
      page: parsePageNumber(searchParams.get("page"), 1),
      limit: parsePageNumber(searchParams.get("limit"), 10),
      search: searchParams.get("search") || undefined,
      status:
        searchParams.get("status") && searchParams.get("status") !== "all"
          ? searchParams.get("status") || undefined
          : undefined,
      modelType:
        searchParams.get("modelType") && searchParams.get("modelType") !== "all"
          ? searchParams.get("modelType") || undefined
          : undefined,
      featured:
        searchParams.get("featured") === "true"
          ? true
          : searchParams.get("featured") === "false"
            ? false
            : undefined,
      sortBy:
        (searchParams.get("sortBy") as
          | "latest"
          | "oldest"
          | "popular"
          | "mostViewed"
          | null) ?? "latest",
    }),
    [searchParams],
  );

  const { data, isLoading, isError } = useAdminPrompts(params);
  const prompts = data?.data.data ?? [];
  const pagination = data?.data.pagination;

  const updateQuery = (updates: Record<string, string | number | null>) => {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        next.delete(key);
        return;
      }
      next.set(key, String(value));
    });

    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleDelete = async () => {
    if (!promptToDelete) return;

    try {
      await deletePrompt.mutateAsync(promptToDelete.id);
      appToast.success("Prompt deleted successfully.");
      setPromptToDelete(null);
    } catch (error: any) {
      appToast.error(
        error?.errors?.[0]?.message ||
          error?.message ||
          "Prompt could not be deleted.",
      );
    }
  };

  const handleStatusUpdate = async (
    prompt: AdminPromptListItem,
    status: string,
  ) => {
    try {
      await updateStatus.mutateAsync({
        id: prompt.id,
        status,
        rejectionReason:
          status === "REJECTED"
            ? prompt.rejectionReason || "Rejected by admin."
            : "",
      });
      appToast.success(`Prompt moved to ${status.toLowerCase()}.`);
    } catch (error: any) {
      appToast.error(
        error?.errors?.[0]?.message ||
          error?.message ||
          "Status update failed.",
      );
    }
  };

  const handleFeaturedToggle = async (prompt: AdminPromptListItem) => {
    try {
      await toggleFeatured.mutateAsync({
        id: prompt.id,
        featured: !prompt.featured,
      });
      appToast.success(
        prompt.featured
          ? "Prompt removed from featured."
          : "Prompt marked as featured.",
      );
    } catch (error: any) {
      appToast.error(
        error?.errors?.[0]?.message ||
          error?.message ||
          "Featured state could not be updated.",
      );
    }
  };

  const columns = useMemo<TableColumn<AdminPromptListItem>[]>(
    () => [
      {
        name: "Prompt",
        grow: 2.2,
        sortable: true,
        selector: (row) => row.title,
        cell: (row) => (
          <div className="flex min-w-0 items-center gap-3 py-3">
            <img
              src={row.imageUrl || "/placeholder.svg"}
              alt={row.title}
              className="h-14 w-14 rounded-lg border border-border object-cover"
            />
            <div className="min-w-0">
              <Link
                href={`/admin/prompts/${row.id}`}
                className="line-clamp-1 font-medium text-foreground hover:text-primary"
              >
                {row.title}
              </Link>
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {row.shortDescription || "No short description"}
              </p>
              <p className="text-xs text-muted-foreground">
                by{" "}
                {row.createdBy.profile?.displayName || row.createdBy.username}
              </p>
            </div>
          </div>
        ),
      },
      {
        name: "Status",
        width: "150px",
        cell: (row) => (
          <div className="space-y-2">
            <PromptStatusBadge status={row.status} />
            {row.featured ? <Badge>Featured</Badge> : null}
          </div>
        ),
      },
      {
        name: "Category",
        width: "180px",
        cell: (row) => (
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {row.category.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.modelType.replaceAll("_", " ")}
            </p>
          </div>
        ),
      },
      {
        name: "Engagement",
        width: "170px",
        cell: (row) => (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Views: {row.viewsCount.toLocaleString()}</p>
            <p>Likes: {row.likesCount.toLocaleString()}</p>
            <p>Comments: {row.commentsCount.toLocaleString()}</p>
          </div>
        ),
      },
      {
        name: "Created",
        sortable: true,
        width: "160px",
        selector: (row) => row.createdOn,
        cell: (row) => (
          <div className="text-sm text-muted-foreground">
            {format(new Date(row.createdOn), "dd MMM yyyy")}
          </div>
        ),
      },
      {
        name: "",
        width: "88px",
        right: true,
        cell: (row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/prompts/${row.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/prompts/${row.id}/edit`}>
                  <PenSquare className="mr-2 h-4 w-4" />
                  Edit prompt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFeaturedToggle(row)}>
                <Star className="mr-2 h-4 w-4" />
                {row.featured ? "Remove featured" : "Feature prompt"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row, "APPROVED")}
              >
                Mark approved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row, "PENDING")}
              >
                Mark pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row, "REJECTED")}
              >
                Mark rejected
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row, "ARCHIVED")}
              >
                Archive prompt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPromptToDelete(row)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete prompt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleFeaturedToggle, handleStatusUpdate],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-foreground">
            Prompt Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Review, curate, update, and retire prompts across the platform from
            a single admin workflow.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/prompts/create">
            <Plus className="mr-2 h-4 w-4" />
            Create prompt
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total prompts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">
              {pagination?.total ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending in current view
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">
              {prompts.filter((prompt) => prompt.status === "PENDING").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Featured in current view
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-foreground">
              {prompts.filter((prompt) => prompt.featured).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 xl:grid-cols-[1.5fr_repeat(4,0.8fr)]">
            <form
              className="relative"
              onSubmit={(event) => {
                event.preventDefault();
                updateQuery({ search: searchInput || null, page: 1 });
              }}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by title, prompt text, or author"
                className="pl-9"
              />
            </form>
            <Select
              value={params.status ?? "all"}
              onValueChange={(value) => updateQuery({ status: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={params.modelType ?? "all"}
              onValueChange={(value) =>
                updateQuery({ modelType: value, page: 1 })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={
                params.featured === true
                  ? "true"
                  : params.featured === false
                    ? "false"
                    : "all"
              }
              onValueChange={(value) =>
                updateQuery({ featured: value, page: 1 })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                {featuredOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={params.sortBy}
              onValueChange={(value) => updateQuery({ sortBy: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="admin-data-table overflow-hidden rounded-xl border border-border bg-card">
            <DataTableExtensions
              columns={columns}
              data={prompts}
              filter={false}
              export
              print={false}
              exportHeaders
              fileName="admin-prompts"
            >
              <DataTable
                columns={columns}
                data={prompts}
                customStyles={globalTableStyles}
                noHeader
                responsive
                highlightOnHover
                persistTableHead
                progressPending={isLoading}
                progressComponent={
                  <div className="p-6 text-sm text-muted-foreground">
                    Loading prompts...
                  </div>
                }
                noDataComponent={
                  isError ? (
                    <div className="p-6 text-sm text-destructive">
                      Prompt data could not be loaded.
                    </div>
                  ) : (
                    <div className="p-6 text-sm text-muted-foreground">
                      No prompts matched the current filters.
                    </div>
                  )
                }
                pagination
                paginationServer
                paginationPerPage={params.limit}
                paginationTotalRows={pagination?.total ?? 0}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
                onChangePage={(page) => updateQuery({ page })}
                onChangeRowsPerPage={(limit, page) =>
                  updateQuery({ limit, page })
                }
              />
            </DataTableExtensions>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!promptToDelete}
        onOpenChange={(open) => {
          if (!open) setPromptToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this prompt?</AlertDialogTitle>
            <AlertDialogDescription>
              {promptToDelete
                ? `This will archive "${promptToDelete.title}" from the platform.`
                : "This will archive the selected prompt."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete prompt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
