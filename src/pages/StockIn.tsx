import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Filter, Package, Layers, CheckCircle, Calendar, Eye } from "lucide-react";

type StockInTrigger = "grn" | "direct" | "return";
type QualityFlag = "passed" | "failed" | "not_checked";

interface StockInEntry {
  id: string;
  entryNumber: string;
  date: string;
  itemCode: string;
  itemName: string;
  category: string;
  subcategory: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  batchNumber: string;
  supplier: string;
  warehouse: string;
  trigger: StockInTrigger;
  poReference?: string;
  grnReference?: string;
  qualityFlag: QualityFlag;
  notes?: string;
  fifoLayerCreated: boolean;
}

const triggerLabels: Record<StockInTrigger, string> = {
  grn:    "Goods receipt (PO)",
  direct: "Direct purchase",
  return: "Return to stock",
};

const warehouses = ["Main Warehouse", "Tank Farm A", "Tank Farm B", "Workshop Store"];

const catalogItems = [
  { itemCode:"FUEL-001", name:"Diesel Fuel",       category:"Oil",         subcategory:"Diesel",     unit:"L"   },
  { itemCode:"FUEL-002", name:"Petrol 95 RON",      category:"Oil",         subcategory:"Petrol",     unit:"L"   },
  { itemCode:"OIL-001",  name:"Engine Oil SAE 40",  category:"Oil",         subcategory:"Lubricants", unit:"L"   },
  { itemCode:"OIL-002",  name:"Hydraulic Oil",      category:"Oil",         subcategory:"Lubricants", unit:"L"   },
  { itemCode:"LUB-001",  name:"Gear Oil 80W-90",    category:"Oil",         subcategory:"Lubricants", unit:"L"   },
  { itemCode:"SPR-001",  name:"Oil Filter (Standard)", category:"Spare Parts", subcategory:"Filters", unit:"Pcs" },
  { itemCode:"SAF-001",  name:"Safety Helmets",     category:"Consumables", subcategory:"Safety Gear",unit:"Pcs" },
];

const initialEntries: StockInEntry[] = [
  { id:"1", entryNumber:"SI-2026-001", date:"2026-01-28", itemCode:"FUEL-001", itemName:"Diesel Fuel", category:"Oil", subcategory:"Diesel", quantity:8000, unit:"L", unitCost:285, totalCost:2280000, batchNumber:"BATCH-008", supplier:"Gulf Petroleum Ltd", warehouse:"Tank Farm A", trigger:"grn", poReference:"PO-2025-008", grnReference:"GRN-2025-001", qualityFlag:"passed", fifoLayerCreated:true },
  { id:"2", entryNumber:"SI-2026-002", date:"2026-01-18", itemCode:"OIL-001",  itemName:"Engine Oil SAE 40", category:"Oil", subcategory:"Lubricants", quantity:200, unit:"L", unitCost:850, totalCost:170000, batchNumber:"BATCH-002", supplier:"Shell Oil Company", warehouse:"Main Warehouse", trigger:"grn", poReference:"PO-2025-002", grnReference:"GRN-2025-002", qualityFlag:"passed", fifoLayerCreated:true },
  { id:"3", entryNumber:"SI-2026-003", date:"2026-01-30", itemCode:"LUB-001",  itemName:"Gear Oil 80W-90", category:"Oil", subcategory:"Lubricants", quantity:300, unit:"L", unitCost:920, totalCost:276000, batchNumber:"BATCH-007", supplier:"Pak Lubricants", warehouse:"Workshop Store", trigger:"grn", poReference:"PO-2025-007", grnReference:"GRN-2025-003", qualityFlag:"passed", fifoLayerCreated:true },
  { id:"4", entryNumber:"SI-2026-004", date:"2026-02-01", itemCode:"SPR-001",  itemName:"Oil Filter (Standard)", category:"Spare Parts", subcategory:"Filters", quantity:25, unit:"Pcs", unitCost:450, totalCost:11250, batchNumber:"BATCH-009", supplier:"Pak Lubricants", warehouse:"Workshop Store", trigger:"direct", qualityFlag:"not_checked", fifoLayerCreated:true },
  { id:"5", entryNumber:"SI-2026-005", date:"2026-02-05", itemCode:"OIL-002",  itemName:"Hydraulic Oil", category:"Oil", subcategory:"Lubricants", quantity:10, unit:"L", unitCost:980, totalCost:9800, batchNumber:"BATCH-010", supplier:"Total Energies", warehouse:"Main Warehouse", trigger:"return", qualityFlag:"passed", notes:"Unused stock returned from Generator-100kVA-01", fifoLayerCreated:true },
];

