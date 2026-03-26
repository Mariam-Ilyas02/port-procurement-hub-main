import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Package, Layers, Banknote, AlertTriangle, Eye, MapPin, TrendingUp, TrendingDown } from "lucide-react";

export type StockLevel = "low" | "medium" | "high";

export interface FIFOBatch {
  batchNumber: string;
  receiptDate: string;
  supplier: string;
  quantity: number;
  remainingQty: number;
  unitCost: number;
  poReference?: string;
}

export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  subcategory: string;
  totalQuantity: number;
  unit: string;
  weightedAvgCost: number;
  totalValue: number;
  reorderLevel: number;
  reorderSuggestion: number;
  warehouse: string;
  stockLevel: StockLevel;
  batches: FIFOBatch[];
  lastMovement: string;
}

export const inventoryItems: InventoryItem[] = [
  { id:"1", itemCode:"FUEL-001", name:"Diesel Fuel", category:"Oil", subcategory:"Diesel", totalQuantity:15000, unit:"L", weightedAvgCost:280, totalValue:4200000, reorderLevel:5000, reorderSuggestion:10000, warehouse:"Tank Farm A", stockLevel:"high", lastMovement:"2026-02-28", batches:[
    { batchNumber:"BATCH-001", receiptDate:"2025-12-15", supplier:"Gulf Petroleum Ltd", quantity:10000, remainingQty:7000, unitCost:275, poReference:"PO-2025-001" },
    { batchNumber:"BATCH-008", receiptDate:"2026-01-28", supplier:"Gulf Petroleum Ltd", quantity:8000,  remainingQty:8000, unitCost:285, poReference:"PO-2025-008" },
  ]},
  { id:"2", itemCode:"FUEL-002", name:"Petrol 95 RON", category:"Oil", subcategory:"Petrol", totalQuantity:8000, unit:"L", weightedAvgCost:260, totalValue:2080000, reorderLevel:3000, reorderSuggestion:6000, warehouse:"Tank Farm B", stockLevel:"high", lastMovement:"2026-02-27", batches:[
    { batchNumber:"BATCH-003", receiptDate:"2026-01-10", supplier:"Shell Oil Company", quantity:8000, remainingQty:8000, unitCost:260, poReference:"PO-2025-003" },
  ]},
  { id:"3", itemCode:"OIL-001", name:"Engine Oil SAE 40", category:"Oil", subcategory:"Lubricants", totalQuantity:200, unit:"L", weightedAvgCost:850, totalValue:170000, reorderLevel:100, reorderSuggestion:300, warehouse:"Main Warehouse", stockLevel:"medium", lastMovement:"2026-02-25", batches:[
    { batchNumber:"BATCH-002", receiptDate:"2026-01-18", supplier:"Shell Oil Company", quantity:200, remainingQty:200, unitCost:850, poReference:"PO-2025-002" },
  ]},
  { id:"4", itemCode:"OIL-002", name:"Hydraulic Oil", category:"Oil", subcategory:"Lubricants", totalQuantity:50, unit:"L", weightedAvgCost:980, totalValue:49000, reorderLevel:100, reorderSuggestion:250, warehouse:"Main Warehouse", stockLevel:"low", lastMovement:"2026-02-20", batches:[
    { batchNumber:"BATCH-006", receiptDate:"2026-01-25", supplier:"Total Energies", quantity:500, remainingQty:50, unitCost:980, poReference:"PO-2025-005" },
  ]},
  { id:"5", itemCode:"LUB-001", name:"Gear Oil 80W-90", category:"Oil", subcategory:"Lubricants", totalQuantity:15, unit:"L", weightedAvgCost:920, totalValue:13800, reorderLevel:50, reorderSuggestion:150, warehouse:"Workshop Store", stockLevel:"low", lastMovement:"2026-02-18", batches:[
    { batchNumber:"BATCH-007", receiptDate:"2026-01-30", supplier:"Pak Lubricants", quantity:300, remainingQty:15, unitCost:920 },
  ]},
  { id:"6", itemCode:"SPR-001", name:"Oil Filter (Standard)", category:"Spare Parts", subcategory:"Filters", totalQuantity:25, unit:"Pcs", weightedAvgCost:450, totalValue:11250, reorderLevel:10, reorderSuggestion:30, warehouse:"Workshop Store", stockLevel:"high", lastMovement:"2026-02-22", batches:[
    { batchNumber:"BATCH-009", receiptDate:"2026-02-01", supplier:"Pak Lubricants", quantity:25, remainingQty:25, unitCost:450 },
  ]},
  { id:"7", itemCode:"SAF-001", name:"Safety Helmets", category:"Consumables", subcategory:"Safety Gear", totalQuantity:42, unit:"Pcs", weightedAvgCost:450, totalValue:18900, reorderLevel:20, reorderSuggestion:50, warehouse:"Main Warehouse", stockLevel:"high", lastMovement:"2026-02-26", batches:[
    { batchNumber:"BATCH-004", receiptDate:"2026-01-26", supplier:"Safety First Inc", quantity:42, remainingQty:42, unitCost:450 },
  ]},
];

