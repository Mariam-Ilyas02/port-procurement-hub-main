import { useState } from "react";
import { Search, Filter, FileText, Building2, Banknote, Plus, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

interface AssignedVendor {
  id: number;
  requisitionId: number;
  requisitionName: string;
  vendorId: number;
  vendorName: string;
  quotation: number;
}

const approvedRequisitions = [
  { id: 1, name: "Cement Bags" },
  { id: 2, name: "Steel Rods" },
  { id: 3, name: "Bricks" },
  { id: 4, name: "Sand" },
];

const vendors = [
  { id: 1, name: "ABC Traders" },
  { id: 2, name: "XYZ Suppliers" },
  { id: 3, name: "BuildMart" },
  { id: 4, name: "Construction Hub" },
];

export default function VendorQuotationPage() {
  // Initialize with dummy data
  const [data, setData] = useState<AssignedVendor[]>([
    {
      id: 1,
      requisitionId: 1,
      requisitionName: "Cement Bags",
      vendorId: 1,
      vendorName: "ABC Traders",
      quotation: 7676547,
    },
    {
      id: 2,
      requisitionId: 2,
      requisitionName: "Steel Rods",
      vendorId: 2,
      vendorName: "XYZ Suppliers",
      quotation: 1250000,
    },
    {
      id: 3,
      requisitionId: 3,
      requisitionName: "Bricks",
      vendorId: 3,
      vendorName: "BuildMart",
      quotation: 450000,
    },
    {
      id: 4,
      requisitionId: 4,
      requisitionName: "Sand",
      vendorId: 4,
      vendorName: "Construction Hub",
      quotation: 325000,
    },
    {
      id: 5,
      requisitionId: 1,
      requisitionName: "Cement Bags",
      vendorId: 3,
      vendorName: "BuildMart",
      quotation: 7890000,
    },
    {
      id: 6,
      requisitionId: 2,
      requisitionName: "Steel Rods",
      vendorId: 4,
      vendorName: "Construction Hub",
      quotation: 1180000,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedRequisition, setSelectedRequisition] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [quotation, setQuotation] = useState("");

  const handleSave = () => {
    if (!selectedRequisition || !selectedVendor || !quotation) return;

    const requisition = approvedRequisitions.find(
      (r) => r.id === Number(selectedRequisition)
    );

    const vendor = vendors.find(
      (v) => v.id === Number(selectedVendor)
    );

    const newEntry: AssignedVendor = {
      id: Date.now(),
      requisitionId: requisition!.id,
      requisitionName: requisition!.name,
      vendorId: vendor!.id,
      vendorName: vendor!.name,
      quotation: Number(quotation),
    };

    setData([...data, newEntry]);

    // Reset form
    setSelectedRequisition("");
    setSelectedVendor("");
    setQuotation("");
    setShowForm(false);
  };

  // Filter data based on search query
  const filteredData = data.filter(
    (item) =>
      item.requisitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Vendor Quotations"
      subtitle="Manage vendor quotations for approved requisitions"
    >
      <div style={{ 
        padding: "24px",
        backgroundColor: "#f9fafb",
        minHeight: "100vh"
      }}>
        {/* Card Container */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
          overflow: "hidden"
        }}>
          {/* Card Header with Actions */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            backgroundColor: "#f9fafb"
          }}>
            {/* Left side - Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 style={{ width: "20px", height: "20px", color: "#2563eb" }} />
              <h2 style={{ 
                fontSize: "18px", 
                fontWeight: "600", 
                color: "#111827",
                margin: 0
              }}>
                Quotations List
              </h2>
              {data.length > 0 && (
                <span style={{
                  backgroundColor: "#e5e7eb",
                  color: "#4b5563",
                  fontSize: "12px",
                  fontWeight: "500",
                  padding: "2px 8px",
                  borderRadius: "12px"
                }}>
                  {data.length} items
                </span>
              )}
            </div>

            {/* Right side - Search and Add Button */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {/* Search Bar */}
              <div style={{ position: "relative" }}>
                <Search style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "16px",
                  height: "16px",
                  color: "#9ca3af"
                }} />
                <input
                  type="text"
                  placeholder="Search quotations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "8px 12px 8px 36px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "14px",
                    width: "240px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {/* Add Button */}
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
              >
                <Plus size={16} />
                Add Quotation
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    color: "#6b7280", 
                    fontWeight: "500",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Requisition
                  </th>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    color: "#6b7280", 
                    fontWeight: "500",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Vendor
                  </th>
                  <th style={{ 
                    padding: "16px 20px", 
                    textAlign: "left", 
                    color: "#6b7280", 
                    fontWeight: "500",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Quotation (PKR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ 
                      textAlign: "center", 
                      padding: "60px 20px",
                      color: "#9ca3af"
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <Building2 size={40} style={{ color: "#d1d5db" }} />
                        <p style={{ margin: 0, fontSize: "16px", fontWeight: "500", color: "#6b7280" }}>
                          No quotations found
                        </p>
                        <p style={{ margin: 0, fontSize: "14px" }}>
                          {searchQuery ? "Try adjusting your search" : "Click 'Add Quotation' to create your first quotation"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FileText size={16} style={{ color: "#9ca3af" }} />
                          <span style={{ color: "#111827", fontWeight: "500" }}>{item.requisitionName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Building2 size={16} style={{ color: "#9ca3af" }} />
                          <span style={{ color: "#4b5563" }}>{item.vendorName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Banknote size={16} style={{ color: "#9ca3af" }} />
                          <span style={{ 
                            color: "#059669", 
                            fontWeight: "600",
                            fontSize: "15px"
                          }}>
                            ₨{item.quotation.toLocaleString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)"
          }}>
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              width: "450px",
              maxWidth: "90%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "20px"
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: "18px", 
                  fontWeight: "600",
                  color: "#111827",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <FileText size={20} style={{ color: "#2563eb" }} />
                  Add New Quotation
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                    e.currentTarget.style.color = "#4b5563";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#9ca3af";
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  fontSize: "14px", 
                  fontWeight: "500",
                  color: "#374151"
                }}>
                  Select Item
                </label>
                <select
                  value={selectedRequisition}
                  onChange={(e) => setSelectedRequisition(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                >
                  <option value="">select from drop down</option>
                  {approvedRequisitions.map((req) => (
                    <option key={req.id} value={req.id}>
                      {req.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  fontSize: "14px", 
                  fontWeight: "500",
                  color: "#374151"
                }}>
                  Select Vendor
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                >
                  <option value="">Choose a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "6px", 
                  fontSize: "14px", 
                  fontWeight: "500",
                  color: "#374151"
                }}>
                  Quotation Amount (PKR)
                </label>
                <div style={{ position: "relative" }}>
                  <Banknote style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    color: "#9ca3af"
                  }} />
                  <input
                    type="number"
                    value={quotation}
                    onChange={(e) => setQuotation(e.target.value)}
                    placeholder="Enter amount"
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                    onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "white",
                    color: "#4b5563",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                    e.currentTarget.style.borderColor = "#9ca3af";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
                >
                  Save Quotation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}