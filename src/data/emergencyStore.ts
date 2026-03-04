// Simple in-memory store for demo only

export interface EmergencyRequest {
  id: string;
  reqNumber: string;
  requester: string;
  requesterEmail: string;
  department: string;
  itemDescription: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  priority: "urgent" | "high" | "normal" | "low";
  requestDate: string;
  requiredDate: string;
  status: "pending_dept";
  justification: string;
  approvalStep: number;
  approvalSteps: {
    level: string;
    approver: string;
    status: "pending" | "approved" | "rejected";
  }[];
}

export const emergencyRequests: EmergencyRequest[] = [];