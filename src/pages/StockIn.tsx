import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, ArrowDownToLine, Package, Calendar } from "lucide-react";

interface StockInEntry {
  id: string;
  receiptNumber: string;
  poReference: string;
  item: string;
  quantity: number;
  unit: string;
  unitCost: string;
  totalCost: string;
  supplier: string;
  receivedDate: string;
  batchNumber: string;
  qualityCheck: boolean;
}

const stockInData: StockInEntry[] = [
  { id: "1", receiptNumber: "GRN-2025-001", poReference: "PO-2025-001", item: "Diesel Fuel", quantity: 5000, unit: "L", unitCost: "₨1.20", totalCost: "₨6,000", supplier: "Gulf Petroleum Ltd", receivedDate: "2025-01-28", batchNumber: "BATCH-001", qualityCheck: true },
  { id: "2", receiptNumber: "GRN-2025-002", poReference: "PO-2025-002", item: "Engine Oil SAE 40", quantity: 100, unit: "L", unitCost: "₨8.50", totalCost: "₨850", supplier: "Shell Oil Company", receivedDate: "2025-01-27", batchNumber: "BATCH-002", qualityCheck: true },
  { id: "3", receiptNumber: "GRN-2025-003", poReference: "PO-2025-005", item: "Petrol", quantity: 3000, unit: "L", unitCost: "₨1.35", totalCost: "₨4,050", supplier: "Total Energies", receivedDate: "2025-01-26", batchNumber: "BATCH-003", qualityCheck: false },
  { id: "4", receiptNumber: "GRN-2025-004", poReference: "Direct", item: "Lubricant Grease", quantity: 50, unit: "KG", unitCost: "₨25.00", totalCost: "₨1,250", supplier: "Castrol", receivedDate: "2025-01-25", batchNumber: "BATCH-004", qualityCheck: true },
];

export default function StockIn() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const columns = [
    {
      key: "receiptNumber",
      header: "GRN Number",
      render: (item: StockInEntry) => (
        <div className="flex items-center gap-2">
          <ArrowDownToLine className="w-4 h-4 text-success" />
          <span className="font-medium">{item.receiptNumber}</span>
        </div>
      ),
    },
    { key: "poReference", header: "PO Reference" },
    {
      key: "item",
      header: "Item",
      render: (item: StockInEntry) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          {item.item}
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: StockInEntry) => (
        <span>{item.quantity.toLocaleString()} {item.unit}</span>
      ),
    },
    { key: "unitCost", header: "Unit Cost" },
    { key: "totalCost", header: "Total Cost", className: "text-right font-medium" },
    { key: "supplier", header: "Supplier" },
    {
      key: "receivedDate",
      header: "Received Date",
      render: (item: StockInEntry) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {item.receivedDate}
        </div>
      ),
    },
    { key: "batchNumber", header: "Batch #" },
    {
      key: "qualityCheck",
      header: "QC",
      render: (item: StockInEntry) => (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
          item.qualityCheck ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
        }`}>
          {item.qualityCheck ? "✓" : "!"}
        </div>
      ),
    },
  ];

  const filteredData = stockInData.filter(
    (item) =>
      item.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Stock In"
      subtitle="Record goods receipt and stock-in transactions"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Stock In
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Stock In</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="poRef">Purchase Order Reference</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PO or Direct" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="po-001">PO-2025-001</SelectItem>
                    <SelectItem value="po-002">PO-2025-002</SelectItem>
                    <SelectItem value="direct">Direct Purchase</SelectItem>
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item">Item</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel Fuel</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="engine-oil">Engine Oil SAE 40</SelectItem>
                    <SelectItem value="hydraulic">Hydraulic Oil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivedDate">Received Date</Label>
                <Input id="receivedDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="Enter quantity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Liter (L)</SelectItem>
                    <SelectItem value="KG">Kilogram (KG)</SelectItem>
                    <SelectItem value="Pcs">Pieces (Pcs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitCost">Unit Cost</Label>
                <Input id="unitCost" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number (Auto)</Label>
                <Input id="batchNumber" value="BATCH-005" disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tank-a1">Tank A1</SelectItem>
                    <SelectItem value="tank-b1">Tank B1</SelectItem>
                    <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox id="qualityCheck" />
                  <Label htmlFor="qualityCheck" className="cursor-pointer">Quality Check Passed</Label>
                </div>
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">FIFO Layer Created</p>
              <p className="text-xs text-muted-foreground">
                This receipt will create a new FIFO cost layer with the specified unit cost.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Record Stock In</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Stock In Transactions</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
