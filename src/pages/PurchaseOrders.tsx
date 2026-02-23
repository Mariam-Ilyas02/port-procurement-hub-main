// import { useState } from "react";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { DataTable } from "@/components/shared/DataTable";
// import { StatusBadge } from "@/components/shared/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogTrigger,
//   DialogFooter 
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Plus, Search, Filter, ShoppingCart, Calendar, Eye, Edit, Printer, Send } from "lucide-react";

// interface PurchaseOrder {
//   id: string;
//   poNumber: string;
//   supplier: string;
//   items: number;
//   totalAmount: string;
//   issueDate: string;
//   deliveryDate: string;
//   status: "draft" | "pending" | "approved" | "completed";
//   createdFrom: string;
// }

// const purchaseOrdersData: PurchaseOrder[] = [
//   { id: "1", poNumber: "PO-2025-001", supplier: "Gulf Petroleum Ltd", items: 3, totalAmount: "₨45,000", issueDate: "2025-01-28", deliveryDate: "2025-02-15", status: "pending", createdFrom: "REQ-2025-001" },
//   { id: "2", poNumber: "PO-2025-002", supplier: "Shell Oil Company", items: 2, totalAmount: "₨8,500", issueDate: "2025-01-27", deliveryDate: "2025-02-10", status: "approved", createdFrom: "REQ-2025-002" },
//   { id: "3", poNumber: "PO-2025-003", supplier: "Safety First Inc", items: 5, totalAmount: "₨12,000", issueDate: "2025-01-25", deliveryDate: "2025-02-20", status: "completed", createdFrom: "REQ-2025-004" },
//   { id: "4", poNumber: "PO-2025-004", supplier: "Office Depot", items: 10, totalAmount: "₨2,500", issueDate: "2025-01-24", deliveryDate: "2025-02-05", status: "draft", createdFrom: "Manual" },
//   { id: "5", poNumber: "PO-2025-005", supplier: "Total Energies", items: 1, totalAmount: "₨32,000", issueDate: "2025-01-23", deliveryDate: "2025-02-12", status: "approved", createdFrom: "REQ-2025-005" },
// ];

// export default function PurchaseOrders() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

