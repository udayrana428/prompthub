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
import { Progress } from "@/shared/components/ui/progress";
import {
  Search,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  FileText,
  User,
  Calendar,
  Shield,
  Ban,
  Clock,
} from "lucide-react";

// Sample reports data
const reports = [
  {
    id: 1,
    type: "prompt",
    contentId: 123,
    contentTitle: "Inappropriate Fantasy Scene",
    contentPreview: "/placeholder.svg?height=60&width=60",
    reporter: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reportedUser: {
      name: "BadActor123",
      email: "badactor@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reason: "Inappropriate Content",
    description:
      "This prompt contains explicit content that violates community guidelines",
    status: "pending",
    priority: "high",
    createdAt: "2024-12-20T10:30:00Z",
    reviewedAt: null,
    reviewedBy: null,
    category: "content_violation",
    autoModScore: 85,
  },
  {
    id: 2,
    type: "comment",
    contentId: 456,
    contentTitle: "Spam comment on trending prompt",
    contentPreview: null,
    reporter: {
      name: "Moderator Bot",
      email: "system@prompthub.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reportedUser: {
      name: "SpamUser456",
      email: "spam@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reason: "Spam",
    description: "Automated detection of spam content in comments",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-12-19T15:45:00Z",
    reviewedAt: "2024-12-19T16:00:00Z",
    reviewedBy: "Admin User",
    category: "spam",
    autoModScore: 92,
  },
  {
    id: 3,
    type: "user",
    contentId: 789,
    contentTitle: "Harassment in messages",
    contentPreview: null,
    reporter: {
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reportedUser: {
      name: "ToxicUser789",
      email: "toxic@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reason: "Harassment",
    description:
      "User has been sending threatening messages and harassing other community members",
    status: "under_review",
    priority: "high",
    createdAt: "2024-12-18T09:15:00Z",
    reviewedAt: null,
    reviewedBy: null,
    category: "harassment",
    autoModScore: 78,
  },
  {
    id: 4,
    type: "prompt",
    contentId: 321,
    contentTitle: "Copyright Infringement",
    contentPreview: "/placeholder.svg?height=60&width=60",
    reporter: {
      name: "Copyright Holder",
      email: "legal@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reportedUser: {
      name: "CopyUser321",
      email: "copy@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reason: "Copyright Violation",
    description: "This prompt uses copyrighted characters without permission",
    status: "escalated",
    priority: "high",
    createdAt: "2024-12-17T14:20:00Z",
    reviewedAt: null,
    reviewedBy: null,
    category: "copyright",
    autoModScore: 65,
  },
];

// Auto-moderation rules
const autoModRules = [
  {
    id: 1,
    name: "Explicit Content Detection",
    description: "Detects and flags explicit or adult content",
    enabled: true,
    sensitivity: 75,
    actions: ["flag", "hide"],
    detections: 234,
  },
  {
    id: 2,
    name: "Spam Detection",
    description: "Identifies spam content and repetitive posts",
    enabled: true,
    sensitivity: 80,
    actions: ["flag", "auto_remove"],
    detections: 156,
  },
  {
    id: 3,
    name: "Hate Speech Detection",
    description:
      "Flags content containing hate speech or discriminatory language",
    enabled: true,
    sensitivity: 85,
    actions: ["flag", "hide", "notify_user"],
    detections: 67,
  },
  {
    id: 4,
    name: "Copyright Detection",
    description: "Identifies potential copyright violations",
    enabled: false,
    sensitivity: 70,
    actions: ["flag"],
    detections: 23,
  },
];

export function ReportsModeration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<
    (typeof reports)[0] | null
  >(null);
  const [activeTab, setActiveTab] = useState("reports");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || report.priority === priorityFilter;
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "under_review":
        return "default";
      case "resolved":
        return "default";
      case "escalated":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleResolve = (reportId: number) => {
    console.log(`[v0] Resolving report ${reportId}`);
    // Handle resolution logic
  };

  const handleEscalate = (reportId: number) => {
    console.log(`[v0] Escalating report ${reportId}`);
    // Handle escalation logic
  };

  const handleDismiss = (reportId: number) => {
    console.log(`[v0] Dismissing report ${reportId}`);
    // Handle dismissal logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Reports & Moderation
        </h1>
        <p className="text-muted-foreground">
          Manage user reports and automated content moderation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Auto-Moderated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="reports">User Reports</TabsTrigger>
          <TabsTrigger value="automod">Auto-Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>
                Review and moderate user-reported content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="prompt">Prompt</SelectItem>
                    <SelectItem value="comment">Comment</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reports Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reported User</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {report.contentPreview && (
                              <img
                                src={
                                  report.contentPreview || "/placeholder.svg"
                                }
                                alt="Content preview"
                                className="h-10 w-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                {report.contentTitle}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center space-x-1">
                                {report.type === "prompt" && (
                                  <FileText className="h-3 w-3" />
                                )}
                                {report.type === "comment" && (
                                  <MessageSquare className="h-3 w-3" />
                                )}
                                {report.type === "user" && (
                                  <User className="h-3 w-3" />
                                )}
                                <span>{report.type}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  report.reporter.avatar || "/placeholder.svg"
                                }
                                alt={report.reporter.name}
                              />
                              <AvatarFallback>
                                {report.reporter.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {report.reporter.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  report.reportedUser.avatar ||
                                  "/placeholder.svg"
                                }
                                alt={report.reportedUser.name}
                              />
                              <AvatarFallback>
                                {report.reportedUser.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {report.reportedUser.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{report.reason}</div>
                            {report.autoModScore > 0 && (
                              <div className="text-xs text-muted-foreground">
                                Auto-mod: {report.autoModScore}%
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(report.priority)}>
                            {report.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(report.status)}>
                            {report.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(
                                  report.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(report.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {report.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleResolve(report.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleEscalate(report.id)}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  Escalate
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
                                  onClick={() => setSelectedReport(report)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Take Action
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Ban className="h-4 w-4 mr-2" />
                                  Ban User
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDismiss(report.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Dismiss
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

        <TabsContent value="automod" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Moderation Rules</CardTitle>
              <CardDescription>
                Configure automated content moderation settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {autoModRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{rule.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {rule.description}
                        </p>
                      </div>
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">Sensitivity</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress
                            value={rule.sensitivity}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">
                            {rule.sensitivity}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Actions</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rule.actions.map((action) => (
                            <Badge
                              key={action}
                              variant="outline"
                              className="text-xs"
                            >
                              {action.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Detections (30 days)</Label>
                        <div className="text-lg font-semibold mt-1">
                          {rule.detections}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                      <Button
                        size="sm"
                        variant={rule.enabled ? "destructive" : "default"}
                      >
                        {rule.enabled ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Details Dialog */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Review and take action on this report
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">
                      Reported Content
                    </Label>
                    <div className="mt-2 p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {selectedReport.contentPreview && (
                          <img
                            src={
                              selectedReport.contentPreview ||
                              "/placeholder.svg"
                            }
                            alt="Content preview"
                            className="h-16 w-16 rounded object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">
                            {selectedReport.contentTitle}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedReport.type} • ID:{" "}
                            {selectedReport.contentId}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Reporter</Label>
                    <div className="mt-2 flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            selectedReport.reporter.avatar || "/placeholder.svg"
                          }
                          alt={selectedReport.reporter.name}
                        />
                        <AvatarFallback>
                          {selectedReport.reporter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedReport.reporter.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedReport.reporter.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">
                      Reported User
                    </Label>
                    <div className="mt-2 flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            selectedReport.reportedUser.avatar ||
                            "/placeholder.svg"
                          }
                          alt={selectedReport.reportedUser.name}
                        />
                        <AvatarFallback>
                          {selectedReport.reportedUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedReport.reportedUser.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedReport.reportedUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">
                      Report Details
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Reason:</span>
                        <Badge variant="outline">{selectedReport.reason}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Priority:</span>
                        <Badge
                          variant={getPriorityColor(selectedReport.priority)}
                        >
                          {selectedReport.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge variant={getStatusColor(selectedReport.status)}>
                          {selectedReport.status.replace("_", " ")}
                        </Badge>
                      </div>
                      {selectedReport.autoModScore > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-mod Score:</span>
                          <span className="text-sm font-medium">
                            {selectedReport.autoModScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">
                      Description
                    </Label>
                    <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                      {selectedReport.description}
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">Timeline</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Reported:{" "}
                          {new Date(selectedReport.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {selectedReport.reviewedAt && (
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Reviewed:{" "}
                            {new Date(
                              selectedReport.reviewedAt,
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Moderation Notes</Label>
                <Textarea placeholder="Add notes about this report and any actions taken..." />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              Close
            </Button>
            {selectedReport?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleEscalate(selectedReport.id)}
                >
                  Escalate
                </Button>
                <Button onClick={() => handleResolve(selectedReport.id)}>
                  Resolve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
