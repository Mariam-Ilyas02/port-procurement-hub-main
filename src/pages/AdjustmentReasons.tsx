import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Reason {
  id: string;
  reason: string;
  type: "increase" | "decrease";
}

const data: Reason[] = [
  {
    id: "1",
    reason: "Physical Stock Found During Audit",
    type: "increase",
  },
  {
    id: "2",
    reason: "Supplier Short Supply Correction",
    type: "increase",
  },
  {
    id: "3",
    reason: "Return from Asset (Unused Quantity)",
    type: "increase",
  },
  {
    id: "4",
    reason: "Batch Cost Correction (FIFO Adjustment)",
    type: "increase",
  },
  {
    id: "5",
    reason: "Inventory Data Entry Correction",
    type: "increase",
  },
  {
    id: "6",
    reason: "Damaged During Handling",
    type: "decrease",
  },
  {
    id: "7",
    reason: "Expired / Obsolete Stock",
    type: "decrease",
  },
  {
    id: "8",
    reason: "Loss / Theft",
    type: "decrease",
  },
  {
    id: "9",
    reason: "Physical Stock Shortage (Audit Variance)",
    type: "decrease",
  },
  {
    id: "10",
    reason: "Transfer to Another Warehouse",
    type: "decrease",
  },
  {
    id: "11",
    reason: "Manual Issuance Without Requisition",
    type: "decrease",
  },
  {
    id: "12",
    reason: "Fuel Consumption Adjustment for Asset",
    type: "decrease",
  },
];

export default function AdjustmentReasons() {
  const columns = [
    { key: "reason", header: "Reason" },
    { key: "type", header: "Type" },
  ];

  return (
    <AppLayout title="Stock Adjustment Reasons" subtitle="Define inventory adjustment reasons">
      <Card>
        <CardContent className="p-0">
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}