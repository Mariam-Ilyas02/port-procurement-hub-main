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
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { Building2, CheckCircle, Mail, Printer } from "lucide-react";

// interface CreatePurchaseOrderDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   requisitionData?: any; // Pass requisition data for auto-generation
// }

// // Mock approved vendors
// const approvedVendors = [
//   { id: "v1", name: "Gulf Petroleum Ltd", category: "Fuel", rating: 4.8, items: ["Diesel", "Petrol"] },
//   { id: "v2", name: "Shell Oil Company", category: "Oil", rating: 4.5, items: ["Engine Oil"] },
//   { id: "v3", name: "Total Energies", category: "Fuel", rating: 4.7, items: ["Diesel"] },
//   { id: "v4", name: "Safety First Inc", category: "Safety", rating: 4.2, items: ["Helmets"] },
// ];

// export function CreatePurchaseOrderDialog({ open, onOpenChange, requisitionData }: CreatePurchaseOrderDialogProps) {
//   const [selectedVendor, setSelectedVendor] = useState("");
//   const [poItems, setPoItems] = useState([
//     { id: 1, name: "", quantity: 0, unit: "", price: 0 }
//   ]);
//   const [isApproved, setIsApproved] = useState(false);

//   const vendor = approvedVendors.find(v => v.id === selectedVendor);

//   const addItem = () => {
//     setPoItems([...poItems, { id: poItems.length + 1, name: "", quantity: 0, unit: "", price: 0 }]);
//   };

//   const calculateTotal = () => {
//     return poItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
//   };

//   const handleSendForApproval = () => {
//     setIsApproved(true);
//     // In real app, this would trigger the approval workflow
//   };

//   const handleIssuePO = () => {
//     // In real app, this would send email and generate PDF
//     alert("PO issued to vendor via email");
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>
//             {requisitionData ? "Generate PO from Requisition" : "Create Manual Purchase Order"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {/* Vendor Selection - From Approved Master */}
//           <div className="space-y-2">
//             <Label className="flex items-center gap-2">
//               <Building2 className="w-4 h-4" />
//               Select Vendor (from Approved Master)
//             </Label>
//             <Select onValueChange={setSelectedVendor}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose approved vendor" />
//               </SelectTrigger>
//               <SelectContent>
//                 {approvedVendors.map(vendor => (
//                   <SelectItem key={vendor.id} value={vendor.id}>
//                     <div className="flex items-center justify-between w-full">
//                       <span>{vendor.name}</span>
//                       <Badge variant="outline" className="ml-2 text-xs">
//                         {vendor.category} • ★ {vendor.rating}
//                       </Badge>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Vendor Details */}
//           {vendor && (
//             <Alert className="border-primary bg-primary/5">
//               <CheckCircle className="h-4 w-4" />
//               <AlertDescription>
//                 <p className="font-medium">{vendor.name}</p>
//                 <p className="text-xs mt-1">Category: {vendor.category} • Rating: ★ {vendor.rating}</p>
//                 <p className="text-xs">Supply items: {vendor.items.join(", ")}</p>
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* PO Items */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <Label>Items</Label>
//               <Button variant="outline" size="sm" onClick={addItem}>
//                 Add Item
//               </Button>
//             </div>

//             {poItems.map((item, index) => (
//               <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
//                 <div className="col-span-4">
//                   <Label className="text-xs">Item Name</Label>
//                   <Input placeholder="Enter item" className="h-9" />
//                 </div>
//                 <div className="col-span-2">
//                   <Label className="text-xs">Qty</Label>
//                   <Input type="number" placeholder="0" className="h-9" />
//                 </div>
//                 <div className="col-span-2">
//                   <Label className="text-xs">Unit</Label>
//                   <Select>
//                     <SelectTrigger className="h-9">
//                       <SelectValue placeholder="Unit" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="L">Liter</SelectItem>
//                       <SelectItem value="KG">KG</SelectItem>
//                       <SelectItem value="Pcs">Pcs</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="col-span-3">
//                   <Label className="text-xs">Unit Price</Label>
//                   <Input type="number" placeholder="0.00" className="h-9" />
//                 </div>
//                 {index > 0 && (
//                   <div className="col-span-1 flex justify-end">
//                     <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive">
//                       ×
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* Total */}
//             <div className="flex justify-end pt-2 border-t">
//               <div className="text-right">
//                 <p className="text-sm text-muted-foreground">Total Amount</p>
//                 <p className="text-2xl font-bold">₨{calculateTotal().toLocaleString()}</p>
//               </div>
//             </div>
//           </div>

