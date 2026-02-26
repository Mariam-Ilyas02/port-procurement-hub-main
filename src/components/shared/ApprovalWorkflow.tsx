import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, User, Shield } from "lucide-react";

interface ApprovalStep {
  level: string;
  approver: string;
  status: "pending" | "approved" | "rejected";
  date?: string;
  comments?: string;
}

interface ApprovalWorkflowProps {
  requestId: string;
  amount: number;
  department: string;
  currentStep: number;
  steps: ApprovalStep[];
  onApprove: (level: string, comments: string) => void;
  onReject: (level: string, comments: string) => void;
}

export function ApprovalWorkflow({ 
  requestId, 
  amount, 
  department,
  currentStep,
  steps,
  onApprove,
  onReject 
}: ApprovalWorkflowProps) {
  const [comments, setComments] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Approval Workflow</h4>
        <Badge variant="outline" className="text-xs">
          Amount: ₨{amount.toLocaleString()}
        </Badge>
      </div>

      {/* Workflow Visualization */}
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.level} className="flex items-start gap-3 mb-4">
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === "approved" ? "bg-success/10 text-success" :
                step.status === "rejected" ? "bg-destructive/10 text-destructive" :
                index === currentStep ? "bg-primary/10 text-primary" :
                "bg-muted text-muted-foreground"
              }`}>
                {step.status === "approved" ? <CheckCircle className="w-4 h-4" /> :
                 step.status === "rejected" ? <XCircle className="w-4 h-4" /> :
                 index === currentStep ? <Clock className="w-4 h-4" /> :
                 <Shield className="w-4 h-4" />}
              </div>
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-4 w-0.5 h-8 bg-border" />
              )}
            </div>
            
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{step.level}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <User className="w-3 h-3" />
                    {step.approver}
                  </div>
                </div>
                {step.date && (
                  <span className="text-xs text-muted-foreground">{step.date}</span>
                )}
              </div>
              
              {step.comments && (
                <p className="text-xs mt-2 p-2 bg-muted/50 rounded">
                  "{step.comments}"
                </p>
              )}

              {index === currentStep && step.status === "pending" && (
                <div className="mt-3 space-y-2">
                  <textarea
                    className="w-full text-sm p-2 border rounded-md"
                    placeholder="Add comments (optional for approval, required for rejection)"
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        onApprove(step.level, comments);
                        setComments("");
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        if (!comments.trim()) {
                          alert("Please provide a reason for rejection");
                          return;
                        }
                        onReject(step.level, comments);
                        setComments("");
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Budget Info */}
      <Card className="p-3 bg-muted/50">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Department Budget ({department})</span>
          <span className="font-medium">₨{(amount * 1.5).toLocaleString()} remaining</span>
        </div>
      </Card>
    </div>
  );
}