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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, ShoppingCart, Calendar, Eye, Edit, Printer, Send } from "lucide-react";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  items: number;
  totalAmount: string;
  issueDate: string;
  deliveryDate: string;
  status: "draft" | "pending" | "approved" | "completed";
  createdFrom: string;
}

const purchaseOrdersData: PurchaseOrder[] = [
  { id: "1", poNumber: "PO-2025-001", supplier: "Gulf Petroleum Ltd", items: 3, totalAmount: "₨45,000", issueDate: "2025-01-28", deliveryDate: "2025-02-15", status: "pending", createdFrom: "REQ-2025-001" },
  { id: "2", poNumber: "PO-2025-002", supplier: "Shell Oil Company", items: 2, totalAmount: "₨8,500", issueDate: "2025-01-27", deliveryDate: "2025-02-10", status: "approved", createdFrom: "REQ-2025-002" },
  { id: "3", poNumber: "PO-2025-003", supplier: "Safety First Inc", items: 5, totalAmount: "₨12,000", issueDate: "2025-01-25", deliveryDate: "2025-02-20", status: "completed", createdFrom: "REQ-2025-004" },
  { id: "4", poNumber: "PO-2025-004", supplier: "Office Depot", items: 10, totalAmount: "₨2,500", issueDate: "2025-01-24", deliveryDate: "2025-02-05", status: "draft", createdFrom: "Manual" },
  { id: "5", poNumber: "PO-2025-005", supplier: "Total Energies", items: 1, totalAmount: "₨32,000", issueDate: "2025-01-23", deliveryDate: "2025-02-12", status: "approved", createdFrom: "REQ-2025-005" },
];

export default function PurchaseOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const columns = [
    {
      key: "poNumber",
      header: "PO Number",
      render: (item: PurchaseOrder) => (
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{item.poNumber}</span>
        </div>
      ),
    },
    { key: "supplier", header: "Supplier" },
    { 
      key: "items", 
      header: "Items",
      render: (item: PurchaseOrder) => (
        <span className="text-muted-foreground">{item.items} items</span>
      ),
    },
    { key: "totalAmount", header: "Total Amount", className: "text-right font-medium" },
    {
      key: "issueDate",
      header: "Issue Date",
      render: (item: PurchaseOrder) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {item.issueDate}
        </div>
      ),
    },
    { key: "deliveryDate", header: "Delivery Date" },
    { 
      key: "createdFrom", 
      header: "Source",
      render: (item: PurchaseOrder) => (
        <span className="text-sm text-muted-foreground">{item.createdFrom}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: PurchaseOrder) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = purchaseOrdersData.filter(
    (item) =>
      item.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Purchase Orders"
      subtitle="Manage and track purchase orders"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create PO
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="requisition">From Requisition (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select requisition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="req-001">REQ-2025-001 - Diesel Fuel</SelectItem>
                    <SelectItem value="req-002">REQ-2025-002 - Engine Oil</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gulf">Gulf Petroleum Ltd</SelectItem>
                    <SelectItem value="shell">Shell Oil Company</SelectItem>
                    <SelectItem value="total">Total Energies</SelectItem>
                    <SelectItem value="office">Office Depot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                <Input id="deliveryDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="advance">Advance Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 border rounded-lg p-4">
                <h4 className="font-medium mb-3">Order Items</h4>
                <div className="grid grid-cols-5 gap-2 text-sm text-muted-foreground mb-2">
                  <span>Item</span>
                  <span>Quantity</span>
                  <span>Unit</span>
                  <span>Unit Price</span>
                  <span>Total</span>
                </div>
                <div className="grid grid-cols-5 gap-2 items-center">
                  <Input placeholder="Item name" />
                  <Input type="number" placeholder="0" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="Pcs">Pcs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="0.00" />
                  <span className="text-sm font-medium">₨0.00</span>
                </div>
                <Button variant="ghost" size="sm" className="mt-2">
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="secondary">Save as Draft</Button>
              <Button>Create & Submit</Button>
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
                <TabsTrigger value="all">All POs</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search POs..."
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
