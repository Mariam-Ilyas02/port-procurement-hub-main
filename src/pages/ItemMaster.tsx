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
import { Plus, Search, Boxes } from "lucide-react";

interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  taxType: string;
  reorderLevel: number;
  isFuel: boolean;
  status: "active" | "inactive";
}

const initialItems: Item[] = [
  {
    id: "1",
    itemCode: "DIESEL",
    itemName: "Diesel Fuel",
    category: "Fuel",
    unit: "L",
    taxType: "GST",
    reorderLevel: 5000,
    isFuel: true,
    status: "active",
  },
  {
    id: "2",
    itemCode: "ENG-OIL",
    itemName: "Engine Oil SAE 40",
    category: "Lubricant",
    unit: "L",
    taxType: "GST",
    reorderLevel: 200,
    isFuel: false,
    status: "active",
  },
];

export default function ItemMaster() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const columns = [
    { key: "itemCode", header: "Item Code" },
    { key: "itemName", header: "Item Name" },
    { key: "category", header: "Category" },
    { key: "unit", header: "Unit" },
    { key: "taxType", header: "Tax Type" },
    { key: "reorderLevel", header: "Reorder Level" },
    {
      key: "isFuel",
      header: "Fuel",
      render: (item: Item) => (item.isFuel ? "Yes" : "No"),
    },
    { key: "status", header: "Status" },
  ];

  const filtered = initialItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout
      title="Item Master"
      subtitle="Manage inventory items and configuration"
      actions={
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Item Code</Label>
                <Input placeholder="e.g., DIESEL" />
              </div>

              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input placeholder="Enter item name" />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="lubricant">Lubricant</SelectItem>
                    <SelectItem value="spare">Spare Parts</SelectItem>
                    <SelectItem value="stationery">Stationery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Unit</Label>
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
                <Label>Tax Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gst">GST</SelectItem>
                    <SelectItem value="sales">Sales Tax</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reorder Level</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button>Save Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <DataTable columns={columns} data={filtered} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}