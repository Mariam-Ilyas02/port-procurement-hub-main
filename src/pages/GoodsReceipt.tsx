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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  ClipboardCheck,
  Package,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Truck,
  ArrowRight,
  MapPin,
  Layers,
  BarChart3,
  ChevronRight,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

type GRNStatus = "draft" | "pending" | "verified" | "discrepancy" | "completed";
type MatchStatus = "matched" | "partial" | "mismatch";
type QualityStatus = "passed" | "failed" | "pending";

interface GRNLineItem {
  itemId: string;
  itemName: string;
  category: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
  unitCost: number;
  batchNumber: string;
  matchStatus: MatchStatus;
}

interface QualityCheck {
  visualInspection: boolean;
  quantityMatch: boolean;
  packagingIntact: boolean;
  documentsComplete: boolean;
}

interface FIFOLayer {
  batchNumber: string;
  receiptDate: string;
  supplier: string;
  quantity: number;
  unitCost: number;
  remainingQty: number;
}

interface GoodsReceipt {
  id: string;
  grnNumber: string;
  poReference: string;
  supplier: string;
  deliveryNote: string;
  lineItems: GRNLineItem[];
  receivedDate: string;
  warehouse: string;
  warehouseTeam: string;
  receivedBy: string;
  status: GRNStatus;
  matchStatus: MatchStatus;
  qualityStatus: QualityStatus;
  qualityChecks: QualityCheck;
  fifoLayers: FIFOLayer[];
  remarks: string;
  stockInTriggered: boolean;
  payOrderGenerated: boolean;
}

interface PendingPO {
  id: string;
  supplier: string;
  items: {
    id: string;
    name: string;
    category: string;
    ordered: number;
    unit: string;
    unitCost: number;
  }[];
}

// ─── Seed Data ──────────────────────────────────────────────────────────────

const pendingPOs: PendingPO[] = [
  {
    id: "PO-2025-006",
    supplier: "Gulf Petroleum Ltd",
    items: [
      { id: "i1", name: "Diesel Fuel", category: "Oil > Diesel", ordered: 5000, unit: "L", unitCost: 280 },
      { id: "i2", name: "Engine Oil 5W-30", category: "Oil > Lubricants", ordered: 200, unit: "L", unitCost: 850 },
    ],
  },
  {
    id: "PO-2025-007",
    supplier: "Office Depot Pakistan",
    items: [
      { id: "i3", name: "Office Stationery Bundle", category: "Consumables", ordered: 100, unit: "Pcs", unitCost: 150 },
    ],
  },
  {
    id: "PO-2025-008",
    supplier: "Pak Lubricants",
    items: [
      { id: "i4", name: "Gear Oil 80W-90", category: "Oil > Lubricants", ordered: 300, unit: "L", unitCost: 920 },
      { id: "i5", name: "Hydraulic Fluid", category: "Oil > Lubricants", ordered: 150, unit: "L", unitCost: 1100 },
      { id: "i6", name: "Brake Fluid DOT4", category: "Spare Parts", ordered: 50, unit: "L", unitCost: 650 },
    ],
  },
];

const warehouses = [
  { id: "main", name: "Main Warehouse", team: "Admin" },
  { id: "tank-a", name: "Tank Farm A", team: "Operations" },
  { id: "tank-b", name: "Tank Farm B", team: "Operations" },
  { id: "workshop", name: "Workshop Store", team: "Workshop" },
];

