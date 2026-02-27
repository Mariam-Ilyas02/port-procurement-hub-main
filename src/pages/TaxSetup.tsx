import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Banknote, Edit, Trash2, Percent } from "lucide-react";

interface TaxRate {
  id: string;
  code: string;
  name: string;
  type: string;
  rate: number;
  applicableTo: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  status: "active" | "inactive";
}

const taxRatesData: TaxRate[] = [
  { id: "1", code: "VAT-5", name: "Value Added Tax", type: "VAT", rate: 5, applicableTo: "All Categories", effectiveFrom: "2024-01-01", effectiveTo: null, status: "active" },
  { id: "2", code: "GST-STD", name: "Standard GST", type: "GST", rate: 18, applicableTo: "Spare Parts", effectiveFrom: "2024-01-01", effectiveTo: null, status: "active" },
  { id: "3", code: "GST-RED", name: "Reduced GST", type: "GST", rate: 12, applicableTo: "Essential Items", effectiveFrom: "2024-01-01", effectiveTo: null, status: "active" },
  { id: "4", code: "ST-10", name: "Sales Tax", type: "Sales Tax", rate: 10, applicableTo: "Services", effectiveFrom: "2024-01-01", effectiveTo: null, status: "active" },
  { id: "5", code: "CESS-1", name: "Environment Cess", type: "Cess", rate: 1, applicableTo: "Fuel", effectiveFrom: "2024-06-01", effectiveTo: null, status: "active" },
  { id: "6", code: "OLD-VAT", name: "Old VAT Rate", type: "VAT", rate: 4, applicableTo: "All Categories", effectiveFrom: "2020-01-01", effectiveTo: "2023-12-31", status: "inactive" },
];

export default function TaxSetup() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const columns = [
    {
      key: "code",
      header: "Tax Code",
      render: (item: TaxRate) => (
        <div className="flex items-center gap-2">
          <Banknote className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm">{item.code}</span>
        </div>
      ),
    },
    { key: "name", header: "Tax Name" },
    { key: "type", header: "Type" },
    {
      key: "rate",
      header: "Rate",
      render: (item: TaxRate) => (
        <div className="flex items-center gap-1 font-medium">
          {item.rate}
          <Percent className="w-3 h-3 text-muted-foreground" />
        </div>
      ),
    },
    { key: "applicableTo", header: "Applicable To" },
    { key: "effectiveFrom", header: "Effective From" },
    {
      key: "effectiveTo",
      header: "Effective To",
      render: (item: TaxRate) => (
        <span className="text-muted-foreground">{item.effectiveTo || "Ongoing"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: TaxRate) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="Tax Setup"
      subtitle="Configure tax rates for procurement transactions"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Tax Rate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tax Rate</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Tax Code</Label>
                  <Input id="code" placeholder="e.g., VAT-5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Tax Name</Label>
                  <Input id="name" placeholder="Enter tax name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tax Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vat">VAT</SelectItem>
                      <SelectItem value="gst">GST</SelectItem>
                      <SelectItem value="sales">Sales Tax</SelectItem>
                      <SelectItem value="cess">Cess</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate (%)</Label>
                  <Input id="rate" type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicableTo">Applicable To</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="oil">Oil</SelectItem>
                    <SelectItem value="spare-parts">Spare Parts</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effectiveFrom">Effective From</Label>
                  <Input id="effectiveFrom" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveTo">Effective To (Optional)</Label>
                  <Input id="effectiveTo" type="date" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <Label htmlFor="active">Active Status</Label>
                  <p className="text-xs text-muted-foreground">Enable this tax rate for transactions</p>
                </div>
                <Switch id="active" defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Add Tax Rate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rates</p>
                <p className="text-2xl font-bold">{taxRatesData.filter(t => t.status === "active").length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VAT Rate</p>
                <p className="text-2xl font-bold">5%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Percent className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Standard GST</p>
                <p className="text-2xl font-bold">18%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Percent className="w-5 h-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tax Types</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Tax Rates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={taxRatesData} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