const fmt    = (n: number) => "₨" + n.toLocaleString();
const fmtQty = (n: number, unit: string) => `${n.toLocaleString()} ${unit}`;

function stockPercent(item: InventoryItem) {
  return Math.min(Math.round((item.totalQuantity / (item.reorderLevel * 3)) * 100), 100);
}

function BatchDetailDialog({ item, onClose }: { item: InventoryItem; onClose: () => void }) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-muted-foreground" />
          FIFO batches — {item.name}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total stock",       value: fmtQty(item.totalQuantity, item.unit) },
            { label: "Avg unit cost",     value: `${fmt(item.weightedAvgCost)}/${item.unit}` },
            { label: "Total value",       value: fmt(item.totalValue) },
          ].map(c => (
            <div key={c.label} className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
              <p className="font-semibold text-sm">{c.value}</p>
            </div>
          ))}
        </div>
        {item.stockLevel === "low" && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Below reorder level</p>
              <p className="text-xs mt-0.5">Current: {fmtQty(item.totalQuantity, item.unit)} · Reorder at: {fmtQty(item.reorderLevel, item.unit)} · Suggested order: {fmtQty(item.reorderSuggestion, item.unit)}</p>
            </div>
          </div>
        )}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4" /> FIFO layers (oldest issued first)
          </p>
          <div className="space-y-2">
            {[...item.batches]
              .sort((a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime())
              .map((batch, i) => (
                <div key={batch.batchNumber} className={`p-3 rounded-lg border text-sm ${i === 0 ? "border-primary/30 bg-primary/5" : "border-muted"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium">{batch.batchNumber}</span>
                      {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">Next to issue</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">{batch.receiptDate}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div><p className="text-muted-foreground">Supplier</p><p className="font-medium">{batch.supplier}</p></div>
                    <div><p className="text-muted-foreground">Original qty</p><p className="font-medium">{batch.quantity.toLocaleString()} {item.unit}</p></div>
                    <div><p className="text-muted-foreground">Remaining</p><p className="font-medium">{batch.remainingQty.toLocaleString()} {item.unit}</p></div>
                    <div><p className="text-muted-foreground">Unit cost</p><p className="font-medium">{fmt(batch.unitCost)}</p></div>
                  </div>
                  {batch.poReference && (
                    <p className="text-xs text-muted-foreground mt-2">PO: <span className="font-mono">{batch.poReference}</span></p>
                  )}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Consumed</span>
                      <span>{Math.round(((batch.quantity - batch.remainingQty) / batch.quantity) * 100)}%</span>
                    </div>
                    <Progress value={Math.round(((batch.quantity - batch.remainingQty) / batch.quantity) * 100)} className="h-1.5" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function Inventory() {
  const [searchQuery,    setSearchQuery]    = useState("");
  const [activeTab,      setActiveTab]      = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem,   setSelectedItem]   = useState<InventoryItem | null>(null);

  const filtered = inventoryItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab    = activeTab === "all" || (activeTab === "low" && item.stockLevel === "low") || item.category.toLowerCase() === activeTab;
    const matchCat    = categoryFilter === "all" || item.category === categoryFilter;
    return matchSearch && matchTab && matchCat;
  });

  const totalValue    = inventoryItems.reduce((s, i) => s + i.totalValue, 0);
  const lowStockCount = inventoryItems.filter((i) => i.stockLevel === "low").length;
  const totalBatches  = inventoryItems.reduce((s, i) => s + i.batches.length, 0);

  const metrics = [
    { label:"Total items",       value:inventoryItems.length, sub:"unique SKUs",         icon:<Package className="w-5 h-5 text-primary" />,         accent:"bg-primary/10"     },
    { label:"Total value",       value:fmt(totalValue),       sub:"FIFO valuation",      icon:<Banknote className="w-5 h-5 text-success" />,        accent:"bg-success/10"     },
    { label:"Active batches",    value:totalBatches,          sub:"FIFO cost layers",    icon:<Layers className="w-5 h-5 text-primary" />,          accent:"bg-primary/10"     },
    { label:"Low stock alerts",  value:lowStockCount,         sub:"below reorder level", icon:<AlertTriangle className="w-5 h-5 text-destructive" />,accent:"bg-destructive/10" },
  ];

  const columns = [
    { key:"itemCode", header:"Item code", render:(item: InventoryItem) => <span className="font-mono text-xs">{item.itemCode}</span> },
    { key:"name", header:"Item name", render:(item: InventoryItem) => (
      <div><p className="font-medium text-sm">{item.name}</p><p className="text-xs text-muted-foreground">{item.category} › {item.subcategory}</p></div>
    )},
    { key:"totalQuantity", header:"Quantity", render:(item: InventoryItem) => <span className="font-medium">{fmtQty(item.totalQuantity, item.unit)}</span> },
    { key:"weightedAvgCost", header:"Avg cost", render:(item: InventoryItem) => <span className="text-sm">{fmt(item.weightedAvgCost)}</span> },
    { key:"totalValue", header:"Total value", render:(item: InventoryItem) => <span className="font-medium">{fmt(item.totalValue)}</span> },
    { key:"batches", header:"FIFO batches", render:(item: InventoryItem) => <span className="text-sm text-muted-foreground">{item.batches.length} batch{item.batches.length !== 1?"es":""}</span> },
    { key:"reorderLevel", header:"Stock level", render:(item: InventoryItem) => (
      <div className="w-28 space-y-1">
        <Progress value={stockPercent(item)} className="h-1.5" />
        <div className="flex items-center justify-between">
          <StatusBadge status={item.stockLevel} />
          {item.stockLevel === "low" && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
        </div>
      </div>
    )},
    { key:"warehouse", header:"Location", render:(item: InventoryItem) => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="w-3 h-3" />{item.warehouse}</div>
    )},
    { key:"actions", header:"Actions", render:(item: InventoryItem) => (
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedItem(item)}><Eye className="w-4 h-4" /></Button>
    )},
  ];

  return (
    <AppLayout title="Inventory management" subtitle="FIFO valuation · Batch/lot tracking · Multiple warehouses · Low-stock alerts">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map((m) => (
          <Card key={m.label}><CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <p className="text-xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
              </div>
              <div className={`w-9 h-9 rounded-lg ${m.accent} flex items-center justify-center`}>{m.icon}</div>
            </div>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2 pt-4 px-4"><p className="text-sm font-medium">Stock movement this month</p></CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-success" /></div>
                <div><p className="text-base font-semibold">₨45,200</p><p className="text-xs text-muted-foreground">Stock in</p></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center"><TrendingDown className="w-4 h-4 text-destructive" /></div>
                <div><p className="text-base font-semibold">₨32,800</p><p className="text-xs text-muted-foreground">Stock out</p></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-4 px-4"><p className="text-sm font-medium">Fuel tanks</p></CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {inventoryItems.filter((i) => i.subcategory === "Diesel" || i.subcategory === "Petrol").map((i) => (
              <div key={i.id} className="space-y-1">
                <div className="flex justify-between text-xs"><span>{i.name}</span><span className="font-medium">{fmtQty(i.totalQuantity, i.unit)}</span></div>
                <Progress value={stockPercent(i)} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-4 px-4"><p className="text-sm font-medium">FIFO batch summary</p></CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2 text-sm">
              {[
                { label:"Active batches",      value:totalBatches           },
                { label:"Oldest batch",        value:"2025-12-15"           },
                { label:"Newest batch",        value:"2026-02-01"           },
                { label:"Items below reorder", value:lowStockCount, alert:lowStockCount>0 },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className={`font-medium ${r.alert?"text-destructive":""}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {lowStockCount > 0 && (
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-destructive flex items-center gap-1.5 mb-3">
              <AlertTriangle className="w-4 h-4" /> Low stock alerts — reorder recommended
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {inventoryItems.filter((i) => i.stockLevel === "low").map((i) => (
                <div key={i.id} className="flex items-center justify-between p-2 bg-background rounded border text-sm">
                  <div><p className="font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.warehouse}</p></div>
                  <div className="text-right">
                    <p className="font-medium text-destructive">{fmtQty(i.totalQuantity, i.unit)}</p>
                    <p className="text-xs text-muted-foreground">Suggest: {fmtQty(i.reorderSuggestion, i.unit)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-0 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All items</TabsTrigger>
                <TabsTrigger value="low">Low stock</TabsTrigger>
                <TabsTrigger value="oil">Oil</TabsTrigger>
                <TabsTrigger value="spare parts">Spare parts</TabsTrigger>
                <TabsTrigger value="consumables">Consumables</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search items..." className="pl-9 w-56" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="Oil">Oil</SelectItem>
                  <SelectItem value="Spare Parts">Spare parts</SelectItem>
                  <SelectItem value="Consumables">Consumables</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <DataTable columns={columns} data={filtered} selectable />
        </CardContent>
      </Card>

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(v) => !v && setSelectedItem(null)}>
          <BatchDetailDialog item={selectedItem} onClose={() => setSelectedItem(null)} />
        </Dialog>
      )}
    </AppLayout>
  );
}