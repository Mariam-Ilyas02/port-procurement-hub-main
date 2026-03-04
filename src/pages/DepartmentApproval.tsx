import { useState, useEffect, useRef, useCallback, memo } from "react"
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
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Package,
  AlertTriangle,
  Mail,
  Banknote,
  User,
  Building2,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApprovalWorkflow } from "@/components/shared/ApprovalWorkflow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Add Vendor interface
interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string[];
  paymentTerms: string;
  deliveryTime: string;
  rating: number;
  preferred: boolean;
}

// Add VendorQuote interface
interface VendorQuote {
  vendorId: string;
  quotedPrice: number;
  deliveryDays: number;
  paymentTerms: string;
  validityDate: string;
  notes?: string;
}

// Update PendingRequest interface
interface PendingRequest {
  id: string;
  reqNumber: string;
  requester: string;
  requesterEmail: string;
  department: string;
  itemDescription: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  priority: "urgent" | "high" | "normal" | "low";
  requestDate: string;
  requiredDate: string;
  status: "pending_dept" | "approved_inventory" | "approved_purchase" | "rejected";
  justification: string;
  approvalStep?: number;
  approvalSteps?: ApprovalStep[];
  selectedVendor?: string;
  vendorQuotes?: VendorQuote[];
  approvedAmount?: number;
}

interface ApprovalStep {
  level: string;
  approver: string;
  status: "pending" | "approved" | "rejected";
  date?: string;
  comments?: string;
  vendorId?: string;
  approvedAmount?: number;
}

interface InventoryItem {
  itemName: string;
  category: string;
  availableQty: number;
  unit: string;
  warehouse: string;
}

interface CategoryBudget {
  category: string;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
}

// Mock vendors data
const vendorsData: Vendor[] = [
  {
    id: "V001",
    name: "Gul Ahmed Oil & Gas",
    contactPerson: "Mohammad Yousuf",
    email: "yousuf@gulahmed.com",
    phone: "+92 21 12345678",
    category: ["Fuel & Lubricants", "Industrial Chemicals"],
    paymentTerms: "Net 30",
    deliveryTime: "3-5 days",
    rating: 4.5,
    preferred: true
  },
  {
    id: "V002",
    name: "TechnoMart Industrial Supplies",
    contactPerson: "Ali Raza",
    email: "ali@technomart.com",
    phone: "+92 21 87654321",
    category: ["Machinery Parts", "Equipment", "Tools"],
    paymentTerms: "Net 45",
    deliveryTime: "5-7 days",
    rating: 4.2,
    preferred: false
  },
  {
    id: "V003",
    name: "Office Essentials Co.",
    contactPerson: "Sara Khan",
    email: "sara@officeessentials.com",
    phone: "+92 21 23456789",
    category: ["Office Supplies", "Furniture"],
    paymentTerms: "Net 15",
    deliveryTime: "2-3 days",
    rating: 4.8,
    preferred: true
  },
  {
    id: "V004",
    name: "Petrochem Trading",
    contactPerson: "Usman Ali",
    email: "usman@petrochem.com",
    phone: "+92 21 34567890",
    category: ["Fuel & Lubricants", "Chemicals"],
    paymentTerms: "Net 30",
    deliveryTime: "2-4 days",
    rating: 4.0,
    preferred: false
  }
];

// Mock vendor quotes
const vendorQuotesData: Record<string, VendorQuote[]> = {
  "1": [
    { vendorId: "V001", quotedPrice: 720, deliveryDays: 3, paymentTerms: "Net 30", validityDate: "2025-03-15" },
    { vendorId: "V004", quotedPrice: 695, deliveryDays: 4, paymentTerms: "Net 30", validityDate: "2025-03-10" }
  ],
  "2": [
    { vendorId: "V001", quotedPrice: 430, deliveryDays: 2, paymentTerms: "Net 30", validityDate: "2025-03-15" },
    { vendorId: "V002", quotedPrice: 445, deliveryDays: 5, paymentTerms: "Net 45", validityDate: "2025-03-20" }
  ],
  "5": [
    { vendorId: "V002", quotedPrice: 14800, deliveryDays: 10, paymentTerms: "Net 45", validityDate: "2025-03-30" },
    { vendorId: "V001", quotedPrice: 15200, deliveryDays: 7, paymentTerms: "Net 30", validityDate: "2025-03-25" }
  ]
};

