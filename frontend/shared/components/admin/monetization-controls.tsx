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
import { Label } from "@/shared/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Switch } from "@/shared/components/ui/switch";
import { Progress } from "@/shared/components/ui/progress";
import {
  CreditCard,
  Star,
  Gift,
  Zap,
  Crown,
  Settings,
  Calendar,
} from "lucide-react";

// Sample subscription plans
const subscriptionPlans = [
  {
    id: 1,
    name: "Free",
    price: 0,
    interval: "month",
    features: ["10 prompts per month", "Basic categories", "Community support"],
    limits: { prompts: 10, downloads: 5, uploads: 3 },
    isActive: true,
    subscribers: 4521,
  },
  {
    id: 2,
    name: "Pro",
    price: 9.99,
    interval: "month",
    features: [
      "Unlimited prompts",
      "Premium categories",
      "Priority support",
      "Advanced filters",
    ],
    limits: { prompts: -1, downloads: -1, uploads: 50 },
    isActive: true,
    subscribers: 892,
  },
  {
    id: 3,
    name: "Creator",
    price: 19.99,
    interval: "month",
    features: [
      "Everything in Pro",
      "Monetize your prompts",
      "Analytics dashboard",
      "Custom branding",
    ],
    limits: { prompts: -1, downloads: -1, uploads: -1 },
    isActive: true,
    subscribers: 234,
  },
];

// Sample revenue data
const revenueData = [
  { month: "Jan", subscriptions: 8450, marketplace: 2340, total: 10790 },
  { month: "Feb", subscriptions: 9200, marketplace: 2890, total: 12090 },
  { month: "Mar", subscriptions: 10100, marketplace: 3450, total: 13550 },
  { month: "Apr", subscriptions: 11200, marketplace: 4120, total: 15320 },
  { month: "May", subscriptions: 12800, marketplace: 4890, total: 17690 },
  { month: "Jun", subscriptions: 14500, marketplace: 5670, total: 20170 },
];

// Sample marketplace settings
const marketplaceSettings = {
  commissionRate: 30,
  minimumPrice: 0.99,
  maximumPrice: 99.99,
  payoutThreshold: 50,
  payoutSchedule: "weekly",
  allowFreePrompts: true,
  requireApproval: true,
};

export function MonetizationControls() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Monetization Controls
        </h1>
        <p className="text-muted-foreground">
          Manage subscriptions, marketplace, and revenue settings
        </p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$20,170</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+14.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$14,500</div>
            <p className="text-xs text-muted-foreground">
              72% of total revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,670</div>
            <p className="text-xs text-muted-foreground">
              28% of total revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,647</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+89</span> this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Monthly revenue by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.slice(-3).map((data) => (
                    <div key={data.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{data.month}</span>
                        <span className="font-medium">
                          ${data.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Subscriptions
                          </span>
                          <span>${data.subscriptions.toLocaleString()}</span>
                        </div>
                        <Progress
                          value={(data.subscriptions / data.total) * 100}
                          className="h-2"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Marketplace
                          </span>
                          <span>${data.marketplace.toLocaleString()}</span>
                        </div>
                        <Progress
                          value={(data.marketplace / data.total) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Plans</CardTitle>
                <CardDescription>
                  Subscription plans by subscriber count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptionPlans
                    .sort((a, b) => b.subscribers - a.subscribers)
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {plan.name === "Free" && (
                              <Gift className="h-4 w-4 text-primary" />
                            )}
                            {plan.name === "Pro" && (
                              <Zap className="h-4 w-4 text-primary" />
                            )}
                            {plan.name === "Creator" && (
                              <Crown className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ${plan.price}/{plan.interval}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {plan.subscribers.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            subscribers
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>
                Manage pricing and features for subscription tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border border-border rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {plan.name === "Free" && (
                            <Gift className="h-5 w-5 text-primary" />
                          )}
                          {plan.name === "Pro" && (
                            <Zap className="h-5 w-5 text-primary" />
                          )}
                          {plan.name === "Creator" && (
                            <Crown className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <p className="text-muted-foreground">
                            ${plan.price}/{plan.interval} •{" "}
                            {plan.subscribers.toLocaleString()} subscribers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={plan.isActive ? "default" : "secondary"}
                        >
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Features</Label>
                        <ul className="mt-2 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground flex items-center"
                            >
                              <Star className="h-3 w-3 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Limits</Label>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Prompts:
                            </span>
                            <span>
                              {plan.limits.prompts === -1
                                ? "Unlimited"
                                : plan.limits.prompts}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Downloads:
                            </span>
                            <span>
                              {plan.limits.downloads === -1
                                ? "Unlimited"
                                : plan.limits.downloads}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Uploads:
                            </span>
                            <span>
                              {plan.limits.uploads === -1
                                ? "Unlimited"
                                : plan.limits.uploads}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Settings</CardTitle>
              <CardDescription>
                Configure marketplace rules and commission rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Commission Rate (%)</Label>
                      <Input
                        type="number"
                        defaultValue={marketplaceSettings.commissionRate}
                      />
                      <p className="text-xs text-muted-foreground">
                        Platform commission on each sale
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={marketplaceSettings.minimumPrice}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maximum Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={marketplaceSettings.maximumPrice}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Payout Threshold ($)</Label>
                      <Input
                        type="number"
                        defaultValue={marketplaceSettings.payoutThreshold}
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum earnings before payout
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Payout Schedule</Label>
                      <Select defaultValue={marketplaceSettings.payoutSchedule}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Allow Free Prompts</Label>
                          <p className="text-xs text-muted-foreground">
                            Let creators offer prompts for free
                          </p>
                        </div>
                        <Switch
                          defaultChecked={marketplaceSettings.allowFreePrompts}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Approval</Label>
                          <p className="text-xs text-muted-foreground">
                            Review prompts before marketplace listing
                          </p>
                        </div>
                        <Switch
                          defaultChecked={marketplaceSettings.requireApproval}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Creator Payouts</CardTitle>
              <CardDescription>
                Manage payments to content creators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Pending Payouts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$12,450</div>
                      <p className="text-xs text-muted-foreground">
                        89 creators
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        This Month
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$34,890</div>
                      <p className="text-xs text-muted-foreground">
                        234 payouts
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Average Payout
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$149</div>
                      <p className="text-xs text-muted-foreground">
                        Per creator
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Payout</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Alice Johnson</div>
                          <div className="text-sm text-muted-foreground">
                            alice@example.com
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">$234.50</div>
                          <div className="text-sm text-muted-foreground">
                            This period
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">45</div>
                          <div className="text-sm text-muted-foreground">
                            prompts sold
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Ready</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Dec 25, 2024</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay Now
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Bob Smith</div>
                          <div className="text-sm text-muted-foreground">
                            bob@example.com
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">$89.25</div>
                          <div className="text-sm text-muted-foreground">
                            This period
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">23</div>
                          <div className="text-sm text-muted-foreground">
                            prompts sold
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Dec 25, 2024</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" disabled>
                            Below Threshold
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
