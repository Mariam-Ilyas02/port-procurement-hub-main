import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, Search, Fuel, Droplets, Calendar, Eye, 
  BookOpen, FileSpreadsheet, TrendingUp, AlertTriangle
} from "lucide-react";

interface ConsumptionEntry {
  id: string;
  logNumber: string;
  type: "diesel" | "lubricant" | "other";
  item: string;
  asset: string;
  quantity: number;
  unit: string;
  recordedBy: string;
  department: string;
  date: string;
  source: "logbook" | "system";
  reconciled: boolean;
}

const consumptionData: ConsumptionEntry[] = [
  { id: "1", logNumber: "LOG-2025-001", type: "diesel", item: "Diesel Fuel", asset: "Kalmar RT-240", quantity: 150, unit: "L", recordedBy: "Ahmed Khan", department: "Admin", date: "2025-01-28", source: "system", reconciled: true },
  { id: "2", logNumber: "LOG-2025-002", type: "diesel", item: "Diesel Fuel", asset: "Generator G-01", quantity: 80, unit: "L", recordedBy: "Ahmed Khan", department: "Admin", date: "2025-01-28", source: "logbook", reconciled: false },
  { id: "3", logNumber: "LOG-2025-003", type: "lubricant", item: "Engine Oil SAE 40", asset: "Kalmar RT-240", quantity: 5, unit: "L", recordedBy: "Mikaal Ahmed", department: "Workshop", date: "2025-01-27", source: "logbook", reconciled: false },
  { id: "4", logNumber: "LOG-2025-004", type: "lubricant", item: "Hydraulic Oil", asset: "Crane C-01", quantity: 10, unit: "L", recordedBy: "Mikaal Ahmed", department: "Workshop", date: "2025-01-27", source: "system", reconciled: true },
  { id: "5", logNumber: "LOG-2025-005", type: "diesel", item: "Diesel Fuel", asset: "Forklift F-03", quantity: 45, unit: "L", recordedBy: "Sarah Ali", department: "Admin", date: "2025-01-26", source: "logbook", reconciled: true },
];

// Asset register for selection
const assetRegister = [
  { id: "kalmar-240", name: "Kalmar RT-240", type: "Reach Stacker", fuelType: "diesel" },
  { id: "kalmar-250", name: "Kalmar RT-250", type: "Reach Stacker", fuelType: "diesel" },
  { id: "gen-01", name: "Generator G-01", type: "Generator", fuelType: "diesel" },
  { id: "gen-02", name: "Generator G-02", type: "Generator", fuelType: "diesel" },
  { id: "crane-01", name: "Crane C-01", type: "Mobile Crane", fuelType: "diesel" },
  { id: "forklift-03", name: "Forklift F-03", type: "Forklift", fuelType: "diesel" },
];