// Update mock data with vendor quotes
const pendingRequestsData: PendingRequest[] = [
  { 
    id: "1", 
    reqNumber: "REQ-2025-001", 
    requester: "Ahmed Hassan",
    requesterEmail: "ahmed.hassan@company.com",
    department: "Operations", 
    itemDescription: "Diesel Fuel for Terminal Vehicles", 
    category: "Fuel & Lubricants",
    quantity: 500, 
    unit: "L",
    estimatedCost: 750,
    priority: "urgent",
    requestDate: "2025-01-28",
    requiredDate: "2025-02-01",
    status: "pending_dept",
    justification: "Required for daily terminal operations",
    approvalStep: 0,
    vendorQuotes: vendorQuotesData["1"],
    approvalSteps: [
      { level: "Department Approval", approver: "Omar Farooq", status: "pending" },
      { level: "Budget Review", approver: "Fatima Zahra", status: "pending" },
      { level: "Final Approval", approver: "Usman Ali", status: "pending" }
    ]
  },
  { 
    id: "2", 
    reqNumber: "REQ-2025-002", 
    requester: "Sarah Ahmed",
    requesterEmail: "sarah.ahmed@company.com",
    department: "Workshop", 
    itemDescription: "Engine Oil SAE 15W-40 for Generator Maintenance", 
    category: "Fuel & Lubricants",
    quantity: 100, 
    unit: "L",
    estimatedCost: 450,
    priority: "high",
    requestDate: "2025-01-27",
    requiredDate: "2025-02-03",
    status: "pending_dept",
    justification: "Scheduled maintenance for Generator #3",
    approvalStep: 1,
    vendorQuotes: vendorQuotesData["2"],
    approvalSteps: [
      { level: "Department Approval", approver: "Omar Farooq", status: "approved", date: "2025-01-28", comments: "Approved within budget" },
      { level: "Budget Review", approver: "Fatima Zahra", status: "pending" },
      { level: "Final Approval", approver: "Usman Ali", status: "pending" }
    ]
  },
  { 
    id: "3", 
    reqNumber: "REQ-2025-003", 
    requester: "Mohamed Ali",
    requesterEmail: "mohamed.ali@company.com",
    department: "Admin", 
    itemDescription: "Office Supplies - Printer Cartridges HP 26A", 
    category: "Office Supplies",
    quantity: 10, 
    unit: "Pcs",
    estimatedCost: 800,
    priority: "normal",
    requestDate: "2025-01-26",
    requiredDate: "2025-02-10",
    status: "pending_dept",
    justification: "Running low on printer supplies",
    approvalStep: 0,
    approvalSteps: [
      { level: "Department Approval", approver: "Omar Farooq", status: "pending" },
      { level: "Budget Review", approver: "Fatima Zahra", status: "pending" }
    ]
  },
  { 
    id: "4", 
    reqNumber: "REQ-2025-004", 
    requester: "Fatima Khan",
    requesterEmail: "fatima.khan@company.com",
    department: "Operations", 
    itemDescription: "Hydraulic Fluid ISO VG 46 for Crane Maintenance", 
    category: "Machinery Parts",
    quantity: 200, 
    unit: "L",
    estimatedCost: 1200,
    priority: "high",
    requestDate: "2025-01-25",
    requiredDate: "2025-02-05",
    status: "pending_dept",
    justification: "Critical for crane hydraulic system",
    approvalStep: 0,
    approvalSteps: [
      { level: "Department Approval", approver: "Omar Farooq", status: "pending" },
      { level: "Budget Review", approver: "Fatima Zahra", status: "pending" }
    ]
  },
  { 
    id: "5", 
    reqNumber: "REQ-2025-005", 
    requester: "Ali Raza",
    requesterEmail: "ali.raza@company.com",
    department: "Workshop", 
    itemDescription: "Industrial Air Compressor 50HP", 
    category: "Equipment",
    quantity: 1, 
    unit: "Pcs",
    estimatedCost: 15000,
    priority: "normal",
    requestDate: "2025-01-24",
    requiredDate: "2025-03-01",
    status: "pending_dept",
    justification: "Replacement for failed compressor unit",
    approvalStep: 0,
    vendorQuotes: vendorQuotesData["5"],
    approvalSteps: [
      { level: "Department Approval", approver: "Omar Farooq", status: "pending" },
      { level: "Budget Review", approver: "Fatima Zahra", status: "pending" },
      { level: "Senior Management", approver: "Khalid Usman", status: "pending" }
    ]
  },
];

