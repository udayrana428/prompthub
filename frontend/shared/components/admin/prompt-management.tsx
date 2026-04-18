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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
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
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Eye,
  Heart,
  Copy,
  CheckCircle,
  XCircle,
  Star,
  Flag,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";

// Sample prompt data
const prompts = [
  {
    id: 1,
    title: "Cyberpunk Dragon in Neon City",
    description:
      "A majestic dragon soaring through a cyberpunk cityscape with neon lights and futuristic buildings",
    prompt:
      "A majestic dragon with iridescent scales soaring through a cyberpunk cityscape, neon lights reflecting off its wings, futuristic skyscrapers, rain-soaked streets, dramatic lighting, highly detailed, 8k resolution",
    image: "/cyberpunk-dragon-soaring-through-neon-cityscape-at.jpg",
    category: "Fantasy",
    tags: ["dragon", "cyberpunk", "neon", "fantasy", "detailed"],
    author: "Alice Johnson",
    authorAvatar: "/img/placeholder-user.jpg?height=32&width=32",
    status: "approved",
    featured: true,
    createdAt: "2024-12-15",
    views: 15420,
    likes: 892,
    copies: 234,
    aiModel: "DALL-E 3",
    reportCount: 0,
  },
  {
    id: 2,
    title: "Professional Business Portrait",
    description:
      "Clean, professional headshot perfect for LinkedIn and business profiles",
    prompt:
      "Professional businesswoman headshot, clean white background, confident smile, business attire, studio lighting, high resolution, corporate photography style",
    image: "/professional-businesswoman-headshot-clean-white-ba.jpg",
    category: "Portrait",
    tags: ["business", "professional", "portrait", "headshot", "corporate"],
    author: "Bob Smith",
    authorAvatar: "/img/placeholder-user.jpg?height=32&width=32",
    status: "pending",
    featured: false,
    createdAt: "2024-12-18",
    views: 1250,
    likes: 67,
    copies: 23,
    aiModel: "Midjourney",
    reportCount: 0,
  },
  {
    id: 3,
    title: "Anime Warrior Character",
    description:
      "Detailed anime-style warrior with ornate armor and mystical elements",
    prompt:
      "Anime female warrior with silver hair, ornate armor with cherry blossom motifs, katana sword, mystical aura, detailed character design, anime art style",
    image: "/anime-female-warrior-silver-hair-ornate-armor-cher.jpg",
    category: "Anime",
    tags: ["anime", "warrior", "character", "armor", "mystical"],
    author: "Carol Davis",
    authorAvatar: "//img/placeholder-user.jpg?height=32&width=32",
    status: "rejected",
    featured: false,
    createdAt: "2024-12-10",
    views: 890,
    likes: 45,
    copies: 12,
    aiModel: "Stable Diffusion",
    reportCount: 2,
  },
  {
    id: 4,
    title: "Futuristic City Landscape",
    description:
      "Stunning futuristic metropolis with flying cars and holographic displays",
    prompt:
      "Futuristic metropolis with flying cars, towering skyscrapers with holographic advertisements, neon lights, bustling streets, sci-fi architecture, cinematic lighting",
    image: "/futuristic-metropolis-flying-cars-skyscrapers-holo.jpg",
    category: "Sci-Fi",
    tags: ["futuristic", "city", "flying cars", "sci-fi", "metropolis"],
    author: "David Wilson",
    authorAvatar: "/img/placeholder-user.jpg?height=32&width=32",
    status: "approved",
    featured: false,
    createdAt: "2024-12-12",
    views: 8900,
    likes: 445,
    copies: 156,
    aiModel: "DALL-E 3",
    reportCount: 0,
  },
];

