// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Package, AlertTriangle, Upload, FileText } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface CreateRequisitionDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// // Mock catalog items from approved vendor master
// const catalogItems = [
//   { id: "1", name: "Diesel Fuel", category: "Fuel", unit: "L", estimatedPrice: 9 },
//   { id: "2", name: "Engine Oil SAE 40", category: "Oil", unit: "L", estimatedPrice: 42.5 },
//   { id: "3", name: "A4 Paper", category: "Stationary", unit: "Pcs", estimatedPrice: 5 },
//   { id: "4", name: "Safety Helmet", category: "Safety", unit: "Pcs", estimatedPrice: 240 },
// ];

// // Mock budget data per department
// const departmentBudgets = {
//   "Operations": { allocated: 500000, used: 325000, remaining: 175000 },
//   "Workshop": { allocated: 200000, used: 145000, remaining: 55000 },
//   "Admin": { allocated: 100000, used: 45000, remaining: 55000 },
// };

// export function CreateRequisitionDialog({ open, onOpenChange }: CreateRequisitionDialogProps) {
//   const { toast } = useToast();
//   const [selectedCatalogItem, setSelectedCatalogItem] = useState("");
//   const [department, setDepartment] = useState("");
//   const [estimatedCost, setEstimatedCost] = useState(0);
//   const [quantity, setQuantity] = useState(0);
//   const [attachments, setAttachments] = useState<File[]>([]);

//   const catalogItem = catalogItems.find(item => item.id === selectedCatalogItem);
//   const budget = department ? departmentBudgets[department as keyof typeof departmentBudgets] : null;

//   const handleQuantityChange = (qty: number) => {
//     setQuantity(qty);
//     if (catalogItem) {
//       setEstimatedCost(qty * catalogItem.estimatedPrice);
//     }
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setAttachments([...attachments, ...Array.from(e.target.files)]);
//     }
//   };

//   const getApprovalLevel = () => {
//     if (!budget) return "department";
//     if (estimatedCost > budget.remaining) return "rejected";
//     if (estimatedCost > 10000) return "senior"; // Senior management for >10,000
//     return "department";
//   };

//   const handleSubmit = () => {
//     const approvalLevel = getApprovalLevel();
    
//     if (approvalLevel === "rejected") {
//       toast({
//         title: "Budget Exceeded",
//         description: `Request exceeds remaining budget of ₨${budget?.remaining.toLocaleString()}`,
//         variant: "destructive",
//       });
//       return;
//     }

//     toast({
//       title: "Requisition Submitted",
//       description: `Request sent for ${approvalLevel === "senior" ? "senior management" : "department"} approval`,
//     });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Create New Requisition</DialogTitle>
//         </DialogHeader>
        
//         <div className="grid gap-4 py-4">
//           {/* Catalog Selection */}
//           <div className="space-y-2">
//             <Label>Select from Catalog (Optional)</Label>
//             <Select onValueChange={setSelectedCatalogItem}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose pre-approved item" />
//               </SelectTrigger>
//               <SelectContent>
//                 {catalogItems.map(item => (
//                   <SelectItem key={item.id} value={item.id}>
//                     {item.name} - {item.category} (₨{item.estimatedPrice}/{item.unit})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Department</Label>
//               <Select onValueChange={setDepartment}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select department" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Operations">Operations</SelectItem>
//                   <SelectItem value="Workshop">Workshop</SelectItem>
//                   <SelectItem value="Admin">Admin</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Required Date</Label>
//               <Input type="date" min={new Date().toISOString().split('T')[0]} />
//             </div>
//           </div>

//           {/* Item Description */}
//           <div className="space-y-2">
//             <Label>Item Description</Label>
//             <Textarea 
//               placeholder="Describe the item in detail..."
//               rows={2}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Quantity</Label>
//               <Input 
//                 type="number" 
//                 placeholder="Enter quantity"
//                 onChange={(e) => handleQuantityChange(Number(e.target.value))}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Unit</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select unit" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="L">Liter (L)</SelectItem>
//                   <SelectItem value="KG">Kilogram (KG)</SelectItem>
//                   <SelectItem value="Pcs">Pieces (Pcs)</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Estimated Unit Price (₨)</Label>
//               <Input 
//                 type="number" 
//                 placeholder="0.00"
//                 value={catalogItem?.estimatedPrice || ''}
//                 disabled={!!catalogItem}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Total Estimated Cost</Label>
//               <Input 
//                 type="text" 
//                 value={`₨${estimatedCost.toLocaleString()}`}
//                 disabled
//                 className="bg-muted font-medium"
//               />
//             </div>
//           </div>

