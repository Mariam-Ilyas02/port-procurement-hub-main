import { useState } from "react";
import { Search, FileText, Building2, Plus, X, Upload, Download, Hash, Package } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

interface AssignedVendor {
  id: number;
  requisitionId: number;
  requisitionNumber: string;
  requisitionName: string;
  itemName: string;
  vendorId: number;
  vendorName: string;
  quotationDoc: {
    name: string;
    size: string;
    url: string;
  };
}

// Updated requisitions data with requisition numbers and items
const approvedRequisitions = [
  { 
    id: 101,
    requisitionNumber: "REQ-2024-001",
    name: "Cement Bags",
    itemName: "Portland Cement 50kg",
    vendors: [
      { id: 1, name: "ABC Traders" },
      { id: 2, name: "BuildMart" }
    ]
  },
  { 
    id: 102,
    requisitionNumber: "REQ-2024-002", 
    name: "Steel Rods",
    itemName: "12mm Steel Reinforcement Bars",
    vendors: [
      { id: 3, name: "XYZ Suppliers" },
      { id: 4, name: "Construction Hub" }
    ]
  },
  { 
    id: 103,
    requisitionNumber: "REQ-2024-003",
    name: "Sand",
    itemName: "Fine River Sand",
    vendors: [
      { id: 5, name: "Sand Co" },
      { id: 6, name: "Builders Supply" }
    ]
  },
  { 
    id: 104,
    requisitionNumber: "REQ-2024-004",
    name: "Bricks",
    itemName: "Clay Bricks 9x4x3 inches",
    vendors: [
      { id: 7, name: "Brick Masters" },
      { id: 8, name: "Red Clay Supplies" }
    ]
  }
];

