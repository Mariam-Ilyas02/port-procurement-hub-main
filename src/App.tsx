import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DepartmentApproval from "./pages/DepartmentApproval";
import Requisitions from "./pages/Requisitions";
import PurchaseOrders from "./pages/PurchaseOrders";
import GoodsReceipt from "./pages/GoodsReceipt";
import PayOrders from "./pages/PayOrders";
import Inventory from "./pages/Inventory";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";
import WarehouseTransfer from "./pages/WarehouseTransfer";
import ConsumptionLog from "./pages/ConsumptionLog";
import Assets from "./pages/Assets";
import Suppliers from "./pages/Suppliers";
import Categories from "./pages/Categories";
import TaxSetup from "./pages/TaxSetup";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import Items from "./pages/ItemMaster";
import Units from "./pages/Units";
import Warehouses from "./pages/Warehouses";
import Departments from "./pages/Departments";
import Budgets from "./pages/Budgets";
import AssetCategories from "./pages/AssetCategories";
import StockAdjustment from "./pages/StockAdjustment";
import AdjustmentReasons from "./pages/AdjustmentReasons";
import PaymentModes from "./pages/PaymentModes";
import ContractTypes from "./pages/ContractTypes";
import ApprovalMatrix from "./pages/ApprovalMatrix";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requisitions" element={<Requisitions />} />
          <Route path="/department-approval" element={<DepartmentApproval />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/goods-receipt" element={<GoodsReceipt />} />
          <Route path="/pay-orders" element={<PayOrders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/stock-in" element={<StockIn />} />
          <Route path="/stock-out" element={<StockOut />} />
          <Route path="/warehouse-transfer" element={<WarehouseTransfer />} />
          <Route path="/consumption-log" element={<ConsumptionLog />} />
          <Route path="/assets" element={<Assets />} />
<Route path="/items" element={<Items />} />
  <Route path="/units" element={<Units />} />
  <Route path="/warehouses" element={<Warehouses />} />
  <Route path="/departments" element={<Departments />} />        
    <Route path="/suppliers" element={<Suppliers />} />
    <Route path="/approval-matrix" element={<ApprovalMatrix />} />
<Route path="/budgets" element={<Budgets />} />
<Route path="/asset-categories" element={<AssetCategories />} />
<Route path="/adjustment-reasons" element={<AdjustmentReasons />} />
<Route path="/stock-adjustment" element={<StockAdjustment />} />
<Route path="/payment-modes" element={<PaymentModes />} />
<Route path="/contract-types" element={<ContractTypes />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tax-setup" element={<TaxSetup />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
