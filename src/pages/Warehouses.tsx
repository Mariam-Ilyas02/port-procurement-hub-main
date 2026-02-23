import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Building2 } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  location: string;
  type: "main" | "fuel" | "sub";
  status: "active" | "inactive";
}

const warehouseData: Warehouse[] = [
  { id: "1", name: "Main Warehouse", location: "Terminal A", type: "main", status: "active" },
  { id: "2", name: "Tank Farm A", location: "Fuel Area", type: "fuel", status: "active" },
];

export default function Warehouses() {
  const [isOpen, setIsOpen] = useState(false);

  const columns = [
    { key: "name", header: "Warehouse Name" },
    { key: "location", header: "Location" },
    { key: "type", header: "Type" },
    { key: "status", header: "Status" },
  ];

  return (
    <AppLayout
      title="Warehouses Setup"
      subtitle="Manage storage locations"
      actions={
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Warehouse</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Warehouse name" />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Location description" />
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
        <CardContent className="p-0">
          <DataTable columns={columns} data={warehouseData} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}