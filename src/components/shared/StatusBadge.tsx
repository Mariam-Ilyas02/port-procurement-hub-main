import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 
  | "draft" 
  | "pending" 
  | "pending_dept"
  | "pending_senior"
  | "pending_approval"   // ✅ ADD
  | "approved"
  | "approved_inventory"
  | "approved_purchase"
  | "issued"               // ✅ ADD
  | "received"           // ✅ ADD
  | "closed"             // ✅ ADD
  | "cancelled"          // ✅ ADD
  | "rejected" 
  | "completed" 
  | "paid"
  | "in-progress"
  | "in_transit"
  | "low"
  | "medium"
  | "high"
  | "active"
  | "inactive"
  | "fulfilled"
  | "maintenance"
  | "verified"
  | "discrepancy";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  draft: { 
    label: "Draft", 
    className: "bg-muted text-muted-foreground hover:bg-muted" 
  },
  pending: { 
    label: "Pending", 
    className: "bg-warning/10 text-warning hover:bg-warning/20" 
  },
  pending_dept: { 
    label: "Pending Dept", 
    className: "bg-warning/10 text-warning hover:bg-warning/20" 
  },
  pending_senior: { 
    label: "Pending Sr. Mgmt", 
    className: "bg-info/10 text-info hover:bg-info/20" 
  },
  approved: { 
    label: "Approved", 
    className: "bg-success/10 text-success hover:bg-success/20" 
  },
  approved_inventory: { 
    label: "Approved (Inventory)", 
    className: "bg-success/10 text-success hover:bg-success/20" 
  },
  approved_purchase: { 
    label: "Approved (Purchase)", 
    className: "bg-primary/10 text-primary hover:bg-primary/20" 
  },
  rejected: { 
    label: "Rejected", 
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20" 
  },
  completed: { 
    label: "Completed", 
    className: "bg-success/10 text-success hover:bg-success/20" 
  },
  paid: { 
    label: "Paid", 
    className: "bg-success/10 text-success hover:bg-success/20" 
  },
  "in-progress": { 
    label: "In Progress", 
    className: "bg-info/10 text-info hover:bg-info/20" 
  },
  in_transit: { 
    label: "In Transit", 
    className: "bg-info/10 text-info hover:bg-info/20" 
  },
  low: { 
    label: "Low", 
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20" 
  },
  medium: { 
    label: "Medium", 
    className: "bg-warning/10 text-warning hover:bg-warning/20" 
  },
  high: { 
    label: "High", 
    className: "bg-success/10 text-success hover:bg-success/20" 
  },
  active: { 
    label: "Active", 
    className: "bg-success/10 text-success hover:bg-success/20" 
  },
  inactive: { 
    label: "Inactive", 
    className: "bg-muted text-muted-foreground hover:bg-muted" 
  },
  fulfilled: { 
    label: "Fulfilled", 
    className: "bg-primary/10 text-primary hover:bg-primary/20" 
  },
  maintenance: { 
    label: "Maintenance", 
    className: "bg-warning/10 text-warning hover:bg-warning/20" 
  },
  verified: { 
    label: "Verified", 
    className: "bg-success/10 text-success hover:bg-success/20" 
  },
  discrepancy: { 
    label: "Discrepancy", 
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20" 
  },
  pending_approval: {
  label: "Pending Approval",
  className: "bg-warning/10 text-warning hover:bg-warning/20",
},

issued: {
  label: "Sent to Vendor",
  className: "bg-primary/10 text-primary hover:bg-primary/20",
},

received: {
  label: "Received",
  className: "bg-success/10 text-success hover:bg-success/20",
},

closed: {
  label: "Closed",
  className: "bg-muted text-muted-foreground hover:bg-muted",
},

cancelled: {
  label: "Cancelled",
  className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
},
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="secondary" 
      className={cn(config.className, "font-medium", className)}
    >
      {config.label}
    </Badge>
  );
}
