import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Search, Filter, ClipboardCheck, Package, Calendar, Eye, 
  CheckCircle, XCircle, AlertTriangle, Truck, ArrowRight, MapPin
} from "lucide-react";

interface GoodsReceipt {
  id: string;
  grnNumber: string;
  poReference: string;
  supplier: string;
  items: number;
  receivedDate: string;
  warehouse: string;
  receivedBy: string;
  status: "pending" | "verified" | "discrepancy" | "completed";
  matchStatus: "matched" | "partial" | "mismatch";
  qualityStatus: "passed" | "failed" | "pending";
}

const goodsReceiptData: GoodsReceipt[] = [
  { id: "1", grnNumber: "GRN-2025-001", poReference: "PO-2025-001", supplier: "Gulf Petroleum Ltd", items: 3, receivedDate: "2025-01-28", warehouse: "Main Warehouse", receivedBy: "Ahmed Khan", status: "completed", matchStatus: "matched", qualityStatus: "passed" },
  { id: "2", grnNumber: "GRN-2025-002", poReference: "PO-2025-002", supplier: "Shell Oil Company", items: 2, receivedDate: "2025-01-27", warehouse: "Tank Farm A", receivedBy: "Sarah Ali", status: "verified", matchStatus: "matched", qualityStatus: "passed" },
  { id: "3", grnNumber: "GRN-2025-003", poReference: "PO-2025-003", supplier: "Safety First Inc", items: 5, receivedDate: "2025-01-26", warehouse: "Main Warehouse", receivedBy: "Mikaal Ahmed", status: "discrepancy", matchStatus: "partial", qualityStatus: "pending" },
  { id: "4", grnNumber: "GRN-2025-004", poReference: "PO-2025-005", supplier: "Total Energies", items: 1, receivedDate: "2025-01-25", warehouse: "Tank Farm B", receivedBy: "Ahmed Khan", status: "pending", matchStatus: "matched", qualityStatus: "pending" },
];

// Mock PO data for matching
const pendingPOs = [
  { id: "PO-2025-006", supplier: "Gulf Petroleum Ltd", items: [
    { name: "Diesel Fuel", ordered: 5000, unit: "L" },
    { name: "Engine Oil", ordered: 200, unit: "L" }
  ]},
  { id: "PO-2025-007", supplier: "Office Depot", items: [
    { name: "Office Stationery", ordered: 100, unit: "Pcs" }
  ]},
];

const warehouses = [
  { id: "main", name: "Main Warehouse", team: "Admin" },
  { id: "tank-a", name: "Tank Farm A", team: "Ops" },
  { id: "tank-b", name: "Tank Farm B", team: "Ops" },
  { id: "workshop", name: "Workshop Store", team: "Workshop" },
];

