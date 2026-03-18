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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  Send,
  CheckCircle,
  FileCheck,
  Calendar,
  Package,
  ChevronRight,
  Building2,
  ClipboardList,
  Download,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type POStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "issued"
  | "received";

interface POLineItem {
  id: string;
  item: string;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  /** Set when auto-generated from an approved requisition */
  requisitionNumber?: string;
  vendor: string;
  vendorContact: string;
  department: string;
  requester: string;
  lineItems: POLineItem[];
  totalAmount: number;
  requiredDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  paymentTerms: string;
  status: POStatus;
  issuedVia?: "email" | "print" | "pdf";
  notes?: string;
  createdAt: string;
}

// ─── Reference Data ───────────────────────────────────────────────────────────

/** Only vendors from the approved vendor master can be selected */
const approvedVendors = [
  { id: "v1", name: "Gulf Petroleum Ltd",   contact: "sales@gulfpetro.pk",    category: "Fuel & Oil"       },
  { id: "v2", name: "Shell Oil Company",     contact: "orders@shell.pk",       category: "Fuel & Oil"       },
  { id: "v3", name: "Total Energies",        contact: "supply@total.pk",       category: "Fuel & Oil"       },
  { id: "v4", name: "Safety First Inc",      contact: "info@safetyfirst.pk",   category: "Safety Equipment" },
  { id: "v5", name: "Pak Lubricants",        contact: "sales@paklub.pk",       category: "Lubricants"       },
  { id: "v6", name: "Office Depot Pakistan", contact: "orders@officedepot.pk", category: "Stationery"       },
];

const categories = [
  { name: "Oil",         subcategories: ["Petrol", "Diesel", "Lubricants", "Hydraulic Fluid"] },
  { name: "Spare Parts", subcategories: ["Engine Parts", "Filters", "Belts", "Bearings"]      },
  { name: "Consumables", subcategories: ["Stationery", "Cleaning Supplies", "Safety Gear"]    },
  { name: "Equipment",   subcategories: ["Workshop Tools", "IT Equipment", "Office Equipment"] },
];

const paymentTermsOptions = [
  "Net 30",
  "Net 60",
  "Immediate",
  "50% Advance / 50% on Delivery",
];

const departments = ["Operations", "Workshop", "Admin", "Finance", "Procurement"];
const units       = ["Pcs", "L", "Kg", "Box", "Set", "Pairs"];

// ─── Seed Data ────────────────────────────────────────────────────────────────

