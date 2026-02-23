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
import { Plus, Landmark } from "lucide-react";

interface Department {
  id: string;
  name: string;
  budget: string;
  status: "active" | "inactive";
}

const departmentData: Department[] = [
  { id: "1", name: "Operations", budget: "₨500,000", status: "active" },
  { id: "2", name: "Workshop", budget: "₨200,000", status: "active" },
  { id: "3", name: "Admin", budget: "₨150,000", status: "active" },
];

export default function Departments() {
  const [isOpen, setIsOpen] = useState(false);

  const columns = [
    { key: "name", header: "Department Name" },
    { key: "budget", header: "Budget" },
    { key: "status", header: "Status" },
  ];

  return (
    <AppLayout
      title="Departments Setup"
      subtitle="Manage organizational departments"
      actions={
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Department Name</Label>
                <Input placeholder="Enter name" />
              </div>

              <div className="space-y-2">
                <Label>Annual Budget (₨)</Label>
                <Input type="number" placeholder="0.00" />
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
          <DataTable columns={columns} data={departmentData} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}