export default function GoodsReceipt() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  const selectedPOData = pendingPOs.find(po => po.id === selectedPO);
  const selectedWarehouseData = warehouses.find(w => w.id === selectedWarehouse);

  const columns = [
    {
      key: "grnNumber",
      header: "GRN Number",
      render: (item: GoodsReceipt) => (
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-primary" />
          <span className="font-medium">{item.grnNumber}</span>
        </div>
      ),
    },
    { key: "poReference", header: "PO Reference" },
    { key: "supplier", header: "Supplier" },
    { 
      key: "items", 
      header: "Items",
      render: (item: GoodsReceipt) => (
        <span className="text-muted-foreground">{item.items} items</span>
      ),
    },
    {
      key: "receivedDate",
      header: "Received Date",
      render: (item: GoodsReceipt) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {item.receivedDate}
        </div>
      ),
    },
    {
      key: "warehouse",
      header: "Warehouse",
      render: (item: GoodsReceipt) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{item.warehouse}</span>
        </div>
      ),
    },
    {
      key: "matchStatus",
      header: "PO Match",
      render: (item: GoodsReceipt) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          item.matchStatus === "matched" 
            ? "bg-success/10 text-success" 
            : item.matchStatus === "partial" 
              ? "bg-warning/10 text-warning" 
              : "bg-destructive/10 text-destructive"
        }`}>
          {item.matchStatus === "matched" ? "✓ Matched" : 
           item.matchStatus === "partial" ? "⚠ Partial" : "✗ Mismatch"}
        </span>
      ),
    },
    {
      key: "qualityStatus",
      header: "Quality",
      render: (item: GoodsReceipt) => (
        <div className="flex items-center gap-1">
          {item.qualityStatus === "passed" ? (
            <CheckCircle className="w-4 h-4 text-success" />
          ) : item.qualityStatus === "failed" ? (
            <XCircle className="w-4 h-4 text-destructive" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-warning" />
          )}
          <span className="text-xs capitalize">{item.qualityStatus}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: GoodsReceipt) => <StatusBadge status={item.status} />,
    },
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

  const filteredData = goodsReceiptData.filter(
    (item) =>
      item.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Goods Receipt Notes (GRN)"
      subtitle="Record and verify goods received against purchase orders"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create GRN
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Goods Receipt Note</DialogTitle>
            </DialogHeader>
            
            {/* Workflow Steps */}
            <div className="flex items-center justify-between text-xs py-3 border-b">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                <span>Select PO</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">2</div>
                <span>Verify Quantities</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">3</div>
                <span>Quality Check</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">4</div>
                <span>Complete</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Purchase Order</Label>
                <Select onValueChange={setSelectedPO}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PO to receive" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingPOs.map(po => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.id} - {po.supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Receiving Warehouse</Label>
                <Select onValueChange={setSelectedWarehouse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map(wh => (
                      <SelectItem key={wh.id} value={wh.id}>
                        {wh.name} ({wh.team} Team)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Received Date</Label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="space-y-2">
                <Label>Delivery Note Number</Label>
                <Input placeholder="Supplier's delivery note #" />
              </div>

              {/* Warehouse Team Assignment */}
              {selectedWarehouseData && (
                <div className="col-span-2">
                  <Alert className="border-info bg-info/5">
                    <MapPin className="h-4 w-4" />
                    <AlertDescription>
                      <span className="text-info">
                        This receipt will be handled by the <strong>{selectedWarehouseData.team}</strong> team 
                        at <strong>{selectedWarehouseData.name}</strong>.
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* PO Items to Verify */}
              {selectedPOData && (
                <div className="col-span-2 border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Items from {selectedPO}
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-6 gap-2 text-xs text-muted-foreground font-medium pb-2 border-b">
                      <span className="col-span-2">Item</span>
                      <span>Ordered</span>
                      <span>Received</span>
                      <span>Unit</span>
                      <span>Match</span>
                    </div>
                    {selectedPOData.items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-6 gap-2 items-center">
                        <span className="col-span-2 text-sm">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.ordered}</span>
                        <Input type="number" className="h-8" placeholder="0" />
                        <span className="text-sm text-muted-foreground">{item.unit}</span>
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality Check Section */}
              <div className="col-span-2 border rounded-lg p-4">
                <h4 className="font-medium mb-3">Quality Verification</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="visualCheck" />
                    <Label htmlFor="visualCheck" className="cursor-pointer text-sm">
                      Visual inspection passed
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="quantityMatch" />
                    <Label htmlFor="quantityMatch" className="cursor-pointer text-sm">
                      Quantities match delivery note
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="packagingIntact" />
                    <Label htmlFor="packagingIntact" className="cursor-pointer text-sm">
                      Packaging intact/undamaged
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="documentsComplete" />
                    <Label htmlFor="documentsComplete" className="cursor-pointer text-sm">
                      All documents received
                    </Label>
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Remarks / Discrepancy Notes</Label>
                <Textarea placeholder="Note any discrepancies, damages, or issues..." rows={2} />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="secondary">Save as Draft</Button>
              <Button>Complete GRN</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Receipt</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Truck className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified Today</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Discrepancies</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <ClipboardCheck className="w-8 h-8 text-primary" />
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
                <TabsTrigger value="all">All GRNs</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="discrepancy">Discrepancy</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search GRNs..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredData} selectable />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