export default function VendorQuotationPage() {
  const [data, setData] = useState<AssignedVendor[]>([
    {
      id: 1,
      requisitionId: 101,
      requisitionNumber: "REQ-2024-001",
      requisitionName: "Cement Bags",
      itemName: "Portland Cement 50kg",
      vendorId: 1,
      vendorName: "ABC Traders",
      quotationDoc: { name: "cement_abc.pdf", size: "245 KB", url: "#" },
    },
    {
      id: 2,
      requisitionId: 101,
      requisitionNumber: "REQ-2024-001",
      requisitionName: "Cement Bags",
      itemName: "Portland Cement 50kg",
      vendorId: 2,
      vendorName: "BuildMart",
      quotationDoc: { name: "cement_buildmart.pdf", size: "298 KB", url: "#" },
    },
    {
      id: 3,
      requisitionId: 102,
      requisitionNumber: "REQ-2024-002",
      requisitionName: "Steel Rods",
      itemName: "12mm Steel Reinforcement Bars",
      vendorId: 3,
      vendorName: "XYZ Suppliers",
      quotationDoc: { name: "steel_xyz.pdf", size: "189 KB", url: "#" },
    },
    {
      id: 4,
      requisitionId: 102,
      requisitionNumber: "REQ-2024-002",
      requisitionName: "Steel Rods",
      itemName: "12mm Steel Reinforcement Bars",
      vendorId: 4,
      vendorName: "Construction Hub",
      quotationDoc: { name: "steel_chub.pdf", size: "205 KB", url: "#" },
    },
    {
      id: 5,
      requisitionId: 103,
      requisitionNumber: "REQ-2024-003",
      requisitionName: "Sand",
      itemName: "Fine River Sand",
      vendorId: 5,
      vendorName: "Sand Co",
      quotationDoc: { name: "sand_co.pdf", size: "178 KB", url: "#" },
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequisition, setSelectedRequisition] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // New state for selected requisition details
  const [selectedRequisitionDetails, setSelectedRequisitionDetails] = useState<{
    requisitionNumber: string;
    itemName: string;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSave = () => {
    if (!selectedRequisition || !selectedVendor || !selectedFile) return;

    const requisition = approvedRequisitions.find(r => r.id === Number(selectedRequisition));
    const vendor = filteredVendors.find(v => v.id === Number(selectedVendor));

    if (!requisition || !vendor) return;

    const newEntry: AssignedVendor = {
      id: Date.now(),
      requisitionId: requisition.id,
      requisitionNumber: requisition.requisitionNumber,
      requisitionName: requisition.name,
      itemName: requisition.itemName,
      vendorId: vendor.id,
      vendorName: vendor.name,
      quotationDoc: {
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
        url: "#"
      },
    };

    setData([...data, newEntry]);
    setShowForm(false);
    setSelectedRequisition("");
    setSelectedVendor("");
    setSelectedFile(null);
    setFilteredVendors([]);
    setSelectedRequisitionDetails(null);
  };

  const filteredData = data.filter(item =>
    item.requisitionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.requisitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.quotationDoc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Vendor Quotations" subtitle="Manage quotations for approved requisitions">
      <div style={{ padding: "24px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 style={{ width: "20px", height: "20px", color: "#2563eb" }} />
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Vendor Quotations</h2>
              {data.length > 0 && <span style={{ backgroundColor: "#e5e7eb", color: "#4b5563", fontSize: "12px", fontWeight: "500", padding: "2px 8px", borderRadius: "12px" }}>{data.length} items</span>}
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#9ca3af" }} />
                <input
                  type="text"
                  placeholder="Search by requisition #, item, vendor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: "8px 12px 8px 36px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", width: "280px" }}
                />
              </div>
              <button onClick={() => setShowForm(true)} style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <Plus size={16} /> Add Quotation
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: "#6b7280", fontWeight: "500", fontSize: "12px" }}>Requisition #</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: "#6b7280", fontWeight: "500", fontSize: "12px" }}>Item</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: "#6b7280", fontWeight: "500", fontSize: "12px" }}>Vendor</th>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: "#6b7280", fontWeight: "500", fontSize: "12px" }}>Quotation Document</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
                      No quotations found
                    </td>
                  </tr>
                ) : (
                  filteredData.map(item => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Hash size={14} style={{ color: "#9ca3af" }} />
                          <span>{item.requisitionNumber}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                          {item.requisitionName}
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Package size={14} style={{ color: "#9ca3af" }} />
                          <span>{item.itemName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>{item.vendorName}</td>
                      <td style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <span>{item.quotationDoc.name} ({item.quotationDoc.size})</span>
                        <button 
                          onClick={() => window.open(item.quotationDoc.url, "_blank")}
                          style={{ cursor: "pointer", background: "none", border: "none" }}
                        >
                          <Download size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <div style={{ background: "white", borderRadius: "12px", padding: "24px", width: "500px", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={20} /> Upload Quotation Document
                </h3>
                <button 
                  onClick={() => setShowForm(false)}
                  style={{ cursor: "pointer", background: "none", border: "none", padding: "4px" }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>
                  <Hash size={14} style={{ display: "inline", marginRight: "4px" }} />
                  Select Requisition
                </label>
                <select
                  value={selectedRequisition}
                  onChange={(e) => {
                    const reqId = Number(e.target.value);
                    setSelectedRequisition(e.target.value);
                    const requisition = approvedRequisitions.find(r => r.id === reqId);
                    if (requisition) {
                      setSelectedRequisitionDetails({
                        requisitionNumber: requisition.requisitionNumber,
                        itemName: requisition.itemName
                      });
                      setFilteredVendors(requisition.vendors);
                    } else {
                      setSelectedRequisitionDetails(null);
                      setFilteredVendors([]);
                    }
                    setSelectedVendor("");
                  }}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" }}
                >
                  <option value="">Select Requisition</option>
                  {approvedRequisitions.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.requisitionNumber} - {r.name} ({r.itemName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Display selected requisition details */}
              {selectedRequisitionDetails && (
                <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>Selected Requisition Details:</div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>Requisition #:</span>
                      <div style={{ fontWeight: "500", fontSize: "14px" }}>{selectedRequisitionDetails.requisitionNumber}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>Item:</span>
                      <div style={{ fontWeight: "500", fontSize: "14px" }}>{selectedRequisitionDetails.itemName}</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Select Vendor</label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" }}
                  disabled={!selectedRequisition}
                >
                  <option value="">Select Vendor</option>
                  {filteredVendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}>Upload Quotation Document</label>
                <div style={{ border: "2px dashed #e5e7eb", borderRadius: "8px", padding: "20px", textAlign: "center", backgroundColor: "#f9fafb" }}>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload" 
                    style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
                  >
                    <Upload size={24} style={{ color: "#9ca3af" }} />
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>Click to upload or drag and drop</span>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>PDF, DOC, XLS up to 10MB</span>
                  </label>
                </div>
                {selectedFile && (
                  <div style={{ marginTop: "12px", padding: "8px", backgroundColor: "#f3f4f6", borderRadius: "6px", fontSize: "14px" }}>
                    <strong>Selected file:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </div>
                )}
              </div>

              <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button 
                  onClick={() => setShowForm(false)}
                  style={{ padding: "8px 16px", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={!selectedRequisition || !selectedVendor || !selectedFile}
                  style={{ 
                    padding: "8px 16px", 
                    backgroundColor: (!selectedRequisition || !selectedVendor || !selectedFile) ? "#e5e7eb" : "#2563eb", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: (!selectedRequisition || !selectedVendor || !selectedFile) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Upload size={16} /> Upload Quotation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}