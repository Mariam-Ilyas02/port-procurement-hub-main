import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Budget {
  id: string;
  department: string;
  year: string;
  amount: string;
}

const data: Budget[] = [
  {
    id: "1",
    department: "IT Department",
    year: "2026",
    amount: "5,000,000",
  },
  {
    id: "2",
    department: "Procurement",
    year: "2026",
    amount: "3,500,000",
  },
  {
    id: "3",
    department: "Finance",
    year: "2026",
    amount: "4,200,000",
  },
  {
    id: "4",
    department: "Operations",
    year: "2026",
    amount: "6,800,000",
  },
  {
    id: "5",
    department: "Human Resources",
    year: "2026",
    amount: "2,100,000",
  },
  {
    id: "6",
    department: "IT Department",
    year: "2025",
    amount: "4,500,000",
  },
];

export default function Budgets() {
  const [open, setOpen] = useState(false);

  const columns = [
    { key: "department", header: "Department" },
    { key: "year", header: "Year" },
    { key: "amount", header: "Budget Amount (₨)" },
  ];

  return (
    <AppLayout
      title="Budget Setup"
      subtitle="Define annual department budgets"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Budget</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Budget</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
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
        <CardContent className="p-0">
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}