const initialPOs: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2025-001",
    requisitionNumber: "REQ-2026-001",
    vendor: "Gulf Petroleum Ltd",
    vendorContact: "sales@gulfpetro.pk",
    department: "Operations",
    requester: "Azlaan Kareem",
    lineItems: [
      { id: "l1", item: "Diesel Fuel", category: "Oil", subcategory: "Diesel",
        quantity: 5000, unit: "L", unitPrice: 9, totalAmount: 45000 },
    ],
    totalAmount: 45000,
    requiredDate: "2025-02-10",
    deliveryDate: "2025-02-15",
    deliveryAddress: "Main Warehouse, Site A",
    paymentTerms: "Net 30",
    status: "approved",
    createdAt: "2025-01-20",
  },
  {
    id: "2",
    poNumber: "PO-2025-002",
    requisitionNumber: "REQ-2026-002",
    vendor: "Shell Oil Company",
    vendorContact: "orders@shell.pk",
    department: "Workshop",
    requester: "Kareem Ullah",
    lineItems: [
      { id: "l2", item: "Engine Oil SAE 40", category: "Oil", subcategory: "Lubricants",
        quantity: 200, unit: "L", unitPrice: 42.5, totalAmount: 8500 },
    ],
    totalAmount: 8500,
    requiredDate: "2025-02-05",
    deliveryDate: "2025-02-10",
    deliveryAddress: "Workshop Store, Site A",
    paymentTerms: "Net 30",
    status: "issued",
    issuedVia: "email",
    createdAt: "2025-01-18",
  },
  {
    id: "3",
    poNumber: "PO-2025-003",
    requisitionNumber: "REQ-2026-004",
    vendor: "Safety First Inc",
    vendorContact: "info@safetyfirst.pk",
    department: "Operations",
    requester: "Sarah Shaikh",
    lineItems: [
      { id: "l3", item: "Safety Helmets", category: "Consumables", subcategory: "Safety Gear",
        quantity: 50, unit: "Pcs", unitPrice: 450, totalAmount: 22500 },
      { id: "l4", item: "Safety Gloves", category: "Consumables", subcategory: "Safety Gear",
        quantity: 200, unit: "Pairs", unitPrice: 120, totalAmount: 24000 },
    ],
    totalAmount: 46500,
    requiredDate: "2025-02-15",
    deliveryDate: "2025-02-20",
    deliveryAddress: "Main Warehouse, Site A",
    paymentTerms: "50% Advance / 50% on Delivery",
    status: "pending_approval",
    createdAt: "2025-01-22",
  },
  {
    id: "4",
    poNumber: "PO-2025-004",
    vendor: "Total Energies",
    vendorContact: "supply@total.pk",
    department: "Operations",
    requester: "Ahmed Khan",
    lineItems: [
      { id: "l5", item: "Transmission Fluid", category: "Oil", subcategory: "Lubricants",
        quantity: 500, unit: "L", unitPrice: 980, totalAmount: 490000 },
    ],
    totalAmount: 490000,
    requiredDate: "2025-02-25",
    deliveryDate: "2025-03-01",
    deliveryAddress: "Tank Farm B, Site A",
    paymentTerms: "Net 60",
    status: "draft",
    notes: "Manual PO — no linked requisition.",
    createdAt: "2025-01-25",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => "₨" + n.toLocaleString();

const statusFlow: POStatus[] = [
  "draft", "pending_approval", "approved", "issued", "received",
];

const statusLabels: Record<POStatus, string> = {
  draft:            "Draft",
  pending_approval: "Pending approval",
  approved:         "Approved",
  issued:           "Issued",
  received:         "Received",
};

// ─── Status Flow Strip ────────────────────────────────────────────────────────

function StatusFlow({ current }: { current: POStatus }) {
  const idx = statusFlow.indexOf(current);
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {statusFlow.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            i < idx ? "bg-success/10 text-success"
            : i === idx ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
          }`}>
            {statusLabels[s]}
          </span>
          {i < statusFlow.length - 1 && (
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Detail Dialog ────────────────────────────────────────────────────────────

function DetailDialog({
  po,
  onStatusChange,
  onClose,
}: {
  po: PurchaseOrder;
  onStatusChange: (id: string, status: POStatus, issuedVia?: "email" | "print" | "pdf") => void;
  onClose: () => void;
}) {
  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-muted-foreground" />
          {po.poNumber}
          {po.requisitionNumber ? (
            <span className="text-xs text-muted-foreground font-normal ml-1">
              · from {po.requisitionNumber}
            </span>
          ) : (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full ml-1">
              Manual
            </span>
          )}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <StatusFlow current={po.status} />

        {/* Meta */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Vendor</p>
            <p className="font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />{po.vendor}
            </p>
            <p className="text-xs text-muted-foreground">{po.vendorContact}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Department / requester</p>
            <p className="font-medium">{po.department}</p>
            <p className="text-xs text-muted-foreground">{po.requester}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Required by</p>
            <p className="font-medium">{po.requiredDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Expected delivery</p>
            <p className="font-medium">{po.deliveryDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Delivery address</p>
            <p className="font-medium">{po.deliveryAddress}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Payment terms</p>
            <p className="font-medium">{po.paymentTerms}</p>
          </div>
          {po.issuedVia && (
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Issued via</p>
              <p className="font-medium capitalize">{po.issuedVia}</p>
            </div>
          )}
        </div>

        {/* Line items */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Package className="w-4 h-4" /> Line items
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {["Item", "Category", "Qty", "Unit", "Unit price", "Total"].map((h) => (
                  <th key={h} className="text-left text-xs text-muted-foreground font-medium pb-2 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {po.lineItems.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-medium">{l.item}</td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground">{l.category} › {l.subcategory}</td>
                  <td className="py-2 pr-3">{l.quantity}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{l.unit}</td>
                  <td className="py-2 pr-3">{fmt(l.unitPrice)}</td>
                  <td className="py-2 font-medium">{fmt(l.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="pt-2 text-right text-sm text-muted-foreground font-medium">Total:</td>
                <td className="pt-2 text-base font-semibold">{fmt(po.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {po.notes && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{po.notes}</p>
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 flex-wrap">
        <Button variant="outline" onClick={onClose}>Close</Button>

        {/* Export — always visible */}
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-1" /> Print
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" /> PDF
        </Button>

        {/* Status-gated workflow actions */}
        {po.status === "draft" && (
          <Button onClick={() => { onStatusChange(po.id, "pending_approval"); onClose(); }}>
            <FileCheck className="w-4 h-4 mr-1" /> Submit for approval
          </Button>
        )}
        {po.status === "pending_approval" && (
          <Button
            className="bg-success hover:bg-success/90 text-white"
            onClick={() => { onStatusChange(po.id, "approved"); onClose(); }}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Approve PO
          </Button>
        )}
        {po.status === "approved" && (
          <>
            <Button variant="outline" onClick={() => { onStatusChange(po.id, "issued", "email"); onClose(); }}>
              <Send className="w-4 h-4 mr-1" /> Issue via email
            </Button>
            <Button onClick={() => { onStatusChange(po.id, "issued", "print"); onClose(); }}>
              <Printer className="w-4 h-4 mr-1" /> Issue & print
            </Button>
          </>
        )}
        {po.status === "issued" && (
          <Button onClick={() => { onStatusChange(po.id, "received"); onClose(); }}>
            <CheckCircle className="w-4 h-4 mr-1" /> Mark as received → GRN
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

// ─── Manual PO Dialog ─────────────────────────────────────────────────────────

function ManualPODialog({
  open,
  onOpenChange,
  onCreate,
  existingCount,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (po: PurchaseOrder) => void;
  existingCount: number;
}) {
  const [vendorId,        setVendorId]        = useState("");
  const [department,      setDepartment]      = useState("");
  const [requiredDate,    setRequiredDate]    = useState("");
  const [deliveryDate,    setDeliveryDate]    = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentTerms,    setPaymentTerms]    = useState("");
  const [notes,           setNotes]           = useState("");
  const [lineItems, setLineItems] = useState<Omit<POLineItem, "id" | "totalAmount">[]>([
    { item: "", category: "", subcategory: "", quantity: 0, unit: "Pcs", unitPrice: 0 },
  ]);

  const selectedVendor = approvedVendors.find((v) => v.id === vendorId);
  const total = lineItems.reduce((s, l) => s + l.quantity * l.unitPrice, 0);

  const updateLine = (
    idx: number,
    field: keyof Omit<POLineItem, "id" | "totalAmount">,
    value: string | number
  ) => setLineItems((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));

  const addLine = () =>
    setLineItems((prev) => [
      ...prev,
      { item: "", category: "", subcategory: "", quantity: 0, unit: "Pcs", unitPrice: 0 },
    ]);

  const removeLine = (idx: number) =>
    setLineItems((prev) => prev.filter((_, i) => i !== idx));

  const handleCreate = (asDraft: boolean) => {
    if (!selectedVendor) return;
    const items: POLineItem[] = lineItems.map((l, i) => ({
      ...l,
      id: `new-${i}`,
      totalAmount: l.quantity * l.unitPrice,
    }));
    const newPO: PurchaseOrder = {
      id:              Date.now().toString(),
      poNumber:        `PO-2025-${String(existingCount + 1).padStart(3, "0")}`,
      vendor:          selectedVendor.name,
      vendorContact:   selectedVendor.contact,
      department,
      requester:       "Current User",
      lineItems:       items,
      totalAmount:     total,
      requiredDate,
      deliveryDate,
      deliveryAddress,
      paymentTerms,
      status:          asDraft ? "draft" : "pending_approval",
      notes,
      createdAt:       new Date().toISOString().split("T")[0],
    };
    onCreate(newPO);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create manual purchase order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Vendor + Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Vendor (approved vendor master)</Label>
              <Select onValueChange={setVendorId} value={vendorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select approved vendor" />
                </SelectTrigger>
                <SelectContent>
                  {approvedVendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                      <span className="text-muted-foreground text-xs ml-1">· {v.category}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedVendor && (
                <p className="text-xs text-muted-foreground">{selectedVendor.contact}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select onValueChange={setDepartment} value={department}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates + Address + Terms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Required date</Label>
              <Input type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Expected delivery date</Label>
              <Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Delivery address</Label>
              <Input
                placeholder="e.g. Main Warehouse, Site A"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Payment terms</Label>
              <Select onValueChange={setPaymentTerms} value={paymentTerms}>
                <SelectTrigger><SelectValue placeholder="Select terms" /></SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Package className="w-4 h-4" /> Line items
              </p>
              <Button variant="outline" size="sm" onClick={addLine}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add item
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {["Item", "Category", "Subcategory", "Qty", "Unit", "Unit price (₨)", "Total", ""].map((h) => (
                      <th key={h} className="text-left text-xs text-muted-foreground font-medium p-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((l, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-1.5">
                        <Input
                          className="h-8 min-w-[100px]"
                          placeholder="Item name"
                          value={l.item}
                          onChange={(e) => updateLine(idx, "item", e.target.value)}
                        />
                      </td>
                      <td className="p-1.5">
                        <Select
                          value={l.category}
                          onValueChange={(v) => { updateLine(idx, "category", v); updateLine(idx, "subcategory", ""); }}
                        >
                          <SelectTrigger className="h-8 min-w-[100px]">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1.5">
                        <Select
                          value={l.subcategory}
                          onValueChange={(v) => updateLine(idx, "subcategory", v)}
                        >
                          <SelectTrigger className="h-8 min-w-[100px]">
                            <SelectValue placeholder="Sub" />
                          </SelectTrigger>
                          <SelectContent>
                            {(categories.find((c) => c.name === l.category)?.subcategories ?? []).map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1.5">
                        <Input
                          type="number" className="h-8 w-16" placeholder="0"
                          value={l.quantity || ""}
                          onChange={(e) => updateLine(idx, "quantity", Number(e.target.value))}
                        />
                      </td>
                      <td className="p-1.5">
                        <Select value={l.unit} onValueChange={(v) => updateLine(idx, "unit", v)}>
                          <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1.5">
                        <Input
                          type="number" className="h-8 w-24" placeholder="0.00"
                          value={l.unitPrice || ""}
                          onChange={(e) => updateLine(idx, "unitPrice", Number(e.target.value))}
                        />
                      </td>
                      <td className="p-1.5 text-right font-medium whitespace-nowrap">
                        {fmt(l.quantity * l.unitPrice)}
                      </td>
                      <td className="p-1.5">
                        {lineItems.length > 1 && (
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-destructive"
                            onClick={() => removeLine(idx)}
                          >✕</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-muted/30">
                    <td colSpan={6} className="p-2 text-right text-sm text-muted-foreground font-medium">Total:</td>
                    <td className="p-2 font-semibold">{fmt(total)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Any additional notes for the vendor or approver..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="outline" onClick={() => handleCreate(true)}>Save as draft</Button>
          <Button
            onClick={() => handleCreate(false)}
            disabled={!vendorId || lineItems.every((l) => !l.item)}
          >
            Submit for approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPOs);
  const [search,         setSearch]         = useState("");
  const [activeTab,      setActiveTab]      = useState("all");
  const [selectedPO,     setSelectedPO]     = useState<PurchaseOrder | null>(null);
  const [isManualOpen,   setIsManualOpen]   = useState(false);

  // ── Actions ──────────────────────────────────────────────────────────────

  const updateStatus = (
    id: string,
    newStatus: POStatus,
    issuedVia?: "email" | "print" | "pdf"
  ) =>
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === id
          ? { ...po, status: newStatus, ...(issuedVia ? { issuedVia } : {}) }
          : po
      )
    );

  const createPO = (po: PurchaseOrder) =>
    setPurchaseOrders((prev) => [po, ...prev]);

  // ── Filtering ─────────────────────────────────────────────────────────────

  const filtered = purchaseOrders.filter((po) => {
    const matchTab    = activeTab === "all" || po.status === activeTab;
    const matchSearch =
      po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.toLowerCase().includes(search.toLowerCase()) ||
      (po.requisitionNumber?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchTab && matchSearch;
  });

  // ── Metrics ───────────────────────────────────────────────────────────────

  const pending    = purchaseOrders.filter((p) => p.status === "pending_approval");
  const approved   = purchaseOrders.filter((p) => p.status === "approved");
  const issued     = purchaseOrders.filter((p) => p.status === "issued");
  const activeValue = purchaseOrders
    .filter((p) => p.status !== "received")
    .reduce((s, p) => s + p.totalAmount, 0);

  const metrics = [
    { label: "Total PO value",    value: fmt(activeValue),  sub: "active orders",     icon: <ClipboardList className="w-5 h-5 text-primary" />,  accent: "bg-primary/10" },
    { label: "Pending approval",  value: pending.length,    sub: "awaiting sign-off", icon: <FileCheck className="w-5 h-5 text-warning" />,       accent: "bg-warning/10" },
    { label: "Approved",          value: approved.length,   sub: "ready to issue",    icon: <CheckCircle className="w-5 h-5 text-success" />,     accent: "bg-success/10" },
    { label: "Issued to vendors", value: issued.length,     sub: "awaiting delivery", icon: <Send className="w-5 h-5 text-primary" />,            accent: "bg-primary/10" },
  ];

  // ── Table columns ─────────────────────────────────────────────────────────

  const columns = [
    {
      key: "poNumber",
      header: "PO number",
      render: (item: PurchaseOrder) => (
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{item.poNumber}</span>
        </div>
      ),
    },
    {
      key: "requisitionNumber",
      header: "Source",
      render: (item: PurchaseOrder) =>
        item.requisitionNumber ? (
          <span className="text-sm text-muted-foreground">{item.requisitionNumber}</span>
        ) : (
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            Manual
          </span>
        ),
    },
    { key: "vendor", header: "Vendor" },
    {
      key: "lineItems",
      header: "Items",
      render: (item: PurchaseOrder) => (
        <span className="text-sm text-muted-foreground">
          {item.lineItems.length} item{item.lineItems.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Total amount",
      render: (item: PurchaseOrder) => (
        <span className="font-medium">{fmt(item.totalAmount)}</span>
      ),
    },
    {
      key: "deliveryDate",
      header: "Delivery date",
      render: (item: PurchaseOrder) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Calendar className="w-3.5 h-3.5" />
          {item.deliveryDate}
        </div>
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
      render: (item: PurchaseOrder) => (
        <div className="flex items-center gap-1">
          {/* View detail */}
          <Button variant="ghost" size="icon" className="h-8 w-8"
            onClick={() => setSelectedPO(item)}>
            <Eye className="w-4 h-4" />
          </Button>

          {/* Inline quick actions per status */}
          {item.status === "draft" && (
            <Button variant="ghost" size="icon" className="h-8 w-8"
              title="Submit for approval"
              onClick={() => updateStatus(item.id, "pending_approval")}>
              <FileCheck className="w-4 h-4 text-warning" />
            </Button>
          )}
          {item.status === "pending_approval" && (
            <Button variant="ghost" size="icon" className="h-8 w-8"
              title="Approve PO"
              onClick={() => updateStatus(item.id, "approved")}>
              <CheckCircle className="w-4 h-4 text-success" />
            </Button>
          )}
          {item.status === "approved" && (
            <Button variant="ghost" size="icon" className="h-8 w-8"
              title="Issue to vendor"
              onClick={() => updateStatus(item.id, "issued", "email")}>
              <Send className="w-4 h-4 text-primary" />
            </Button>
          )}
          {item.status === "issued" && (
            <Button variant="ghost" size="icon" className="h-8 w-8"
              title="Mark received → GRN"
              onClick={() => updateStatus(item.id, "received")}>
              <CheckCircle className="w-4 h-4 text-success" />
            </Button>
          )}

          {/* Print always available */}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="Purchase order management"
      subtitle="Auto-generated from approved requisitions · Manual creation · Vendor master · Approval workflow · Issuance"
      actions={
        <Button onClick={() => setIsManualOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Manual PO
        </Button>
      }
    >
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-xl font-bold">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg ${m.accent} flex items-center justify-center`}>
                  {m.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="pending_approval">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="issued">Issued</TabsTrigger>
                <TabsTrigger value="received">Received</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search PO, vendor, requisition..."
                  className="pl-9 w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <DataTable columns={columns} data={filtered} selectable />
        </CardContent>
      </Card>

      {/* Detail dialog */}
      {selectedPO && (
        <Dialog open={!!selectedPO} onOpenChange={(v) => !v && setSelectedPO(null)}>
          <DetailDialog
            po={selectedPO}
            onStatusChange={updateStatus}
            onClose={() => setSelectedPO(null)}
          />
        </Dialog>
      )}

      {/* Manual PO dialog */}
      <ManualPODialog
        open={isManualOpen}
        onOpenChange={setIsManualOpen}
        onCreate={createPO}
        existingCount={purchaseOrders.length}
      />
    </AppLayout>
  );
}
