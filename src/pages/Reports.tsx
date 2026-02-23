import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  ShoppingCart, 
  Package, 
  Banknote,
  Truck, 
  TrendingUp,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  Filter
} from "lucide-react";

const reportCategories = [
  {
    id: "procurement",
    title: "Procurement Reports",
    icon: ShoppingCart,
    reports: [
      { id: "req-status", name: "Requisition Status Summary", description: "Overview of all requisitions by status" },
      { id: "po-status", name: "Purchase Order Status", description: "Track PO progress and delivery" },
      { id: "pay-aging", name: "Vendor Payment Aging", description: "Outstanding payments by age" },
      { id: "budget-actual", name: "Budget vs Actual Spend", description: "Compare budgeted vs actual expenses" },
    ],
  },
  {
    id: "inventory",
    title: "Inventory Reports",
    icon: Package,
    reports: [
      { id: "inv-valuation", name: "Inventory Valuation (FIFO)", description: "Current inventory value using FIFO method" },
      { id: "stock-movement", name: "Stock Movement History", description: "All stock-in and stock-out transactions" },
      { id: "low-stock", name: "Low Stock Alert Report", description: "Items below reorder levels" },
      { id: "batch-report", name: "Batch/Lot Tracking Report", description: "Detailed batch information and aging" },
    ],
  },
  {
    id: "assets",
    title: "Asset Reports",
    icon: Truck,
    reports: [
      { id: "consumption-asset", name: "Consumption by Asset", description: "Fuel and resource usage per asset" },
      { id: "consumption-period", name: "Consumption by Period", description: "Usage trends over time" },
      { id: "asset-cost", name: "Asset Operating Costs", description: "Total costs per operational asset" },
      { id: "fuel-efficiency", name: "Fuel Efficiency Report", description: "Consumption vs operating hours" },
    ],
  },
  {
    id: "financial",
    title: "Financial Reports",
    icon: Banknote,
    reports: [
      { id: "spend-summary", name: "Total Spend Summary", description: "Overall procurement spending analysis" },
      { id: "vendor-ledger", name: "Vendor Ledger", description: "Payment history per vendor" },
      { id: "tax-summary", name: "Tax Summary Report", description: "Tax collected and paid summary" },
      { id: "cogs-report", name: "Cost of Goods Sold", description: "COGS analysis by category" },
    ],
  },
];

export default function Reports() {
  return (
    <AppLayout
      title="Reports & Analytics"
      subtitle="Generate and export comprehensive reports"
    >
      {/* Filter Section */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Report Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input id="dateFrom" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input id="dateTo" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fuel">Fuel</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                  <SelectItem value="spare-parts">Spare Parts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Dashboard */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Monthly Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <p className="text-3xl font-bold">$245,000</p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-sm text-success mt-1">+12% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PieChart className="w-4 h-4" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      <span className="text-sm">Fuel</span>
                    </div>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-info" />
                      <span className="text-sm">Oil & Lubricants</span>
                    </div>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm">Spare Parts</span>
                    </div>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                      <span className="text-sm">Others</span>
                    </div>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg PO Value</span>
                    <span className="font-medium">$18,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Inventory Turnover</span>
                    <span className="font-medium">4.2x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">On-Time Delivery</span>
                    <span className="font-medium text-success">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cost Savings</span>
                    <span className="font-medium text-success">$32,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Categories */}
      <div className="space-y-6">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.reports.map((report) => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
