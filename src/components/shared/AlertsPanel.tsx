import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Package, 
  TrendingDown, 
  TrendingUp,
  Bell,
  CheckCircle,
  X
} from "lucide-react";

interface Alert {
  id: string;
  type: "low_stock" | "overstock" | "approval_pending" | "maintenance_due" | "budget_warning";
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
  actionLabel?: string;
}

const alertsData: Alert[] = [
  {
    id: "1",
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Hydraulic Oil is below reorder level (50L remaining, reorder at 100L)",
    severity: "critical",
    timestamp: "2 hours ago",
    actionLabel: "Create Requisition"
  },
  {
    id: "2",
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Lubricant Grease running low (15 KG remaining, reorder at 30 KG)",
    severity: "critical",
    timestamp: "3 hours ago",
    actionLabel: "Create Requisition"
  },
  {
    id: "3",
    type: "overstock",
    title: "Overstock Warning",
    message: "Diesel Fuel storage at 75% capacity. Consider reducing next order.",
    severity: "warning",
    timestamp: "1 day ago"
  },
  {
    id: "4",
    type: "approval_pending",
    title: "Pending Approval",
    message: "REQ-2025-001 awaiting department approval for 3 days",
    severity: "warning",
    timestamp: "3 days ago",
    actionLabel: "Review"
  },
  {
    id: "5",
    type: "maintenance_due",
    title: "Maintenance Due",
    message: "Kalmar #2 maintenance is overdue by 5 days",
    severity: "critical",
    timestamp: "5 days ago",
    actionLabel: "Schedule"
  },
  {
    id: "6",
    type: "budget_warning",
    title: "Budget Alert",
    message: "Safety Equipment category at 80% of annual budget",
    severity: "warning",
    timestamp: "1 day ago"
  },
];

const getAlertIcon = (type: Alert["type"]) => {
  switch (type) {
    case "low_stock":
      return <TrendingDown className="w-4 h-4" />;
    case "overstock":
      return <TrendingUp className="w-4 h-4" />;
    case "approval_pending":
      return <Bell className="w-4 h-4" />;
    case "maintenance_due":
      return <AlertTriangle className="w-4 h-4" />;
    case "budget_warning":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

const getSeverityStyles = (severity: Alert["severity"]) => {
  switch (severity) {
    case "critical":
      return "border-destructive/50 bg-destructive/5";
    case "warning":
      return "border-warning/50 bg-warning/5";
    default:
      return "border-info/50 bg-info/5";
  }
};

const getSeverityIconStyles = (severity: Alert["severity"]) => {
  switch (severity) {
    case "critical":
      return "text-destructive";
    case "warning":
      return "text-warning";
    default:
      return "text-info";
  }
};

interface AlertsPanelProps {
  maxAlerts?: number;
  showHeader?: boolean;
}

export function AlertsPanel({ maxAlerts = 5, showHeader = true }: AlertsPanelProps) {
  const displayedAlerts = alertsData.slice(0, maxAlerts);
  const criticalCount = alertsData.filter(a => a.severity === "critical").length;
  const warningCount = alertsData.filter(a => a.severity === "warning").length;

  return (
    <Card>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alerts & Notifications
            </CardTitle>
            <div className="flex items-center gap-2 text-xs">
              {criticalCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
                  {criticalCount} critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-warning/10 text-warning font-medium">
                  {warningCount} warnings
                </span>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={showHeader ? "" : "pt-6"}>
        <div className="space-y-3">
          {displayedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityStyles(alert.severity)}`}
            >
              <div className={`mt-0.5 ${getSeverityIconStyles(alert.severity)}`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                  {alert.actionLabel && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      {alert.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {alertsData.length > maxAlerts && (
          <Button variant="ghost" className="w-full mt-3 text-sm">
            View all {alertsData.length} alerts
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
