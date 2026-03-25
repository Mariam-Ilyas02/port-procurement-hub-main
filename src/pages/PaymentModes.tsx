import { useState, useMemo } from "react";
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
import { Plus } from "lucide-react";

interface PaymentMode {
  id: string;
  code: string;
  name: string;
  description: string;
  requiresReference: boolean;
  accountCode: string;
  isDefault: boolean;
  isActive: boolean;
}

const data: PaymentMode[] = [
  {
    id: "1",
    code: "PM-001",
    name: "Cash",
    description: "Direct cash payment",
    requiresReference: false,
    accountCode: "101001",
    isDefault: false,
    isActive: true,
  },
  {
    id: "2",
    code: "PM-002",
    name: "Bank Transfer",
    description: "Online bank transfer payment",
    requiresReference: true,
    accountCode: "101002",
    isDefault: true,
    isActive: true,
  },
  {
    id: "3",
    code: "PM-003",
    name: "Cheque",
    description: "Cheque based payment",
    requiresReference: true,
    accountCode: "101003",
    isDefault: false,
    isActive: true,
  },
  {
    id: "4",
    code: "PM-004",
    name: "Pay Order",
    description: "Bank issued pay order",
    requiresReference: true,
    accountCode: "101004",
    isDefault: false,
    isActive: true,
  },
  {
    id: "5",
    code: "PM-005",
    name: "Credit (Vendor Ledger)",
    description: "Deferred vendor payment",
    requiresReference: false,
    accountCode: "201001",
    isDefault: false,
    isActive: true,
  },
];

export default function PaymentModes() {
  const [search, setSearch] = useState("");

  // 🔐 Simulated role (replace later with auth context)
  const userRole = "System Administrator"; 
  const canManage =
    userRole === "System Administrator" ||
    userRole === "Finance Officer";

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.accountCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const columns = [
    { key: "code", header: "Code" },
    { key: "name", header: "Payment Mode" },
    { key: "description", header: "Description" },
    // { key: "accountCode", header: "Account Code" },
    {
      key: "requiresReference",
      header: "Ref Required",
      render: (row: PaymentMode) =>
        row.requiresReference ? "Yes" : "No",
    },
    {
      key: "isDefault",
      header: "Default",
      render: (row: PaymentMode) =>
        row.isDefault ? "Yes" : "No",
    },
    {
      key: "isActive",
      header: "Active",
      render: (row: PaymentMode) =>
        row.isActive ? "Active" : "Inactive",
    },
  ];

  return (
    <AppLayout
      title="Payment Modes"
      subtitle="Define payment methods for pay orders"
    >
      <Card>
        {/* Header Section */}
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Search Filter */}
          <Input
            placeholder="Search by code, name or account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-80"
          />

          {/* Add Button (Right Aligned) */}
          {canManage && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Mode
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Mode</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Code</Label>
                    <Input placeholder="PM-006" />
                  </div>

                  <div>
                    <Label>Name</Label>
                    <Input placeholder="Enter payment mode name" />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input placeholder="Enter description" />
                  </div>

                  {/* <div>
                    <Label>Account Code</Label>
                    <Input placeholder="Enter GL account code" />
                  </div> */}

                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <Label>Requires Reference Number</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <Label>Set as Default</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <Label>Active</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>

        {/* Data Grid */}
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}