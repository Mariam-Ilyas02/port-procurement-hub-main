import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AlertsPanel } from "@/components/shared/AlertsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ShoppingCart, 
  Package, 
  Banknote,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

const recentRequisitions = [
  { id: "REQ-001", item: "Diesel Fuel", quantity: "5000 L", status: "pending" as const, date: "2025-01-28" },
  { id: "REQ-002", item: "Engine Oil", quantity: "200 L", status: "approved" as const, date: "2025-01-27" },
  { id: "REQ-003", item: "Office Supplies", quantity: "50 Pcs", status: "draft" as const, date: "2025-01-26" },
];

const pendingApprovals = [
  { id: "PO-001", type: "Purchase Order", amount: "₨45,000", requester: "Azlaan Kareem" },
  { id: "PAY-001", type: "Pay Order", amount: "₨32,500", requester: "Jane Smith" },
];

export default function Dashboard() {
  return (
    <AppLayout 
      title="Dashboard" 
      subtitle="Overview of procurement and inventory operations"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Requisitions"
          value="156"
          subtitle="This month"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active POs"
          value="43"
          subtitle="In progress"
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Inventory Value"
          value="₨2.4M"
          subtitle="Current valuation"
          icon={Package}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Pending Payments"
          value="₨156K"
          subtitle="12 pay orders"
          icon={Banknote}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requisitions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">Recent Requisitions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/requisitions" className="flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRequisitions.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{req.id}</p>
                      <p className="text-xs text-muted-foreground">{req.item} • {req.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{req.date}</span>
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{item.id}</span>
                    <span className="text-sm font-semibold text-primary">{item.amount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.type} by {item.requester}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-3 text-sm">
              View all pending
            </Button>
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <div className="lg:col-span-2">
          <AlertsPanel maxAlerts={4} />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline" size="sm" asChild>
                <Link to="/requisitions">
                  <FileText className="w-4 h-4 mr-2" />
                  New Requisition
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm" asChild>
                <Link to="/purchase-orders">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Create PO
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm" asChild>
                <Link to="/stock-in">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Record Stock In
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm" asChild>
                <Link to="/reports">
                  <Package className="w-4 h-4 mr-2" />
                  View Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
