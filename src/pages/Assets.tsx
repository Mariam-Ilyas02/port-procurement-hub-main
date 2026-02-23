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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, Search, Truck, Fuel, Eye, Settings, Zap, Car, 
  QrCode, Calendar, Wrench, Banknote, ClipboardCheck
} from "lucide-react";

interface Asset {
  id: string;
  assetCode: string;
  rfidTag: string;
  name: string;
  category: string;
  assignedFuel: string;
  fuelAssigned: number;
  fuelConsumed: number;
  fuelRemaining: number;
  unit: string;
  lastRefuel: string;
  purchaseDate: string;
  purchaseCost: number;
  depreciationRate: number;
  currentValue: number;
  nextMaintenance: string;
  location: string;
  status: "active" | "maintenance" | "inactive";
}

interface AuditRecord {
  id: string;
  date: string;
  assetCode: string;
  assetName: string;
  auditor: string;
  status: "verified" | "discrepancy" | "pending";
  notes: string;
}

const assetsData: Asset[] = [
  { id: "1", assetCode: "GEN-100-01", rfidTag: "RFID-001-A", name: "Generator 100kVA #1", category: "Generator", assignedFuel: "Diesel", fuelAssigned: 500, fuelConsumed: 320, fuelRemaining: 180, unit: "L", lastRefuel: "2025-01-25", purchaseDate: "2022-03-15", purchaseCost: 45000, depreciationRate: 10, currentValue: 31500, nextMaintenance: "2025-02-15", location: "Power House A", status: "active" },
  { id: "2", assetCode: "KLM-01", rfidTag: "RFID-002-B", name: "Kalmar #1", category: "Machinery", assignedFuel: "Diesel", fuelAssigned: 300, fuelConsumed: 150, fuelRemaining: 150, unit: "L", lastRefuel: "2025-01-27", purchaseDate: "2021-06-20", purchaseCost: 250000, depreciationRate: 15, currentValue: 156250, nextMaintenance: "2025-02-20", location: "Terminal A", status: "active" },
  { id: "3", assetCode: "KLM-02", rfidTag: "RFID-003-C", name: "Kalmar #2", category: "Machinery", assignedFuel: "Diesel", fuelAssigned: 300, fuelConsumed: 280, fuelRemaining: 20, unit: "L", lastRefuel: "2025-01-20", purchaseDate: "2021-06-20", purchaseCost: 250000, depreciationRate: 15, currentValue: 156250, nextMaintenance: "2025-02-01", location: "Terminal B", status: "maintenance" },
  { id: "4", assetCode: "FNT-01", rfidTag: "RFID-004-D", name: "Fantuzzi #1", category: "Machinery", assignedFuel: "Diesel", fuelAssigned: 400, fuelConsumed: 200, fuelRemaining: 200, unit: "L", lastRefuel: "2025-01-26", purchaseDate: "2020-01-10", purchaseCost: 320000, depreciationRate: 15, currentValue: 160000, nextMaintenance: "2025-03-10", location: "Terminal A", status: "active" },
  { id: "5", assetCode: "FLT-01", rfidTag: "RFID-005-E", name: "Forklift #1", category: "Machinery", assignedFuel: "Diesel", fuelAssigned: 100, fuelConsumed: 45, fuelRemaining: 55, unit: "L", lastRefuel: "2025-01-28", purchaseDate: "2023-08-05", purchaseCost: 35000, depreciationRate: 12, currentValue: 29050, nextMaintenance: "2025-02-28", location: "Warehouse A", status: "active" },
  { id: "6", assetCode: "VEH-HND-01", rfidTag: "RFID-006-F", name: "Honda Civic", category: "Vehicle", assignedFuel: "Petrol", fuelAssigned: 50, fuelConsumed: 35, fuelRemaining: 15, unit: "L", lastRefuel: "2025-01-24", purchaseDate: "2024-01-15", purchaseCost: 28000, depreciationRate: 15, currentValue: 23800, nextMaintenance: "2025-04-15", location: "Admin Pool", status: "active" },
];

const auditRecords: AuditRecord[] = [
  { id: "1", date: "2025-01-28", assetCode: "GEN-100-01", assetName: "Generator 100kVA #1", auditor: "Mikaal Ahmed", status: "verified", notes: "All tags readable, condition good" },
  { id: "2", date: "2025-01-28", assetCode: "KLM-01", assetName: "Kalmar #1", auditor: "Mikaal Ahmed", status: "verified", notes: "Fuel level matches records" },
  { id: "3", date: "2025-01-27", assetCode: "FLT-01", assetName: "Forklift #1", auditor: "Tehseen Alam", status: "discrepancy", notes: "Minor scratches not in record" },
  { id: "4", date: "2025-01-26", assetCode: "VEH-HND-01", assetName: "Honda Civic", auditor: "Tehseen Alam", status: "pending", notes: "Awaiting mileage verification" },
];

