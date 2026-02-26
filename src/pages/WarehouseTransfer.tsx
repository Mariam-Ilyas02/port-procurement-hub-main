import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, Search, ArrowLeftRight, Package, Calendar, Eye, 
  MapPin, Truck, CheckCircle, ArrowRight
} from "lucide-react";

interface WarehouseTransfer {
  id: string;
  transferNumber: string;
  item: string;
  quantity: number;
  unit: string;
  fromWarehouse: string;
  toWarehouse: string;
  requestedBy: string;
  transferDate: string;
  status: "pending" | "in_transit" | "completed";
  grnCreated: boolean;
}

const transferData: WarehouseTransfer[] = [
  { id: "1", transferNumber: "TRF-2025-001", item: "Diesel Fuel", quantity: 2000, unit: "L", fromWarehouse: "Tank Farm A", toWarehouse: "Tank Farm B", requestedBy: "Ahmed Khan", transferDate: "2025-01-28", status: "completed", grnCreated: true },
  { id: "2", transferNumber: "TRF-2025-002", item: "Engine Oil SAE 40", quantity: 50, unit: "L", fromWarehouse: "Main Warehouse", toWarehouse: "Workshop Store", requestedBy: "Mikaal Ahmed", transferDate: "2025-01-27", status: "completed", grnCreated: true },
  { id: "3", transferNumber: "TRF-2025-003", item: "Brake Pads Set", quantity: 10, unit: "Pcs", fromWarehouse: "Main Warehouse", toWarehouse: "Workshop Store", requestedBy: "Sarah Ali", transferDate: "2025-01-26", status: "in_transit", grnCreated: false },
  { id: "4", transferNumber: "TRF-2025-004", item: "Hydraulic Oil", quantity: 25, unit: "L", fromWarehouse: "Workshop Store", toWarehouse: "Main Warehouse", requestedBy: "Tehseen Alam", transferDate: "2025-01-25", status: "pending", grnCreated: false },
];

const warehouses = [
  { id: "main", name: "Main Warehouse", team: "Admin", items: ["Engine Oil", "Hydraulic Oil", "Spare Parts", "Stationery"] },
  { id: "tank-a", name: "Tank Farm A", team: "Ops", items: ["Diesel Fuel", "Petrol"] },
  { id: "tank-b", name: "Tank Farm B", team: "Ops", items: ["Diesel Fuel"] },
  { id: "workshop", name: "Workshop Store", team: "Workshop", items: ["Lubricants", "Spare Parts", "Tools"] },
];

export default function WarehouseTransfer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");

  const fromWarehouseData = warehouses.find(w => w.id === fromWarehouse);
  const toWarehouseData = warehouses.find(w => w.id === toWarehouse);

  const columns = [
    {
      key: "transferNumber",
      header: "Transfer #",
      render: (item: WarehouseTransfer) => (
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-primary" />
          <span className="font-medium">{item.transferNumber}</span>
        </div>
      ),
    },
    {
      key: "item",
      header: "Item",
      render: (item: WarehouseTransfer) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          {item.item}
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: WarehouseTransfer) => (
        <span>{item.quantity.toLocaleString()} {item.unit}</span>
      ),
    },
    {
      key: "route",
      header: "Route",
      render: (item: WarehouseTransfer) => (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{item.fromWarehouse}</span>
          <ArrowRight className="w-3 h-3" />
          <span>{item.toWarehouse}</span>
        </div>
      ),
    },
    {
      key: "transferDate",
      header: "Date",
      render: (item: WarehouseTransfer) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {item.transferDate}
        </div>
      ),
    },
    {
      key: "grnCreated",
      header: "GRN",
      render: (item: WarehouseTransfer) => (
        <span className={`text-xs ${item.grnCreated ? "text-success" : "text-muted-foreground"}`}>
          {item.grnCreated ? "✓ Created" : "○ Pending"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: WarehouseTransfer) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (item: WarehouseTransfer) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          {item.status === "in_transit" && (
            <Button variant="ghost" size="sm" className="h-8 text-xs text-success">
              Receive
            </Button>
          )}
        </div>
      ),
    },
  ];

  const filteredData = transferData.filter(
    (item) =>
      item.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Warehouse Transfers"
      subtitle="Transfer stock between warehouses"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create Warehouse Transfer</DialogTitle>
            </DialogHeader>
            
            <Alert className="border-info bg-info/5">
              <Truck className="h-4 w-4" />
              <AlertDescription className="text-info">
                Warehouse-to-warehouse transfers are processed directly without approval. 
                A GRN will be auto-generated upon receipt.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Warehouse</Label>
                  <Select onValueChange={setFromWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(wh => (
                        <SelectItem key={wh.id} value={wh.id} disabled={wh.id === toWarehouse}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {wh.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fromWarehouseData && (
                    <p className="text-xs text-muted-foreground">
                      Team: {fromWarehouseData.team}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>To Warehouse</Label>
                  <Select onValueChange={setToWarehouse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(wh => (
                        <SelectItem key={wh.id} value={wh.id} disabled={wh.id === fromWarehouse}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {wh.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {toWarehouseData && (
                    <p className="text-xs text-muted-foreground">
                      Team: {toWarehouseData.team}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Item</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item to transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel Fuel (5,000 L available)</SelectItem>
                    <SelectItem value="engine-oil">Engine Oil SAE 40 (200 L available)</SelectItem>
                    <SelectItem value="hydraulic-oil">Hydraulic Oil (50 L available)</SelectItem>
                    <SelectItem value="brake-pads">Brake Pads Set (25 Pcs available)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="Enter quantity" />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select defaultValue="L">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Liters (L)</SelectItem>
                      <SelectItem value="KG">Kilograms (KG)</SelectItem>
                      <SelectItem value="Pcs">Pieces (Pcs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transfer Date</Label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="space-y-2">
                <Label>Reason for Transfer</Label>
                <Textarea placeholder="Why is this transfer needed?" rows={2} />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Initiate Transfer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Truck className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending GRN</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Package className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <ArrowLeftRight className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs defaultValue="all" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Transfers</TabsTrigger>
                <TabsTrigger value="in_transit">In Transit</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transfers..."
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