const requestHistory = [
  {
    requesterEmail: "ahmed.hassan@company.com",
    itemDescription: "Diesel Fuel for Terminal Vehicles",
    requestDate: "2025-01-20",
  },
];

const checkAbnormalPattern = (request: PendingRequest) => {
  const daysLimit = 20;
  const today = new Date(request.requestDate);

  const found = requestHistory.find((history) => {
    const historyDate = new Date(history.requestDate);
    const diffTime = today.getTime() - historyDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    return (
      history.requesterEmail === request.requesterEmail &&
      request.itemDescription.toLowerCase().includes(history.itemDescription.toLowerCase()) &&
      diffDays <= daysLimit
    );
  });

  return found;
};

// Mock inventory data
const inventoryData: InventoryItem[] = [
  { itemName: "Diesel Fuel", category: "Fuel & Lubricants", availableQty: 2000, unit: "L", warehouse: "Ops Warehouse" },
  { itemName: "Engine Oil SAE 15W-40", category: "Fuel & Lubricants", availableQty: 50, unit: "L", warehouse: "Workshop" },
  { itemName: "Hydraulic Fluid ISO VG 46", category: "Machinery Parts", availableQty: 300, unit: "L", warehouse: "Ops Warehouse" },
  { itemName: "Office Supplies - Printer Cartridges", category: "Office Supplies", availableQty: 0, unit: "Pcs", warehouse: "Admin Store" },
];

// Mock category budgets
const categoryBudgets: CategoryBudget[] = [
  { category: "Fuel & Lubricants", totalBudget: 50000, usedBudget: 32000, remainingBudget: 18000 },
  { category: "Machinery Parts", totalBudget: 30000, usedBudget: 12000, remainingBudget: 18000 },
  { category: "Office Supplies", totalBudget: 10000, usedBudget: 7500, remainingBudget: 2500 },
  { category: "Equipment", totalBudget: 25000, usedBudget: 20000, remainingBudget: 5000 },
  { category: "Safety Equipment", totalBudget: 15000, usedBudget: 5000, remainingBudget: 10000 },
];

export default function DepartmentApproval() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [inventoryCheck, setInventoryCheck] = useState<InventoryItem | null>(null);
  const [budgetCheck, setBudgetCheck] = useState<CategoryBudget | null>(null);
  
  // New state for vendor selection
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [vendorQuotes, setVendorQuotes] = useState<VendorQuote[]>([]);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const { toast } = useToast();

  // Calculate derived values
  const isInventoryAvailable = inventoryCheck && inventoryCheck.availableQty >= (selectedRequest?.quantity || 0);
  const isBudgetSufficient = budgetCheck && (approvedAmount || selectedRequest?.estimatedCost || 0) <= budgetCheck.remainingBudget;
  
  // Check if vendor selection is needed (when inventory is insufficient)
  const needsVendorSelection = selectedRequest && 
    !isInventoryAvailable && 
    selectedRequest.vendorQuotes && 
    selectedRequest.vendorQuotes.length > 0;

  // Get vendor details by ID
  const getVendorById = (vendorId: string) => {
    return vendorsData.find(v => v.id === vendorId);
  };

  // Get quote for selected vendor
  const getSelectedVendorQuote = () => {
    return vendorQuotes.find(q => q.vendorId === selectedVendor);
  };

  const checkInventory = (request: PendingRequest) => {
    const found = inventoryData.find(item => 
      request.itemDescription.toLowerCase().includes(item.itemName.toLowerCase()) ||
      item.itemName.toLowerCase().includes(request.itemDescription.toLowerCase().split(" ")[0])
    );
    setInventoryCheck(found || null);
  };

  const checkBudget = (request: PendingRequest) => {
    const budget = categoryBudgets.find(b => b.category === request.category);
    setBudgetCheck(budget || null);
  };

const openReviewDialog = (request: PendingRequest) => {
  setSelectedRequest(request);
  setRejectionReason("");
  
  // Set vendor quotes if available
  if (request.vendorQuotes) {
    setVendorQuotes(request.vendorQuotes);
  } else {
    setVendorQuotes([]);
  }
  
  // Reset vendor selection
  setSelectedVendor(request.selectedVendor || "");
  // Initialize amount to 0 or empty - user will enter manually
  setApprovedAmount(0);
  
  checkInventory(request);
  checkBudget(request);

  const abnormal = checkAbnormalPattern(request);

  if (abnormal) {
    toast({
      title: "⚠ Abnormal Request Pattern Detected",
      description: `This user requested the same item within last 20 days.`,
      variant: "destructive",
    });
  }

  setIsReviewDialogOpen(true);
};

