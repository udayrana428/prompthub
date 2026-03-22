"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Users,
  FileText,
  Flag,
  DollarSign,
  Eye,
  Heart,
  Copy,
  AlertTriangle,
} from "lucide-react";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";

// Sample data for charts
const userGrowthData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1800 },
  { month: "Mar", users: 2400 },
  { month: "Apr", users: 3200 },
  { month: "May", users: 4100 },
  { month: "Jun", users: 5300 },
];

const promptActivityData = [
  { day: "Mon", uploads: 45, views: 1200 },
  { day: "Tue", uploads: 52, views: 1400 },
  { day: "Wed", uploads: 38, views: 1100 },
  { day: "Thu", uploads: 61, views: 1600 },
  { day: "Fri", uploads: 55, views: 1500 },
  { day: "Sat", uploads: 42, views: 1300 },
  { day: "Sun", uploads: 35, views: 1000 },
];

const trendingPrompts = [
  {
    id: 1,
    title: "Cyberpunk Dragon in Neon City",
    category: "Fantasy",
    views: 15420,
    likes: 892,
    copies: 234,
    status: "approved",
  },
  {
    id: 2,
    title: "Professional Business Portrait",
    category: "Portrait",
    views: 12350,
    likes: 567,
    copies: 189,
    status: "approved",
  },
  {
    id: 3,
    title: "Anime Warrior Character",
    category: "Anime",
    views: 9870,
    likes: 445,
    copies: 156,
    status: "pending",
  },
];

const reportedContent = [
  {
    id: 1,
    type: "Prompt",
    title: "Inappropriate Content Example",
    reporter: "user123",
    reason: "Inappropriate content",
    status: "pending",
  },
  {
    id: 2,
    type: "Comment",
    title: "Spam comment on trending prompt",
    reporter: "moderator1",
    reason: "Spam",
    status: "resolved",
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your PromptHub platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,342</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,580</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+3</span> new today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly active users over time</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-scroll ">
            <ChartContainer
              config={{
                users: {
                  label: "Users",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-users)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Activity</CardTitle>
            <CardDescription>Daily prompt uploads and views</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-scroll ">
            <ChartContainer
              config={{
                uploads: {
                  label: "Uploads",
                  color: "hsl(var(--chart-1))",
                },
                views: {
                  label: "Views",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={promptActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="uploads" fill="var(--color-uploads)" />
                  <Bar dataKey="views" fill="var(--color-views)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Prompts */}
        <Card>
          <CardHeader>
            <CardTitle>Trending Prompts</CardTitle>
            <CardDescription>Most popular prompts this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{prompt.title}</h4>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {prompt.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {prompt.likes}
                      </span>
                      <span className="flex items-center">
                        <Copy className="h-3 w-3 mr-1" />
                        {prompt.copies}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        prompt.status === "approved" ? "default" : "secondary"
                      }
                    >
                      {prompt.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reported Content */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Content flagged by users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportedContent.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-medium text-sm">{report.title}</h4>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {report.type} • Reported by {report.reporter} •{" "}
                      {report.reason}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        report.status === "pending" ? "destructive" : "default"
                      }
                    >
                      {report.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