const fmt = (n: number) => "₨" + n.toLocaleString();

function generateBatch() { return "BATCH-" + Date.now().toString().slice(-6); }
function generateEntry(count: number) { return `SI-2026-${String(count + 1).padStart(3, "0")}`; }

function triggerPill(t: StockInTrigger) {
  const c = { grn:"bg-primary/10 text-primary", direct:"bg-success/10 text-success", return:"bg-warning/10 text-warning" };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${c[t]}`}>{triggerLabels[t]}</span>;
}

function qualityPill(q: QualityFlag) {
  if (q === "passed")      return <span className="text-xs text-success flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/>Passed</span>;
  if (q === "failed")      return <span className="text-xs text-destructive">Failed</span>;
  return <span className="text-xs text-muted-foreground">Not checked</span>;
}

function DetailDialog({ entry, onClose }: { entry: StockInEntry; onClose: () => void }) {
  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-muted-foreground" />{entry.entryNumber}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><p className="text-xs text-muted-foreground mb-0.5">Item</p><p className="font-medium">{entry.itemName}</p><p className="text-xs text-muted-foreground">{entry.itemCode}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Trigger</p>{triggerPill(entry.trigger)}</div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Quantity</p><p className="font-medium">{entry.quantity.toLocaleString()} {entry.unit}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Unit cost</p><p className="font-medium">{fmt(entry.unitCost)}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Total cost</p><p className="text-lg font-semibold">{fmt(entry.totalCost)}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Batch created</p><p className="font-mono text-xs">{entry.batchNumber}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Supplier</p><p className="font-medium">{entry.supplier}</p></div>
          <div><p className="text-xs text-muted-foreground mb-0.5">Warehouse</p><p className="font-medium">{entry.warehouse}</p></div>
          {entry.poReference  && <div><p className="text-xs text-muted-foreground mb-0.5">PO reference</p><p className="font-mono text-xs">{entry.poReference}</p></div>}
          {entry.grnReference && <div><p className="text-xs text-muted-foreground mb-0.5">GRN reference</p><p className="font-mono text-xs">{entry.grnReference}</p></div>}
          <div><p className="text-xs text-muted-foreground mb-0.5">Quality check</p>{qualityPill(entry.qualityFlag)}</div>
          <div><p className="text-xs text-muted-foreground mb-0.5">FIFO layer</p><p className="text-success text-xs flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/>Created</p></div>
        </div>
        {entry.notes && (
          <div><p className="text-xs text-muted-foreground mb-1">Notes</p><p className="text-sm p-3 bg-muted/50 rounded-lg">{entry.notes}</p></div>
        )}
        <div className="p-3 bg-success/5 border border-success/20 rounded-lg text-xs text-success">
          <p className="font-medium mb-1 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/>FIFO layer created</p>
          <p>Batch <span className="font-mono">{entry.batchNumber}</span> · {entry.quantity.toLocaleString()} {entry.unit} @ {fmt(entry.unitCost)} · {entry.date}</p>
          <p className="text-muted-foreground mt-0.5">Future issuances will consume from the oldest batch first.</p>
        </div>
      </div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
    </DialogContent>
  );
}

function CreateDialog({ open, onOpenChange, onCreate, existingCount }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  onCreate: (e: StockInEntry) => void; existingCount: number;
}) {
  const [trigger,    setTrigger]    = useState<StockInTrigger>("grn");
  const [itemCode,   setItemCode]   = useState("");
  const [qty,        setQty]        = useState(0);
  const [unitCost,   setUnitCost]   = useState(0);
  const [supplier,   setSupplier]   = useState("");
  const [warehouse,  setWarehouse]  = useState("");
  const [poRef,      setPoRef]      = useState("");
  const [grnRef,     setGrnRef]     = useState("");
  const [qualityOk,  setQualityOk]  = useState(false);
  const [doQuality,  setDoQuality]  = useState(false);
  const [notes,      setNotes]      = useState("");
  const [date,       setDate]       = useState(new Date().toISOString().split("T")[0]);

  const selectedItem = catalogItems.find(i => i.itemCode === itemCode);
  const total = qty * unitCost;

  const handleCreate = () => {
    if (!selectedItem || !supplier || !warehouse || qty <= 0 || unitCost <= 0) return;
    const entry: StockInEntry = {
      id: Date.now().toString(),
      entryNumber: generateEntry(existingCount),
      date,
      itemCode: selectedItem.itemCode,
      itemName: selectedItem.name,
      category: selectedItem.category,
      subcategory: selectedItem.subcategory,
      quantity: qty,
      unit: selectedItem.unit,
      unitCost,
      totalCost: total,
      batchNumber: generateBatch(),
      supplier,
      warehouse,
      trigger,
      poReference:  poRef  || undefined,
      grnReference: grnRef || undefined,
      qualityFlag: !doQuality ? "not_checked" : qualityOk ? "passed" : "failed",
      notes: notes || undefined,
      fifoLayerCreated: true,
    };
    onCreate(entry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Record stock-in</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Trigger</Label>
              <Select value={trigger} onValueChange={(v) => setTrigger(v as StockInTrigger)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="grn">Goods receipt (PO)</SelectItem>
                  <SelectItem value="direct">Direct purchase</SelectItem>
                  <SelectItem value="return">Return to stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Item</Label>
            <Select value={itemCode} onValueChange={setItemCode}>
              <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
              <SelectContent>
                {catalogItems.map(i => <SelectItem key={i.itemCode} value={i.itemCode}>{i.name} <span className="text-muted-foreground text-xs ml-1">· {i.itemCode}</span></SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Quantity {selectedItem && `(${selectedItem.unit})`}</Label>
              <Input type="number" placeholder="0" value={qty || ""} onChange={e => setQty(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Unit cost (₨)</Label>
              <Input type="number" placeholder="0.00" value={unitCost || ""} onChange={e => setUnitCost(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Total cost</Label>
              <Input value={total > 0 ? fmt(total) : "—"} disabled className="bg-muted" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Supplier</Label>
              <Input placeholder="Supplier name" value={supplier} onChange={e => setSupplier(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Warehouse</Label>
              <Select value={warehouse} onValueChange={setWarehouse}>
                <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                <SelectContent>{warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          {trigger === "grn" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>PO reference</Label><Input placeholder="PO-XXXX" value={poRef} onChange={e => setPoRef(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>GRN reference</Label><Input placeholder="GRN-XXXX" value={grnRef} onChange={e => setGrnRef(e.target.value)} /></div>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="doQuality" checked={doQuality} onCheckedChange={v => setDoQuality(!!v)} />
              <Label htmlFor="doQuality" className="cursor-pointer">Perform quality check</Label>
            </div>
            {doQuality && (
              <div className="flex items-center gap-2 pl-6">
                <Checkbox id="qualityOk" checked={qualityOk} onCheckedChange={v => setQualityOk(!!v)} />
                <Label htmlFor="qualityOk" className="cursor-pointer text-sm">Quality inspection passed</Label>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Textarea rows={2} placeholder="Any additional notes..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          {selectedItem && qty > 0 && unitCost > 0 && (
            <div className="p-3 bg-success/5 border border-success/20 rounded-lg text-xs text-success">
              <p className="font-medium flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/>New FIFO layer will be created</p>
              <p className="mt-0.5 text-muted-foreground">{qty.toLocaleString()} {selectedItem.unit} of {selectedItem.name} @ {fmt(unitCost)}/{selectedItem.unit} · {date}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!itemCode || !supplier || !warehouse || qty <= 0 || unitCost <= 0}>Record stock-in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function StockIn() {
  const [entries,       setEntries]       = useState<StockInEntry[]>(initialEntries);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [activeTab,     setActiveTab]     = useState("all");
  const [isCreateOpen,  setIsCreateOpen]  = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StockInEntry | null>(null);

  const addEntry = (e: StockInEntry) => setEntries(prev => [e, ...prev]);

  const filtered = entries.filter(e => {
    const matchSearch = e.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || e.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) || (e.poReference?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchTab    = activeTab === "all" || e.trigger === activeTab;
    return matchSearch && matchTab;
  });

  const totalValue  = entries.reduce((s, e) => s + e.totalCost, 0);
  const thisMonth   = entries.filter(e => e.date.startsWith("2026-02")).length;
  const grnCount    = entries.filter(e => e.trigger === "grn").length;
  const batchCount  = entries.filter(e => e.fifoLayerCreated).length;

  const metrics = [
    { label:"Total stock-ins",    value:entries.length, sub:"all time",          icon:<Package className="w-5 h-5 text-primary" />,  accent:"bg-primary/10" },
    { label:"Total value",        value:fmt(totalValue), sub:"recorded",         icon:<Package className="w-5 h-5 text-success" />,  accent:"bg-success/10" },
    { label:"This month",         value:thisMonth,       sub:"February 2026",    icon:<Calendar className="w-5 h-5 text-primary" />, accent:"bg-primary/10" },
    { label:"FIFO layers created",value:batchCount,      sub:"batches active",   icon:<Layers className="w-5 h-5 text-primary" />,   accent:"bg-primary/10" },
  ];

  const columns = [
    { key:"entryNumber", header:"Entry #", render:(e: StockInEntry) => <span className="font-mono text-xs font-medium">{e.entryNumber}</span> },
    { key:"date", header:"Date", render:(e: StockInEntry) => (
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm"><Calendar className="w-3.5 h-3.5"/>{e.date}</div>
    )},
    { key:"itemName", header:"Item", render:(e: StockInEntry) => (
      <div><p className="font-medium text-sm">{e.itemName}</p><p className="text-xs text-muted-foreground font-mono">{e.itemCode}</p></div>
    )},
    { key:"quantity", header:"Quantity", render:(e: StockInEntry) => <span className="font-medium">{e.quantity.toLocaleString()} {e.unit}</span> },
    { key:"unitCost", header:"Unit cost", render:(e: StockInEntry) => <span className="text-sm">{fmt(e.unitCost)}</span> },
    { key:"totalCost", header:"Total cost", render:(e: StockInEntry) => <span className="font-medium">{fmt(e.totalCost)}</span> },
    { key:"batchNumber", header:"Batch", render:(e: StockInEntry) => <span className="font-mono text-xs">{e.batchNumber}</span> },
    { key:"warehouse", header:"Warehouse", render:(e: StockInEntry) => <span className="text-sm text-muted-foreground">{e.warehouse}</span> },
    { key:"trigger", header:"Trigger", render:(e: StockInEntry) => triggerPill(e.trigger) },
    { key:"qualityFlag", header:"Quality", render:(e: StockInEntry) => qualityPill(e.qualityFlag) },
    { key:"actions", header:"Actions", render:(e: StockInEntry) => (
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedEntry(e)}><Eye className="w-4 h-4"/></Button>
    )},
  ];

  return (
    <AppLayout
      title="Stock-in management"
      subtitle="Record goods receipt, direct purchases, and returns · Auto FIFO layer creation"
      actions={<Button onClick={() => setIsCreateOpen(true)}><Plus className="w-4 h-4 mr-2"/>Record stock-in</Button>}
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
                <TabsTrigger value="grn">Goods receipt</TabsTrigger>
                <TabsTrigger value="direct">Direct purchase</TabsTrigger>
                <TabsTrigger value="return">Returns</TabsTrigger>
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