export default function ConsumptionLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [consumptionType, setConsumptionType] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all");

  const columns = [
    {
      key: "logNumber",
      header: "Log #",
      render: (item: ConsumptionEntry) => (
        <div className="flex items-center gap-2">
          {item.type === "diesel" ? (
            <Fuel className="w-4 h-4 text-warning" />
          ) : (
            <Droplets className="w-4 h-4 text-info" />
          )}
          <span className="font-medium">{item.logNumber}</span>
        </div>
      ),
    },
    { key: "item", header: "Item" },
    { key: "asset", header: "Asset" },
    {
      key: "quantity",
      header: "Quantity",
      render: (item: ConsumptionEntry) => (
        <span>{item.quantity} {item.unit}</span>
      ),
    },
    { key: "department", header: "Department" },
    { key: "recordedBy", header: "Recorded By" },
    {
      key: "date",
      header: "Date",
      render: (item: ConsumptionEntry) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {item.date}
        </div>
      ),
    },
    {
      key: "source",
      header: "Source",
      render: (item: ConsumptionEntry) => (
        <span className={`text-xs px-2 py-1 rounded-full ${
          item.source === "system" 
            ? "bg-primary/10 text-primary" 
            : "bg-muted text-muted-foreground"
        }`}>
          {item.source === "system" ? "System" : "Logbook"}
        </span>
      ),
    },
    {
      key: "reconciled",
      header: "Reconciled",
      render: (item: ConsumptionEntry) => (
        <span className={`text-xs ${item.reconciled ? "text-success" : "text-warning"}`}>
          {item.reconciled ? "✓ Yes" : "○ Pending"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  const filteredData = consumptionData.filter((item) => {
    const matchesSearch = 
      item.logNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.type === activeTab || 
      (activeTab === "pending" && !item.reconciled);
    return matchesSearch && matchesTab;
  });

  // Calculate totals
  const dieselTotal = consumptionData
    .filter(c => c.type === "diesel")
    .reduce((sum, c) => sum + c.quantity, 0);
  const lubricantTotal = consumptionData
    .filter(c => c.type === "lubricant")
    .reduce((sum, c) => sum + c.quantity, 0);
  const pendingReconciliation = consumptionData.filter(c => !c.reconciled).length;

  return (
    <AppLayout
      title="Consumption Log"
      subtitle="Track diesel and lubricant consumption by asset"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Log Consumption
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Record Consumption Entry</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Consumption Type</Label>
                <Select onValueChange={setConsumptionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-warning" />
                        Diesel (Admin Team)
                      </div>
                    </SelectItem>
                    <SelectItem value="lubricant">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-info" />
                        Lubricant (Workshop Team)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {consumptionType && (
                <Alert className={consumptionType === "diesel" ? "border-warning bg-warning/5" : "border-info bg-info/5"}>
                  <BookOpen className="h-4 w-4" />
                  <AlertDescription>
                    {consumptionType === "diesel" ? (
                      <span className="text-warning">
                        Diesel consumption is tracked by the <strong>Admin</strong> department. 
                        Ensure logbook entry is made before system entry.
                      </span>
                    ) : (
                      <span className="text-info">
                        Lubricant consumption is tracked by the <strong>Workshop</strong> team.
                        Ensure logbook entry is made before system entry.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Item</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {consumptionType === "diesel" ? (
                      <SelectItem value="diesel">Diesel Fuel</SelectItem>
                    ) : (
                      <>
                        <SelectItem value="engine-oil">Engine Oil SAE 40</SelectItem>
                        <SelectItem value="hydraulic-oil">Hydraulic Oil</SelectItem>
                        <SelectItem value="grease">Lubricant Grease</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Asset</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetRegister.map(asset => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name} ({asset.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select defaultValue="L">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Liters (L)</SelectItem>
                      <SelectItem value="KG">Kilograms (KG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Logbook Reference</Label>
                  <Input placeholder="Page/Entry #" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Meter Reading (if applicable)</Label>
                <Input type="number" placeholder="Current meter/hour reading" />
              </div>

              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea placeholder="Additional notes..." rows={2} />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button>Save Entry</Button>
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
                <p className="text-sm text-muted-foreground">Diesel (This Month)</p>
                <p className="text-2xl font-bold">{dieselTotal.toLocaleString()} L</p>
              </div>
              <Fuel className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lubricants (This Month)</p>
                <p className="text-2xl font-bold">{lubricantTotal} L</p>
              </div>
              <Droplets className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reconciliation</p>
                <p className="text-2xl font-bold">{pendingReconciliation}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{consumptionData.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Month-end Reconciliation Alert */}
      {pendingReconciliation > 0 && (
        <Alert className="mb-6 border-warning bg-warning/5">
          <FileSpreadsheet className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-warning">
              <strong>{pendingReconciliation}</strong> entries pending reconciliation with inventory. 
              Complete before month-end reports.
            </span>
            <Button size="sm" variant="outline" className="text-warning border-warning">
              Start Reconciliation
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Entries</TabsTrigger>
                <TabsTrigger value="diesel">Diesel</TabsTrigger>
                <TabsTrigger value="lubricant">Lubricants</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
