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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Search, Users, Shield, Key, Edit, Trash2, 
  UserPlus, Settings, Eye, Lock, Unlock
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  lastLogin: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

const usersData: User[] = [
  { id: "1", name: "Muhammad", email: "Muhammad.Iqbal@port.com", role: "Procurement Officer", department: "Procurement", status: "active", lastLogin: "2025-01-28 09:30" },
  { id: "2", name: "Jeena Merchant", email: "jeena.merchant@port.com", role: "Department Approver", department: "Operations", status: "active", lastLogin: "2025-01-28 08:45" },
  { id: "3", name: "Mustajab", email: "mustajab.hassan@port.com", role: "Warehouse Manager", department: "Warehouse", status: "active", lastLogin: "2025-01-27 16:20" },
  { id: "4", name: "Sarah", email: "sarah.khalil@port.com", role: "Finance Officer", department: "Finance", status: "active", lastLogin: "2025-01-28 10:15" },
  { id: "5", name: "Taha", email: "taha.khan@port.com", role: "Asset Manager", department: "Assets", status: "active", lastLogin: "2025-01-26 14:00" },
  { id: "6", name: "Laraib", email: "laraib.ahmed@port.com", role: "Viewer/Reporter", department: "Management", status: "inactive", lastLogin: "2025-01-20 11:30" },
  { id: "7", name: "Admin User", email: "admin@port.com", role: "System Administrator", department: "IT", status: "active", lastLogin: "2025-01-28 07:00" },
];

const rolesData: Role[] = [
  { 
    id: "1", 
    name: "Requester", 
    description: "Can create requisitions and view own requests", 
    userCount: 25,
    permissions: ["create_requisition", "view_own_requests", "view_inventory"]
  },
  { 
    id: "2", 
    name: "Department Approver", 
    description: "Approves requisitions, checks inventory and budget", 
    userCount: 5,
    permissions: ["approve_requisition", "reject_requisition", "view_budget", "view_inventory", "send_notifications"]
  },
  { 
    id: "3", 
    name: "Procurement Officer", 
    description: "Creates POs, manages vendors, receives goods", 
    userCount: 3,
    permissions: ["create_po", "edit_po", "send_po", "manage_vendors", "receive_goods"]
  },
  { 
    id: "4", 
    name: "Warehouse Manager", 
    description: "Manages stock, locations, and inventory audits", 
    userCount: 4,
    permissions: ["stock_in", "stock_out", "manage_locations", "conduct_audits", "view_all_inventory"]
  },
  { 
    id: "5", 
    name: "Finance Officer", 
    description: "Processes payments and approves pay orders", 
    userCount: 2,
    permissions: ["approve_payorder", "process_payment", "view_financial_reports", "manage_budgets"]
  },
  { 
    id: "6", 
    name: "Asset Manager", 
    description: "Tracks assets, manages lifecycle, calculates depreciation", 
    userCount: 2,
    permissions: ["manage_assets", "track_rfid", "schedule_maintenance", "calculate_depreciation", "dispose_assets"]
  },
  { 
    id: "7", 
    name: "Viewer/Reporter", 
    description: "View-only access to dashboards and reports", 
    userCount: 10,
    permissions: ["view_dashboard", "view_reports", "generate_alerts"]
  },
  { 
    id: "8", 
    name: "System Administrator", 
    description: "Full system access, manages users and settings", 
    userCount: 2,
    permissions: ["all"]
  },
];

const allPermissions = [
  { id: "create_requisition", label: "Create Requisitions", category: "Requisitions" },
  { id: "view_own_requests", label: "View Own Requests", category: "Requisitions" },
  { id: "approve_requisition", label: "Approve Requisitions", category: "Requisitions" },
  { id: "reject_requisition", label: "Reject Requisitions", category: "Requisitions" },
  { id: "create_po", label: "Create Purchase Orders", category: "Purchase Orders" },
  { id: "edit_po", label: "Edit Purchase Orders", category: "Purchase Orders" },
  { id: "send_po", label: "Send PO to Vendor", category: "Purchase Orders" },
  { id: "receive_goods", label: "Receive Goods", category: "Purchase Orders" },
  { id: "view_inventory", label: "View Inventory", category: "Inventory" },
  { id: "view_all_inventory", label: "View All Inventory", category: "Inventory" },
  { id: "stock_in", label: "Stock In", category: "Inventory" },
  { id: "stock_out", label: "Stock Out", category: "Inventory" },
  { id: "manage_locations", label: "Manage Locations", category: "Inventory" },
  { id: "conduct_audits", label: "Conduct Audits", category: "Inventory" },
  { id: "manage_assets", label: "Manage Assets", category: "Assets" },
  { id: "track_rfid", label: "Track RFID/Barcodes", category: "Assets" },
  { id: "schedule_maintenance", label: "Schedule Maintenance", category: "Assets" },
  { id: "calculate_depreciation", label: "Calculate Depreciation", category: "Assets" },
  { id: "dispose_assets", label: "Dispose Assets", category: "Assets" },
  { id: "view_budget", label: "View Budget", category: "Finance" },
  { id: "manage_budgets", label: "Manage Budgets", category: "Finance" },
  { id: "approve_payorder", label: "Approve Pay Orders", category: "Finance" },
  { id: "process_payment", label: "Process Payments", category: "Finance" },
  { id: "view_financial_reports", label: "View Financial Reports", category: "Finance" },
  { id: "manage_vendors", label: "Manage Vendors", category: "Settings" },
  { id: "send_notifications", label: "Send Notifications", category: "Settings" },
  { id: "view_dashboard", label: "View Dashboard", category: "Reports" },
  { id: "view_reports", label: "View Reports", category: "Reports" },
  { id: "generate_alerts", label: "Generate Alerts", category: "Reports" },
];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  const userColumns = [
    {
      key: "name",
      header: "User",
      render: (item: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {item.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role" },
    { key: "department", header: "Department" },
    { key: "lastLogin", header: "Last Login" },
    {
      key: "status",
      header: "Status",
      render: (item: User) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (item: User) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {item.status === "active" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const permissionsByCategory = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, typeof allPermissions>);

  return (
    <AppLayout
      title="User & Role Management"
      subtitle="Manage system users, roles, and permissions"
    >
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Key className="w-4 h-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input placeholder="Enter first name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input placeholder="Enter last name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="Enter email" />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {rolesData.map(role => (
                              <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="procurement">Procurement</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="warehouse">Warehouse</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="assets">Assets</SelectItem>
                            <SelectItem value="it">IT</SelectItem>
                            <SelectItem value="management">Management</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                      <Button>Add User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable columns={userColumns} data={filteredUsers} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <div className="flex justify-end mb-4">
            <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Role Name</Label>
                    <Input placeholder="Enter role name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="Brief description of this role" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>Cancel</Button>
                  <Button>Create Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rolesData.map((role) => (
              <Card key={role.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        {role.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{role.userCount} users</span>
                    <span className="text-muted-foreground">
                      {role.permissions.includes("all") ? "All permissions" : `${role.permissions.length} permissions`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <p className="text-sm text-muted-foreground">Configure what each role can do in the system</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">{category}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {permissions.map((perm) => (
                        <div key={perm.id} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                          <Checkbox id={perm.id} />
                          <label htmlFor={perm.id} className="text-sm cursor-pointer">
                            {perm.label}
                          </label>
                        </div>
                      ))}
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
