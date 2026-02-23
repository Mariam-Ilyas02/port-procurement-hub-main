import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, ArrowUpFromLine, Package, Calendar, Truck, AlertTriangle } from "lucide-react";

interface StockOutEntry {
  id: string;
  issueNumber: string;
  item: string;
  quantity: number;
  unit: string;
  costOfGoods: string;
  issuedTo: string;
  issueType: "asset" | "manual" | "adjustment" | "transfer";
  issueDate: string;
  issuedBy: string;
  reason?: string;
}

const stockOutData: StockOutEntry[] = [
  { id: "1", issueNumber: "ISS-2025-001", item: "Diesel Fuel", quantity: 500, unit: "L", costOfGoods: "₨600", issuedTo: "Generator-100kVA-01", issueType: "asset", issueDate: "2025-01-28", issuedBy: "Azlaan Kareem" },
  { id: "2", issueNumber: "ISS-2025-002", item: "Petrol", quantity: 100, unit: "L", costOfGoods: "₨135", issuedTo: "Forklift-01", issueType: "asset", issueDate: "2025-01-27", issuedBy: "Kareem Ullah" },
  { id: "3", issueNumber: "ISS-2025-003", item: "Engine Oil SAE 40", quantity: 10, unit: "L", costOfGoods: "₨85", issuedTo: "Maintenance Dept", issueType: "manual", issueDate: "2025-01-26", issuedBy: "Mikaal Ahmed" },
  { id: "4", issueNumber: "ADJ-2025-001", item: "Lubricant Grease", quantity: 2, unit: "KG", costOfGoods: "₨50", issuedTo: "Damaged Stock", issueType: "adjustment", issueDate: "2025-01-25", issuedBy: "Tehseen Alam", reason: "Damaged during storage" },
  { id: "5", issueNumber: "TRF-2025-001", item: "Diesel Fuel", quantity: 1000, unit: "L", costOfGoods: "₨1,200", issuedTo: "Terminal B", issueType: "transfer", issueDate: "2025-01-24", issuedBy: "Sarah" },
];

export default function StockOut() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const columns = [
    {
      key: "issueNumber",
      header: "Issue Number",
      render: (item: StockOutEntry) => (
        <div className="flex items-center gap-2">
          <ArrowUpFromLine className="w-4 h-4 text-destructive" />
          <span className="font-medium">{item.issueNumber}</span>
        </div>
      ),
    },
    {
      key: "item",
      header: "Item",
      render: (item: StockOutEntry) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          {item.item}
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: StockOutEntry) => (
        <span>{item.quantity.toLocaleString()} {item.unit}</span>
      ),
    },
    { key: "costOfGoods", header: "COGS (FIFO)", className: "text-right font-medium" },
    {
      key: "issuedTo",
      header: "Issued To",
      render: (item: StockOutEntry) => (
        <div className="flex items-center gap-2">
          {item.issueType === "asset" && <Truck className="w-4 h-4 text-muted-foreground" />}
          {item.issueType === "adjustment" && <AlertTriangle className="w-4 h-4 text-warning" />}
          {item.issuedTo}
        </div>
      ),
    },
    {
      key: "issueType",
      header: "Type",
      render: (item: StockOutEntry) => {
        const typeColors = {
          asset: "bg-primary/10 text-primary",
          manual: "bg-muted text-muted-foreground",
          adjustment: "bg-warning/10 text-warning",
          transfer: "bg-info/10 text-info",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[item.issueType]}`}>
            {item.issueType.charAt(0).toUpperCase() + item.issueType.slice(1)}
          </span>
        );
      },
    },
    {
      key: "issueDate",
      header: "Issue Date",
      render: (item: StockOutEntry) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {item.issueDate}
        </div>
      ),
    },
    { key: "issuedBy", header: "Issued By" },
  ];

  const filteredData = stockOutData.filter(
    (item) =>
      item.issueNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Stock Out"
      subtitle="Record issuances, adjustments, and transfers"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Stock Out
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Stock Out</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asset">Asset Consumption</SelectItem>
                    <SelectItem value="manual">Manual Issuance</SelectItem>
                    <SelectItem value="adjustment">Adjustment (Loss/Damage)</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item">Item</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel Fuel (15,000 L available)</SelectItem>
                    <SelectItem value="petrol">Petrol (8,000 L available)</SelectItem>
                    <SelectItem value="engine-oil">Engine Oil (200 L available)</SelectItem>
                    <SelectItem value="hydraulic">Hydraulic Oil (50 L available)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" value="L" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuedTo">Issued To</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gen-01">Generator-100kVA-01</SelectItem>
                    <SelectItem value="kalmar-01">Kalmar-01</SelectItem>
                    <SelectItem value="forklift-01">Forklift-01</SelectItem>
                    <SelectItem value="maintenance">Maintenance Dept</SelectItem>
                    <SelectItem value="terminal-b">Terminal B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input id="issueDate" type="date" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="reason">Reason / Notes</Label>
                <Textarea id="reason" placeholder="Enter reason for stock out" rows={2} />
              </div>
            </div>
            <div className="p-3 bg-info/10 rounded-lg border border-info/20">
              <p className="text-sm font-medium text-info mb-1">FIFO Consumption</p>
              <p className="text-xs text-muted-foreground">
                Stock will be consumed from oldest batch first (Batch: BATCH-001, Cost: ₨1.20/L)
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Record Stock Out</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs defaultValue="all" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="asset">Asset Usage</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="adjustment">Adjustments</TabsTrigger>
                <TabsTrigger value="transfer">Transfers</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
