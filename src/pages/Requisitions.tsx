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
  Plus, Search, Filter, FileText, Calendar, Eye, Edit, Trash2, 
  CheckCircle, XCircle, Package, AlertTriangle, ArrowRight 
} from "lucide-react";

interface Requisition {
  id: string;
  requestNumber: string;
  item: string;
  category: string;
  subcategory: string;
  unit: string;
  quantity: string;
  // estimatedCost: number;
  totalEstimatedCost: number;
  justification: string;
  requiredDate: string;
  requester: string;
  department: string;
  status: "draft" | "pending_dept" | "pending_senior" | "approved" | "rejected" | "fulfilled";
  inventoryAvailable: boolean;
  inventoryQuantity: number;
  budgetStatus: "within" | "exceeds" | "pending";
  approvalType: "inventory" | "purchase" | "pending";
  approvalLevel: "dept_manager" | "senior_management" | "none";
  createdAt: string;
  notificationSent: boolean;
}

// Approval threshold - requests above this require senior management approval
const SENIOR_APPROVAL_THRESHOLD = 10000;

const requisitionsData: Requisition[] = [
  {
    id: "1",
    requestNumber: "REQ-2026-001",
    item: "Diesel Fuel",
    category: "Fuel",
    subcategory: "Bulk Fuel",
    unit: "L",
    quantity: "5000",
    totalEstimatedCost: 15000,
    justification: "Required for monthly port machinery operations",
    requiredDate: "2026-03-01",
    requester: "Azlaan Kareem",
    department: "Operations",
    status: "pending_senior",
    inventoryAvailable: true,
    inventoryQuantity: 15000,
    budgetStatus: "within",
    approvalType: "inventory",
    approvalLevel: "senior_management",
    createdAt: "2026-02-20",
    notificationSent: true,
  },
  {
    id: "2",
    requestNumber: "REQ-2026-002",
    item: "Engine Oil SAE 40",
    category: "Oil",
    subcategory: "Lubricants",
    unit: "L",
    quantity: "200",
    totalEstimatedCost: 3500,
    justification: "Routine maintenance",
    requiredDate: "2026-03-05",
    requester: "Kareem Ullah",
    department: "Workshop",
    status: "approved",
    inventoryAvailable: true,
    inventoryQuantity: 200,
    budgetStatus: "within",
    approvalType: "inventory",
    approvalLevel: "dept_manager",
    createdAt: "2026-02-18",
    notificationSent: true,
  },
  {
    id: "3",
    requestNumber: "REQ-2026-003",
    item: "Office Stationery",
    category: "Stationary",
    subcategory: "Office Supplies",
    unit: "Pcs",
    quantity: "100",
    totalEstimatedCost: 500,
    justification: "Admin office usage",
    requiredDate: "2026-03-10",
    requester: "Mikaal Ahmed",
    department: "Admin",
    status: "draft",
    inventoryAvailable: false,
    inventoryQuantity: 0,
    budgetStatus: "pending",
    approvalType: "pending",
    approvalLevel: "none",
    createdAt: "2026-02-15",
    notificationSent: false,
  },
  {
    id: "4",
    requestNumber: "REQ-2026-004",
    item: "Safety Helmets",
    category: "Safety",
    subcategory: "PPE",
    unit: "Pcs",
    quantity: "50",
    totalEstimatedCost: 12000,
    justification: "New staff safety compliance",
    requiredDate: "2026-03-12",
    requester: "Sarah Brown",
    department: "Operations",
    status: "rejected",
    inventoryAvailable: false,
    inventoryQuantity: 0,
    budgetStatus: "exceeds",
    approvalType: "purchase",
    approvalLevel: "senior_management",
    createdAt: "2026-02-14",
    notificationSent: true,
  },
  {
    id: "5",
    requestNumber: "REQ-2026-005",
    item: "Hydraulic Oil",
    category: "Oil",
    subcategory: "Lubricants",
    unit: "L",
    quantity: "100",
    totalEstimatedCost: 2800,
    justification: "Crane maintenance",
    requiredDate: "2026-03-15",
    requester: "Tehseen Alam",
    department: "Workshop",
    status: "fulfilled",
    inventoryAvailable: true,
    inventoryQuantity: 50,
    budgetStatus: "within",
    approvalType: "inventory",
    approvalLevel: "dept_manager",
    createdAt: "2026-02-10",
    notificationSent: true,
  },
];