//   const columns = [
//     {
//       key: "poNumber",
//       header: "PO Number",
//       render: (item: PurchaseOrder) => (
//         <div className="flex items-center gap-2">
//           <ShoppingCart className="w-4 h-4 text-muted-foreground" />
//           <span className="font-medium">{item.poNumber}</span>
//         </div>
//       ),
//     },
//     { key: "supplier", header: "Supplier" },
//     { 
//       key: "items", 
//       header: "Items",
//       render: (item: PurchaseOrder) => (
//         <span className="text-muted-foreground">{item.items} items</span>
//       ),
//     },
//     { key: "totalAmount", header: "Total Amount", className: "text-right font-medium" },
//     {
//       key: "issueDate",
//       header: "Issue Date",
//       render: (item: PurchaseOrder) => (
//         <div className="flex items-center gap-2 text-muted-foreground">
//           <Calendar className="w-4 h-4" />
//           {item.issueDate}
//         </div>
//       ),
//     },
//     { key: "deliveryDate", header: "Delivery Date" },
//     { 
//       key: "createdFrom", 
//       header: "Source",
//       render: (item: PurchaseOrder) => (
//         <span className="text-sm text-muted-foreground">{item.createdFrom}</span>
//       ),
//     },
//     {
//       key: "status",
//       header: "Status",
//       render: (item: PurchaseOrder) => <StatusBadge status={item.status} />,
//     },
//     {
//       key: "actions",
//       header: "Actions",
//       render: () => (
//         <div className="flex items-center gap-1">
//           <Button variant="ghost" size="icon" className="h-8 w-8">
//             <Eye className="w-4 h-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="h-8 w-8">
//             <Edit className="w-4 h-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="h-8 w-8">
//             <Printer className="w-4 h-4" />
//           </Button>
//           <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
//             <Send className="w-4 h-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   const filteredData = purchaseOrdersData.filter(
//     (item) =>
//       item.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <AppLayout
//       title="Purchase Orders"
//       subtitle="Manage and track purchase orders"
//       actions={
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="w-4 h-4 mr-2" />
//               Create PO
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>Create Purchase Order</DialogTitle>
//             </DialogHeader>
//             <div className="grid grid-cols-2 gap-4 py-4">
//               <div className="space-y-2">
//                 <Label htmlFor="requisition">From Requisition (Optional)</Label>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select requisition" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="req-001">REQ-2025-001 - Diesel Fuel</SelectItem>
//                     <SelectItem value="req-002">REQ-2025-002 - Engine Oil</SelectItem>
//                     <SelectItem value="manual">Manual Entry</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="supplier">Supplier</Label>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select supplier" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="gulf">Gulf Petroleum Ltd</SelectItem>
//                     <SelectItem value="shell">Shell Oil Company</SelectItem>
//                     <SelectItem value="total">Total Energies</SelectItem>
//                     <SelectItem value="office">Office Depot</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
//                 <Input id="deliveryDate" type="date" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="paymentTerms">Payment Terms</Label>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select terms" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="net30">Net 30</SelectItem>
//                     <SelectItem value="net60">Net 60</SelectItem>
//                     <SelectItem value="cod">Cash on Delivery</SelectItem>
//                     <SelectItem value="advance">Advance Payment</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="col-span-2 border rounded-lg p-4">
//                 <h4 className="font-medium mb-3">Order Items</h4>
//                 <div className="grid grid-cols-5 gap-2 text-sm text-muted-foreground mb-2">
//                   <span>Item</span>
//                   <span>Quantity</span>
//                   <span>Unit</span>
//                   <span>Unit Price</span>
//                   <span>Total</span>
//                 </div>
//                 <div className="grid grid-cols-5 gap-2 items-center">
//                   <Input placeholder="Item name" />
//                   <Input type="number" placeholder="0" />
//                   <Select>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Unit" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="L">L</SelectItem>
//                       <SelectItem value="KG">KG</SelectItem>
//                       <SelectItem value="Pcs">Pcs</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Input type="number" placeholder="0.00" />
//                   <span className="text-sm font-medium">₨0.00</span>
//                 </div>
//                 <Button variant="ghost" size="sm" className="mt-2">
//                   <Plus className="w-4 h-4 mr-1" /> Add Item
//                 </Button>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button variant="secondary">Save as Draft</Button>
//               <Button>Create & Submit</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       }
//     >
//       <Card>
//         <CardHeader className="pb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <Tabs defaultValue="all" className="w-full sm:w-auto">
//               <TabsList>
//                 <TabsTrigger value="all">All POs</TabsTrigger>
//                 <TabsTrigger value="draft">Draft</TabsTrigger>
//                 <TabsTrigger value="pending">Pending</TabsTrigger>
//                 <TabsTrigger value="approved">Approved</TabsTrigger>
//                 <TabsTrigger value="completed">Completed</TabsTrigger>
//               </TabsList>
//             </Tabs>
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search POs..."
//                   className="pl-9 w-64"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               <Button variant="outline" size="icon">
//                 <Filter className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           <DataTable columns={columns} data={filteredData} selectable />
//         </CardContent>
//       </Card>
//     </AppLayout>
//   );
// }


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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Eye,
  Printer,
  Send,
  CheckCircle,
  FileCheck,
  Plus,
} from "lucide-react";

/* ============================= */
/*         TYPES                 */
/* ============================= */

interface PurchaseOrder {
  id: string;
  poNumber: string;
  requisitionNumber?: string;
  item: string;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  totalAmount: number;
  department: string;
  requester: string;
  vendor: string;
  requiredDate: string;
  deliveryDate: string;
  status: "draft" | "pending_approval" | "approved" | "issued" | "received";
}

/* ============================= */
/*     AUTO GENERATED POs       */
/* ============================= */

const initialPOs: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2025-001",
    requisitionNumber: "REQ-2025-003",
    item: "Diesel Fuel",
    category: "Fuel",
    subcategory: "Diesel",
    quantity: 5000,
    unit: "L",
    estimatedUnitPrice: 9,
    totalAmount: 45000,
    department: "Operations",
    requester: "Azlaan Kareem",
    vendor: "Gulf Petroleum Ltd",
    requiredDate: "2025-02-10",
    deliveryDate: "2025-02-15",
    status: "approved",
  },
  {
    id: "2",
    poNumber: "PO-2025-002",
    requisitionNumber: "REQ-2025-004",
    item: "Engine Oil",
    category: "Oil",
    subcategory: "SAE 40",
    quantity: 200,
    unit: "L",
    estimatedUnitPrice: 42.5,
    totalAmount: 8500,
    department: "Workshop",
    requester: "Kareem Ullah",
    vendor: "Shell Oil Company",
    requiredDate: "2025-02-05",
    deliveryDate: "2025-02-10",
    status: "issued",
  },
];

