import { 
  LayoutDashboard, 
  FileText, 
  ShoppingCart, 
  CreditCard, 
  Package, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  ArrowLeftRight,
  Truck,
  Users,
  Tags,
  Receipt,
  BarChart3,
  Settings,
  ChevronDown,
  ClipboardCheck,
  Fuel,
  Boxes,
  Building2,
  Landmark,
  ShieldCheck,
  Layers,
  ClipboardList,
  FileSignature
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Requisitions", url: "/requisitions", icon: FileText },
  { title: "Dept. Approval", url: "/department-approval", icon: ClipboardCheck },
  { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
  { title: "Goods Receipt (GRN)", url: "/goods-receipt", icon: Receipt },
  { title: "Pay Orders", url: "/pay-orders", icon: CreditCard },
];

const inventoryItems = [
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Stock In", url: "/stock-in", icon: ArrowDownToLine },
  { title: "Stock Out", url: "/stock-out", icon: ArrowUpFromLine },
  { title: "Warehouse Transfer", url: "/warehouse-transfer", icon: ArrowLeftRight },
  { title: "Consumption Log", url: "/consumption-log", icon: Fuel },
  { title: "Assets", url: "/assets", icon: Truck },
];

const settingsItems = [
  { title: "User Management", url: "/user-management", icon: Settings },
  { title: "Departments", url: "/departments", icon: Landmark },
  { title: "Item Master", url: "/items", icon: Boxes },
  { title: "Categories", url: "/categories", icon: Tags },
  { title: "Warehouses", url: "/warehouses", icon: Building2 },
  { title: "Suppliers", url: "/suppliers", icon: Users },
  { title: "Units", url: "/units", icon: Layers },
  { title: "Approval Matrix", url: "/approval-matrix", icon: ShieldCheck },
  { title: "Budget Setup", url: "/budgets", icon: ClipboardList },
  { title: "Asset Categories", url: "/asset-categories", icon: Truck },
  { title: "Stock Adjustment", url: "/stock-adjustment", icon: ClipboardCheck },
  { title: "Stock Adjustment Reasons", url: "/adjustment-reasons", icon: ClipboardCheck },
  { title: "Payment Modes", url: "/payment-modes", icon: CreditCard },
  { title: "Contract Types", url: "/contract-types", icon: FileSignature },
  { title: "Tax Setup", url: "/tax-setup", icon: Receipt },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">

      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Package className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">PIMS</h1>
            <p className="text-xs text-sidebar-foreground/60">
              Procurement & Inventory
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">

        {/* 1️⃣ MAIN */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 2️⃣ INVENTORY MODULE (temporarily removed from here) */}
        {/* We will place it AFTER Setup */}

        {/* 2️⃣ SETUP (MOVED ABOVE INVENTORY) */}
        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="flex justify-between items-center">
                Setup
                <ChevronDown className="w-4 h-4" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {settingsItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url}>
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* 3️⃣ INVENTORY (NOW BELOW SETUP) */}
        <SidebarGroup>
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="flex justify-between items-center">
                Inventory
                <ChevronDown className="w-4 h-4" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {inventoryItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url}>
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* 4️⃣ REPORTS */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/reports">
                    <BarChart3 className="w-5 h-5" />
                    <span>Reports</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-foreground">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">Mariam Ilyas</p>
            <p className="text-xs text-sidebar-foreground/60">Procurement Officer</p>
          </div>
          <Settings className="w-5 h-5 text-sidebar-foreground/60 cursor-pointer hover:text-sidebar-foreground" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
