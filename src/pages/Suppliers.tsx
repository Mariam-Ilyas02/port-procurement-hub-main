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
  DialogDescription
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Users, Eye, Edit, Star, Phone, Mail, 
  Trash2, Package, MapPin, X, AlertTriangle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupplierItem {
  id: string;
  name: string;
  category: string;
  unit: string;
}
interface PerformanceMetrics {
  onTimeDelivery: number; // percentage
  qualityRating: number; // 1-5
  responseTime: number; // hours
  complaintCount: number;
  lastEvaluation: string; // date
}
interface Supplier {
  id: string;
  code: string;
  name: string;
  category: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string;
  // paymentTerms: string;
  rating: number;
  totalOrders: number;
  totalSpend: string;
  status: "active" | "inactive";
  items: SupplierItem[];
}

const initialSuppliersData: Supplier[] = [
  { 
    id: "1", code: "SUP-001", name: "Gulf Petroleum Ltd", category: "Fuel", 
    contactPerson: "Ahmed Hassan", designation: "Sales Manager", 
    email: "ahmed@gulfpetro.com", phone: "+92-300-123-4567", 
    address: "Plot 12, Industrial Area, Karachi", taxNumber: "TRN-12345678",
    rating: 4.8, totalOrders: 45, totalSpend: "₨12,500,000", 
    status: "active",
    items: [
      { id: "i1", name: "Diesel Fuel", category: "Fuel", unit: "L" },
      { id: "i2", name: "Petrol", category: "Fuel", unit: "L" },
      { id: "i3", name: "Kerosene", category: "Fuel", unit: "L" },
    ]
  },
  { 
    id: "2", code: "SUP-002", name: "Shell Oil Company", category: "Oil", 
    contactPerson: "Sarah", designation: "Account Manager",
    email: "sarah@shell.com", phone: "+92-321-234-5678", 
    address: "Shell House, Clifton, Karachi", taxNumber: "TRN-23456789",
    rating: 4.5, totalOrders: 32, totalSpend: "₨4,500,000", 
    status: "active",
    items: [
      { id: "i4", name: "Engine Oil SAE 40", category: "Oil", unit: "L" },
      { id: "i5", name: "Hydraulic Oil", category: "Oil", unit: "L" },
    ]
  },
  { 
    id: "3", code: "SUP-003", name: "Total Energies", category: "Fuel", 
    contactPerson: "Paras Mubeen", designation: "Regional Head",
    email: "paras@total.com", phone: "+92-333-345-6789",
    address: "Total Tower, I.I. Chundrigar Rd, Karachi", taxNumber: "TRN-34567890",
    rating: 4.7, totalOrders: 28, totalSpend: "₨8,900,000", 
    status: "active",
    items: [
      { id: "i6", name: "Diesel Fuel", category: "Fuel", unit: "L" },
      { id: "i7", name: "Lubricant Grease", category: "Lubricants", unit: "KG" },
    ]
  },
  { 
    id: "4", code: "SUP-004", name: "Safety First Inc", category: "Safety Equipment", 
    contactPerson: "Jaleel Khan", designation: "Director",
    email: "jaleel@safetyfirst.com", phone: "+92-345-456-7890",
    address: "SITE Area, Karachi", taxNumber: "TRN-45678901",
    rating: 4.2, totalOrders: 15, totalSpend: "₨1,250,000", 
    status: "active",
    items: [
      { id: "i8", name: "Safety Helmets", category: "Safety Equipment", unit: "Pcs" },
      { id: "i9", name: "Safety Vests", category: "Safety Equipment", unit: "Pcs" },
      { id: "i10", name: "Fire Extinguishers", category: "Safety Equipment", unit: "Pcs" },
    ]
  },
  { 
    id: "5", code: "SUP-005", name: "Office Depot", category: "Stationary", 
    contactPerson: "Laiba Moin", designation: "Sales Rep",
    email: "laiba@officedepot.com", phone: "+92-312-567-8901",
    address: "Saddar, Karachi", taxNumber: "TRN-56789012",
    rating: 4.0, totalOrders: 22, totalSpend: "₨450,000", 
    status: "active",
    items: [
      { id: "i11", name: "Printer Cartridges", category: "Stationary", unit: "Pcs" },
      { id: "i12", name: "A4 Paper", category: "Stationary", unit: "Pcs" },
    ]
  },
  { 
    id: "6", code: "SUP-006", name: "Castrol Lubricants", category: "Lubricants", 
    contactPerson: "Mikaal", designation: "Territory Manager",
    email: "mikaal@castrol.com", phone: "+92-322-678-9012",
    address: "Korangi Industrial Area, Karachi", taxNumber: "TRN-67890123",
    rating: 4.6, totalOrders: 18, totalSpend: "₨1,800,000", 
    status: "inactive",
    items: [
      { id: "i13", name: "Engine Oil", category: "Lubricants", unit: "L" },
      { id: "i14", name: "Transmission Oil", category: "Lubricants", unit: "L" },
    ]
  },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();

  // New supplier form state
  const [newSupplier, setNewSupplier] = useState({
    name: "", categories: [] as string[], contactPerson: "", designation: "",
    email: "", phone: "", address: "", taxNumber: "", paymentTerms: ""
  });

  // New item form state
  const [newItem, setNewItem] = useState({ name: "", category: "", unit: "" });

  const handleAddSupplier = () => {
if (!newSupplier.name || newSupplier.categories.length === 0){
      toast({ title: "Required fields missing", description: "Company name and category are required.", variant: "destructive" });
      return;
    }
    const code = `SUP-${String(suppliers.length + 1).padStart(3, "0")}`;
const supplier: Supplier = {
  id: String(Date.now()),
  code,
  ...newSupplier,
  category: newSupplier.categories.join(", "), // optional for display
  rating: 0,
  totalOrders: 0,
  totalSpend: "₨0",
  status: "active",
  items: [],
};
    setSuppliers(prev => [...prev, supplier]);
    setNewSupplier({ name: "", categories: [], contactPerson: "", designation: "", email: "", phone: "", address: "", taxNumber: "", paymentTerms: "" });
    setIsCreateDialogOpen(false);
    toast({ title: "Supplier Added", description: `${supplier.name} has been added successfully.` });
  };

  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return;
    setSuppliers(prev => prev.filter(s => s.id !== selectedSupplier.id));
    setIsDeleteDialogOpen(false);
    toast({ title: "Supplier Deleted", description: `${selectedSupplier.name} has been removed.`, variant: "destructive" });
    setSelectedSupplier(null);
  };

  const handleToggleStatus = (supplier: Supplier) => {
    setSuppliers(prev => prev.map(s => 
      s.id === supplier.id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
    ));
    toast({ title: "Status Updated", description: `${supplier.name} is now ${supplier.status === "active" ? "inactive" : "active"}.` });
  };

  const handleAddItem = () => {
    if (!selectedSupplier || !newItem.name) return;
    const item: SupplierItem = { id: String(Date.now()), ...newItem };
    setSuppliers(prev => prev.map(s => 
      s.id === selectedSupplier.id ? { ...s, items: [...s.items, item] } : s
    ));
    setSelectedSupplier(prev => prev ? { ...prev, items: [...prev.items, item] } : null);
    setNewItem({ name: "", category: "", unit: "" });
    setIsAddItemDialogOpen(false);
    toast({ title: "Item Added", description: `${item.name} added to ${selectedSupplier.name}.` });
  };

  const handleRemoveItem = (supplierId: string, itemId: string) => {
    setSuppliers(prev => prev.map(s => 
      s.id === supplierId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s
    ));
    setSelectedSupplier(prev => prev ? { ...prev, items: prev.items.filter(i => i.id !== itemId) } : null);
  };

  const columns = [
    {
      key: "code",
      header: "Supplier Code",
      render: (item: Supplier) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm">{item.code}</span>
        </div>
      ),
    },
    { key: "name", header: "Company Name" },
    { key: "category", header: "Category" },
    { key: "contactPerson", header: "Contact Person" },
    {
      key: "contact",
      header: "Contact",
      render: (item: Supplier) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{item.email}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{item.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: (item: Supplier) => (
        <div className="flex items-center gap-1">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{item.items.length} items</span>
        </div>
      ),
    },
    {
  key: "taxNumber",
  header: "NTN",
  render: (item: Supplier) => (
    <span className="font-mono text-sm text-muted-foreground">
      {item.taxNumber}
    </span>
  ),
},
    // {
    //   key: "rating",
    //   header: "Rating",
    //   render: (item: Supplier) => (
    //     <div className="flex items-center gap-1">
    //       <Star className="w-4 h-4 fill-warning text-warning" />
    //       <span className="font-medium">{item.rating}</span>
    //     </div>
    //   ),
    // },
    // { key: "totalSpend", header: "Total Spend", className: "text-right font-medium" },
    {
      key: "status",
      header: "Status",
      render: (item: Supplier) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: Supplier) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedSupplier(item); setIsViewDialogOpen(true); }}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedSupplier(item); setIsEditDialogOpen(true); }}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setSelectedSupplier(item); setIsDeleteDialogOpen(true); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = suppliers.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Supplier Management"
      subtitle="Manage vendor information, items, and performance"
      actions={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input placeholder="Enter company name" value={newSupplier.name} onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))} />
              </div>