//           {/* Budget Check Alert */}
//           {budget && (
//             <Alert className={
//               estimatedCost > budget.remaining 
//                 ? "border-destructive bg-destructive/5" 
//                 : "border-info bg-info/5"
//             }>
//               <AlertTriangle className="h-4 w-4" />
//               <AlertDescription>
//                 <div className="space-y-1">
//                   <p className={estimatedCost > budget.remaining ? "text-destructive" : "text-info"}>
//                     <strong>{department}</strong> budget: ₨{budget.remaining.toLocaleString()} remaining
//                     (₨{budget.used.toLocaleString()} used of ₨{budget.allocated.toLocaleString()})
//                   </p>
//                   {estimatedCost > 10000 && (
//                     <p className="text-warning text-sm mt-1">
//                       ⚠ Amount exceeds ₨10,000 - requires senior management approval
//                     </p>
//                   )}
//                 </div>
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Justification */}
//           <div className="space-y-2">
//             <Label>Justification</Label>
//             <Textarea 
//               placeholder="Explain why this item is needed..."
//               rows={2}
//             />
//           </div>

//           {/* Attachments */}
//           <div className="space-y-2">
//             <Label>Attachments</Label>
//             <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
//               <input
//                 type="file"
//                 multiple
//                 className="hidden"
//                 id="file-upload"
//                 onChange={handleFileUpload}
//               />
//               <label htmlFor="file-upload" className="cursor-pointer">
//                 <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
//                 <p className="text-sm text-muted-foreground">
//                   Click to upload or drag and drop
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   PDF, Images, DOC (Max 10MB)
//                 </p>
//               </label>
//             </div>
//             {attachments.length > 0 && (
//               <div className="space-y-1 mt-2">
//                 {attachments.map((file, index) => (
//                   <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded">
//                     <FileText className="w-4 h-4 text-primary" />
//                     <span>{file.name}</span>
//                     <span className="text-xs text-muted-foreground ml-auto">
//                       {(file.size / 1024).toFixed(0)} KB
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Approval Path Preview */}
//           <div className="p-3 bg-muted/50 rounded-lg">
//             <p className="text-sm font-medium mb-2">Approval Path</p>
//             <div className="flex items-center gap-2 text-xs">
//               <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">Requester</span>
//               <span>→</span>
//               <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
//                 {estimatedCost > 10000 ? "Senior Management" : "Department Approver"}
//               </span>
//               {estimatedCost > budget?.remaining && (
//                 <>
//                   <span>→</span>
//                   <span className="px-2 py-1 bg-warning/10 text-warning rounded-full">
//                     Budget Review
//                   </span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
        
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button variant="secondary">Save as Draft</Button>
//           <Button onClick={handleSubmit}>Submit for Approval</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  FileText,
  ChevronRight,
  Package,
} from "lucide-react";
import type { Requisition, RequisitionStatus, ApprovalLevel, ApprovalType, BudgetStatus } from "@/pages/Requisitions";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateRequisitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (req: Requisition) => void;
  existingCount: number;
}

// ─── Reference Data ───────────────────────────────────────────────────────────

const SENIOR_THRESHOLD = 10000;

const categories = {
  Oil:         ["Petrol", "Diesel", "Lubricants", "Hydraulic Fluid"],
  "Spare Parts": ["Engine Parts", "Filters", "Belts", "Bearings"],
  Consumables: ["Stationery", "Cleaning Supplies", "Safety Gear"],
  Equipment:   ["Workshop Tools", "IT Equipment", "Office Equipment"],
  Safety:      ["PPE", "Fire Safety", "First Aid"],
};

const catalogItems = [
  { id: "c1", name: "Diesel Fuel",      category: "Oil",         subcategory: "Diesel",         unit: "L",   estimatedPrice: 9    },
  { id: "c2", name: "Engine Oil SAE 40", category: "Oil",         subcategory: "Lubricants",     unit: "L",   estimatedPrice: 42.5 },
  { id: "c3", name: "Hydraulic Oil",     category: "Oil",         subcategory: "Hydraulic Fluid", unit: "L",   estimatedPrice: 28   },
  { id: "c4", name: "Safety Helmets",    category: "Safety",      subcategory: "PPE",            unit: "Pcs", estimatedPrice: 240  },
  { id: "c5", name: "Printer Paper A4",  category: "Consumables", subcategory: "Stationery",     unit: "Pcs", estimatedPrice: 5    },
  { id: "c6", name: "Oil Filter",        category: "Spare Parts", subcategory: "Filters",        unit: "Pcs", estimatedPrice: 450  },
];

