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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Plus, Search, Filter, CreditCard, Calendar, Eye, CheckCircle, 
  Banknote, Clock, AlertTriangle, Building2, FileCheck
} from "lucide-react";

interface PayOrder {
  id: string;
  payOrderNumber: string;
  poReference: string;
  grnReference: string;
  supplier: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  status: "pending" | "approved" | "paid";
  paymentMethod: "cash" | "bank_transfer" | "pay_order";
  paymentType: string;
  threeWayMatch: {
    po: boolean;
    grn: boolean;
    invoice: boolean;
  };
  financeApproved: boolean;
}

const payOrdersData: PayOrder[] = [
  { id: "1", payOrderNumber: "PAY-2025-001", poReference: "PO-2025-001", grnReference: "GRN-2025-001", supplier: "Gulf Petroleum Ltd", invoiceNumber: "INV-4521", amount: "₨45,000", dueDate: "2025-02-15", status: "pending", paymentMethod: "bank_transfer", paymentType: "Full Payment", threeWayMatch: { po: true, grn: true, invoice: true }, financeApproved: false },
  { id: "2", payOrderNumber: "PAY-2025-002", poReference: "PO-2025-002", grnReference: "GRN-2025-002", supplier: "Shell Oil Company", invoiceNumber: "INV-7832", amount: "₨8,500", dueDate: "2025-02-10", status: "approved", paymentMethod: "pay_order", paymentType: "Full Payment", threeWayMatch: { po: true, grn: true, invoice: true }, financeApproved: true },
  { id: "3", payOrderNumber: "PAY-2025-003", poReference: "PO-2025-003", grnReference: "GRN-2025-003", supplier: "Safety First Inc", invoiceNumber: "INV-2341", amount: "₨6,000", dueDate: "2025-02-20", status: "paid", paymentMethod: "cash", paymentType: "Partial (50%)", threeWayMatch: { po: true, grn: true, invoice: true }, financeApproved: true },
  { id: "4", payOrderNumber: "PAY-2025-004", poReference: "PO-2025-003", grnReference: "GRN-2025-003", supplier: "Safety First Inc", invoiceNumber: "INV-2342", amount: "₨6,000", dueDate: "2025-03-05", status: "pending", paymentMethod: "bank_transfer", paymentType: "Partial (50%)", threeWayMatch: { po: true, grn: false, invoice: false }, financeApproved: false },
  { id: "5", payOrderNumber: "PAY-2025-005", poReference: "PO-2025-005", grnReference: "GRN-2025-004", supplier: "Total Energies", invoiceNumber: "INV-9087", amount: "₨32,000", dueDate: "2025-02-25", status: "approved", paymentMethod: "pay_order", paymentType: "Full Payment", threeWayMatch: { po: true, grn: true, invoice: true }, financeApproved: true },
];

