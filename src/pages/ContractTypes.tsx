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
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";

interface ContractType {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

const initialData: ContractType[] = [
  {
    id: "1",
    name: "Annual Maintenance Contract",
    status: "Active",
    createdAt: "2025-01-10",
  },
  {
    id: "2",
    name: "Fuel Supply Contract",
    status: "Active",
    createdAt: "2025-02-15",
  },
  {
    id: "3",
    name: "Service Level Agreement (SLA)",
    status: "Active",
    createdAt: "2025-03-05",
  },
  {
    id: "4",
    name: "One-Time Purchase Agreement",
    status: "Inactive",
    createdAt: "2025-04-01",
  },
];

export default function ContractTypes() {
  const [data, setData] = useState<ContractType[]>(initialData);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName.trim()) return;

    const newContract: ContractType = {
      id: Date.now().toString(),
      name: newName,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setData([newContract, ...data]);
    setNewName("");
    setOpen(false);
  };

  const columns = [
    { key: "name", header: "Contract Type" },
    { key: "status", header: "Status" },
    { key: "createdAt", header: "Created Date" },
  ];

  return (
    <AppLayout
      title="Contract Types"
      subtitle="Manage contract classification and setup"
    >
      <Card>
        <CardContent className="p-6 space-y-4">

          {/* Top Actions */}
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contract type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contract Type
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Contract Type</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <div>
                    <Label>Contract Type Name</Label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter contract type"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Data Table */}
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}