// const requisitionsData: Requisition[] = [
//   { id: "1", requestNumber: "REQ-2025-001", item: "Diesel Fuel", category: "Fuel", quantity: "5000 L", estimatedCost: "₨15,000", requiredDate: "2025-02-15", requester: "Azlaan Kareem", department: "Operations", status: "pending_senior", inventoryAvailable: true, inventoryQuantity: 15000, budgetStatus: "within", approvalType: "pending", approvalLevel: "senior_management", createdAt: "2025-01-28", notificationSent: true },
//   { id: "2", requestNumber: "REQ-2025-002", item: "Engine Oil SAE 40", category: "Oil", quantity: "200 L", estimatedCost: "₨3,500", requiredDate: "2025-02-10", requester: "Jane Smith", department: "Workshop", status: "approved", inventoryAvailable: true, inventoryQuantity: 200, budgetStatus: "within", approvalType: "inventory", approvalLevel: "dept_manager", createdAt: "2025-01-27", notificationSent: true },
//   { id: "3", requestNumber: "REQ-2025-003", item: "Office Stationery", category: "Stationary", quantity: "100 Pcs", estimatedCost: "₨500", requiredDate: "2025-02-05", requester: "Mikaal Ahmed", department: "Admin", status: "draft", inventoryAvailable: false, inventoryQuantity: 0, budgetStatus: "pending", approvalType: "pending", approvalLevel: "none", createdAt: "2025-01-26", notificationSent: false },
//   { id: "4", requestNumber: "REQ-2025-004", item: "Safety Helmets", category: "Safety", quantity: "50 Pcs", estimatedCost: "₨12,000", requiredDate: "2025-02-20", requester: "Sarah Brown", department: "Operations", status: "rejected", inventoryAvailable: false, inventoryQuantity: 0, budgetStatus: "exceeds", approvalType: "purchase", approvalLevel: "senior_management", createdAt: "2025-01-25", notificationSent: true },
//   { id: "5", requestNumber: "REQ-2025-005", item: "Petrol", category: "Fuel", quantity: "2000 L", estimatedCost: "₨6,000", requiredDate: "2025-02-12", requester: "Azlaan Kareem", department: "Operations", status: "approved", inventoryAvailable: false, inventoryQuantity: 0, budgetStatus: "within", approvalType: "purchase", approvalLevel: "dept_manager", createdAt: "2025-01-24", notificationSent: true },
//   { id: "6", requestNumber: "REQ-2025-006", item: "Hydraulic Oil", category: "Oil", quantity: "100 L", estimatedCost: "₨2,800", requiredDate: "2025-02-18", requester: "Tehseen Alam", department: "Workshop", status: "fulfilled", inventoryAvailable: true, inventoryQuantity: 50, budgetStatus: "within", approvalType: "inventory", approvalLevel: "dept_manager", createdAt: "2025-01-23", notificationSent: true },
// ];

// Mock inventory data for availability check
const inventoryStock = {
  "Diesel Fuel": { available: true, quantity: 15000, unit: "L" },
  "Engine Oil SAE 40": { available: true, quantity: 200, unit: "L" },
  "Petrol": { available: true, quantity: 8000, unit: "L" },
  "Hydraulic Oil": { available: true, quantity: 50, unit: "L" },
  "Office Stationery": { available: false, quantity: 0, unit: "Pcs" },
  "Safety Helmets": { available: false, quantity: 0, unit: "Pcs" },
};

// Mock budget limits per category
const categoryBudgets = {
  "Fuel": { limit: 50000, used: 21000, remaining: 29000 },
  "Oil": { limit: 15000, used: 6300, remaining: 8700 },
  "Stationary": { limit: 5000, used: 500, remaining: 4500 },
  "Safety": { limit: 10000, used: 8000, remaining: 2000 },
  "Spare Parts": { limit: 25000, used: 3750, remaining: 21250 },
};