const departments = ["Operations", "Workshop", "Admin", "Finance", "Procurement"];
const units       = ["L", "Pcs", "Kg", "Box", "Set", "Pairs", "m"];

// Mock inventory stock
const inventoryStock: Record<string, { available: boolean; quantity: number }> = {
  "Diesel Fuel":       { available: true,  quantity: 15000 },
  "Engine Oil SAE 40": { available: true,  quantity: 200   },
  "Hydraulic Oil":     { available: true,  quantity: 50    },
  "Safety Helmets":    { available: false, quantity: 0     },
  "Printer Paper A4":  { available: false, quantity: 0     },
  "Oil Filter":        { available: true,  quantity: 12    },
};

// Mock department budgets
const departmentBudgets: Record<string, { allocated: number; used: number; remaining: number }> = {
  Operations:  { allocated: 500000, used: 325000, remaining: 175000 },
  Workshop:    { allocated: 200000, used: 145000, remaining: 55000  },
  Admin:       { allocated: 100000, used: 45000,  remaining: 55000  },
  Finance:     { allocated: 80000,  used: 20000,  remaining: 60000  },
  Procurement: { allocated: 150000, used: 60000,  remaining: 90000  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => "₨" + n.toLocaleString();

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateRequisitionDialog({
  open,
  onOpenChange,
  onCreate,
  existingCount,
}: CreateRequisitionDialogProps) {
  // Form state
  const [catalogId,      setCatalogId]      = useState("");
  const [itemName,       setItemName]        = useState("");
  const [category,       setCategory]        = useState("");
  const [subcategory,    setSubcategory]     = useState("");
  const [unit,           setUnit]            = useState("Pcs");
  const [quantity,       setQuantity]        = useState(0);
  const [unitPrice,      setUnitPrice]       = useState(0);
  const [requiredDate,   setRequiredDate]    = useState("");
  const [department,     setDepartment]      = useState("");
  const [justification,  setJustification]   = useState("");
  const [attachments,    setAttachments]     = useState<File[]>([]);

  const totalCost = quantity * unitPrice;

  // Derived checks
  const inventoryInfo = inventoryStock[itemName];
  const budgetInfo    = departmentBudgets[department];
  const budgetOk      = budgetInfo ? totalCost <= budgetInfo.remaining : null;
  const needsSenior   = totalCost > SENIOR_THRESHOLD;

  const approvalLevel: ApprovalLevel =
    !department ? "none"
    : needsSenior ? "senior_management"
    : "dept_manager";

  const budgetStatus: BudgetStatus =
    !budgetInfo ? "pending"
    : budgetOk ? "within"
    : "exceeds";

  const approvalType: ApprovalType =
    !itemName ? "pending"
    : inventoryInfo?.available && inventoryInfo.quantity >= quantity ? "inventory"
    : "purchase";

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setCatalogId(""); setItemName(""); setCategory(""); setSubcategory("");
      setUnit("Pcs"); setQuantity(0); setUnitPrice(0); setRequiredDate("");
      setDepartment(""); setJustification(""); setAttachments([]);
    }
  }, [open]);

  // Handle catalog item selection
  const handleCatalogSelect = (id: string) => {
    setCatalogId(id);
    const item = catalogItems.find((c) => c.id === id);
    if (item) {
      setItemName(item.name);
      setCategory(item.category);
      setSubcategory(item.subcategory);
      setUnit(item.unit);
      setUnitPrice(item.estimatedPrice);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const isValid = itemName && category && quantity > 0 && unitPrice > 0 && requiredDate && department && justification;

  const handleCreate = (asDraft: boolean) => {
    const today = new Date().toISOString().split("T")[0];
    const newReq: Requisition = {
      id:                   Date.now().toString(),
      requestNumber:        `REQ-2026-${String(existingCount + 1).padStart(3, "0")}`,
      item:                 itemName,
      category,
      subcategory,
      unit,
      quantity,
      estimatedUnitPrice:   unitPrice,
      totalEstimatedCost:   totalCost,
      justification,
      requiredDate,
      requester:            "Current User",
      requesterEmail:       "user@company.com",
      department,
      status:               asDraft ? "draft" : "submitted",
      inventoryAvailable:   inventoryInfo?.available ?? false,
      inventoryQuantity:    inventoryInfo?.quantity ?? 0,
      budgetStatus,
      approvalType,
      approvalLevel,
      createdAt:            today,
      notificationSent:     !asDraft,
      attachments:          attachments.map((f) => f.name),
      auditTrail: asDraft
        ? [{ date: today, action: "Created", by: "Current User" }]
        : [
            { date: today, action: "Created",   by: "Current User" },
            { date: today, action: "Submitted", by: "Current User" },
          ],
    };
    onCreate(newReq);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new requisition</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">

          {/* Catalog picker */}
          <div className="space-y-1.5">
            <Label>Select from catalog (optional — pre-approved items)</Label>
            <Select value={catalogId} onValueChange={handleCatalogSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a pre-approved item..." />
              </SelectTrigger>
              <SelectContent>
                {catalogItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground text-xs ml-1">
                      · {item.category} · {fmt(item.estimatedPrice)}/{item.unit}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Item + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Item name</Label>
              <Input
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v); setSubcategory(""); }}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(categories).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Subcategory</Label>
              <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                <SelectContent>
                  {(categories[category as keyof typeof categories] ?? []).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quantity / Unit / Price */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                value={quantity || ""}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Estimated unit price (₨)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={unitPrice || ""}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Total cost display */}
          {totalCost > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Total estimated cost</span>
              <span className="text-lg font-semibold">{fmt(totalCost)}</span>
            </div>
          )}

          {/* Required date */}
          <div className="space-y-1.5">
            <Label>Required date</Label>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={requiredDate}
              onChange={(e) => setRequiredDate(e.target.value)}
            />
          </div>

          {/* Justification */}
          <div className="space-y-1.5">
            <Label>Justification</Label>
            <Textarea
              placeholder="Explain why this item is needed..."
              rows={2}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
          </div>

          {/* Live checks — only show when enough data entered */}
          {itemName && (
            <div className="grid grid-cols-2 gap-3">
              {/* Inventory check */}
              <div className={`p-3 rounded-lg border text-sm ${
                approvalType === "inventory" ? "border-success/30 bg-success/5"
                : approvalType === "purchase" ? "border-primary/30 bg-primary/5"
                : "border-muted bg-muted/30"
              }`}>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" /> Inventory check
                </p>
                {inventoryInfo ? (
                  approvalType === "inventory" ? (
                    <p className="text-success text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {inventoryInfo.quantity} {unit} available — will issue from stock
                    </p>
                  ) : (
                    <p className="text-primary text-xs flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Insufficient stock — will raise purchase order
                    </p>
                  )
                ) : (
                  <p className="text-muted-foreground text-xs">Item not in inventory — will raise purchase order</p>
                )}
              </div>

              {/* Budget check */}
              <div className={`p-3 rounded-lg border text-sm ${
                budgetStatus === "within"  ? "border-success/30 bg-success/5"
                : budgetStatus === "exceeds" ? "border-destructive/30 bg-destructive/5"
                : "border-muted bg-muted/30"
              }`}>
                <p className="text-xs text-muted-foreground mb-1">Budget check</p>
                {budgetInfo ? (
                  <div className="space-y-1">
                    <p className={`text-xs font-medium ${
                      budgetStatus === "within" ? "text-success" : "text-destructive"
                    }`}>
                      {budgetStatus === "within" ? "✓ Within budget" : "✗ Exceeds budget"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fmt(budgetInfo.remaining)} remaining of {fmt(budgetInfo.allocated)}
                    </p>
                    {budgetStatus === "within" && totalCost > 0 && (
                      <p className="text-xs text-muted-foreground">
                        After approval: {fmt(budgetInfo.remaining - totalCost)} left
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Select department to check budget</p>
                )}
              </div>
            </div>
          )}

          {/* Senior approval warning */}
          {needsSenior && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Amount exceeds ₨10,000 — requires senior management approval in addition to department approval.
            </div>
          )}

          {/* Approval path preview */}
          {department && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Approval path</p>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">Requester</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">Dept manager</span>
                {needsSenior && (
                  <>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning">Senior management</span>
                  </>
                )}
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success">
                  {approvalType === "inventory" ? "Issue from stock" : "Auto-generate PO"}
                </span>
              </div>
            </div>
          )}

          {/* Attachments */}
          <div className="space-y-1.5">
            <Label>Attachments (optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/40 transition-colors">
              <input
                type="file"
                multiple
                className="hidden"
                id="req-file-upload"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label htmlFor="req-file-upload" className="cursor-pointer">
                <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload PDF, images, or documents</p>
                <p className="text-xs text-muted-foreground mt-0.5">Max 10MB per file</p>
              </label>
            </div>
            {attachments.length > 0 && (
              <div className="space-y-1 mt-2">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm p-2 bg-muted/50 rounded">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
                    <button
                      className="text-muted-foreground hover:text-destructive text-xs"
                      onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="outline" onClick={() => handleCreate(true)} disabled={!itemName}>
            Save as draft
          </Button>
          <Button onClick={() => handleCreate(false)} disabled={!isValid}>
            Submit for approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
