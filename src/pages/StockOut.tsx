import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Package, Layers, AlertTriangle, Eye, Calendar, ArrowDownRight } from "lucide-react";
import { inventoryItems } from "./Inventory";

type OutflowType = "consumption" | "issuance" | "damage" | "loss" | "transfer";
type AdjustmentStatus = "pending_approval" | "approved" | "rejected";

interface FIFOConsumed {
  batchNumber: string;
  receiptDate: string;
  qtyConsumed: number;
  unitCost: number;
  cogsCost: number;
}

interface StockOutEntry {
  id: string;
  entryNumber: string;
  date: string;
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  quantity: number;
  totalCOGS: number;
  outflowType: OutflowType;
  reasonCode: string;
  assetReference?: string;
  fromWarehouse: string;
  toWarehouse?: string;
  issuedTo?: string;
  status: AdjustmentStatus;
  approvedBy?: string;
  fifoConsumed: FIFOConsumed[];
  notes?: string;
}

const outflowLabels: Record<OutflowType, string> = {
  consumption: "Asset consumption",
  issuance:    "Manual issuance",
  damage:      "Damage/write-off",
  loss:        "Loss",
  transfer:    "Warehouse transfer",
};

const reasonCodes: Record<OutflowType, string[]> = {
  consumption: ["Generator fuel", "Machinery oil", "Vehicle fuel", "Crane hydraulics"],
  issuance:    ["Workshop use", "Maintenance kit", "Admin supply", "Project use"],
  damage:      ["Physical damage", "Quality failure", "Contamination", "Expired"],
  loss:        ["Spillage", "Theft", "Evaporation", "Leakage"],
  transfer:    ["Warehouse rebalance", "Emergency transfer", "Consolidation"],
};

const assets = [
  "Generator-1kVA-01", "Generator-40kVA-01", "Generator-100kVA-01",
  "Kalmar-01", "Kalmar-02", "Kalmar-03",
  "Fantuzi-01", "Fantuzi-02", "Fantuzi-03",
  "Forklift-01", "Forklift-02", "Forklift-03",
  "Car-Honda-01", "Car-Toyota-01", "Car-Lexus-01",
];

const warehouses = ["Main Warehouse", "Tank Farm A", "Tank Farm B", "Workshop Store"];

const initialEntries: StockOutEntry[] = [
  { id:"1", entryNumber:"SO-2026-001", date:"2026-02-28", itemCode:"FUEL-001", itemName:"Diesel Fuel", category:"Oil", unit:"L", quantity:2000, totalCOGS:550000, outflowType:"consumption", reasonCode:"Generator fuel", assetReference:"Generator-100kVA-01", fromWarehouse:"Tank Farm A", status:"approved", approvedBy:"Omar Farooq",
    fifoConsumed:[{ batchNumber:"BATCH-001", receiptDate:"2025-12-15", qtyConsumed:2000, unitCost:275, cogsCost:550000 }] },
  { id:"2", entryNumber:"SO-2026-002", date:"2026-02-25", itemCode:"OIL-001", itemName:"Engine Oil SAE 40", category:"Oil", unit:"L", quantity:30, totalCOGS:25500, outflowType:"issuance", reasonCode:"Maintenance kit", issuedTo:"Workshop Team", fromWarehouse:"Main Warehouse", status:"approved", approvedBy:"Omar Farooq",
    fifoConsumed:[{ batchNumber:"BATCH-002", receiptDate:"2026-01-18", qtyConsumed:30, unitCost:850, cogsCost:25500 }] },
  { id:"3", entryNumber:"SO-2026-003", date:"2026-02-20", itemCode:"OIL-002", itemName:"Hydraulic Oil", category:"Oil", unit:"L", quantity:450, totalCOGS:441000, outflowType:"consumption", reasonCode:"Crane hydraulics", assetReference:"Kalmar-01", fromWarehouse:"Main Warehouse", status:"approved", approvedBy:"Omar Farooq",
    fifoConsumed:[{ batchNumber:"BATCH-006", receiptDate:"2026-01-25", qtyConsumed:450, unitCost:980, cogsCost:441000 }] },
  { id:"4", entryNumber:"SO-2026-004", date:"2026-02-22", itemCode:"LUB-001", itemName:"Gear Oil 80W-90", category:"Oil", unit:"L", quantity:285, totalCOGS:262200, outflowType:"consumption", reasonCode:"Machinery oil", assetReference:"Forklift-01", fromWarehouse:"Workshop Store", status:"approved", approvedBy:"Omar Farooq",
    fifoConsumed:[{ batchNumber:"BATCH-007", receiptDate:"2026-01-30", qtyConsumed:285, unitCost:920, cogsCost:262200 }] },
  { id:"5", entryNumber:"SO-2026-005", date:"2026-02-26", itemCode:"FUEL-002", itemName:"Petrol 95 RON", category:"Oil", unit:"L", quantity:5, totalCOGS:1300, outflowType:"damage", reasonCode:"Contamination", fromWarehouse:"Tank Farm B", status:"pending_approval",
    fifoConsumed:[{ batchNumber:"BATCH-003", receiptDate:"2026-01-10", qtyConsumed:5, unitCost:260, cogsCost:1300 }], notes:"Contaminated during transfer — requires manager approval." },
];