const handleApprove = (level: string, comments: string) => {
  if (!selectedRequest) return;
  
  // Use estimated cost as the amount to approve
  const amountToApprove = selectedRequest.estimatedCost;
  
  // Check if amount exceeds budget
  if (budgetCheck && amountToApprove > budgetCheck.remainingBudget) {
    toast({
      title: "Budget Exceeded",
      description: `Approved amount (₨${amountToApprove.toLocaleString()}) exceeds remaining budget (₨${budgetCheck.remainingBudget.toLocaleString()}).`,
      variant: "destructive",
    });
    return;
  }

  // Update the approval step with info
  const updatedSteps = selectedRequest.approvalSteps?.map((step, index) => {
    if (step.level === level) {
      return { 
        ...step, 
        status: "approved" as const, 
        date: new Date().toISOString().split('T')[0], 
        comments,
        approvedAmount: amountToApprove
      };
    }
    return step;
  });

  const nextStep = (selectedRequest.approvalStep || 0) + 1;
  
  // Check if this was the last step
  if (nextStep >= (selectedRequest.approvalSteps?.length || 0)) {
    // Final approval
    if (isInventoryAvailable) {
      handleApproveFromInventory();
    } else {
      toast({
        title: "Purchase Order Created",
        description: `Request approved for purchase.`,
      });
    }
  } else {
    toast({
      title: "Step Approved",
      description: `Request moved to next approval level.`,
    });
  }
  
  setIsReviewDialogOpen(false);
  setSelectedRequest(null);
};

  const handleReject = (level: string, comments: string) => {
    if (!selectedRequest) return;
    
    toast({
      title: "Request Rejected",
      description: `Notification sent to ${selectedRequest.requester} with rejection reason.`,
      variant: "destructive",
    });
    
    setIsReviewDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleApproveFromInventory = () => {
    if (!selectedRequest) return;
    
    toast({
      title: "Request Approved - From Inventory",
      description: `Notification sent to ${selectedRequest.requester} (${selectedRequest.requesterEmail}). Item will be issued from inventory.`,
    });
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      urgent: "bg-destructive/10 text-destructive border-destructive/20",
      high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      normal: "bg-primary/10 text-primary border-primary/20",
      low: "bg-muted text-muted-foreground border-border",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[priority]}`}>
        {priority === "urgent" ? "🔴 " : ""}{priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: "reqNumber",
      header: "Request #",
      render: (item: PendingRequest) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{item.reqNumber}</span>
        </div>
      ),
    },
    {
      key: "requester",
      header: "Requester",
      render: (item: PendingRequest) => (
        <div>
          <p className="font-medium">{item.requester}</p>
          <p className="text-xs text-muted-foreground">{item.department}</p>
        </div>
      ),
    },
    { 
      key: "itemDescription", 
      header: "Item Description",
      render: (item: PendingRequest) => (
        <div className="max-w-xs">
          <p className="truncate">{item.itemDescription}</p>
          <p className="text-xs text-muted-foreground">{item.category}</p>
        </div>
      ),
    },
    { 
      key: "quantity", 
      header: "Qty",
      render: (item: PendingRequest) => (
        <span>{item.quantity} {item.unit}</span>
      ),
    },
    { 
      key: "estimatedCost", 
      header: "Est. Cost",
      render: (item: PendingRequest) => (
        <span className="font-medium">₨{item.estimatedCost.toLocaleString()}</span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (item: PendingRequest) => getPriorityBadge(item.priority),
    },
    {
      key: "requestDate",
      header: "Request Date",
      render: (item: PendingRequest) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {item.requestDate}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: PendingRequest) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: PendingRequest) => (
        <Button 
          variant="default" 
          size="sm"
          onClick={() => openReviewDialog(item)}
        >
          Review
        </Button>
      ),
    },
  ];

  const filteredData = pendingRequestsData.filter(
    (item) =>
      item.reqNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Restore the missing request details section
  const RequestDetailsSection = () => {
    if (!selectedRequest) return null;
    
    return (
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Requester</Label>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{selectedRequest.requester}</span>
          </div>
          <p className="text-xs text-muted-foreground">{selectedRequest.requesterEmail}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Department</Label>
          <p className="font-medium">{selectedRequest.department}</p>
        </div>
        <div className="space-y-1 col-span-2">
          <Label className="text-muted-foreground text-xs">Item Description</Label>
          <p className="font-medium">{selectedRequest.itemDescription}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Category</Label>
          <p>{selectedRequest.category}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Quantity</Label>
          <p>{selectedRequest.quantity} {selectedRequest.unit}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Estimated Cost</Label>
          <p className="font-medium text-lg">₨{selectedRequest.estimatedCost.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Priority</Label>
          {getPriorityBadge(selectedRequest.priority)}
        </div>
        <div className="space-y-1 col-span-2">
          <Label className="text-muted-foreground text-xs">Justification</Label>
          <p className="text-sm">{selectedRequest.justification}</p>
        </div>
      </div>
    );
  };

  return (
    <AppLayout
      title="Department Approval"
      subtitle="Review and approve requisition requests"
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs defaultValue="pending" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="pending">Pending Review</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
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
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Review Request - {selectedRequest?.reqNumber}
            </DialogTitle>
            <DialogDescription>
              Review the request details, check inventory availability, and verify budget limits before approval.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 py-4">
              {/* Request Details */}
              <RequestDetailsSection />

              {/* Approval Workflow */}
              {selectedRequest.approvalSteps && (
                <div className="border rounded-lg p-4">
                  <ApprovalWorkflow
                    requestId={selectedRequest.id}
                    amount={selectedRequest.estimatedCost}
                    department={selectedRequest.department}
                    currentStep={selectedRequest.approvalStep || 0}
                    steps={selectedRequest.approvalSteps}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </div>
              )}

              {/* Inventory Check */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Inventory Check</h4>
                </div>
                {inventoryCheck ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="font-medium">{inventoryCheck.itemName}</p>
                        <p className="text-sm text-muted-foreground">{inventoryCheck.warehouse}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{inventoryCheck.availableQty} {inventoryCheck.unit}</p>
                        <p className="text-xs text-muted-foreground">Available</p>
                      </div>
                    </div>
                    {isInventoryAvailable ? (
                      <div className="flex items-center gap-2 text-success bg-success/10 p-2 rounded">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Sufficient inventory available. Can be issued from stock.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-warning bg-warning/10 p-2 rounded">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">Insufficient inventory. Will require purchase from vendor.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-warning bg-warning/10 p-3 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Item not found in inventory. Will require purchase from vendor.</span>
                  </div>
                )}
              </div>

              {/* Budget Check */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Banknote className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Budget Check - {selectedRequest.category}</h4>
                </div>
                {budgetCheck ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-muted/50 rounded text-center">
                        <p className="text-xs text-muted-foreground">Total Budget</p>
                        <p className="font-semibold">₨{budgetCheck.totalBudget.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded text-center">
                        <p className="text-xs text-muted-foreground">Used Budget</p>
                        <p className="font-semibold">₨{budgetCheck.usedBudget.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded text-center">
                        <p className="text-xs text-muted-foreground">Remaining Budget</p>
                        <p className="font-semibold text-success">₨{budgetCheck.remainingBudget.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(budgetCheck.usedBudget / budgetCheck.totalBudget) * 100}%` }}
                      />
                    </div>
                    {selectedRequest.estimatedCost <= budgetCheck.remainingBudget ? (
                      <div className="flex items-center gap-2 text-success bg-success/10 p-2 rounded">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Budget available. Remaining after approval: ₨{(budgetCheck.remainingBudget - selectedRequest.estimatedCost).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-2 rounded">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Budget exceeded! Amount (₨{selectedRequest.estimatedCost.toLocaleString()}) exceeds remaining budget (₨{budgetCheck.remainingBudget.toLocaleString()})
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-warning bg-warning/10 p-3 rounded">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">No budget defined for this category.</span>
                  </div>
                )}
              </div>

              {/* Notification Info */}
              <div className="flex items-center gap-2 p-3 bg-info/10 text-info rounded-lg">
                <Mail className="w-4 h-4" />
                <span className="text-sm">
                  The requester ({selectedRequest.requesterEmail}) will be notified of your decision via email.
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}