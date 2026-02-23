import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Package, Layers, Banknote, AlertTriangle, Eye, TrendingUp, TrendingDown } from "lucide-react";

interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  unitCost: string;
  totalValue: string;
  reorderLevel: number;
  location: string;
  stockLevel: "low" | "medium" | "high";
}

const inventoryData: InventoryItem[] = [
  { id: "1", itemCode: "FUEL-001", name: "Diesel Fuel", category: "Fuel", subcategory: "Diesel", quantity: 15000, unit: "L", unitCost: "₨1.20", totalValue: "₨18,000", reorderLevel: 5000, location: "Tank A1", stockLevel: "high" },
  { id: "2", itemCode: "FUEL-002", name: "Petrol", category: "Fuel", subcategory: "Petrol", quantity: 8000, unit: "L", unitCost: "₨1.35", totalValue: "₨10,800", reorderLevel: 3000, location: "Tank B1", stockLevel: "high" },
  { id: "3", itemCode: "OIL-001", name: "Engine Oil SAE 40", category: "Oil", subcategory: "Engine Oil", quantity: 200, unit: "L", unitCost: "₨8.50", totalValue: "₨1,700", reorderLevel: 100, location: "Warehouse A", stockLevel: "medium" },
  { id: "4", itemCode: "OIL-002", name: "Hydraulic Oil", category: "Oil", subcategory: "Hydraulic", quantity: 50, unit: "L", unitCost: "₨12.00", totalValue: "₨600", reorderLevel: 100, location: "Warehouse A", stockLevel: "low" },
  { id: "5", itemCode: "LUB-001", name: "Lubricant Grease", category: "Lubricants", subcategory: "Grease", quantity: 15, unit: "KG", unitCost: "₨25.00", totalValue: "₨375", reorderLevel: 30, location: "Warehouse B", stockLevel: "low" },
  { id: "6", itemCode: "SPR-001", name: "Brake Pads Set", category: "Spare Parts", subcategory: "Brakes", quantity: 25, unit: "Pcs", unitCost: "₨150.00", totalValue: "₨3,750", reorderLevel: 10, location: "Warehouse C", stockLevel: "high" },
];

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const columns = [
    {
      key: "itemCode",
      header: "Item Code",
      render: (item: InventoryItem) => (
        <span className="font-mono text-sm">{item.itemCode}</span>
      ),
    },
    { key: "name", header: "Item Name" },
    { key: "category", header: "Category" },
    { key: "subcategory", header: "Subcategory" },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: InventoryItem) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.quantity.toLocaleString()}</span>
          <span className="text-muted-foreground">{item.unit}</span>
        </div>
      ),
    },
    { key: "unitCost", header: "Unit Cost" },
    { key: "totalValue", header: "Total Value", className: "text-right font-medium" },
    {
      key: "stockLevel",
      header: "Stock Level",
      render: (item: InventoryItem) => {
        const percentage = (item.quantity / item.reorderLevel) * 50;
        return (
          <div className="w-24 space-y-1">
            <Progress value={Math.min(percentage, 100)} className="h-2" />
            <StatusBadge status={item.stockLevel} />
          </div>
        );
      },
    },
    { key: "location", header: "Location" },
    {
      key: "actions",
      header: "",
      render: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = inventoryData.reduce((sum, item) => 
    sum + parseFloat(item.totalValue.replace("₨", "").replace(",", "")), 0
  );

  const lowStockCount = inventoryData.filter(item => item.stockLevel === "low").length;

  return (
    <AppLayout
      title="Inventory Management"
      subtitle="Track and manage inventory using FIFO valuation"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Items"
          value={inventoryData.length}
          subtitle="Unique SKUs"
          icon={Package}
        />
        <StatsCard
          title="Total Value"
          value={`₨${totalValue.toLocaleString()}`}
          subtitle="FIFO valuation"
          icon={Banknote}
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Categories"
          value="4"
          subtitle="Active categories"
          icon={Layers}
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="Items below reorder"
          icon={AlertTriangle}
        />
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock Movement (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-lg font-semibold">₨45,200</p>
                  <p className="text-xs text-muted-foreground">Stock In</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-lg font-semibold">₨32,800</p>
                  <p className="text-xs text-muted-foreground">Stock Out</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fuel Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Diesel</span>
                <span className="font-medium">15,000 L</span>
              </div>
              <Progress value={75} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span>Petrol</span>
                <span className="font-medium">8,000 L</span>
              </div>
              <Progress value={53} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Batch Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Batches</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Oldest Batch</span>
                <span className="font-medium">2024-12-15</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Newest Batch</span>
                <span className="font-medium">2025-01-28</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs defaultValue="all" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="low">Low Stock</TabsTrigger>
                <TabsTrigger value="fuel">Fuel</TabsTrigger>
                <TabsTrigger value="oil">Oil</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                  <SelectItem value="Oil">Oil</SelectItem>
                  <SelectItem value="Lubricants">Lubricants</SelectItem>
                  <SelectItem value="Spare Parts">Spare Parts</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