export default function Assets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterAssetOpen, setIsRegisterAssetOpen] = useState(false);
  const [isScheduleAuditOpen, setIsScheduleAuditOpen] = useState(false);

  const totalAssetValue = assetsData.reduce((sum, a) => sum + a.currentValue, 0);
  const totalDepreciation = assetsData.reduce((sum, a) => sum + (a.purchaseCost - a.currentValue), 0);

  const assetColumns = [
    {
      key: "assetCode",
      header: "Asset",
      render: (item: Asset) => {
        const icons = { Generator: Zap, Machinery: Truck, Vehicle: Car };
        const Icon = icons[item.category as keyof typeof icons] || Truck;
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{item.assetCode}</p>
              <p className="text-xs text-muted-foreground">{item.name}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "rfidTag",
      header: "RFID/Barcode",
      render: (item: Asset) => (
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-xs">{item.rfidTag}</span>
        </div>
      ),
    },
    { key: "location", header: "Location" },
    {
      key: "currentValue",
      header: "Value",
      render: (item: Asset) => (
        <div>
          <p className="font-medium">₨{item.currentValue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            Cost: ₨{item.purchaseCost.toLocaleString()}
          </p>
        </div>
      ),
    },
    {
      key: "fuelRemaining",
      header: "Fuel Status",
      render: (item: Asset) => {
        const percentage = item.fuelAssigned > 0 ? (item.fuelRemaining / item.fuelAssigned) * 100 : 0;
        return (
          <div className="w-24">
            <div className="flex justify-between text-xs mb-1">
              <span>{item.fuelRemaining} {item.unit}</span>
            </div>
            <Progress 
              value={percentage} 
              className={`h-1.5 ${percentage < 20 ? "[&>div]:bg-destructive" : percentage < 50 ? "[&>div]:bg-warning" : ""}`}
            />
          </div>
        );
      },
    },
    {
      key: "nextMaintenance",
      header: "Next Maint.",
      render: (item: Asset) => (
        <div className="flex items-center gap-1 text-sm">
          <Wrench className="w-3 h-3 text-muted-foreground" />
          {item.nextMaintenance}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Asset) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Fuel className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const auditColumns = [
    { key: "date", header: "Date" },
    {
      key: "asset",
      header: "Asset",
      render: (item: AuditRecord) => (
        <div>
          <p className="font-medium">{item.assetCode}</p>
          <p className="text-xs text-muted-foreground">{item.assetName}</p>
        </div>
      ),
    },
    { key: "auditor", header: "Auditor" },
    {
      key: "status",
      header: "Status",
      render: (item: AuditRecord) => <StatusBadge status={item.status} />,
    },
    { key: "notes", header: "Notes" },
  ];

  const filteredAssets = assetsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rfidTag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Asset Management"
      subtitle="Track assets, maintenance schedules, and depreciation"
      actions={
        <div className="flex gap-2">
          <Dialog open={isScheduleAuditOpen} onOpenChange={setIsScheduleAuditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Schedule Audit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Physical Audit</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Audit Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Audit (All Assets)</SelectItem>
                      <SelectItem value="category">By Category</SelectItem>
                      <SelectItem value="location">By Location</SelectItem>
                      <SelectItem value="random">Random Sample</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Assigned Auditor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select auditor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mike">Mikaal Ahmed</SelectItem>
                      <SelectItem value="tom">Tehseen Alam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsScheduleAuditOpen(false)}>Cancel</Button>
                <Button>Schedule Audit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isRegisterAssetOpen} onOpenChange={setIsRegisterAssetOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Register Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Register New Asset</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asset Code</Label>
                    <Input placeholder="e.g., GEN-100-02" />
                  </div>
                  <div className="space-y-2">
                    <Label>RFID/Barcode Tag</Label>
                    <Input placeholder="Scan or enter tag" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Asset Name</Label>
                  <Input placeholder="Enter asset name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="generator">Generator</SelectItem>
                        <SelectItem value="machinery">Machinery</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="terminal-a">Terminal A</SelectItem>
                        <SelectItem value="terminal-b">Terminal B</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="power-house">Power House</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Purchase Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Cost (₨)</Label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Depreciation Rate (%/year)</Label>
                  <Input type="number" placeholder="e.g., 10" defaultValue="10" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRegisterAssetOpen(false)}>Cancel</Button>
                <Button>Register Asset</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-xl font-bold">{assetsData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-xl font-bold">₨{totalAssetValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Depreciation</p>
                <p className="text-xl font-bold">₨{totalDepreciation.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Maintenance</p>
                <p className="text-xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assets">Asset Registry</TabsTrigger>
          <TabsTrigger value="audits">Audit Records</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by code, name, or RFID..."
                    className="pl-9 w-80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <QrCode className="w-4 h-4 mr-2" />
                    Scan RFID
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={assetColumns} data={filteredAssets} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={auditColumns} data={auditRecords} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetsData.filter(a => a.status === "maintenance" || new Date(a.nextMaintenance) <= new Date("2025-02-15")).map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.assetCode} • {asset.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{asset.nextMaintenance}</p>
                        <p className="text-xs text-muted-foreground">Next scheduled</p>
                      </div>
                      <StatusBadge status={asset.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
