import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Approval {
  id: string;
  documentType: string;
  department: string;
  approver: string;
  level: number;
}

const data: Approval[] = [
  {
    id: "1",
    documentType: "Requisition",
    department: "IT Department",
    approver: "IT Manager",
    level: 1,
  },
  {
    id: "2",
    documentType: "Requisition",
    department: "IT Department",
    approver: "Finance Manager",
    level: 2,
  },
  {
    id: "3",
    documentType: "Purchase Order",
    department: "Procurement",
    approver: "Procurement Head",
    level: 1,
  },
  {
    id: "4",
    documentType: "Purchase Order",
    department: "Procurement",
    approver: "CEO",
    level: 2,
  },
  {
    id: "5",
    documentType: "Budget",
    department: "Operations",
    approver: "Operations Manager",
    level: 1,
  },
  {
    id: "6",
    documentType: "Budget",
    department: "Operations",
    approver: "CFO",
    level: 2,
  },
];

export default function ApprovalMatrix() {
  const [open, setOpen] = useState(false);

  const columns = [
    { key: "documentType", header: "Document Type" },
    { key: "department", header: "Department" },
    { key: "approver", header: "Approver" },
    { key: "level", header: "Level" },
  ];

  return (
    <AppLayout
      title="Approval Matrix"
      subtitle="Define approval hierarchy for documents"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Rule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Approval Rule</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Input placeholder="Requisition / PO / Budget etc" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input placeholder="Department Name" />
              </div>
              <div className="space-y-2">
                <Label>Approver Name</Label>
                <Input placeholder="User Name" />
              </div>
              <div className="space-y-2">
                <Label>Approval Level</Label>
                <Input type="number" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader />
        <CardContent className="p-0">
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}