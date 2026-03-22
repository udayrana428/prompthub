"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Switch } from "@/shared/components/ui/switch";
import {
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Folder,
  TrendingUp,
  Hash,
} from "lucide-react";

// Sample categories data
const categories = [
  {
    id: 1,
    name: "Fantasy",
    slug: "fantasy",
    description: "Magical creatures, mythical worlds, and fantasy art",
    color: "#8B5CF6",
    icon: "🧙‍♂️",
    promptCount: 2847,
    isActive: true,
    isFeatured: true,
    parentId: null,
    createdAt: "2024-01-15",
    order: 1,
  },
  {
    id: 2,
    name: "Portrait",
    slug: "portrait",
    description: "Human portraits, headshots, and character art",
    color: "#F59E0B",
    icon: "👤",
    promptCount: 1923,
    isActive: true,
    isFeatured: true,
    parentId: null,
    createdAt: "2024-01-15",
    order: 2,
  },
  {
    id: 3,
    name: "Anime",
    slug: "anime",
    description: "Anime-style art, manga characters, and Japanese animation",
    color: "#EF4444",
    icon: "🎌",
    promptCount: 1654,
    isActive: true,
    isFeatured: false,
    parentId: null,
    createdAt: "2024-01-15",
    order: 3,
  },
  {
    id: 4,
    name: "Sci-Fi",
    slug: "sci-fi",
    description: "Futuristic scenes, space art, and science fiction",
    color: "#06B6D4",
    icon: "🚀",
    promptCount: 1234,
    isActive: true,
    isFeatured: true,
    parentId: null,
    createdAt: "2024-01-15",
    order: 4,
  },
  {
    id: 5,
    name: "Cyberpunk",
    slug: "cyberpunk",
    description: "Neon-lit futuristic cityscapes and cyberpunk aesthetics",
    color: "#EC4899",
    icon: "🌃",
    promptCount: 567,
    isActive: true,
    isFeatured: false,
    parentId: 4,
    createdAt: "2024-02-01",
    order: 1,
  },
];

// Sample tags data
const tags = [
  {
    id: 1,
    name: "dragon",
    promptCount: 892,
    isActive: true,
    category: "Fantasy",
  },
  {
    id: 2,
    name: "portrait",
    promptCount: 1234,
    isActive: true,
    category: "Portrait",
  },
  {
    id: 3,
    name: "cyberpunk",
    promptCount: 567,
    isActive: true,
    category: "Sci-Fi",
  },
  { id: 4, name: "anime", promptCount: 445, isActive: true, category: "Anime" },
  { id: 5, name: "neon", promptCount: 334, isActive: true, category: "Sci-Fi" },
  {
    id: 6,
    name: "warrior",
    promptCount: 289,
    isActive: true,
    category: "Fantasy",
  },
  {
    id: 7,
    name: "professional",
    promptCount: 234,
    isActive: true,
    category: "Portrait",
  },
  { id: 8, name: "detailed", promptCount: 567, isActive: true, category: null },
  { id: 9, name: "8k", promptCount: 445, isActive: true, category: null },
  {
    id: 10,
    name: "realistic",
    promptCount: 389,
    isActive: true,
    category: null,
  },
];

export function CategoriesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof categories)[0] | null
  >(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateCategory = () => {
    console.log("[v0] Creating new category");
    setIsCreateDialogOpen(false);
  };

  const handleEditCategory = (categoryId: number) => {
    console.log(`[v0] Editing category ${categoryId}`);
  };

  const handleDeleteCategory = (categoryId: number) => {
    console.log(`[v0] Deleting category ${categoryId}`);
  };

  const handleToggleActive = (categoryId: number) => {
    console.log(`[v0] Toggling active status for category ${categoryId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Categories & Tags
          </h1>
          <p className="text-muted-foreground">
            Organize and manage content categories and tags
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new category to organize prompts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input placeholder="Enter category name..." />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe this category..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input type="color" defaultValue="#8B5CF6" />
                </div>
                <div className="space-y-2">
                  <Label>Icon (Emoji)</Label>
                  <Input placeholder="🎨" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {categories
                      .filter((cat) => !cat.parentId)
                      .map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="featured" />
                <Label htmlFor="featured">Featured Category</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>Create Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.filter((c) => c.isActive).length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
            <p className="text-xs text-muted-foreground">
              {tags.filter((t) => t.isActive).length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter((c) => c.isFeatured).length}
            </div>
            <p className="text-xs text-muted-foreground">On homepage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Fantasy</div>
            <p className="text-xs text-muted-foreground">2,847 prompts</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Manage prompt categories and subcategories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Prompts</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <div>
                              <div className="font-medium flex items-center space-x-2">
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                                {category.isFeatured && (
                                  <Badge variant="secondary">Featured</Badge>
                                )}
                              </div>
                              {category.parentId && (
                                <div className="text-sm text-muted-foreground">
                                  Subcategory of{" "}
                                  {
                                    categories.find(
                                      (c) => c.id === category.parentId,
                                    )?.name
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-muted-foreground truncate">
                              {category.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {category.promptCount.toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                category.isActive ? "default" : "secondary"
                              }
                            >
                              {category.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(category.id)}
                            >
                              {category.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditCategory(category.id)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Folder className="h-4 w-4 mr-2" />
                                View Prompts
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Category
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Manage prompt tags and keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>

              {/* Tags Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTags.map((tag) => (
                  <Card key={tag.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{tag.name}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Tag
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Prompts
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Tag
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Usage:</span>
                          <span className="font-medium">
                            {tag.promptCount} prompts
                          </span>
                        </div>
                        {tag.category && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Category:
                            </span>
                            <Badge variant="outline">{tag.category}</Badge>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge
                            variant={tag.isActive ? "default" : "secondary"}
                          >
                            {tag.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