export default function Requisitions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Get inventory status for selected item
  const getInventoryStatus = (itemName: string) => {
    return inventoryStock[itemName as keyof typeof inventoryStock] || { available: false, quantity: 0, unit: "Pcs" };
  };

  // Get budget status for selected category
  const getBudgetStatus = (categoryName: string) => {
    return categoryBudgets[categoryName as keyof typeof categoryBudgets] || { limit: 0, used: 0, remaining: 0 };
  };

  const columns = [
    {
      key: "requestNumber",
      header: "Request #",
      render: (item: Requisition) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{item.requestNumber}</span>
        </div>
      ),
    },
    { key: "item", header: "Item" },
    { key: "category", header: "Category" },
    { key: "quantity", header: "Qty" },
    { key: "estimatedCost", header: "Est. Cost" },
    {
      key: "inventoryStatus",
      header: "Inventory",
      render: (item: Requisition) => (
        <div className="flex items-center gap-1">
          {item.inventoryAvailable ? (
            <>
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-xs text-success">{item.inventoryQuantity} available</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Not in stock</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: "approvalType",
      header: "Approval Type",
      render: (item: Requisition) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          item.approvalType === "inventory" 
            ? "bg-success/10 text-success" 
            : item.approvalType === "purchase" 
              ? "bg-info/10 text-info" 
              : "bg-muted text-muted-foreground"
        }`}>
          {item.approvalType === "inventory" ? "From Inventory" : 
           item.approvalType === "purchase" ? "Purchase Order" : "Pending"}
        </span>
      ),
    },
    {
      key: "budgetStatus",
      header: "Budget",
      render: (item: Requisition) => (
        <span className={`text-xs font-medium ${
          item.budgetStatus === "within" ? "text-success" : 
          item.budgetStatus === "exceeds" ? "text-destructive" : "text-muted-foreground"
        }`}>
          {item.budgetStatus === "within" ? "✓ Within" : 
           item.budgetStatus === "exceeds" ? "✗ Exceeds" : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Requisition) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = requisitionsData.filter(
    (item) =>
      item.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inventoryInfo = getInventoryStatus(selectedItem);
  const budgetInfo = getBudgetStatus(selectedCategory);

  return (
    <AppLayout
      title="Requisition Management"
      subtitle="Create and track procurement requisitions"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Requisition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Requisition</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Requisition Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumable">Consumable Items</SelectItem>
                    <SelectItem value="machinery">Machinery/Equipment</SelectItem>
                    <SelectItem value="spare-parts">Spare Parts</SelectItem>
                    <SelectItem value="fuel">Fuel Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fuel">Fuel</SelectItem>
                    <SelectItem value="Oil">Oil</SelectItem>
                    <SelectItem value="Stationary">Stationary</SelectItem>
                    <SelectItem value="Safety">Safety Equipment</SelectItem>
                    <SelectItem value="Spare Parts">Spare Parts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Item Description</Label>
                <Textarea 
                  placeholder="Describe the item or machinery you need..." 
                  rows={2}
                  onChange={(e) => setSelectedItem(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent" className="text-destructive font-medium">🔴 Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Required Date</Label>
                <Input type="date" />
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="Enter quantity" />
              </div>

              <div className="space-y-2">
                <Label>Estimated Unit Price</Label>
                <Input type="number" placeholder="0.00" />
              </div>

              {/* Inventory Availability Alert */}
              {selectedItem && (
                <div className="col-span-2">
                  <Alert className={inventoryInfo.available ? "border-success bg-success/5" : "border-warning bg-warning/5"}>
                    <Package className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        {inventoryInfo.available ? (
                          <span className="text-success">
                            <strong>{inventoryInfo.quantity} {inventoryInfo.unit}</strong> available in inventory. 
                            You can request from stock.
                          </span>
                        ) : (
                          <span className="text-warning">
                            Item not available in inventory. Will require purchase approval.
                          </span>
                        )}
                      </div>
                      {inventoryInfo.available && (
                        <Button size="sm" variant="outline" className="text-success border-success">
                          Request from Stock
                        </Button>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Budget Status Alert */}
              {selectedCategory && (
                <div className="col-span-2">
                  <Alert className={budgetInfo.remaining > 5000 ? "border-info bg-info/5" : "border-warning bg-warning/5"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <span className={budgetInfo.remaining > 5000 ? "text-info" : "text-warning"}>
                        <strong>{selectedCategory}</strong> budget: ₨{budgetInfo.remaining.toLocaleString()} remaining 
                        (₨{budgetInfo.used.toLocaleString()} / ₨{budgetInfo.limit.toLocaleString()} used)
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div className="col-span-2 space-y-2">
                <Label>Justification</Label>
                <Textarea placeholder="Enter reason for this requisition" rows={2} />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="secondary">Save as Draft</Button>
              <Button>Submit for Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Workflow Steps */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
              <span>Create Request</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">2</div>
              <span>Dept. Approval</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">3</div>
              <span>Inventory/PO</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">4</div>
              <span>Fulfilled</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs defaultValue="all" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search requisitions..."
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
