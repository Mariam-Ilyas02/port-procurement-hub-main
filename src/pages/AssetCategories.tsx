import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AssetCategory {
  id: string;
  name: string;
  description: string;
  depreciationRate: number;
  usefulLife: number;
}

export default function AssetCategories() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<AssetCategory[]>([
    {
      id: "1",
      name: "IT Equipment",
      description: "Laptops, desktops, servers and networking devices",
      depreciationRate: 20,
      usefulLife: 5,
    },
    {
      id: "2",
      name: "Vehicles",
      description: "Company operational vehicles",
      depreciationRate: 15,
      usefulLife: 7,
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    depreciationRate: 0,
    usefulLife: 0,
  });

  const columns = [
    { key: "name", header: "Category Name" },
    { key: "description", header: "Description" },
    { key: "depreciationRate", header: "Depreciation (%)" },
    { key: "usefulLife", header: "Useful Life (Years)" },
  ];

  const handleSave = () => {
    const newCategory: AssetCategory = {
      id: Date.now().toString(),
      ...form,
    };

    setCategories([...categories, newCategory]);
    setOpen(false);

    setForm({
      name: "",
      description: "",
      depreciationRate: 0,
      usefulLife: 0,
    });
  };

  return (
    <AppLayout
      title="Asset Categories"
      subtitle="Manage asset classification"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Asset Category</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Depreciation Rate (%)</Label>
                <Input
                  type="number"
                  value={form.depreciationRate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      depreciationRate: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Useful Life (Years)</Label>
                <Input
                  type="number"
                  value={form.usefulLife}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      usefulLife: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardContent className="p-0">
          <DataTable columns={columns} data={categories} />
        </CardContent>
      </Card>
    </AppLayout>
  );
}