//           {/* Terms */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Payment Terms</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select terms" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="net30">Net 30 Days</SelectItem>
//                   <SelectItem value="net60">Net 60 Days</SelectItem>
//                   <SelectItem value="cod">Cash on Delivery</SelectItem>
//                   <SelectItem value="advance">Advance Payment</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Delivery Date</Label>
//               <Input type="date" />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label>Special Instructions</Label>
//             <Textarea placeholder="Any special instructions for vendor..." rows={2} />
//           </div>

//           {/* Approval Checkbox */}
//           <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
//             <Checkbox 
//               id="approval" 
//               checked={isApproved}
//               onCheckedChange={(checked) => setIsApproved(checked as boolean)}
//             />
//             <Label htmlFor="approval" className="text-sm cursor-pointer">
//               I confirm that this PO is ready for approval and complies with procurement policies
//             </Label>
//           </div>
//         </div>

//         <DialogFooter className="flex-col sm:flex-row gap-2">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="secondary"
//             onClick={handleSendForApproval}
//             disabled={!selectedVendor || calculateTotal() === 0}
//           >
//             Send for Approval
//           </Button>
//           <Button 
//             onClick={handleIssuePO}
//             disabled={!isApproved}
//             className="gap-2"
//           >
//             <Mail className="w-4 h-4" />
//             Issue PO (Email/PDF)
//             <Printer className="w-4 h-4 ml-2" />
//           </Button>
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Mail, Printer, FileText } from "lucide-react";

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ============================= */
/*   DUMMY APPROVED REQUISITIONS */
/* ============================= */

const approvedRequisitions = [
  {
    id: "REQ-001",
    item: "Diesel Fuel",
    category: "Fuel",
    subcategory: "Bulk Fuel",
    quantity: 5000,
    unit: "L",
    department: "Operations",
  },
  {
    id: "REQ-002",
    item: "Engine Oil",
    category: "Oil",
    subcategory: "Lubricants",
    quantity: 200,
    unit: "L",
    department: "Workshop",
  },
];

/* ============================= */
/*        APPROVED VENDORS       */
/* ============================= */

const approvedVendors = [
  "Gulf Petroleum Ltd",
  "Shell Oil Company",
  "Total Energies",
  "Safety First Inc",
];

/* ============================= */

export function CreatePurchaseOrderDialog({
  open,
  onOpenChange,
}: CreatePurchaseOrderDialogProps) {
  const [selectedReq, setSelectedReq] = useState("");
  const [vendor, setVendor] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [approved, setApproved] = useState(false);


  useEffect(() => {
    const req = approvedRequisitions.find(r => r.id === selectedReq);
    if (req) {
      setItems([
        {
          name: req.item,
          quantity: req.quantity,
          unit: req.unit,
          price: 0,
        },
      ]);
    }
  }, [selectedReq]);

  const addItem = () => {
    setItems([...items, { name: "", quantity: 0, unit: "", price: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSave = () => {
    alert("Purchase Order Created Successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">

          {/* Select Requisition */}
          <div>
            <Label>Select Approved Requisition (Optional)</Label>
            <Select onValueChange={setSelectedReq}>
              <SelectTrigger>
                <SelectValue placeholder="Choose requisition to auto-fill" />
              </SelectTrigger>
              <SelectContent>
                {approvedRequisitions.map(req => (
                  <SelectItem key={req.id} value={req.id}>
                    {req.id} - {req.item} ({req.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vendor Selection */}
          <div>
            <Label>Vendor (Approved Master)</Label>
            <Select onValueChange={setVendor}>
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {approvedVendors.map(v => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Items Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Items</Label>
              <Button size="sm" variant="outline" onClick={addItem}>
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-3">
                <Input
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) =>
                    updateItem(index, "name", e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", Number(e.target.value))
                  }
                />
                <Input
                  type="number"
                  placeholder="Unit Price"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(index, "price", Number(e.target.value))
                  }
                />
                <Input value={item.unit} placeholder="Unit" />
              </div>
            ))}
          </div>

          {/* Payment & Delivery */}
          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <Label>Payment Terms</Label>
              <Select onValueChange={setPaymentTerms}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net30">Net 30</SelectItem>
                  <SelectItem value="net60">Net 60</SelectItem>
                  <SelectItem value="advance">Advance</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div>
              <Label>Delivery Date</Label>
              <Input
                type="date"
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <Label>Special Instructions</Label>
            <Textarea
              rows={2}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {/* Total */}
          <div className="text-right border-t pt-3">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">
              ₨{calculateTotal().toLocaleString()}
            </p>
          </div>

          {/* Approval Confirmation */}
          <div className="flex items-center gap-2">
            <Checkbox checked={approved} onCheckedChange={(checked) => setApproved(checked as boolean)} />
            <Label>I confirm PO is ready for approval</Label>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={!vendor || !approved}>
            Create Purchase Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}