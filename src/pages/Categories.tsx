import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  code: string;
  defaultUnit: string;
  accountingCode?: string;
  budgetLimit?: number;
  status: "Active" | "Inactive";
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Fuel",
    code: "FUEL",
    defaultUnit: "L",
    accountingCode: "ACC-101",
    budgetLimit: 50000,
    status: "Active",
  },
  
  {
    id: "2",
    name: "Oil",
    code: "OIL",
    defaultUnit: "L",
    budgetLimit: 15000,
    status: "Active",
  },
  {
    id: "3",
    name: "Lubricants",
    code: "LUB",
    defaultUnit: "KG",
    budgetLimit: 8000,
    status: "Active",
  },
  {
    id: "4",
    name: "Spare Parts",
    code: "SP",
    defaultUnit: "Pcs",
    status: "Active",
  },
  {
    id: "5",
    name: "Stationary",
    code: "STAT",
    defaultUnit: "Pcs",
    status: "Inactive",
  },
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AppLayout
      title="Category Setup"
      subtitle="Manage inventory categories and budget configuration"
      actions={
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input placeholder="Enter category name" />
              </div>

              <div className="space-y-2">
                <Label>Category Code</Label>
                <Input placeholder="e.g., FUEL" />
              </div>

              <div className="space-y-2">
                <Label>Default Unit</Label>
                <Input placeholder="L / KG / Pcs" />
              </div>

              <div className="space-y-2">
                <Label>Annual Budget Limit (₨)</Label>
                <Input type="number" placeholder="Enter budget (optional)" />
              </div>

              <div className="space-y-2">
                <Label>Accounting Code (Optional)</Label>
                <Input placeholder="GL Code" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button>Save Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-6 p-3 bg-muted text-sm font-medium">
              <div>Name</div>
              <div>Code</div>
              <div>Unit</div>
              <div>Budget</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="grid grid-cols-6 p-3 border-t text-sm items-center hover:bg-muted/50 transition"
              >
                <div className="font-medium">{cat.name}</div>
                <div>{cat.code}</div>
                <div>{cat.defaultUnit}</div>

                <div>
                  {cat.budgetLimit ? (
                    <span className="text-primary font-medium">
                      ₨{cat.budgetLimit.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Not Set</span>
                  )}
                </div>

                <div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      cat.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}