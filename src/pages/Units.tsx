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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Ruler } from "lucide-react";

interface Unit {
  id: string;
  name: string;
  symbol: string;
  status: "active" | "inactive";
}

const unitsData: Unit[] = [
  { id: "1", name: "Liter", symbol: "L", status: "active" },
  { id: "2", name: "Kilogram", symbol: "KG", status: "active" },
  { id: "3", name: "Piece", symbol: "Pcs", status: "active" },
];

export default function Units() {
  const [isOpen, setIsOpen] = useState(false);

  const columns = [
    { key: "name", header: "Unit Name" },
    { key: "symbol", header: "Symbol" },
    { key: "status", header: "Status" },
  ];

  return (
    <AppLayout
      title="Units Setup"
      subtitle="Manage measurement units used in inventory"
      actions={
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Unit</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Unit Name</Label>
                <Input placeholder="e.g., Liter" />
              </div>

              <div className="space-y-2">
                <Label>Symbol</Label>
                <Input placeholder="e.g., L" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader />
        <CardContent className="p-0">
          <DataTable columns={columns} data={unitsData} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}