const fmt = (n: number) => "₨" + n.toLocaleString();
function generateEntry(count: number) { return `SO-2026-${String(count + 1).padStart(3, "0")}`; }

function outflowPill(t: OutflowType) {
  const c: Record<OutflowType, string> = {
    consumption:"bg-primary/10 text-primary",
    issuance:"bg-success/10 text-success",
    damage:"bg-destructive/10 text-destructive",
    loss:"bg-destructive/10 text-destructive",
    transfer:"bg-warning/10 text-warning",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${c[t]}`}>{outflowLabels[t]}</span>;
}

function DetailDialog({ entry, onClose }: { entry: StockOutEntry; onClose: () => void }) {
  return (
    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ArrowDownRight className="w-5 h-5 text-muted-foreground"/>{entry.entryNumber}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><p className="text-xs text-muted-foreground mb-0.5">Item</p><p className="font-medium">{entry.itemName}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Type</p>{outflowPill(entry.outflowType)}</div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Quantity</p><p className="font-medium">{entry.quantity.toLocaleString()} {entry.unit}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Total COGS</p><p className="text-lg font-semibold">{fmt(entry.totalCOGS)}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Reason</p><p className="font-medium">{entry.reasonCode}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">From warehouse</p><p className="font-medium">{entry.fromWarehouse}</p></div>
          {entry.assetReference && <div><p className="text-xs text-muted-foreground mb-0.5">Asset</p><p className="font-mono text-xs">{entry.assetReference}</p></div>}
          {entry.issuedTo       && <div><p className="text-xs text-muted-foreground mb-0.5">Issued to</p><p className="font-medium">{entry.issuedTo}</p></div>}
          {entry.toWarehouse    && <div><p className="text-xs text-muted-foreground mb-0.5">To warehouse</p><p className="font-medium">{entry.toWarehouse}</p></div>}
          <div><p className="text-xs text-muted-foreground mb-0.5">Approval</p><StatusBadge status={entry.status}/></div>
          {entry.approvedBy && <div><p className="text-xs text-muted-foreground mb-0.5">Approved by</p><p className="font-medium">{entry.approvedBy}</p></div>}
        </div>
        {entry.notes && (
          <div><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="text-sm p-3 bg-muted/50 rounded-lg">{entry.notes}</p></div>
        )}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1.5"><Layers className="w-4 h-4"/>FIFO consumption detail</p>
          {entry.fifoConsumed.map(f => (
            <div key={f.batchNumber} className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs space-y-1">
              <div className="flex justify-between"><span className="font-mono">{f.batchNumber}</span><span className="text-muted-foreground">Received {f.receiptDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{f.qtyConsumed.toLocaleString()} {entry.unit} × {fmt(f.unitCost)}</span><span className="font-medium">COGS: {fmt(f.cogsCost)}</span></div>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
    </DialogContent>
  );
}

function CreateDialog({ open, onOpenChange, onCreate, existingCount }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  onCreate: (e: StockOutEntry) => void; existingCount: number;
}) {
  const [outflowType, setOutflowType] = useState<OutflowType>("consumption");
  const [itemId,      setItemId]      = useState("");
  const [qty,         setQty]         = useState(0);
  const [reasonCode,  setReasonCode]  = useState("");
  const [assetRef,    setAssetRef]    = useState("");
  const [issuedTo,    setIssuedTo]    = useState("");
  const [fromWh,      setFromWh]      = useState("");
  const [toWh,        setToWh]        = useState("");
  const [notes,       setNotes]       = useState("");
  const [date,        setDate]        = useState(new Date().toISOString().split("T")[0]);

  const selectedItem = inventoryItems.find(i => i.id === itemId);
  const needsApproval = outflowType === "damage" || outflowType === "loss";

  // FIFO preview: consume from oldest batch first
  const fifoPreview: FIFOConsumed[] = [];
  if (selectedItem && qty > 0) {
    let remaining = qty;
    const sorted = [...selectedItem.batches].sort((a,b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime());
    for (const b of sorted) {
      if (remaining <= 0) break;
      const consume = Math.min(remaining, b.remainingQty);
      fifoPreview.push({ batchNumber:b.batchNumber, receiptDate:b.receiptDate, qtyConsumed:consume, unitCost:b.unitCost, cogsCost:consume*b.unitCost });
      remaining -= consume;
    }
  }
  const totalCOGS = fifoPreview.reduce((s,f) => s+f.cogsCost, 0);

  const handleCreate = () => {
    if (!selectedItem || !fromWh || qty <= 0 || !reasonCode) return;
    const entry: StockOutEntry = {
      id: Date.now().toString(),
      entryNumber: generateEntry(existingCount),
      date,
      itemCode: selectedItem.itemCode,
      itemName: selectedItem.name,
      category: selectedItem.category,
      unit: selectedItem.unit,
      quantity: qty,
      totalCOGS,
      outflowType,
      reasonCode,
      assetReference: assetRef || undefined,
      issuedTo:       issuedTo || undefined,
      fromWarehouse:  fromWh,
      toWarehouse:    toWh || undefined,
      status: needsApproval ? "pending_approval" : "approved",
      fifoConsumed: fifoPreview,
      notes: notes || undefined,
    };
    onCreate(entry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Record stock-out</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Outflow type</Label>
              <Select value={outflowType} onValueChange={v => { setOutflowType(v as OutflowType); setReasonCode(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(outflowLabels) as OutflowType[]).map(t => <SelectItem key={t} value={t}>{outflowLabels[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Item</Label>
              <Select value={itemId} onValueChange={setItemId}>
                <SelectTrigger><SelectValue placeholder="Select item"/></SelectTrigger>
                <SelectContent>{inventoryItems.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Quantity {selectedItem && `(${selectedItem.unit})`}</Label>
              <Input type="number" placeholder="0" value={qty||""} onChange={e => setQty(Number(e.target.value))}/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Reason code</Label>
              <Select value={reasonCode} onValueChange={setReasonCode}>
                <SelectTrigger><SelectValue placeholder="Select reason"/></SelectTrigger>
                <SelectContent>{(reasonCodes[outflowType]||[]).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>From warehouse</Label>
              <Select value={fromWh} onValueChange={setFromWh}>
                <SelectTrigger><SelectValue placeholder="Select warehouse"/></SelectTrigger>
                <SelectContent>{warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          {outflowType === "consumption" && (
            <div className="space-y-1.5">
              <Label>Asset reference</Label>
              <Select value={assetRef} onValueChange={setAssetRef}>
                <SelectTrigger><SelectValue placeholder="Select asset (optional)"/></SelectTrigger>
                <SelectContent>{assets.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {outflowType === "issuance" && (
            <div className="space-y-1.5">
              <Label>Issued to</Label>
              <Input placeholder="Name or team" value={issuedTo} onChange={e => setIssuedTo(e.target.value)}/>
            </div>
          )}
          {outflowType === "transfer" && (
            <div className="space-y-1.5">
              <Label>To warehouse</Label>
              <Select value={toWh} onValueChange={setToWh}>
                <SelectTrigger><SelectValue placeholder="Select destination"/></SelectTrigger>
                <SelectContent>{warehouses.filter(w => w !== fromWh).map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {needsApproval && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0"/>
              Damage/loss entries require manager approval before inventory is updated.
            </div>
          )}
          {fifoPreview.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-1.5"><Layers className="w-4 h-4"/>FIFO consumption preview</p>
              {fifoPreview.map(f => (
                <div key={f.batchNumber} className="p-2 bg-primary/5 border border-primary/20 rounded text-xs flex justify-between">
                  <span><span className="font-mono">{f.batchNumber}</span> · {f.receiptDate} · {f.qtyConsumed.toLocaleString()} {selectedItem?.unit} @ {fmt(f.unitCost)}</span>
                  <span className="font-medium">COGS: {fmt(f.cogsCost)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-medium p-2 bg-muted/50 rounded">
                <span>Total COGS</span><span>{fmt(totalCOGS)}</span>
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea rows={2} placeholder="Any additional notes..." value={notes} onChange={e => setNotes(e.target.value)}/>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!itemId || !fromWh || qty <= 0 || !reasonCode}>Record stock-out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function StockOut() {
  const [entries,       setEntries]       = useState<StockOutEntry[]>(initialEntries);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [activeTab,     setActiveTab]     = useState("all");
  const [isCreateOpen,  setIsCreateOpen]  = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StockOutEntry | null>(null);

  const addEntry = (e: StockOutEntry) => setEntries(prev => [e, ...prev]);

  const filtered = entries.filter(e => {
    const matchSearch = e.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || e.entryNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab    = activeTab === "all" || e.outflowType === activeTab || e.status === activeTab;
    return matchSearch && matchTab;
  });

  const totalCOGS      = entries.reduce((s,e) => s+e.totalCOGS, 0);
  const pendingCount   = entries.filter(e => e.status === "pending_approval").length;
  const thisMonthCount = entries.filter(e => e.date.startsWith("2026-02")).length;

  const metrics = [
    { label:"Total stock-outs",    value:entries.length,  sub:"all time",           icon:<ArrowDownRight className="w-5 h-5 text-primary" />,    accent:"bg-primary/10"     },
    { label:"Total COGS",          value:fmt(totalCOGS),  sub:"recorded",           icon:<Package className="w-5 h-5 text-success" />,           accent:"bg-success/10"     },
    { label:"This month",          value:thisMonthCount,  sub:"February 2026",      icon:<Calendar className="w-5 h-5 text-primary" />,          accent:"bg-primary/10"     },
    { label:"Pending approval",    value:pendingCount,    sub:"adjustments",        icon:<AlertTriangle className="w-5 h-5 text-warning" />,      accent:"bg-warning/10"     },
  ];

  const columns = [
    { key:"entryNumber", header:"Entry #", render:(e: StockOutEntry) => <span className="font-mono text-xs font-medium">{e.entryNumber}</span> },
    { key:"date", header:"Date", render:(e: StockOutEntry) => (
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm"><Calendar className="w-3.5 h-3.5"/>{e.date}</div>
    )},
    { key:"itemName", header:"Item", render:(e: StockOutEntry) => (
      <div><p className="font-medium text-sm">{e.itemName}</p><p className="text-xs text-muted-foreground">{e.category}</p></div>
    )},
    { key:"quantity", header:"Quantity", render:(e: StockOutEntry) => <span className="font-medium">{e.quantity.toLocaleString()} {e.unit}</span> },
    { key:"totalCOGS", header:"COGS", render:(e: StockOutEntry) => <span className="font-medium">{fmt(e.totalCOGS)}</span> },
    { key:"outflowType", header:"Type", render:(e: StockOutEntry) => outflowPill(e.outflowType) },
    { key:"reasonCode", header:"Reason", render:(e: StockOutEntry) => <span className="text-sm text-muted-foreground">{e.reasonCode}</span> },
    { key:"assetReference", header:"Asset", render:(e: StockOutEntry) => e.assetReference ? <span className="font-mono text-xs">{e.assetReference}</span> : <span className="text-muted-foreground text-xs">—</span> },
    { key:"fromWarehouse", header:"Warehouse", render:(e: StockOutEntry) => <span className="text-sm text-muted-foreground">{e.fromWarehouse}</span> },
    { key:"status", header:"Status", render:(e: StockOutEntry) => <StatusBadge status={e.status}/> },
    { key:"actions", header:"Actions", render:(e: StockOutEntry) => (
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedEntry(e)}><Eye className="w-4 h-4"/></Button>
    )},
  ];

  return (
    <AppLayout
      title="Stock-out management"
      subtitle="FIFO-enforced issuances · Consumptions · Adjustments · COGS calculation"
      actions={<Button onClick={() => setIsCreateOpen(true)}><Plus className="w-4 h-4 mr-2"/>Record stock-out</Button>}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map(m => (
          <Card key={m.label}><CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-muted-foreground mb-1">{m.label}</p><p className="text-xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p></div>
              <div className={`w-9 h-9 rounded-lg ${m.accent} flex items-center justify-center`}>{m.icon}</div>
            </div>
          </CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-0 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="consumption">Consumption</TabsTrigger>
                <TabsTrigger value="issuance">Issuance</TabsTrigger>
                <TabsTrigger value="damage">Damage / loss</TabsTrigger>
                <TabsTrigger value="pending_approval">Pending approval</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <Input placeholder="Search entries..." className="pl-9 w-56" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
              </div>
              <Button variant="outline" size="icon"><Filter className="w-4 h-4"/></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <DataTable columns={columns} data={filtered} selectable/>
        </CardContent>
      </Card>
      <CreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreate={addEntry} existingCount={entries.length}/>
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={v => !v && setSelectedEntry(null)}>
          <DetailDialog entry={selectedEntry} onClose={() => setSelectedEntry(null)}/>
        </Dialog>
      )}
    </AppLayout>
  );
}