export function PromptManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPrompt, setSelectedPrompt] = useState<
    (typeof prompts)[0] | null
  >(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || prompt.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || prompt.category === categoryFilter;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && prompt.status === "pending") ||
      (activeTab === "featured" && prompt.featured) ||
      (activeTab === "reported" && prompt.reportCount > 0);
    return matchesSearch && matchesStatus && matchesCategory && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleApprove = (promptId: number) => {
    console.log(`[v0] Approving prompt ${promptId}`);
    // Handle approval logic
  };

  const handleReject = (promptId: number) => {
    console.log(`[v0] Rejecting prompt ${promptId}`);
    // Handle rejection logic
  };

  const handleFeature = (promptId: number) => {
    console.log(`[v0] Featuring prompt ${promptId}`);
    // Handle featuring logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Prompt Management
        </h1>
        <p className="text-muted-foreground">
          Review, approve, and manage user-submitted prompts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground">+234 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Currently featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Prompts</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="reported">Reported</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt List</CardTitle>
              <CardDescription>Search and filter prompts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search prompts by title, description, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Fantasy">Fantasy</SelectItem>
                    <SelectItem value="Portrait">Portrait</SelectItem>
                    <SelectItem value="Anime">Anime</SelectItem>
                    <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prompts Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prompt</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stats</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrompts.map((prompt) => (
                      <TableRow key={prompt.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={prompt.image || "/img/placeholder.svg"}
                              alt={prompt.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div className="max-w-xs">
                              <div className="font-medium flex items-center space-x-2">
                                <span className="truncate">{prompt.title}</span>
                                {prompt.featured && (
                                  <Star className="h-4 w-4 text-yellow-500" />
                                )}
                                {prompt.reportCount > 0 && (
                                  <Flag className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {prompt.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  prompt.authorAvatar ||
                                  "/img/placeholder-user.jpg"
                                }
                                alt={prompt.author}
                              />
                              <AvatarFallback>
                                {prompt.author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{prompt.author}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{prompt.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(prompt.status)}>
                            {prompt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{prompt.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span>{prompt.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Copy className="h-3 w-3" />
                              <span>{prompt.copies}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(
                                  prompt.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {prompt.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(prompt.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(prompt.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setSelectedPrompt(prompt)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Prompt
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleFeature(prompt.id)}
                                >
                                  <Star className="h-4 w-4 mr-2" />
                                  {prompt.featured ? "Unfeature" : "Feature"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Prompt
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prompt Details Dialog */}
      <Dialog
        open={!!selectedPrompt}
        onOpenChange={() => setSelectedPrompt(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prompt Details</DialogTitle>
            <DialogDescription>
              Review and moderate this prompt
            </DialogDescription>
          </DialogHeader>
          {selectedPrompt && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image */}
                <div className="space-y-4">
                  <img
                    src={selectedPrompt.image || "/img/placeholder.svg"}
                    alt={selectedPrompt.title}
                    className="w-full rounded-lg object-cover"
                  />
                  <div className="flex items-center justify-between">
                    <Badge variant={getStatusColor(selectedPrompt.status)}>
                      {selectedPrompt.status}
                    </Badge>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {selectedPrompt.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {selectedPrompt.likes}
                      </span>
                      <span className="flex items-center">
                        <Copy className="h-4 w-4 mr-1" />
                        {selectedPrompt.copies}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Title</Label>
                    <p className="text-sm">{selectedPrompt.title}</p>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">
                      Description
                    </Label>
                    <p className="text-sm">{selectedPrompt.description}</p>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">
                      Full Prompt
                    </Label>
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      {selectedPrompt.prompt}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-semibold">
                        Category
                      </Label>
                      <p className="text-sm">{selectedPrompt.category}</p>
                    </div>
                    <div>
                      <Label className="text-base font-semibold">
                        AI Model
                      </Label>
                      <p className="text-sm">{selectedPrompt.aiModel}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPrompt.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Author</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={
                            selectedPrompt.authorAvatar ||
                            "/img/placeholder-user.jpg"
                          }
                          alt={selectedPrompt.author}
                        />
                        <AvatarFallback>
                          {selectedPrompt.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedPrompt.author}</span>
                    </div>
                  </div>
                  {selectedPrompt.reportCount > 0 && (
                    <div>
                      <Label className="text-base font-semibold text-red-600">
                        Reports
                      </Label>
                      <p className="text-sm text-red-600">
                        {selectedPrompt.reportCount} user reports
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Moderation Notes</Label>
                <Textarea placeholder="Add notes about this prompt..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPrompt(null)}>
              Close
            </Button>
            {selectedPrompt?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedPrompt.id)}
                >
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedPrompt.id)}>
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