<div className="space-y-2">
  <Label>Categories *</Label>

  <Select
    onValueChange={(value) => {
      setNewSupplier((prev) => ({
        ...prev,
        categories: prev.categories.includes(value)
          ? prev.categories
          : [...prev.categories, value],
      }));
    }}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select categories" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Fuel">Fuel</SelectItem>
      <SelectItem value="Oil">Oil</SelectItem>
      <SelectItem value="Lubricants">Lubricants</SelectItem>
      <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
      <SelectItem value="Stationary">Stationary</SelectItem>
      <SelectItem value="Spare Parts">Spare Parts</SelectItem>
    </SelectContent>
  </Select>

  {/* ✅ Show selected categories */}
  <div className="flex flex-wrap gap-2 mt-2">
    {newSupplier.categories.map((cat) => (
      <span
        key={cat}
        className="bg-primary/10 text-primary px-2 py-1 rounded text-xs flex items-center gap-1"
      >
        {cat}
        <X
          className="w-3 h-3 cursor-pointer"
          onClick={() =>
            setNewSupplier((prev) => ({
              ...prev,
              categories: prev.categories.filter((c) => c !== cat),
            }))
          }
        />
      </span>
    ))}
  </div>
</div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input placeholder="Enter contact name" value={newSupplier.contactPerson} onChange={(e) => setNewSupplier(prev => ({ ...prev, contactPerson: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input placeholder="Enter designation" value={newSupplier.designation} onChange={(e) => setNewSupplier(prev => ({ ...prev, designation: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Enter email" value={newSupplier.email} onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="Enter phone number" value={newSupplier.phone} onChange={(e) => setNewSupplier(prev => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Address</Label>
                <Textarea placeholder="Enter full address" rows={2} value={newSupplier.address} onChange={(e) => setNewSupplier(prev => ({ ...prev, address: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Tax Registration Number (NTN)</Label>
                <Input placeholder="Enter NTN" value={newSupplier.taxNumber} onChange={(e) => setNewSupplier(prev => ({ ...prev, taxNumber: e.target.value }))} />
              </div>
              {/* <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select value={newSupplier.paymentTerms} onValueChange={(v) => setNewSupplier(prev => ({ ...prev, paymentTerms: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select terms" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                    <SelectItem value="COD">Cash on Delivery</SelectItem>
                    <SelectItem value="Advance">Advance Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSupplier}>Add Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">All Suppliers ({filteredData.length})</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                className="pl-9 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>

      {/* View Supplier Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {selectedSupplier?.name} ({selectedSupplier?.code})
            </DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="items">Items ({selectedSupplier.items.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Contact Person</Label>
                    <p className="font-medium">{selectedSupplier.contactPerson}</p>
                    <p className="text-xs text-muted-foreground">{selectedSupplier.designation}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Category</Label>
                    <p>{selectedSupplier.category}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Email</Label>
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-muted-foreground" /><span>{selectedSupplier.email}</span></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Phone</Label>
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" /><span>{selectedSupplier.phone}</span></div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-muted-foreground text-xs">Address</Label>
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-muted-foreground" /><span>{selectedSupplier.address}</span></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">NTN</Label>
                    <p>{selectedSupplier.taxNumber}</p>
                  </div>
                  {/* <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Payment Terms</Label>
                    <p>{selectedSupplier.paymentTerms}</p>
                  </div> */}
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Total Orders</Label>
                    <p className="font-medium">{selectedSupplier.totalOrders}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Total Spend</Label>
                    <p className="font-medium">{selectedSupplier.totalSpend}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => handleToggleStatus(selectedSupplier)}>
                    {selectedSupplier.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </TabsContent>
             
              <TabsContent value="items">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Items supplied by {selectedSupplier.name}</p>
                    <Button size="sm" onClick={() => setIsAddItemDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  {selectedSupplier.items.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No items assigned yet. Add items this supplier provides.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedSupplier.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.category} • {item.unit}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveItem(selectedSupplier.id, item.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
  {/* Performance Metrics Card */}
  <Card className="p-4">
    <h4 className="font-medium mb-3">Performance Metrics</h4>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">On-Time Delivery</p>
        <p className="text-2xl font-bold text-success">98%</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Quality Rating</p>
        <p className="text-2xl font-bold text-warning">4.5/5</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Avg Response Time</p>
        <p className="text-2xl font-bold">4 hrs</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Complaints</p>
        <p className="text-2xl font-bold text-destructive">2</p>
      </div>
    </div>
  </Card>
  
  {/* Spend Analysis Card */}
  <Card className="p-4">
    <h4 className="font-medium mb-3">Spend Analysis</h4>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Total Spend (YTD)</span>
        <span className="font-medium">₨12.5M</span>
      </div>
      <div className="flex justify-between">
        <span>Average Order Value</span>
        <span className="font-medium">₨278K</span>
      </div>
      <div className="flex justify-between">
        <span>Last Order Date</span>
        <span className="font-medium">2025-01-28</span>
      </div>
      <div className="flex justify-between">
        <span>Total Orders</span>
        <span className="font-medium">45</span>
      </div>
    </div>
  </Card>

  {/* Recent Performance Chart (Optional) */}
  <Card className="p-4">
    <h4 className="font-medium mb-3">Delivery Performance Trend</h4>
    <div className="h-32 flex items-end justify-between gap-2">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-success/20 rounded-t h-16" style={{ height: '64px' }}></div>
        <span className="text-xs mt-1">Jan</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-success/20 rounded-t h-20" style={{ height: '80px' }}></div>
        <span className="text-xs mt-1">Feb</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-success/20 rounded-t h-24" style={{ height: '96px' }}></div>
        <span className="text-xs mt-1">Mar</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-success/20 rounded-t h-28" style={{ height: '112px' }}></div>
        <span className="text-xs mt-1">Apr</span>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-success/20 rounded-t h-32" style={{ height: '128px' }}></div>
        <span className="text-xs mt-1">May</span>
      </div>
    </div>
    <div className="flex justify-between text-xs text-muted-foreground mt-2">
      <span>On-Time Delivery: 98%</span>
      <span>Target: 95%</span>
    </div>
  </Card>

  {/* Performance Rating History */}
  <Card className="p-4">
    <h4 className="font-medium mb-3">Rating History</h4>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">Q1 2025</span>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((star) => (
            <span key={star} className={`text-lg ${star <= 4 ? 'text-warning' : 'text-muted'}`}>★</span>
          ))}
          <span className="text-sm ml-2">4.0</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Q4 2024</span>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((star) => (
            <span key={star} className={`text-lg ${star <= 4.5 ? 'text-warning' : 'text-muted'}`}>★</span>
          ))}
          <span className="text-sm ml-2">4.5</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Q3 2024</span>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((star) => (
            <span key={star} className={`text-lg ${star <= 4.2 ? 'text-warning' : 'text-muted'}`}>★</span>
          ))}
          <span className="text-sm ml-2">4.2</span>
        </div>
      </div>
    </div>
  </Card>
</TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Item to Supplier Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item to {selectedSupplier?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input placeholder="Enter item name" value={newItem.name} onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newItem.category} onValueChange={(v) => setNewItem(prev => ({ ...prev, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                  <SelectItem value="Oil">Oil</SelectItem>
                  <SelectItem value="Lubricants">Lubricants</SelectItem>
                  <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                  <SelectItem value="Stationary">Stationary</SelectItem>
                  <SelectItem value="Spare Parts">Spare Parts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={newItem.unit} onValueChange={(v) => setNewItem(prev => ({ ...prev, unit: v }))}>
                <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Liter (L)</SelectItem>
                  <SelectItem value="KG">Kilogram (KG)</SelectItem>
                  <SelectItem value="Pcs">Pieces (Pcs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Supplier - {selectedSupplier?.code}</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue={selectedSupplier.name} onChange={(e) => setSelectedSupplier(prev => prev ? { ...prev, name: e.target.value } : null)} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select defaultValue={selectedSupplier.category} onValueChange={(v) => setSelectedSupplier(prev => prev ? { ...prev, category: v } : null)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fuel">Fuel</SelectItem>
                      <SelectItem value="Oil">Oil</SelectItem>
                      <SelectItem value="Lubricants">Lubricants</SelectItem>
                      <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                      <SelectItem value="Stationary">Stationary</SelectItem>
                      <SelectItem value="Spare Parts">Spare Parts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input defaultValue={selectedSupplier.contactPerson} onChange={(e) => setSelectedSupplier(prev => prev ? { ...prev, contactPerson: e.target.value } : null)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={selectedSupplier.phone} onChange={(e) => setSelectedSupplier(prev => prev ? { ...prev, phone: e.target.value } : null)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={selectedSupplier.email} onChange={(e) => setSelectedSupplier(prev => prev ? { ...prev, email: e.target.value } : null)} />
                </div>
                <div className="space-y-2">
                  {/* <Label>Payment Terms</Label>
                  <Select defaultValue={selectedSupplier.paymentTerms} onValueChange={(v) => setSelectedSupplier(prev => prev ? { ...prev, paymentTerms: v } : null)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="COD">Cash on Delivery</SelectItem>
                      <SelectItem value="Advance">Advance Payment</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  if (selectedSupplier) {
                    setSuppliers(prev => prev.map(s => s.id === selectedSupplier.id ? selectedSupplier : s));
                    setIsEditDialogOpen(false);
                    toast({ title: "Supplier Updated", description: `${selectedSupplier.name} has been updated.` });
                  }
                }}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Supplier
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedSupplier?.name}</strong>? This action cannot be undone. All associated items and records will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSupplier}>Delete Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