const initialGRNs: GoodsReceipt[] = [
  {
    id: "1",
    grnNumber: "GRN-2025-001",
    poReference: "PO-2025-001",
    supplier: "Gulf Petroleum Ltd",
    deliveryNote: "DN-4521",
    lineItems: [
      { itemId: "i1", itemName: "Diesel Fuel", category: "Oil > Diesel", orderedQty: 5000, receivedQty: 5000, unit: "L", unitCost: 280, batchNumber: "BATCH-001", matchStatus: "matched" },
      { itemId: "i2", itemName: "Engine Oil 5W-30", category: "Oil > Lubricants", orderedQty: 200, receivedQty: 200, unit: "L", unitCost: 850, batchNumber: "BATCH-002", matchStatus: "matched" },
    ],
    receivedDate: "2025-01-28",
    warehouse: "Main Warehouse",
    warehouseTeam: "Admin",
    receivedBy: "Ahmed Khan",
    status: "completed",
    matchStatus: "matched",
    qualityStatus: "passed",
    qualityChecks: { visualInspection: true, quantityMatch: true, packagingIntact: true, documentsComplete: true },
    fifoLayers: [
      { batchNumber: "BATCH-001", receiptDate: "2025-01-28", supplier: "Gulf Petroleum Ltd", quantity: 5000, unitCost: 280, remainingQty: 4200 },
      { batchNumber: "BATCH-002", receiptDate: "2025-01-28", supplier: "Gulf Petroleum Ltd", quantity: 200, unitCost: 850, remainingQty: 180 },
    ],
    remarks: "",
    stockInTriggered: true,
    payOrderGenerated: true,
  },
  {
    id: "2",
    grnNumber: "GRN-2025-002",
    poReference: "PO-2025-002",
    supplier: "Shell Oil Company",
    deliveryNote: "DN-7832",
    lineItems: [
      { itemId: "i3", itemName: "Petrol 95 RON", category: "Oil > Petrol", orderedQty: 3000, receivedQty: 3000, unit: "L", unitCost: 260, batchNumber: "BATCH-003", matchStatus: "matched" },
    ],
    receivedDate: "2025-01-27",
    warehouse: "Tank Farm A",
    warehouseTeam: "Operations",
    receivedBy: "Sarah Ali",
    status: "verified",
    matchStatus: "matched",
    qualityStatus: "passed",
    qualityChecks: { visualInspection: true, quantityMatch: true, packagingIntact: true, documentsComplete: true },
    fifoLayers: [
      { batchNumber: "BATCH-003", receiptDate: "2025-01-27", supplier: "Shell Oil Company", quantity: 3000, unitCost: 260, remainingQty: 3000 },
    ],
    remarks: "",
    stockInTriggered: true,
    payOrderGenerated: false,
  },
  {
    id: "3",
    grnNumber: "GRN-2025-003",
    poReference: "PO-2025-003",
    supplier: "Safety First Inc",
    deliveryNote: "DN-2341",
    lineItems: [
      { itemId: "i4", itemName: "Safety Helmets", category: "Consumables", orderedQty: 50, receivedQty: 42, unit: "Pcs", unitCost: 450, batchNumber: "BATCH-004", matchStatus: "partial" },
      { itemId: "i5", itemName: "Safety Gloves", category: "Consumables", orderedQty: 200, receivedQty: 200, unit: "Pairs", unitCost: 120, batchNumber: "BATCH-005", matchStatus: "matched" },
    ],
    receivedDate: "2025-01-26",
    warehouse: "Main Warehouse",
    warehouseTeam: "Admin",
    receivedBy: "Mikaal Ahmed",
    status: "discrepancy",
    matchStatus: "partial",
    qualityStatus: "pending",
    qualityChecks: { visualInspection: true, quantityMatch: false, packagingIntact: true, documentsComplete: false },
    fifoLayers: [],
    remarks: "8 helmets short-delivered. Supplier notified. Awaiting partial delivery.",
    stockInTriggered: false,
    payOrderGenerated: false,
  },
  {
    id: "4",
    grnNumber: "GRN-2025-004",
    poReference: "PO-2025-005",
    supplier: "Total Energies",
    deliveryNote: "DN-9087",
    lineItems: [
      { itemId: "i6", itemName: "Transmission Fluid", category: "Oil > Lubricants", orderedQty: 500, receivedQty: 500, unit: "L", unitCost: 980, batchNumber: "BATCH-006", matchStatus: "matched" },
    ],
    receivedDate: "2025-01-25",
    warehouse: "Tank Farm B",
    warehouseTeam: "Operations",
    receivedBy: "Ahmed Khan",
    status: "pending",
    matchStatus: "matched",
    qualityStatus: "pending",
    qualityChecks: { visualInspection: false, quantityMatch: true, packagingIntact: false, documentsComplete: false },
    fifoLayers: [],
    remarks: "",
    stockInTriggered: false,
    payOrderGenerated: false,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => "₨" + n.toLocaleString();

const grnStatusFlow: GRNStatus[] = ["draft", "pending", "verified", "completed"];

function generateBatch() {
  return "BATCH-" + Date.now().toString().slice(-6);
}

function generateGRNNumber() {
  return "GRN-2025-" + String(Math.floor(Math.random() * 900) + 100).padStart(3, "0");
}

// ─── Status Flow Component ────────────────────────────────────────────────────

function StatusFlow({ current }: { current: GRNStatus }) {
  const steps = ["draft", "pending", "verified", "completed"];
  const idx = steps.indexOf(current === "discrepancy" ? "pending" : current);
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              i < idx
                ? "bg-success/10 text-success"
                : i === idx
                ? current === "discrepancy"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      ))}
      {current === "discrepancy" && (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive ml-1">
          ⚠ Discrepancy
        </span>
      )}
    </div>
  );
}

