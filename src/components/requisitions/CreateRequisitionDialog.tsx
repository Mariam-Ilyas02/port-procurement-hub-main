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

import { useState } from "react";
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
import { Upload, FileText } from "lucide-react";

interface CreateRequisitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = {
  Fuel: ["Bulk Fuel", "Petrol"],
  Oil: ["Lubricants", "Hydraulic"],
  Stationary: ["Office Supplies"],
  Safety: ["PPE"],
};

const catalogItems = [
  { id: "1", name: "Diesel Fuel", category: "Fuel", subcategory: "Bulk Fuel", unit: "L", estimatedPrice: 9 },
  { id: "2", name: "Engine Oil SAE 40", category: "Oil", subcategory: "Lubricants", unit: "L", estimatedPrice: 42.5 },
];

export function CreateRequisitionDialog({ open, onOpenChange }: CreateRequisitionDialogProps) {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [selectedCatalogItem, setSelectedCatalogItem] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);

  const totalCost = quantity * estimatedPrice;

  const handleCatalogSelect = (id: string) => {
    setSelectedCatalogItem(id);
    const item = catalogItems.find(c => c.id === id);
    if (item) {
      setCategory(item.category);
      setSubcategory(item.subcategory);
      setEstimatedPrice(item.estimatedPrice);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Requisition</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Catalog */}
          <div>
            <Label>Catalog Item (Optional)</Label>
            <Select onValueChange={handleCatalogSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select item from catalog" />
              </SelectTrigger>
              <SelectContent>
                {catalogItems.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category / Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={(val) => {
                setCategory(val);
                setSubcategory("");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categories).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Subcategory</Label>
              <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {category &&
                    categories[category as keyof typeof categories].map(sub => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Item Description</Label>
            <Textarea rows={2} placeholder="Enter item details..." />
          </div>

          {/* Quantity / Price */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Quantity</Label>
              <Input type="number" onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>

            <div>
              <Label>Unit Price</Label>
              <Input
                type="number"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Total Cost</Label>
              <Input value={`₨${totalCost.toLocaleString()}`} disabled />
            </div>
          </div>

          {/* Required Date */}
          <div>
            <Label>Required Date</Label>
            <Input type="date" />
          </div>

          {/* Justification */}
          <div>
            <Label>Justification</Label>
            <Textarea rows={2} placeholder="Reason for request..." />
          </div>

          {/* Attachments */}
          <div>
            <Label>Attachments</Label>
            <div className="border rounded-md p-3 text-center text-sm">
              <input
                type="file"
                multiple
                className="hidden"
                id="upload"
                onChange={handleFileUpload}
              />
              <label htmlFor="upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-4 h-4 mb-1" />
                Click to upload
              </label>
            </div>

            {attachments.map((file, i) => (
              <div key={i} className="text-xs flex items-center gap-2 mt-1">
                <FileText className="w-3 h-3" />
                {file.name}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="secondary">Save as Draft</Button>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}