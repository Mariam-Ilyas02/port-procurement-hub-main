import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Plus, ChevronRight, ChevronDown, Edit, Trash2, 
  Fuel, Package, Wrench, FileText, Shield, Droplets,
  AlertTriangle, Banknote
} from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  itemCount: number;
  defaultUnit: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  subcategories: Subcategory[];
  totalItems: number;
  budgetLimit: number;
  budgetUsed: number;
}

const categoriesData: Category[] = [
  {
    id: "1",
    name: "Fuel",
    icon: Fuel,
    color: "text-warning",
    totalItems: 3,
    budgetLimit: 50000,
    budgetUsed: 21000,
    subcategories: [
      { id: "1-1", name: "Diesel", itemCount: 1, defaultUnit: "L" },
      { id: "1-2", name: "Petrol", itemCount: 1, defaultUnit: "L" },
      { id: "1-3", name: "Kerosene", itemCount: 1, defaultUnit: "L" },
    ],
  },
  {
    id: "2",
    name: "Oil",
    icon: Droplets,
    color: "text-info",
    totalItems: 4,
    budgetLimit: 15000,
    budgetUsed: 6300,
    subcategories: [
      { id: "2-1", name: "Engine Oil", itemCount: 2, defaultUnit: "L" },
      { id: "2-2", name: "Hydraulic Oil", itemCount: 1, defaultUnit: "L" },
      { id: "2-3", name: "Transmission Oil", itemCount: 1, defaultUnit: "L" },
    ],
  },
  {
    id: "3",
    name: "Lubricants",
    icon: Package,
    color: "text-success",
    totalItems: 5,
    budgetLimit: 8000,
    budgetUsed: 2400,
    subcategories: [
      { id: "3-1", name: "Grease", itemCount: 3, defaultUnit: "KG" },
      { id: "3-2", name: "Industrial Lubricant", itemCount: 2, defaultUnit: "L" },
    ],
  },
  {
    id: "4",
    name: "Spare Parts",
    icon: Wrench,
    color: "text-primary",
    totalItems: 25,
    budgetLimit: 25000,
    budgetUsed: 3750,
    subcategories: [
      { id: "4-1", name: "Brakes", itemCount: 8, defaultUnit: "Pcs" },
      { id: "4-2", name: "Filters", itemCount: 10, defaultUnit: "Pcs" },
      { id: "4-3", name: "Belts", itemCount: 4, defaultUnit: "Pcs" },
      { id: "4-4", name: "Bearings", itemCount: 3, defaultUnit: "Pcs" },
    ],
  },
  {
    id: "5",
    name: "Stationary",
    icon: FileText,
    color: "text-muted-foreground",
    totalItems: 15,
    budgetLimit: 5000,
    budgetUsed: 500,
    subcategories: [
      { id: "5-1", name: "Office Supplies", itemCount: 10, defaultUnit: "Pcs" },
      { id: "5-2", name: "Printing", itemCount: 5, defaultUnit: "Pcs" },
    ],
  },
  {
    id: "6",
    name: "Safety Equipment",
    icon: Shield,
    color: "text-destructive",
    totalItems: 12,
    budgetLimit: 10000,
    budgetUsed: 8000,
    subcategories: [
      { id: "6-1", name: "PPE", itemCount: 6, defaultUnit: "Pcs" },
      { id: "6-2", name: "Fire Safety", itemCount: 3, defaultUnit: "Pcs" },
      { id: "6-3", name: "First Aid", itemCount: 3, defaultUnit: "Pcs" },
    ],
  },
];

export default function Categories() {
  const [openCategories, setOpenCategories] = useState<string[]>(["1"]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const totalBudget = categoriesData.reduce((sum, cat) => sum + cat.budgetLimit, 0);
  const totalUsed = categoriesData.reduce((sum, cat) => sum + cat.budgetUsed, 0);

  return (
    <AppLayout
      title="Category & Budget Management"
      subtitle="Organize inventory categories and set budget limits"
      actions={
        <div className="flex gap-2">
          <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Set Budgets
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Set Category Budgets</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Set annual budget limits for each category. Requisitions exceeding these limits will require additional approval.
                </p>
                {categoriesData.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-4">
                    <span className="w-32 text-sm font-medium">{cat.name}</span>
                    <div className="flex-1">
                      <Input 
                        type="number" 
                        defaultValue={cat.budgetLimit} 
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>Cancel</Button>
                <Button>Save Budgets</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input placeholder="Enter category name" />
                </div>
                <div className="space-y-2">
                  <Label>Category Code</Label>
                  <Input placeholder="e.g., FUEL, OIL" />
                </div>
                <div className="space-y-2">
                  <Label>Annual Budget Limit (₨)</Label>
                  <Input type="number" placeholder="Enter budget limit" />
                </div>
                <div className="space-y-2">
                  <Label>Accounting Code (Optional)</Label>
                  <Input placeholder="Enter GL account code" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button>
                <Button>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="budgets">Budget Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="flex justify-end mb-4">
            <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subcategory
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Subcategory</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Parent Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory Name</Label>
                    <Input placeholder="Enter subcategory name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Unit</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Liter (L)</SelectItem>
                        <SelectItem value="KG">Kilogram (KG)</SelectItem>
                        <SelectItem value="Pcs">Pieces (Pcs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddSubcategoryOpen(false)}>Cancel</Button>
                  <Button>Add Subcategory</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {categoriesData.map((category) => {
              const Icon = category.icon;
              const isOpen = openCategories.includes(category.id);
              const budgetPercentage = (category.budgetUsed / category.budgetLimit) * 100;

              return (
                <Card key={category.id}>
                  <Collapsible open={isOpen} onOpenChange={() => toggleCategory(category.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${category.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{category.name}</CardTitle>
                              <p className="text-xs text-muted-foreground">
                                {category.subcategories.length} subcategories • {category.totalItems} items
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Budget</p>
                              <p className={`text-sm font-medium ${budgetPercentage > 80 ? "text-destructive" : "text-foreground"}`}>
                                ₨{category.budgetUsed.toLocaleString()} / ₨{category.budgetLimit.toLocaleString()}
                              </p>
                            </div>
                            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 space-y-3">
                        {/* Budget Progress */}
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Budget Usage</span>
                            <span className={budgetPercentage > 80 ? "text-destructive" : "text-muted-foreground"}>
                              {budgetPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={budgetPercentage} 
                            className={`h-2 ${budgetPercentage > 80 ? "[&>div]:bg-destructive" : ""}`}
                          />
                        </div>
                        
                        {/* Subcategories */}
                        {category.subcategories.map((sub) => (
                          <div 
                            key={sub.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span className="text-sm">{sub.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({sub.itemCount} items, {sub.defaultUnit})
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="budgets">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-2xl font-bold">₨{totalBudget.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-bold text-success">₨{(totalBudget - totalUsed).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Used</p>
                    <p className="text-2xl font-bold">₨{totalUsed.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoriesData.map((cat) => {
                const percentage = (cat.budgetUsed / cat.budgetLimit) * 100;
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ₨{cat.budgetUsed.toLocaleString()} / ₨{cat.budgetLimit.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${percentage > 80 ? "[&>div]:bg-destructive" : percentage > 60 ? "[&>div]:bg-warning" : ""}`}
                      />
                    </div>
                    <span className={`text-sm font-medium w-12 text-right ${
                      percentage > 80 ? "text-destructive" : percentage > 60 ? "text-warning" : "text-success"
                    }`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
