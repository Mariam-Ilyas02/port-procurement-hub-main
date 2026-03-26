import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Filter,
  CreditCard,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  BookOpen,
  History,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PayOrderStatus = "draft" | "pending" | "approved" | "paid";
type PaymentType = "full" | "partial" | "advance";
type ApprovalLevel = "L1" | "L2" | "L3";

interface ThreeWayMatch {
  po: boolean;
  grn: boolean;
  invoice: boolean;
}

interface PayOrder {
  id: string;
  payOrderNumber: string;
  poReference: string;
  grnReference: string;
  supplier: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  paymentType: PaymentType;
  dueDate: string;
  status: PayOrderStatus;
  // threeWayMatch: ThreeWayMatch;
  approvalLevel: ApprovalLevel;
  financeApproved: boolean;
  daysOutstanding: number;
  notes?: string;
}

interface PaymentHistoryEntry {
  date: string;
  payOrderNumber: string;
  supplier: string;
  amount: number;
  reference: string;
  status: "paid";
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const initialPayOrders: PayOrder[] = [
  {
    id: "1",
    payOrderNumber: "PAY-2025-001",
    poReference: "PO-2025-001",
    grnReference: "GRN-2025-001",
    supplier: "Gulf Petroleum Ltd",
    invoiceNumber: "INV-4521",
    invoiceDate: "2025-01-20",
    amount: 45000,
    paymentType: "full",
    dueDate: "2025-02-15",
    status: "pending",
    // threeWayMatch: { po: true, grn: true, invoice: true },
    approvalLevel: "L2",
    financeApproved: false,
    daysOutstanding: 30,
  },
  {
    id: "2",
    payOrderNumber: "PAY-2025-002",
    poReference: "PO-2025-002",
    grnReference: "GRN-2025-002",
    supplier: "Shell Oil Company",
    invoiceNumber: "INV-7832",
    invoiceDate: "2025-01-18",
    amount: 8500,
    paymentType: "full",
    dueDate: "2025-02-10",
    status: "approved",
    // threeWayMatch: { po: true, grn: true, invoice: true },
    approvalLevel: "L1",
    financeApproved: true,
    daysOutstanding: 35,
  },
  {
    id: "3",
    payOrderNumber: "PAY-2025-003",
    poReference: "PO-2025-003",
    grnReference: "GRN-2025-003",
    supplier: "Safety First Inc",
    invoiceNumber: "INV-2341",
    invoiceDate: "2025-01-10",
    amount: 6000,
    paymentType: "partial",
    dueDate: "2025-01-20",
    status: "paid",
    // threeWayMatch: { po: true, grn: true, invoice: true },
    approvalLevel: "L1",
    financeApproved: true,
    daysOutstanding: 0,
  },
  {
    id: "4",
    payOrderNumber: "PAY-2025-004",
    poReference: "PO-2025-003",
    grnReference: "GRN-2025-003",
    supplier: "Safety First Inc",
    invoiceNumber: "INV-2342",
    invoiceDate: "2025-02-01",
    amount: 6000,
    paymentType: "partial",
    dueDate: "2025-03-05",
    status: "draft",
    // threeWayMatch: { po: true, grn: false, invoice: false },
    approvalLevel: "L1",
    financeApproved: false,
    daysOutstanding: 0,
  },
  {
    id: "5",
    payOrderNumber: "PAY-2025-005",
    poReference: "PO-2025-005",
    grnReference: "GRN-2025-004",
    supplier: "Total Energies",
    invoiceNumber: "INV-9087",
    invoiceDate: "2025-01-25",
    amount: 32000,
    paymentType: "full",
    dueDate: "2025-02-25",
    status: "approved",
    // threeWayMatch: { po: true, grn: true, invoice: true },
    approvalLevel: "L2",
    financeApproved: true,
    daysOutstanding: 20,
  },
  {
    id: "6",
    payOrderNumber: "PAY-2025-006",
    poReference: "PO-2025-006",
    grnReference: "GRN-2025-005",
    supplier: "Gulf Petroleum Ltd",
    invoiceNumber: "INV-4600",
    invoiceDate: "2024-12-28",
    amount: 120000,
    paymentType: "full",
    dueDate: "2025-01-10",
    status: "pending",
    // threeWayMatch: { po: true, grn: true, invoice: true },
    approvalLevel: "L3",
    financeApproved: false,
    daysOutstanding: 65,
  },
  {
    id: "7",
    payOrderNumber: "PAY-2025-007",
    poReference: "PO-2025-007",
    grnReference: "GRN-2025-006",
    supplier: "Pak Lubricants",
    invoiceNumber: "INV-3300",
    invoiceDate: "2025-02-05",
    amount: 18000,
    paymentType: "advance",
    dueDate: "2025-02-28",
    status: "draft",
    // threeWayMatch: { po: true, grn: false, invoice: false },
    approvalLevel: "L1",
    financeApproved: false,
    daysOutstanding: 0,
  },
];

const paymentHistory: PaymentHistoryEntry[] = [
  {
    date: "2025-01-20",
    payOrderNumber: "PAY-2025-003",
    supplier: "Safety First Inc",
    amount: 6000,
    reference: "CASH-003",
    status: "paid",
  },
  {
    date: "2025-01-15",
    payOrderNumber: "PAY-2025-001",
    supplier: "Gulf Petroleum Ltd",
    amount: 22500,
    reference: "TXN-88721",
    status: "paid",
  },
  {
    date: "2025-01-08",
    payOrderNumber: "PAY-2024-099",
    supplier: "Shell Oil Company",
    amount: 15000,
    reference: "PO-BBL-441",
    status: "paid",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => "₨" + n.toLocaleString();

const isFullMatch = (m: ThreeWayMatch) => m.po && m.grn && m.invoice;

const paymentTypeLabel: Record<PaymentType, string> = {
  full: "Full payment",
  partial: "Partial payment",
  advance: "Advance payment",
};

const approvalThresholds: Record<ApprovalLevel, string> = {
  L1: "Up to ₨25,000",
  L2: "₨25,001 – ₨100,000",
  L3: "Above ₨100,000",
};

const statusFlow: PayOrderStatus[] = ["draft", "pending", "approved", "paid"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MatchBadge({ match }: { match: ThreeWayMatch }) {
  const all = isFullMatch(match);
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
        all
          ? "bg-success/10 text-success"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      <span className={match.po ? "text-success" : "text-destructive"}>PO</span>
      <span className="text-muted-foreground">·</span>
      <span className={match.grn ? "text-success" : "text-destructive"}>GRN</span>
      <span className="text-muted-foreground">·</span>
      <span className={match.invoice ? "text-success" : "text-destructive"}>INV</span>
      {all ? (
        <CheckCircle className="w-3 h-3 ml-0.5 text-success" />
      ) : (
        <AlertTriangle className="w-3 h-3 ml-0.5 text-destructive" />
      )}
    </div>
  );
}

function StatusFlow({ current }: { current: PayOrderStatus }) {
  const idx = statusFlow.indexOf(current);
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {statusFlow.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              i < idx
                ? "bg-success/10 text-success"
                : i === idx
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
          {i < statusFlow.length - 1 && (
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Detail Dialog ────────────────────────────────────────────────────────────

function DetailDialog({
  order,
  onApprove,
  onMarkPaid,
  onSubmit,
  onClose,
}: {
  order: PayOrder;
  onApprove: () => void;
  onMarkPaid: () => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  // const matched = isFullMatch(order.threeWayMatch);

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          {order.payOrderNumber}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        {/* Status flow */}
        <StatusFlow current={order.status} />

        {/* Warning if unmatched */}
        {/* {!matched && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              3-way match incomplete. GRN and/or invoice verification pending.
              Pay order cannot be approved until all three documents match.
            </span>
          </div>
        )} */}

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">PO reference</p>
            <p className="font-medium">{order.poReference}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">GRN reference</p>
            <p className="font-medium">{order.grnReference}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Supplier</p>
            <p className="font-medium">{order.supplier}</p>
          </div>
          {/* <div>
            <p className="text-xs text-muted-foreground mb-0.5">Invoice number</p>
            <p className="font-medium">{order.invoiceNumber}</p>
          </div> */}
          {/* <div>
            <p className="text-xs text-muted-foreground mb-0.5">Invoice date</p>
            <p className="font-medium">{order.invoiceDate}</p>
          </div> */}
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Due date</p>
            <p className="font-medium">{order.dueDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Amount</p>
            <p className="text-xl font-semibold">{fmt(order.amount)}</p>
          </div>
          {/* <div>
            <p className="text-xs text-muted-foreground mb-0.5">Payment type</p>
            <p className="font-medium">{paymentTypeLabel[order.paymentType]}</p>
          </div> */}
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Approval level</p>
            <p className="font-medium">
              {order.approvalLevel}{" "}
              <span className="text-muted-foreground text-xs">
                ({approvalThresholds[order.approvalLevel]})
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Finance approved</p>
            <p className="font-medium">{order.financeApproved ? "Yes" : "No"}</p>
          </div>
        </div>

        {/* 3-way match */}


        {order.notes && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {order.status === "draft" && (
          <Button
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            Submit for approval
          </Button>
        )}
        {/* {order.status === "pending" && matched && (
          <Button
            className="bg-success hover:bg-success/90 text-white"
            onClick={() => {
              onApprove();
              onClose();
            }}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Approve
          </Button>
        )} */}
        {order.status === "approved" && (
          <Button
            onClick={() => {
              onMarkPaid();
              onClose();
            }}
          >
            Mark as paid
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

// ─── Create Dialog ────────────────────────────────────────────────────────────

function CreateDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (order: PayOrder) => void;
}) {
  const [poRef, setPoRef] = useState("");
  const [grnRef, setGrnRef] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("full");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  // Simulate auto-match when PO + GRN selected
  const autoMatch: ThreeWayMatch = {
    po: !!poRef,
    grn: !!grnRef,
    invoice: !!invoiceNumber,
  };

  const getApprovalLevel = (amt: number): ApprovalLevel => {
    if (amt <= 25000) return "L1";
    if (amt <= 100000) return "L2";
    return "L3";
  };

  const handleCreate = (asDraft: boolean) => {
    const amt = parseFloat(amount) || 0;
    const newOrder: PayOrder = {
      id: Date.now().toString(),
      payOrderNumber: `PAY-2025-${String(Math.floor(Math.random() * 900) + 100)}`,
      poReference: poRef || "PO-2025-NEW",
      grnReference: grnRef || "GRN-2025-NEW",
      supplier: "New Supplier",
      invoiceNumber: invoiceNumber || "INV-NEW",
      invoiceDate: invoiceDate || new Date().toISOString().split("T")[0],
      amount: amt,
      paymentType,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      status: asDraft ? "draft" : "pending",
      // threeWayMatch: autoMatch,
      approvalLevel: getApprovalLevel(amt),
      financeApproved: false,
      daysOutstanding: 0,
      notes,
    };
    onCreate(newOrder);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create pay order</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            System will auto-generate the pay order after 3-way match (PO + GRN
            + Invoice) is verified. You may also create manually.
          </div> */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Purchase order reference</Label>
              <Select onValueChange={setPoRef}>
                <SelectTrigger>
                  <SelectValue placeholder="Select PO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PO-2025-001">
                    PO-2025-001 · Gulf Petroleum Ltd
                  </SelectItem>
                  <SelectItem value="PO-2025-002">
                    PO-2025-002 · Shell Oil Company
                  </SelectItem>
                  <SelectItem value="PO-2025-005">
                    PO-2025-005 · Total Energies
                  </SelectItem>
                  <SelectItem value="PO-2025-008">
                    PO-2025-008 · Pak Lubricants
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>GRN reference</Label>
              <Select onValueChange={setGrnRef}>
                <SelectTrigger>
                  <SelectValue placeholder="Select GRN" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GRN-2025-001">GRN-2025-001</SelectItem>
                  <SelectItem value="GRN-2025-002">GRN-2025-002</SelectItem>
                  <SelectItem value="GRN-2025-004">GRN-2025-004</SelectItem>
                  <SelectItem value="GRN-2025-007">GRN-2025-007</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Invoice number</Label>
              <Input
                placeholder="e.g. INV-5000"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Invoice date</Label>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
          </div> */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Amount (₨)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {amount && (
                <p className="text-xs text-muted-foreground">
                  Approval level:{" "}
                  <span className="font-medium text-foreground">
                    {getApprovalLevel(parseFloat(amount))}
                  </span>{" "}
                  — {approvalThresholds[getApprovalLevel(parseFloat(amount))]}
                </p>
              )}
            </div>
            {/* <div className="space-y-1.5">
              <Label>Payment type</Label>
              <Select
                onValueChange={(v) => setPaymentType(v as PaymentType)}
                defaultValue="full"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full payment</SelectItem>
                  <SelectItem value="partial">Partial payment</SelectItem>
                  <SelectItem value="advance">Advance payment</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="space-y-1.5">
            <Label>Due date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Live 3-way match preview */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <p className="text-sm font-medium flex items-center gap-1.5">
              {/* <FileCheck className="w-4 h-4" /> 3-way match verification */}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { key: "po" as const, label: "PO", ref: poRef },
                  { key: "grn" as const, label: "GRN", ref: grnRef },
                  // {
                  //   key: "invoice" as const,
                  //   label: "Invoice",
                  //   ref: invoiceNumber,
                  // },
                ]
              ).map(({ key, label, ref }) => (
                <div
                  key={key}
                  className={`flex items-center gap-2 p-2 rounded border bg-background ${
                    autoMatch[key]
                      ? "border-success/40"
                      : "border-muted-foreground/20"
                  }`}
                >
                  {autoMatch[key] ? (
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-warning flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {ref || "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Finance confirmation required.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Add notes for the finance team..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleCreate(true)}>
            Save as draft
          </Button>
          <Button onClick={() => handleCreate(false)}>
            Submit for approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Aging Report ─────────────────────────────────────────────────────────────

function AgingReport({ orders }: { orders: PayOrder[] }) {
  const outstanding = orders.filter((o) => o.status !== "paid");
  const total = outstanding.reduce((s, o) => s + o.amount, 0) || 1;

  const buckets = [
    {
      label: "Current (0–30 days)",
      color: "bg-success",
      textColor: "text-success",
      items: outstanding.filter((o) => o.daysOutstanding <= 30),
    },
    {
      label: "31–60 days",
      color: "bg-warning",
      textColor: "text-warning",
      items: outstanding.filter(
        (o) => o.daysOutstanding > 30 && o.daysOutstanding <= 60
      ),
    },
    {
      label: "61–90 days",
      color: "bg-destructive",
      textColor: "text-destructive",
      items: outstanding.filter(
        (o) => o.daysOutstanding > 60 && o.daysOutstanding <= 90
      ),
    },
    {
      label: "Over 90 days",
      color: "bg-destructive",
      textColor: "text-destructive",
      items: outstanding.filter((o) => o.daysOutstanding > 90),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm font-medium flex items-center gap-1.5">
        <TrendingUp className="w-4 h-4" /> Aging report — outstanding payables
      </p>
      {buckets.map((b) => {
        const amt = b.items.reduce((s, o) => s + o.amount, 0);
        const pct = Math.round((amt / total) * 100);
        return (
          <div key={b.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={`font-medium ${b.textColor}`}>{b.label}</span>
              <span className="text-muted-foreground">
                {fmt(amt)} · {b.items.length} orders · {pct}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${b.color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="pt-2 border-t text-sm text-muted-foreground">
        Total outstanding:{" "}
        <span className="font-semibold text-foreground">{fmt(total)}</span>
      </div>
    </div>
  );
}

// ─── Vendor Ledger ────────────────────────────────────────────────────────────

function VendorLedger({ orders }: { orders: PayOrder[] }) {
  const vendors: Record<
    string,
    { paid: number; outstanding: number; count: number }
  > = {};

  orders.forEach((o) => {
    if (!vendors[o.supplier])
      vendors[o.supplier] = { paid: 0, outstanding: 0, count: 0 };
    vendors[o.supplier].count++;
    if (o.status === "paid") vendors[o.supplier].paid += o.amount;
    else vendors[o.supplier].outstanding += o.amount;
  });

  return (
    <div className="p-4">
      <p className="text-sm font-medium flex items-center gap-1.5 mb-3">
        <BookOpen className="w-4 h-4" /> Vendor ledger
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left text-xs text-muted-foreground font-medium pb-2">
              Supplier
            </th>
            <th className="text-right text-xs text-muted-foreground font-medium pb-2">
              Orders
            </th>
            <th className="text-right text-xs text-muted-foreground font-medium pb-2">
              Paid
            </th>
            <th className="text-right text-xs text-muted-foreground font-medium pb-2">
              Outstanding
            </th>
            <th className="text-right text-xs text-muted-foreground font-medium pb-2">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(vendors).map(([name, v]) => (
            <tr key={name} className="border-b last:border-0">
              <td className="py-2.5 font-medium">{name}</td>
              <td className="py-2.5 text-right text-muted-foreground">
                {v.count}
              </td>
              <td className="py-2.5 text-right text-success font-medium">
                {fmt(v.paid)}
              </td>
              <td
                className={`py-2.5 text-right font-medium ${
                  v.outstanding > 0 ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {fmt(v.outstanding)}
              </td>
              <td className="py-2.5 text-right">
                {v.outstanding > 0 ? (
                  <StatusBadge status="pending" />
                ) : (
                  <StatusBadge status="paid" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Payment History ──────────────────────────────────────────────────────────

function PaymentHistory({ history }: { history: PaymentHistoryEntry[] }) {
  return (
    <div className="p-4">
      <p className="text-sm font-medium flex items-center gap-1.5 mb-3">
        <History className="w-4 h-4" /> Payment history
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {["Date", "Pay order #", "Supplier", "Amount", "Reference", "Status"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left text-xs text-muted-foreground font-medium pb-2 pr-3 last:pr-0"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="py-2.5 pr-3 text-muted-foreground">{h.date}</td>
              <td className="py-2.5 pr-3 font-medium">{h.payOrderNumber}</td>
              <td className="py-2.5 pr-3">{h.supplier}</td>
              <td className="py-2.5 pr-3 font-medium">{fmt(h.amount)}</td>
              <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">
                {h.reference}
              </td>
              <td className="py-2.5">
                <StatusBadge status={h.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PayOrders() {
  const [orders, setOrders] = useState<PayOrder[]>(initialPayOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PayOrder | null>(null);

  // ── Actions ──
  const approveOrder = (id: string) =>
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "approved", financeApproved: true } : o
      )
    );

  const markPaid = (id: string) =>
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "paid", daysOutstanding: 0 } : o
      )
    );

  const submitOrder = (id: string) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "pending" } : o))
    );

  const createOrder = (order: PayOrder) =>
    setOrders((prev) => [order, ...prev]);

  // ── Filtering ──
  const filtered = orders.filter((o) => {
    const matchTab =
      activeTab === "all" ||
      activeTab === "aging" ||
      activeTab === "ledger" ||
      activeTab === "history" ||
      o.status === activeTab;
    const matchSearch =
      o.payOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  // ── Summary metrics ──
  const outstanding = orders.filter((o) => o.status !== "paid");
  const pending = orders.filter(
    (o) => o.status === "pending" || o.status === "draft"
  );
  const approved = orders.filter((o) => o.status === "approved");
  const overdue = outstanding.filter((o) => o.daysOutstanding > 30);
  // const unmatched = orders.filter((o) => !isFullMatch(o.threeWayMatch));

  const metrics = [
    {
      label: "Total payables",
      value: fmt(outstanding.reduce((s, o) => s + o.amount, 0)),
      sub: `${outstanding.length} orders`,
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      accent: "bg-primary/10",
    },
    {
      label: "Pending approval",
      value: fmt(pending.reduce((s, o) => s + o.amount, 0)),
      sub: `${pending.length} orders`,
      icon: <Clock className="w-5 h-5 text-warning" />,
      accent: "bg-warning/10",
    },
    {
      label: "Ready to pay",
      value: fmt(approved.reduce((s, o) => s + o.amount, 0)),
      sub: `${approved.length} orders`,
      icon: <CheckCircle className="w-5 h-5 text-success" />,
      accent: "bg-success/10",
    },
    {
      label: "Overdue (>30d)",
      value: overdue.length,
      sub: "needs action",
      icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
      accent: "bg-destructive/10",
    },
    {
      label: "Unmatched",
      // value: unmatched.length,
      sub: "3-way match fail",
      icon: <FileCheck className="w-5 h-5 text-destructive" />,
      accent: "bg-destructive/10",
    },
  ];

  // ── Table columns ──
  const columns = [
    {
      key: "payOrderNumber",
      header: "Pay order #",
      render: (item: PayOrder) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{item.payOrderNumber}</span>
        </div>
      ),
    },
    { key: "poReference", header: "PO ref" },
    { key: "grnReference", header: "GRN ref" },
    { key: "supplier", header: "Supplier" },
    // { key: "invoiceNumber", header: "Invoice #" },
    {
      key: "amount",
      header: "Amount",
      render: (item: PayOrder) => (
        <span className="font-medium">{fmt(item.amount)}</span>
      ),
    },
    {
      key: "paymentType",
      header: "Type",
      render: (item: PayOrder) => (
        <span className="text-xs text-muted-foreground">
          {paymentTypeLabel[item.paymentType]}
        </span>
      ),
    },
    // {
    //   key: "threeWayMatch",
    //   header: "3-way match",
    //   render: (item: PayOrder) => <MatchBadge match={item.threeWayMatch} />,
    // },
    {
      key: "dueDate",
      header: "Due date",
      render: (item: PayOrder) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Calendar className="w-3.5 h-3.5" />
          {item.dueDate}
        </div>
      ),
    },
    {
      key: "approvalLevel",
      header: "Level",
      render: (item: PayOrder) => (
        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
          {item.approvalLevel}
        </span>
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedOrder(item)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {item.status === "draft" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => submitOrder(item.id)}
            >
              Submit
            </Button>
          )}
          {/* {item.status === "pending" && isFullMatch(item.threeWayMatch) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-success"
              onClick={() => approveOrder(item.id)}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )} */}
          {item.status === "approved" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-primary"
              onClick={() => markPaid(item.id)}
            >
              Mark paid
            </Button>
          )}
        </div>
      ),
    },
  ];

  const specialTabs = ["aging", "ledger", "history"];
  const isSpecialTab = specialTabs.includes(activeTab);

  return (
    <AppLayout
      title="Pay orders"
      // subtitle="3-way match verification (PO · GRN · Invoice) · Approval workflow · Payment tracking"
      actions={
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create pay order
        </Button>
      }
    >
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-xl font-bold">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
                </div>
                <div
                  className={`w-9 h-9 rounded-lg ${m.accent} flex items-center justify-center`}
                >
                  {m.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main table card */}
      <Card>
        <CardHeader className="pb-0 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="aging">Aging</TabsTrigger>
                <TabsTrigger value="ledger">Ledger</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </Tabs>

            {!isSpecialTab && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pay orders..."
                    className="pl-9 w-56"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 mt-2">
          {activeTab === "aging" && <AgingReport orders={orders} />}
          {activeTab === "ledger" && <VendorLedger orders={orders} />}
          {activeTab === "history" && (
            <PaymentHistory history={paymentHistory} />
          )}
          {!isSpecialTab && (
            <DataTable columns={columns} data={filtered} selectable />
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <CreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={createOrder}
      />

      {/* Detail dialog */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={(v) => !v && setSelectedOrder(null)}
        >
          <DetailDialog
            order={selectedOrder}
            onApprove={() => approveOrder(selectedOrder.id)}
            onMarkPaid={() => markPaid(selectedOrder.id)}
            onSubmit={() => submitOrder(selectedOrder.id)}
            onClose={() => setSelectedOrder(null)}
          />
        </Dialog>
      )}
    </AppLayout>
  );
}