export default function PayOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const columns = [
    {
      key: "payOrderNumber",
      header: "Pay Order #",
      render: (item: PayOrder) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{item.payOrderNumber}</span>
        </div>
      ),
    },
    { key: "poReference", header: "PO Ref" },
    { key: "grnReference", header: "GRN Ref" },
    { key: "supplier", header: "Supplier" },
    { key: "invoiceNumber", header: "Invoice #" },
    { key: "amount", header: "Amount", className: "text-right font-medium" },
    {
      key: "threeWayMatch",
      header: "3-Way Match",
      render: (item: PayOrder) => (
        <div className="flex items-center gap-1">
          <span className={`text-xs ${item.threeWayMatch.po ? "text-success" : "text-destructive"}`}>PO</span>
          <span className={`text-xs ${item.threeWayMatch.grn ? "text-success" : "text-destructive"}`}>GRN</span>
          <span className={`text-xs ${item.threeWayMatch.invoice ? "text-success" : "text-destructive"}`}>INV</span>
          {item.threeWayMatch.po && item.threeWayMatch.grn && item.threeWayMatch.invoice ? (
            <CheckCircle className="w-4 h-4 text-success ml-1" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-warning ml-1" />
          )}
        </div>
      ),
    },
    {
      key: "paymentMethod",
      header: "Payment",
      render: (item: PayOrder) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          item.paymentMethod === "cash" 
            ? "bg-success/10 text-success" 
            : item.paymentMethod === "bank_transfer" 
              ? "bg-info/10 text-info" 
              : "bg-primary/10 text-primary"
        }`}>
          {item.paymentMethod === "cash" ? "Cash" : 
           item.paymentMethod === "bank_transfer" ? "Bank Transfer" : "Pay Order"}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (item: PayOrder) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {item.dueDate}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: PayOrder) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: PayOrder) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          {item.status === "approved" && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-success">
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const filteredData = payOrdersData.filter(
    (item) =>
      item.payOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPending = payOrdersData
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + parseFloat(p.amount.replace("₨", "").replace(",", "")), 0);

  const totalApproved = payOrdersData
    .filter(p => p.status === "approved")
    .reduce((sum, p) => sum + parseFloat(p.amount.replace("₨", "").replace(",", "")), 0);

  const unmatchedCount = payOrdersData
    .filter(p => !p.threeWayMatch.po || !p.threeWayMatch.grn || !p.threeWayMatch.invoice).length;

  return (
    <AppLayout
      title="Pay Orders"
      subtitle="Process payments with 3-way match verification (PO-GRN-Invoice)"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Pay Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Pay Order</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purchase Order Reference</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="po-001">PO-2025-001 - Gulf Petroleum Ltd</SelectItem>
                      <SelectItem value="po-002">PO-2025-002 - Shell Oil Company</SelectItem>
                      <SelectItem value="po-005">PO-2025-005 - Total Energies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>GRN Reference</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GRN" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grn-001">GRN-2025-001</SelectItem>
                      <SelectItem value="grn-002">GRN-2025-002</SelectItem>
                      <SelectItem value="grn-004">GRN-2025-004</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input placeholder="Enter invoice number" />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Payment</SelectItem>
                      <SelectItem value="partial">Partial Payment</SelectItem>
                      <SelectItem value="advance">Advance Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                      <Banknote className="w-4 h-4 text-success" />
                      Cash
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer">
                      <Building2 className="w-4 h-4 text-info" />
                      Bank Transfer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="pay_order" id="pay_order" />
                    <Label htmlFor="pay_order" className="flex items-center gap-2 cursor-pointer">
                      <FileCheck className="w-4 h-4 text-primary" />
                      Pay Order
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Method Specific Fields */}
              {paymentMethod === "bank_transfer" && (
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-info/5">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input placeholder="Enter bank name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input placeholder="Enter account number" />
                  </div>
                  <div className="space-y-2">
                    <Label>IBAN</Label>
                    <Input placeholder="Enter IBAN" />
                  </div>
                  <div className="space-y-2">
                    <Label>Transfer Reference</Label>
                    <Input placeholder="Auto-generated" disabled className="bg-muted" />
                  </div>
                </div>
              )}

              {paymentMethod === "pay_order" && (
                <Alert className="border-primary bg-primary/5">
                  <FileCheck className="h-4 w-4" />
                  <AlertDescription className="text-primary">
                    A bank-generated Pay Order will be created. This requires bank approval 
                    and will be issued as a guaranteed payment instrument.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>

              {/* 3-Way Match Verification */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium mb-3 flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  3-Way Match Verification
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-2 bg-background rounded border">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">PO Verified</p>
                      <p className="text-xs text-muted-foreground">PO-2025-001</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-background rounded border">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">GRN Verified</p>
                      <p className="text-xs text-muted-foreground">GRN-2025-001</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-background rounded border">
                    <Clock className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-sm font-medium">Invoice</p>
                      <p className="text-xs text-muted-foreground">Pending entry</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Finance confirmation required after all three documents are matched.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Create Pay Order</Button>
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
                <p className="text-sm text-muted-foreground">Total Payables</p>
                <p className="text-2xl font-bold">₨{(totalPending + totalApproved).toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">₨{totalPending.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ready to Pay</p>
                <p className="text-2xl font-bold">₨{totalApproved.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unmatched</p>
                <p className="text-2xl font-bold">{unmatchedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs defaultValue="all" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search pay orders..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredData} selectable />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