// ─── FIFO Layer Display ───────────────────────────────────────────────────────

function FIFOLayerCard({ layers }: { layers: FIFOLayer[] }) {
  if (!layers.length) return null;
  return (
    <div className="p-3 bg-success/5 rounded-lg border border-success/20 space-y-2">
      <p className="text-sm font-medium text-success flex items-center gap-1.5">
        <Layers className="w-4 h-4" /> FIFO layer information
      </p>
      {layers.map((l) => (
        <div key={l.batchNumber} className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs bg-background/60 rounded p-2">
          <div>
            <span className="text-muted-foreground">Batch:</span>{" "}
            <span className="font-mono font-medium">{l.batchNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Receipt date:</span>{" "}
            <span>{l.receiptDate}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Unit cost:</span>{" "}
            <span className="font-medium">{fmt(l.unitCost)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Remaining:</span>{" "}
            <span className="font-medium">
              {l.remainingQty} / {l.quantity}
            </span>
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        Future issuances will consume from the oldest batch first (FIFO).
      </p>
    </div>
  );
}

// ─── Detail Dialog ────────────────────────────────────────────────────────────

function DetailDialog({
  grn,
  onVerify,
  onComplete,
  onClose,
}: {
  grn: GoodsReceipt;
  onVerify: () => void;
  onComplete: () => void;
  onClose: () => void;
}) {
  const totalValue = grn.lineItems.reduce(
    (s, i) => s + i.receivedQty * i.unitCost,
    0
  );

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-muted-foreground" />
          {grn.grnNumber}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <StatusFlow current={grn.status} />

        {grn.status === "discrepancy" && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{grn.remarks || "Discrepancy detected between ordered and received quantities."}</span>
          </div>
        )}

        {/* Meta */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">PO reference</p>
            <p className="font-medium">{grn.poReference}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Delivery note</p>
            <p className="font-medium">{grn.deliveryNote}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Supplier</p>
            <p className="font-medium">{grn.supplier}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Received date</p>
            <p className="font-medium">{grn.receivedDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Warehouse</p>
            <p className="font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {grn.warehouse}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Received by</p>
            <p className="font-medium">{grn.receivedBy}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Stock-in triggered</p>
            <p className="font-medium">{grn.stockInTriggered ? "Yes ✓" : "No"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Pay order generated</p>
            <p className="font-medium">{grn.payOrderGenerated ? "Yes ✓" : "Pending"}</p>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Package className="w-4 h-4" /> Line items
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {["Item", "Category", "Ordered", "Received", "Unit", "Unit cost", "Total", "Match"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground font-medium pb-2 pr-2"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {grn.lineItems.map((item) => (
                <tr key={item.itemId} className="border-b last:border-0">
                  <td className="py-2 pr-2 font-medium">{item.itemName}</td>
                  <td className="py-2 pr-2 text-muted-foreground text-xs">{item.category}</td>
                  <td className="py-2 pr-2">{item.orderedQty}</td>
                  <td
                    className={`py-2 pr-2 font-medium ${
                      item.receivedQty < item.orderedQty
                        ? "text-warning"
                        : "text-success"
                    }`}
                  >
                    {item.receivedQty}
                  </td>
                  <td className="py-2 pr-2 text-muted-foreground">{item.unit}</td>
                  <td className="py-2 pr-2">{fmt(item.unitCost)}</td>
                  <td className="py-2 pr-2 font-medium">
                    {fmt(item.receivedQty * item.unitCost)}
                  </td>
                  <td className="py-2">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        item.matchStatus === "matched"
                          ? "bg-success/10 text-success"
                          : item.matchStatus === "partial"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {item.matchStatus === "matched"
                        ? "✓ Matched"
                        : item.matchStatus === "partial"
                        ? "⚠ Partial"
                        : "✗ Mismatch"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={6}
                  className="pt-2 text-right text-sm text-muted-foreground font-medium"
                >
                  Total value:
                </td>
                <td className="pt-2 font-semibold">{fmt(totalValue)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Quality Checks */}
        <div>
          <p className="text-sm font-medium mb-2">Quality verification</p>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { key: "visualInspection", label: "Visual inspection passed" },
                { key: "quantityMatch", label: "Quantities match delivery note" },
                { key: "packagingIntact", label: "Packaging intact / undamaged" },
                { key: "documentsComplete", label: "All documents received" },
              ] as { key: keyof QualityCheck; label: string }[]
            ).map(({ key, label }) => (
              <div
                key={key}
                className={`flex items-center gap-2 p-2 rounded border text-sm ${
                  grn.qualityChecks[key]
                    ? "border-success/30 bg-success/5 text-success"
                    : "border-muted text-muted-foreground"
                }`}
              >
                {grn.qualityChecks[key] ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* FIFO Layers */}
        <FIFOLayerCard layers={grn.fifoLayers} />

        {grn.remarks && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Remarks</p>
            <p className="text-sm">{grn.remarks}</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {grn.status === "pending" && (
          <Button
            className="bg-success hover:bg-success/90 text-white"
            onClick={() => { onVerify(); onClose(); }}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Verify GRN
          </Button>
        )}
        {grn.status === "verified" && (
          <Button
            onClick={() => { onComplete(); onClose(); }}
          >
            Complete & trigger stock-in
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
  onCreate: (grn: GoodsReceipt) => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedPOId, setSelectedPOId] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [receivedDate, setReceivedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [deliveryNote, setDeliveryNote] = useState("");
  const [receivedQtys, setReceivedQtys] = useState<Record<string, number>>({});
  const [unitCosts, setUnitCosts] = useState<Record<string, number>>({});
  const [qualityChecks, setQualityChecks] = useState<QualityCheck>({
    visualInspection: false,
    quantityMatch: false,
    packagingIntact: false,
    documentsComplete: false,
  });
  const [remarks, setRemarks] = useState("");

  const selectedPO = pendingPOs.find((p) => p.id === selectedPOId);
  const selectedWarehouse = warehouses.find((w) => w.id === selectedWarehouseId);

  const getMatchStatus = (itemId: string, ordered: number): MatchStatus => {
    const received = receivedQtys[itemId] ?? 0;
    if (received === 0) return "mismatch";
    if (received === ordered) return "matched";
    return "partial";
  };

  const allQualityPassed = Object.values(qualityChecks).every(Boolean);

  const handleCreate = (asDraft: boolean) => {
    if (!selectedPO || !selectedWarehouse) return;

    const lineItems: GRNLineItem[] = selectedPO.items.map((item) => ({
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      orderedQty: item.ordered,
      receivedQty: receivedQtys[item.id] ?? 0,
      unit: item.unit,
      unitCost: unitCosts[item.id] ?? item.unitCost,
      batchNumber: generateBatch(),
      matchStatus: getMatchStatus(item.id, item.ordered),
    }));

    const overallMatch: MatchStatus = lineItems.every(
      (l) => l.matchStatus === "matched"
    )
      ? "matched"
      : lineItems.some((l) => l.matchStatus === "mismatch")
      ? "mismatch"
      : "partial";

    const fifoLayers: FIFOLayer[] = asDraft
      ? []
      : lineItems.map((l) => ({
          batchNumber: l.batchNumber,
          receiptDate: receivedDate,
          supplier: selectedPO.supplier,
          quantity: l.receivedQty,
          unitCost: l.unitCost,
          remainingQty: l.receivedQty,
        }));

    const newGRN: GoodsReceipt = {
      id: Date.now().toString(),
      grnNumber: generateGRNNumber(),
      poReference: selectedPOId,
      supplier: selectedPO.supplier,
      deliveryNote: deliveryNote || "DN-NEW",
      lineItems,
      receivedDate,
      warehouse: selectedWarehouse.name,
      warehouseTeam: selectedWarehouse.team,
      receivedBy: "Current User",
      status: asDraft
        ? "draft"
        : overallMatch === "matched" && allQualityPassed
        ? "verified"
        : overallMatch !== "matched"
        ? "discrepancy"
        : "pending",
      matchStatus: overallMatch,
      qualityStatus: allQualityPassed ? "passed" : "pending",
      qualityChecks,
      fifoLayers,
      remarks,
      stockInTriggered: !asDraft && overallMatch === "matched" && allQualityPassed,
      payOrderGenerated: false,
    };

    onCreate(newGRN);
    onOpenChange(false);
  };

  const stepLabels = ["Select PO", "Verify quantities", "Quality check", "Complete"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create goods receipt note</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center justify-between py-3 border-b mb-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > i + 1
                      ? "bg-success text-white"
                      : step === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    step === i + 1 ? "font-medium" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <ArrowRight className="w-3 h-3 text-muted-foreground mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select PO */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Purchase order</Label>
              <Select onValueChange={setSelectedPOId} value={selectedPOId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select PO to receive" />
                </SelectTrigger>
                <SelectContent>
                  {pendingPOs.map((po) => (
                    <SelectItem key={po.id} value={po.id}>
                      {po.id} · {po.supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Receiving warehouse</Label>
              <Select
                onValueChange={setSelectedWarehouseId}
                value={selectedWarehouseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh.id} value={wh.id}>
                      {wh.name} ({wh.team} team)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Received date</Label>
              <Input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Delivery note number</Label>
              <Input
                placeholder="Supplier's delivery note #"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
              />
            </div>

            {selectedWarehouse && (
              <div className="col-span-2 p-3 rounded-lg bg-info/5 border border-info/20 text-sm text-info flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                This receipt will be handled by the{" "}
                <strong>{selectedWarehouse.team}</strong> team at{" "}
                <strong>{selectedWarehouse.name}</strong>.
              </div>
            )}

            {selectedPO && (
              <div className="col-span-2 p-3 rounded-lg bg-muted/50 text-sm">
                <p className="font-medium mb-1">
                  {selectedPO.items.length} item(s) on this PO from{" "}
                  {selectedPO.supplier}:
                </p>
                <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                  {selectedPO.items.map((i) => (
                    <li key={i.id}>
                      {i.name} — {i.ordered} {i.unit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Verify Quantities */}
        {step === 2 && selectedPO && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Enter the actual quantities received for each line item.
            </p>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left text-xs text-muted-foreground font-medium p-3">Item</th>
                    <th className="text-left text-xs text-muted-foreground font-medium p-3">Category</th>
                    <th className="text-left text-xs text-muted-foreground font-medium p-3">Ordered</th>
                    <th className="text-left text-xs text-muted-foreground font-medium p-3">Received qty</th>
                    <th className="text-left text-xs text-muted-foreground font-medium p-3">Unit cost (₨)</th>
                    <th className="text-left text-xs text-muted-foreground font-medium p-3">Unit</th>
                    <th className="text-left text-xs text-muted-foreground font-medium p-3">Match</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPO.items.map((item) => {
                    const received = receivedQtys[item.id] ?? 0;
                    const match = getMatchStatus(item.id, item.ordered);
                    return (
                      <tr key={item.id} className="border-t">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3 text-xs text-muted-foreground">{item.category}</td>
                        <td className="p-3 text-muted-foreground">{item.ordered}</td>
                        <td className="p-3">
                          <Input
                            type="number"
                            className="h-8 w-24"
                            placeholder="0"
                            value={receivedQtys[item.id] ?? ""}
                            onChange={(e) =>
                              setReceivedQtys((prev) => ({
                                ...prev,
                                [item.id]: Number(e.target.value),
                              }))
                            }
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            className="h-8 w-28"
                            placeholder={String(item.unitCost)}
                            value={unitCosts[item.id] ?? ""}
                            onChange={(e) =>
                              setUnitCosts((prev) => ({
                                ...prev,
                                [item.id]: Number(e.target.value),
                              }))
                            }
                          />
                        </td>
                        <td className="p-3 text-muted-foreground">{item.unit}</td>
                        <td className="p-3">
                          {received === 0 ? (
                            <span className="text-xs text-muted-foreground">—</span>
                          ) : match === "matched" ? (
                            <span className="text-xs text-success">✓ Matched</span>
                          ) : match === "partial" ? (
                            <span className="text-xs text-warning">⚠ Partial</span>
                          ) : (
                            <span className="text-xs text-destructive">✗ Mismatch</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* FIFO layer preview */}
            <div className="p-3 bg-success/5 rounded-lg border border-success/20 text-xs space-y-1">
              <p className="font-medium text-success flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> FIFO layer preview
              </p>
              <p className="text-muted-foreground">
                Each line item will create a new FIFO cost layer. Batch numbers
                will be auto-assigned on completion.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {selectedPO.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-background/70 rounded p-2 flex justify-between"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">
                      {receivedQtys[item.id] ?? 0} {item.unit} @{" "}
                      {fmt(unitCosts[item.id] ?? item.unitCost)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Quality Check */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Complete quality verification before finalizing the receipt.
            </p>
            <div className="grid grid-cols-1 gap-3">
              {(
                [
                  { key: "visualInspection", label: "Visual inspection passed", desc: "Items match description, no visible damage" },
                  { key: "quantityMatch", label: "Quantities match delivery note", desc: "Received qty matches supplier delivery note" },
                  { key: "packagingIntact", label: "Packaging intact / undamaged", desc: "All packaging sealed and undamaged" },
                  { key: "documentsComplete", label: "All documents received", desc: "Delivery note, invoice, and any certificates included" },
                ] as { key: keyof QualityCheck; label: string; desc: string }[]
              ).map(({ key, label, desc }) => (
                <div
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    qualityChecks[key]
                      ? "border-success/40 bg-success/5"
                      : "border-muted hover:bg-muted/30"
                  }`}
                  onClick={() =>
                    setQualityChecks((prev) => ({
                      ...prev,
                      [key]: !prev[key],
                    }))
                  }
                >
                  <Checkbox
                    id={key}
                    checked={qualityChecks[key]}
                    onCheckedChange={(v) =>
                      setQualityChecks((prev) => ({ ...prev, [key]: !!v }))
                    }
                  />
                  <div>
                    <Label htmlFor={key} className="cursor-pointer font-medium text-sm">
                      {label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {!allQualityPassed && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 text-warning text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Not all quality checks passed. GRN will be saved with a quality
                flag for review.
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Remarks / discrepancy notes</Label>
              <Textarea
                placeholder="Note any discrepancies, damages, or issues..."
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && selectedPO && selectedWarehouse && (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3 text-sm">
              <p className="font-medium">Review before completing</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <span className="text-muted-foreground">PO:</span>{" "}
                  <span className="font-medium">{selectedPOId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Supplier:</span>{" "}
                  <span className="font-medium">{selectedPO.supplier}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Warehouse:</span>{" "}
                  <span className="font-medium">{selectedWarehouse.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  <span className="font-medium">{receivedDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quality:</span>{" "}
                  <span
                    className={
                      allQualityPassed ? "text-success font-medium" : "text-warning font-medium"
                    }
                  >
                    {allQualityPassed ? "All checks passed" : "Some checks failed"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Stock-in:</span>{" "}
                  <span className="font-medium">
                    Will be triggered on completion
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-sm">
              <p className="font-medium text-primary mb-1">What happens next:</p>
              <ul className="text-muted-foreground space-y-1 text-xs list-disc list-inside">
                <li>Stock-in will be recorded and inventory updated (FIFO)</li>
                <li>New FIFO batch layers created for each line item</li>
                <li>System will prompt generation of pay order (3-way match)</li>
                <li>GRN status set to Completed</li>
              </ul>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && (!selectedPOId || !selectedWarehouseId)}
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleCreate(true)}
              >
                Save as draft
              </Button>
              <Button onClick={() => handleCreate(false)}>
                Complete GRN
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GoodsReceipt() {
  const [grns, setGRNs] = useState<GoodsReceipt[]>(initialGRNs);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState<GoodsReceipt | null>(null);

  // ── Actions ──
  const verifyGRN = (id: string) =>
    setGRNs((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, status: "verified", qualityStatus: "passed" } : g
      )
    );

  const completeGRN = (id: string) =>
    setGRNs((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status: "completed",
              stockInTriggered: true,
              fifoLayers: g.lineItems.map((l) => ({
                batchNumber: l.batchNumber,
                receiptDate: g.receivedDate,
                supplier: g.supplier,
                quantity: l.receivedQty,
                unitCost: l.unitCost,
                remainingQty: l.receivedQty,
              })),
            }
          : g
      )
    );

  const createGRN = (grn: GoodsReceipt) => setGRNs((prev) => [grn, ...prev]);

  // ── Filtering ──
  const filtered = grns.filter((g) => {
    const matchTab =
      activeTab === "all" || g.status === activeTab;
    const matchSearch =
      g.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.poReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  // ── Metrics ──
  const pending = grns.filter((g) => g.status === "pending" || g.status === "draft");
  const discrepancies = grns.filter((g) => g.status === "discrepancy");
  const completedToday = grns.filter((g) => g.status === "completed");
  const stockInCount = grns.filter((g) => g.stockInTriggered).length;

  const metrics = [
    {
      label: "Pending receipt",
      value: pending.length,
      sub: "awaiting verification",
      icon: <Truck className="w-5 h-5 text-warning" />,
      accent: "bg-warning/10",
    },
    {
      label: "Verified today",
      value: completedToday.length,
      sub: "completed GRNs",
      icon: <CheckCircle className="w-5 h-5 text-success" />,
      accent: "bg-success/10",
    },
    {
      label: "Discrepancies",
      value: discrepancies.length,
      sub: "needs resolution",
      icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
      accent: "bg-destructive/10",
    },
    {
      label: "Stock-in triggered",
      value: stockInCount,
      sub: "inventory updated",
      icon: <BarChart3 className="w-5 h-5 text-primary" />,
      accent: "bg-primary/10",
    },
    {
      label: "This month",
      value: grns.length,
      sub: "total GRNs",
      icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
      accent: "bg-primary/10",
    },
  ];

  // ── Columns ──
  const columns = [
    {
      key: "grnNumber",
      header: "GRN number",
      render: (item: GoodsReceipt) => (
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-primary" />
          <span className="font-medium">{item.grnNumber}</span>
        </div>
      ),
    },
    { key: "poReference", header: "PO reference" },
    { key: "supplier", header: "Supplier" },
    {
      key: "items",
      header: "Items",
      render: (item: GoodsReceipt) => (
        <span className="text-muted-foreground text-sm">
          {item.lineItems.length} item{item.lineItems.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "receivedDate",
      header: "Received date",
      render: (item: GoodsReceipt) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Calendar className="w-3.5 h-3.5" />
          {item.receivedDate}
        </div>
      ),
    },
    {
      key: "warehouse",
      header: "Warehouse",
      render: (item: GoodsReceipt) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          {item.warehouse}
        </div>
      ),
    },
    {
      key: "matchStatus",
      header: "PO match",
      render: (item: GoodsReceipt) => (
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            item.matchStatus === "matched"
              ? "bg-success/10 text-success"
              : item.matchStatus === "partial"
              ? "bg-warning/10 text-warning"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {item.matchStatus === "matched"
            ? "✓ Matched"
            : item.matchStatus === "partial"
            ? "⚠ Partial"
            : "✗ Mismatch"}
        </span>
      ),
    },
    {
      key: "qualityStatus",
      header: "Quality",
      render: (item: GoodsReceipt) => (
        <div className="flex items-center gap-1">
          {item.qualityStatus === "passed" ? (
            <CheckCircle className="w-4 h-4 text-success" />
          ) : item.qualityStatus === "failed" ? (
            <XCircle className="w-4 h-4 text-destructive" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-warning" />
          )}
          <span className="text-xs capitalize">{item.qualityStatus}</span>
        </div>
      ),
    },
    {
      key: "stockInTriggered",
      header: "Stock-in",
      render: (item: GoodsReceipt) => (
        <span
          className={`text-xs ${
            item.stockInTriggered ? "text-success" : "text-muted-foreground"
          }`}
        >
          {item.stockInTriggered ? "✓ Done" : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: GoodsReceipt) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: GoodsReceipt) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedGRN(item)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {item.status === "pending" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-success"
              onClick={() => verifyGRN(item.id)}
            >
              Verify
            </Button>
          )}
          {item.status === "verified" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-primary"
              onClick={() => completeGRN(item.id)}
            >
              Complete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      title="Goods receipt notes (GRN)"
      subtitle="Record and verify goods received against purchase orders · Triggers stock-in on completion"
      actions={
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create GRN
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

      {/* Table */}
      <Card>
        <CardHeader className="pb-0 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All GRNs</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="discrepancy">Discrepancy</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search GRNs..."
                  className="pl-9 w-56"
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
        <CardContent className="p-0 mt-2">
          <DataTable columns={columns} data={filtered} selectable />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <CreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={createGRN}
      />

      {/* Detail Dialog */}
      {selectedGRN && (
        <Dialog
          open={!!selectedGRN}
          onOpenChange={(v) => !v && setSelectedGRN(null)}
        >
          <DetailDialog
            grn={selectedGRN}
            onVerify={() => verifyGRN(selectedGRN.id)}
            onComplete={() => completeGRN(selectedGRN.id)}
            onClose={() => setSelectedGRN(null)}
          />
        </Dialog>
      )}
    </AppLayout>
  );
}
