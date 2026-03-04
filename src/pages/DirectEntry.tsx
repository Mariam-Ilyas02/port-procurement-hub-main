import { useState , useEffect} from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const warehouses = ["Main Warehouse", "Fuel Yard", "Spare Parts Shed"];
const items = [
  { name: "Container Seal", unit: "Pieces" },
  { name: "Diesel", unit: "Liters" },
  { name: "Lubricant Oil", unit: "Liters" },
];

export default function DirectEntry() {
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [invoiceRef, setInvoiceRef] = useState("");
  const [sealNumber, setSealNumber] = useState("");
  const [isBackdated, setIsBackdated] = useState(false);
  const [backdate, setBackdate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    const itemObj = items.find((i) => i.name === selectedItem);
    setUnit(itemObj ? itemObj.unit : "");
  }, [selectedItem]);

  const handleSubmit = () => {
    const payload = {
      type: "Emergency Direct Procurement",
      selectedWarehouse,
      selectedItem,
      quantity,
      unit, // include unit in payload
      supplier,
      unitCost,
      invoiceRef,
      sealNumber,
      isBackdated,
      backdate,
      remarks,
      status: "Pending Approval",
    };

    console.log("Entry Submitted:", payload);
    alert("Item added in inventory");
  };

  return (
    <AppLayout
      title="Direct Entry"
      subtitle="Record purchases without Requisition or PO"
    >
      <Card>
        <CardHeader>
          <CardTitle>Procurement</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warehouse */}
          <div>
            <Label>Warehouse</Label>
            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((wh, index) => (
                  <SelectItem key={index} value={wh}>
                    {wh}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Item */}
          <div>
            <Label>Item</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder="Select Item" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item, index) => (
                  <SelectItem key={index} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unit (Read-only) */}
          <div>
            <Label>Unit</Label>
            <Input type="text" value={unit} readOnly />
          </div>

          {/* Quantity */}
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              placeholder="Enter Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Supplier */}
          <div>
            <Label>Supplier Name</Label>
            <Input
              placeholder="Enter Supplier Name"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>

          {/* Unit Cost */}
          <div>
            <Label>Unit Cost</Label>
            <Input
              type="number"
              placeholder="Enter Unit Cost"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
            />
          </div>

          {/* Invoice Reference */}
          {/* <div>
            <Label>Invoice Reference (Optional)</Label>
            <Input
              placeholder="Enter Invoice / Manual Receipt Ref"
              value={invoiceRef}
              onChange={(e) => setInvoiceRef(e.target.value)}
            />
          </div> */}
 {/* Seal Number */}
          {/* <div>
            <Label>Seal Number</Label>
            <Input
              placeholder="Enter Seal Number"
              value={sealNumber} // ✅ Bind state
              onChange={(e) => setSealNumber(e.target.value)}
            />
          </div> */}
          {/* Backdated Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isBackdated}
              onCheckedChange={(checked) => setIsBackdated(!!checked)}
            />
            <Label>Is Backdated Entry?</Label>
          </div>

          {isBackdated && (
            <div>
              <Label>Backdated Transaction Date</Label>
              <Input
                type="date"
                value={backdate}
                onChange={(e) => setBackdate(e.target.value)}
              />
            </div>
          )}

          {/* Remarks */}
          {/* <div>
            <Label>Reason / Justification</Label>
            <Textarea
              placeholder="Explain emergency reason (mandatory)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div> */}

          {/* Submit */}
          <Button onClick={handleSubmit}>
            Submit
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}