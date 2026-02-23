import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Reason {
  id: string;
  reason: string;
  type: "increase" | "decrease";
}

const reasons: Reason[] = [
  { id: "1", reason: "Physical Stock Found During Audit", type: "increase" },
  { id: "2", reason: "Return from Asset (Unused Quantity)", type: "increase" },
  { id: "3", reason: "Inventory Data Entry Correction", type: "increase" },
  { id: "4", reason: "Damaged During Handling", type: "decrease" },
  { id: "5", reason: "Expired / Obsolete Stock", type: "decrease" },
  { id: "6", reason: "Loss / Theft", type: "decrease" },
  { id: "7", reason: "Physical Stock Shortage (Audit Variance)", type: "decrease" },
];

const warehouses = ["Main Warehouse", "Fuel Yard", "Spare Parts Shed"];
const items = ["Diesel", "Petrol", "Lubricant Oil", "Printer Paper"];

export default function StockAdjustment() {
  const [adjustmentType, setAdjustmentType] =
    useState<"increase" | "decrease">("increase");
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");

  const filteredReasons = reasons.filter(
    (r) => r.type === adjustmentType
  );

  const handleSubmit = () => {
    const payload = {
      adjustmentType,
      selectedReason,
      selectedWarehouse,
      selectedItem,
      quantity,
      status: "Pending Approval",
    };

    console.log("Stock Adjustment Submitted:", payload);
    alert("Stock Adjustment Submitted for Approval");
  };

  return (
    <AppLayout
      title="Stock Adjustment"
      subtitle="Increase or Decrease inventory with FIFO enforcement"
    >
      <Card>
        <CardHeader>
          <CardTitle>Adjustment Entry</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Adjustment Type */}
          <div>
            <Label>Adjustment Type</Label>
            <Select
              value={adjustmentType}
              onValueChange={(value: "increase" | "decrease") =>
                setAdjustmentType(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase">Increase</SelectItem>
                <SelectItem value="decrease">Decrease</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div>
            <Label>Reason</Label>
            <Select
              value={selectedReason}
              onValueChange={setSelectedReason}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Reason" />
              </SelectTrigger>
              <SelectContent>
                {filteredReasons.map((reason) => (
                  <SelectItem key={reason.id} value={reason.id}>
                    {reason.reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Select
              value={selectedItem}
              onValueChange={setSelectedItem}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Item" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {/* Submit */}
          <Button onClick={handleSubmit}>
            Submit for Approval
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}