/* ============================= */
/*         COMPONENT             */
/* ============================= */

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>(initialPOs);

  const [search, setSearch] = useState("");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isManualOpen, setIsManualOpen] = useState(false);

  /* ============================= */
  /*       STATUS TRANSITIONS      */
  /* ============================= */

  const updateStatus = (id: string, newStatus: PurchaseOrder["status"]) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === id ? { ...po, status: newStatus } : po
      )
    );
  };

  /* ============================= */
  /*        FILTER SEARCH          */
  /* ============================= */

  const filtered = purchaseOrders.filter(
    (po) =>
      po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.requisitionNumber?.toLowerCase().includes(search.toLowerCase())
  );

  /* ============================= */
  /*          TABLE COLUMNS        */
  /* ============================= */

  const columns = [
    { key: "poNumber", header: "PO Number" },
    { key: "requisitionNumber", header: "Requisition" },
    { key: "item", header: "Item" },
    { key: "vendor", header: "Vendor" },
    { key: "totalAmount", header: "Total Amount", className: "text-right" },
    {
      key: "status",
      header: "Status",
      render: (item: PurchaseOrder) => (
        <StatusBadge status={item.status} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: PurchaseOrder) => (
        <div className="flex gap-1">

          {/* View */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedPO(item)}
          >
            <Eye className="w-4 h-4" />
          </Button>

          {/* Submit for Approval */}
          {item.status === "draft" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateStatus(item.id, "pending_approval")}
            >
              <FileCheck className="w-4 h-4 text-warning" />
            </Button>
          )}

          {/* Approve */}
          {item.status === "pending_approval" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateStatus(item.id, "approved")}
            >
              <CheckCircle className="w-4 h-4 text-success" />
            </Button>
          )}

          {/* Issue to Vendor */}
          {item.status === "approved" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateStatus(item.id, "issued")}
            >
              <Send className="w-4 h-4 text-primary" />
            </Button>
          )}

          {/* Mark as Received */}
          {item.status === "issued" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateStatus(item.id, "received")}
            >
              <CheckCircle className="w-4 h-4 text-success" />
            </Button>
          )}

          {/* Print */}
          <Button variant="ghost" size="icon">
            <Printer className="w-4 h-4" />
          </Button>

        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="Purchase Order Management"
      subtitle="Auto-generated from approved requisitions & manual creation supported"
      actions={
        <Button onClick={() => setIsManualOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Manual PO
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Purchase Orders</CardTitle>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search PO..."
                className="pl-9 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <DataTable columns={columns} data={filtered} />
        </CardContent>
      </Card>

      {/* ============================= */}
      {/*        PO DETAIL DIALOG       */}
      {/* ============================= */}

      <Dialog open={!!selectedPO} onOpenChange={() => setSelectedPO(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
          </DialogHeader>

          {selectedPO && (
            <div className="space-y-3 text-sm">
              <p><strong>PO:</strong> {selectedPO.poNumber}</p>
              <p><strong>Requisition:</strong> {selectedPO.requisitionNumber}</p>
              <p><strong>Item:</strong> {selectedPO.item}</p>
              <p><strong>Vendor:</strong> {selectedPO.vendor}</p>
              <p><strong>Total:</strong> {selectedPO.totalAmount}</p>
              <p><strong>Status:</strong> <StatusBadge status={selectedPO.status} /></p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPO(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================= */}
      {/*        MANUAL PO DIALOG       */}
      {/* ============================= */}

      <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Manual PO</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Supplier</Label>
              <Input placeholder="Select vendor..." />
            </div>
            <div>
              <Label>Item Description</Label>
              <Input placeholder="Enter item..." />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input placeholder="Enter quantity..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
const newPO: PurchaseOrder = {
  id: Date.now().toString(),
  poNumber: `PO-2025-${purchaseOrders.length + 1}`,
  requisitionNumber: "Manual",
  item: "Manual Item",
  category: "General",
  subcategory: "Manual",
  quantity: 100,
  unit: "Pcs",
  estimatedUnitPrice: 0,
  totalAmount: 0,
  department: "Admin",
  requester: "System",
  vendor: "Manual Vendor",
  requiredDate: new Date().toISOString().split("T")[0],
  deliveryDate: new Date().toISOString().split("T")[0],
  status: "draft",
};
                setPurchaseOrders((prev) => [...prev, newPO]);
                setIsManualOpen(false);
              }}
            >
              Create PO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}