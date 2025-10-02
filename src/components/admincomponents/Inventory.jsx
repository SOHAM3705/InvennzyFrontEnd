import React, { useState, useEffect } from "react";
import {
  Monitor,
  Projector,
  Zap,
  Fan,
  Wifi,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  MapPin,
  Building,
  X,
  Save,
  User,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  AlertTriangle,
  Box,
} from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EquipmentDetailsModal from "./EquipmentModel";

const Inventory = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [viewingLab, setViewingLab] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [formData, setFormData] = useState({
    labNo: "",
    labName: "",
    building: "",
    floor: "",
    capacity: 0,
    monitors: 0,
    projectors: 0,
    switchBoards: 0,
    fans: 0,
    wifi: 0,
    others: 0,
    inchargeName: "",
    inchargeEmail: "",
    inchargePhone: "",
    assistantName: "",
    assistantEmail: "",
    assistantPhone: "",
    status: "active",
  });
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("");
  const [selectedLabForEquipment, setSelectedLabForEquipment] = useState(null);

  const handleEquipmentClick = (lab, equipmentType) => {
    setSelectedLabForEquipment(lab);
    setSelectedEquipmentType(equipmentType);
    setShowEquipmentModal(true);
  };

  const generatePDF = (lab) => {
    const printWindow = window.open("", "_blank");
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lab Report - ${lab.lab_no}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0 0 0;
            font-size: 16px;
          }
          .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background-color: #f9fafb;
          }
          .section h2 {
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 15px;
            font-size: 20px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          .info-item {
            display: flex;
            flex-direction: column;
          }
          .info-label {
            font-weight: bold;
            color: #374151;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .info-value {
            color: #1f2937;
            font-size: 16px;
          }
          .equipment-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            margin-top: 15px;
          }
          .equipment-item {
            text-align: center;
            padding: 15px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background-color: white;
          }
          .equipment-count {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
          }
          .equipment-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-active {
            background-color: #dcfce7;
            color: #166534;
          }
          .status-maintenance {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-inactive {
            background-color: #fee2e2;
            color: #991b1b;
          }
          .staff-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-top: 15px;
          }
          .staff-section {
            padding: 15px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background-color: white;
          }
          .staff-title {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
            font-size: 16px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          @media print {
            body { margin: 20px; }
            .section { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${lab.lab_no} - ${lab.lab_name}</h1>
          <p>Laboratory Information Report</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="section">
          <h2>Basic Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Lab Number</span>
              <span class="info-value">${lab.lab_no}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Lab Name</span>
              <span class="info-value">${lab.lab_name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Building</span>
              <span class="info-value">${lab.building}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Floor</span>
              <span class="info-value">${lab.floor}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Capacity</span>
              <span class="info-value">${lab.capacity} students</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status</span>
              <span class="info-value">
                <span class="status-badge status-${lab.status}">${
      lab.status
    }</span>
              </span>
            </div>
          </div>
        </div>
        <div class="section">
          <h2>Equipment Inventory</h2>
          <div class="equipment-grid">
            <div class="equipment-item">
              <div class="equipment-count">${lab.monitors || 0}</div>
              <div class="equipment-label">Monitors</div>
            </div>
            <div class="equipment-item">
              <div class="equipment-count">${lab.projectors || 0}</div>
              <div class="equipment-label">Projectors</div>
            </div>
            <div class="equipment-item">
              <div class="equipment-count">${lab.switch_boards || 0}</div>
              <div class="equipment-label">Switch Boards</div>
            </div>
            <div class="equipment-item">
              <div class="equipment-count">${lab.fans || 0}</div>
              <div class="equipment-label">Fans</div>
            </div>
            <div class="equipment-item">
              <div class="equipment-count">${lab.wifi || 0}</div>
              <div class="equipment-label">WiFi Points</div>
            </div>
          </div>
        </div>
        <div class="section">
          <h2>Staff Information</h2>
          <div class="staff-grid">
            <div class="staff-section">
              <div class="staff-title">Lab In-charge</div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Name</span>
                  <span class="info-value">${
                    lab.incharge_name || "Not assigned"
                  }</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value">${lab.incharge_email || "N/A"}</span>
                </div>
                <div class="info-item" style="grid-column: span 2;">
                  <span class="info-label">Phone</span>
                  <span class="info-value">${lab.incharge_phone || "N/A"}</span>
                </div>
              </div>
            </div>
            <div class="staff-section">
              <div class="staff-title">Lab Assistant</div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Name</span>
                  <span class="info-value">${
                    lab.assistant_name || "Not assigned"
                  }</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value">${
                    lab.assistant_email || "N/A"
                  }</span>
                </div>
                <div class="info-item" style="grid-column: span 2;">
                  <span class="info-label">Phone</span>
                  <span class="info-value">${
                    lab.assistant_phone || "N/A"
                  }</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Last updated: ${new Date(lab.last_updated).toLocaleString()}</p>
          <p>This report was generated automatically from the Laboratory Inventory Management System</p>
        </div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = function () {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const adminId = localStorage.getItem("adminId");
        const response = await axios.get(
          `http://localhost:3000/api/labs/admin/${adminId}`
        );
        setLabs(response.data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch labs. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };
    fetchLabs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "maintenance":
        return Clock;
      case "inactive":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.lab_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.lab_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || lab.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      labNo: "",
      labName: "",
      building: "",
      floor: "",
      capacity: 0,
      monitors: 0,
      projectors: 0,
      switchBoards: 0,
      fans: 0,
      wifi: 0,
      others: 0,
      inchargeName: "",
      inchargeEmail: "",
      inchargePhone: "",
      assistantName: "",
      assistantEmail: "",
      assistantPhone: "",
      status: "active",
    });
  };

  const handleAddLab = async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      await axios.post("http://localhost:3000/api/labs", {
        labNo: formData.labNo,
        labName: formData.labName,
        building: formData.building,
        floor: formData.floor,
        capacity: formData.capacity,
        monitors: formData.monitors,
        projectors: formData.projectors,
        switchBoards: formData.switchBoards,
        fans: formData.fans,
        wifi: formData.wifi,
        others: formData.others,
        inchargeName: formData.inchargeName,
        inchargeEmail: formData.inchargeEmail,
        inchargePhone: formData.inchargePhone,
        assistantName: formData.assistantName,
        assistantEmail: formData.assistantEmail,
        assistantPhone: formData.assistantPhone,
        status: formData.status,
        adminId,
      });
      const labsResponse = await axios.get(
        `http://localhost:3000/api/labs/admin/${adminId}`
      );
      setLabs(labsResponse.data);
      setShowAddModal(false);
      resetForm();
      toast.success("Lab added successfully!");
    } catch (err) {
      toast.error("Failed to add lab. Please try again.");
      console.error(err);
    }
  };

  const handleEditLab = (lab) => {
    setEditingLab(lab);
    setFormData({
      labNo: lab.lab_no,
      labName: lab.lab_name,
      building: lab.building,
      floor: lab.floor,
      capacity: lab.capacity,
      monitors: lab.monitors,
      projectors: lab.projectors,
      switchBoards: lab.switch_boards,
      fans: lab.fans,
      wifi: lab.wifi,
      others: lab.others,
      inchargeName: lab.incharge_name,
      inchargeEmail: lab.incharge_email,
      inchargePhone: lab.incharge_phone,
      assistantName: lab.assistant_name,
      assistantEmail: lab.assistant_email,
      assistantPhone: lab.assistant_phone,
      status: lab.status,
    });
    setShowAddModal(true);
  };

  const handleUpdateLab = async () => {
    const adminId = localStorage.getItem("adminId");
    if (!editingLab) return;
    try {
      await axios.put(`http://localhost:3000/api/labs/${editingLab.id}`, {
        labNo: formData.labNo,
        labName: formData.labName,
        building: formData.building,
        floor: formData.floor,
        capacity: formData.capacity,
        monitors: formData.monitors,
        projectors: formData.projectors,
        switchBoards: formData.switchBoards,
        fans: formData.fans,
        wifi: formData.wifi,
        others: formData.others,
        inchargeName: formData.inchargeName,
        inchargeEmail: formData.inchargeEmail,
        inchargePhone: formData.inchargePhone,
        assistantName: formData.assistantName,
        assistantEmail: formData.assistantEmail,
        assistantPhone: formData.assistantPhone,
        status: formData.status,
      });
      const response = await axios.get(
        `http://localhost:3000/api/labs/admin/${adminId}`
      );
      setLabs(response.data);
      setShowAddModal(false);
      setEditingLab(null);
      resetForm();
      toast.success("Lab updated successfully!");
    } catch (err) {
      toast.error("Failed to update lab. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteLab = (lab) => {
    setDeleteConfirmModal(lab);
  };

  const confirmDeleteLab = async () => {
    if (!deleteConfirmModal) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/labs/${deleteConfirmModal.id}`
      );
      setLabs(labs.filter((lab) => lab.id !== deleteConfirmModal.id));
      setDeleteConfirmModal(null);
      toast.success("Lab deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete lab. Please try again.");
      console.error(err);
      setDeleteConfirmModal(null);
    }
  };

  const totalEquipment = labs.reduce(
    (acc, lab) => ({
      monitors: acc.monitors + (lab.monitors || 0),
      projectors: acc.projectors + (lab.projectors || 0),
      switchBoards: acc.switchBoards + (lab.switch_boards || 0),
      fans: acc.fans + (lab.fans || 0),
      wifi: acc.wifi + (lab.wifi || 0),
      others: acc.others + (lab.others || 0),
    }),
    { monitors: 0, projectors: 0, switchBoards: 0, fans: 0, wifi: 0, others: 0 }
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-gray-200"
            >
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 sm:p-4">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Laboratory Inventory
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Manage all college laboratory equipment and staff
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Lab
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Monitor className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Monitors
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalEquipment.monitors || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Projector className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Projectors
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalEquipment.projectors || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Switch Boards
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalEquipment.switchBoards || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Fan className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Fans
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalEquipment.fans || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Wifi className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                WiFi Points
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalEquipment.wifi || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-lg flex items-center justify-center">
              <Box className="text-white" size={20} />
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Others
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalEquipment.others || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search labs by number, name, or building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredLabs.map((lab) => {
          const StatusIcon = getStatusIcon(lab.status);
          return (
            <div
              key={lab.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lab.lab_no}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {lab.lab_name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        lab.status
                      )}`}
                    >
                      <StatusIcon size={12} className="mr-1" />
                      {lab.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="mr-2" size={16} />
                    {lab.building} - {lab.floor}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2" size={16} />
                    Capacity: {lab.capacity} students
                  </div>
                </div>

                {/* Equipment Grid - Fixed to 6 columns */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  <div className="text-center">
                    <Monitor className="mx-auto text-blue-500 mb-1" size={16} />
                    <p className="text-xs text-gray-600">{lab.monitors || 0}</p>
                  </div>
                  <div className="text-center">
                    <Projector
                      className="mx-auto text-purple-500 mb-1"
                      size={16}
                    />
                    <p className="text-xs text-gray-600">
                      {lab.projectors || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <Zap className="mx-auto text-yellow-500 mb-1" size={16} />
                    <p className="text-xs text-gray-600">
                      {lab.switch_boards || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <Fan className="mx-auto text-green-500 mb-1" size={16} />
                    <p className="text-xs text-gray-600">{lab.fans || 0}</p>
                  </div>
                  <div className="text-center">
                    <Wifi className="mx-auto text-indigo-500 mb-1" size={16} />
                    <p className="text-xs text-gray-600">{lab.wifi || 0}</p>
                  </div>
                  <div className="text-center">
                    <Box className="mx-auto text-pink-500 mb-1" size={16} />
                    <p className="text-xs text-gray-600">{lab.others || 0}</p>
                  </div>
                </div>

                <div className="border-t pt-3 sm:pt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <UserCheck className="mr-2 text-green-600" size={14} />
                    <span className="font-medium">In-charge:</span>
                    <span className="ml-1 text-gray-600">
                      {lab.incharge_name || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="mr-2 text-blue-600" size={14} />
                    <span className="font-medium">Assistant:</span>
                    <span className="ml-1 text-gray-600">
                      {lab.assistant_name || "Not assigned"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Updated: {new Date(lab.last_updated).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => setViewingLab(lab)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditLab(lab)}
                      className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Edit lab"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLab(lab)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete lab"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-gray-300 ring-1 ring-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-200">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
              </div>
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Delete Laboratory
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900">
                    {deleteConfirmModal.lab_no} - {deleteConfirmModal.lab_name}
                  </span>
                  ?
                </p>
                <p className="text-xs sm:text-sm text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg border border-red-200">
                  This action cannot be undone. All lab data and equipment
                  records will be permanently removed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setDeleteConfirmModal(null)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteLab}
                  className="flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg text-sm sm:text-base"
                >
                  <Trash2 className="mr-1.5 sm:mr-2" size={16} />
                  Delete Lab
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Lab Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-300 ring-1 ring-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {editingLab ? "Edit Laboratory" : "Add New Laboratory"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLab(null);
                    resetForm();
                  }}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lab Number
                    </label>
                    <input
                      type="text"
                      value={formData.labNo}
                      onChange={(e) =>
                        setFormData({ ...formData, labNo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                      placeholder="e.g., CS-101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lab Name
                    </label>
                    <input
                      type="text"
                      value={formData.labName}
                      onChange={(e) =>
                        setFormData({ ...formData, labName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                      placeholder="e.g., Computer Science Lab 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Building
                    </label>
                    <input
                      type="text"
                      value={formData.building}
                      onChange={(e) =>
                        setFormData({ ...formData, building: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                      placeholder="e.g., Block A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor
                    </label>
                    <input
                      type="text"
                      value={formData.floor}
                      onChange={(e) =>
                        setFormData({ ...formData, floor: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                      placeholder="e.g., 1st Floor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capacity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                      placeholder="Number of students"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Equipment Inventory */}
              <div>
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                  Equipment Inventory
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <Monitor className="inline mr-1" size={14} />
                      Monitors
                    </label>
                    <input
                      type="number"
                      value={formData.monitors || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monitors: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <Projector className="inline mr-1" size={14} />
                      Projectors
                    </label>
                    <input
                      type="number"
                      value={formData.projectors || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectors: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <Zap className="inline mr-1" size={14} />
                      Switch Boards
                    </label>
                    <input
                      type="number"
                      value={formData.switchBoards || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          switchBoards: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <Fan className="inline mr-1" size={14} />
                      Fans
                    </label>
                    <input
                      type="number"
                      value={formData.fans || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fans: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <Wifi className="inline mr-1" size={14} />
                      WiFi Points
                    </label>
                    <input
                      type="number"
                      value={formData.wifi || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wifi: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      <Box className="inline mr-1" size={14} />
                      Others
                    </label>
                    <input
                      type="number"
                      value={formData.others || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          others: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Staff Information */}
              <div>
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                  Staff Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                    <h5 className="text-sm sm:text-md font-medium text-gray-800 mb-2 sm:mb-3">
                      Lab In-charge
                    </h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.inchargeName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inchargeName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                          placeholder="Dr. John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.inchargeEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inchargeEmail: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                          placeholder="john.doe@college.edu"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.inchargePhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inchargePhone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                          placeholder="+1-555-0123"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                    <h5 className="text-sm sm:text-md font-medium text-gray-800 mb-2 sm:mb-3">
                      Lab Assistant
                    </h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.assistantName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              assistantName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.assistantEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              assistantEmail: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                          placeholder="jane.smith@college.edu"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.assistantPhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              assistantPhone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                          placeholder="+1-555-0124"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end space-x-2 sm:space-x-3 bg-gray-50">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingLab(null);
                  resetForm();
                }}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={editingLab ? handleUpdateLab : handleAddLab}
                className="flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg text-sm sm:text-base"
              >
                <Save className="mr-1.5 sm:mr-2" size={16} />
                {editingLab ? "Update Lab" : "Add Lab"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Lab Modal */}
      {viewingLab && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-300 ring-1 ring-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {viewingLab.lab_no} - {viewingLab.lab_name}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => generatePDF(viewingLab)}
                    className="flex items-center px-2 py-1.5 sm:px-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg text-xs sm:text-sm"
                    title="Download PDF Report"
                  >
                    <Download className="mr-1.5 sm:mr-2" size={14} />
                    Download PDF
                  </button>
                  <button
                    onClick={() => setViewingLab(null)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Building
                  </p>
                  <p className="text-base sm:text-lg text-gray-900">
                    {viewingLab.building}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Floor
                  </p>
                  <p className="text-base sm:text-lg text-gray-900">
                    {viewingLab.floor}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Capacity
                  </p>
                  <p className="text-base sm:text-lg text-gray-900">
                    {viewingLab.capacity} students
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Status
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      viewingLab.status
                    )}`}
                  >
                    {viewingLab.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                  Equipment Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleEquipmentClick(viewingLab, "monitor")}
                    className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <Monitor
                      className="mx-auto text-blue-500 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform"
                      size={18}
                    />
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {viewingLab.monitors || 0}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Monitors</p>
                  </button>

                  <button
                    onClick={() =>
                      handleEquipmentClick(viewingLab, "projector")
                    }
                    className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all cursor-pointer group"
                  >
                    <Projector
                      className="mx-auto text-purple-500 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform"
                      size={18}
                    />
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {viewingLab.projectors || 0}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Projectors
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      handleEquipmentClick(viewingLab, "switch_board")
                    }
                    className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 transition-all cursor-pointer group"
                  >
                    <Zap
                      className="mx-auto text-yellow-500 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform"
                      size={18}
                    />
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {viewingLab.switch_boards || 0}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Switch Boards
                    </p>
                  </button>

                  <button
                    onClick={() => handleEquipmentClick(viewingLab, "fan")}
                    className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer group"
                  >
                    <Fan
                      className="mx-auto text-green-500 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform"
                      size={18}
                    />
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {viewingLab.fans || 0}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Fans</p>
                  </button>

                  <button
                    onClick={() => handleEquipmentClick(viewingLab, "wifi")}
                    className="text-center p-2 sm:p-3 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer group"
                  >
                    <Wifi
                      className="mx-auto text-indigo-500 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform"
                      size={18}
                    />
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {viewingLab.wifi || 0}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      WiFi Points
                    </p>
                  </button>

                  <button
                    onClick={() => handleEquipmentClick(viewingLab, "other")}
                    className="text-center p-2 sm:p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 hover:border-pink-300 transition-all cursor-pointer group"
                  >
                    <Box
                      className="mx-auto text-pink-500 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform"
                      size={18}
                    />
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {viewingLab.others || 0}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Others</p>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                  Staff Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <UserCheck
                        className="text-green-600 mr-1.5 sm:mr-2"
                        size={16}
                      />
                      <h5 className="text-sm sm:text-md font-medium text-gray-800">
                        Lab In-charge
                      </h5>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium">Name:</span>{" "}
                        {viewingLab.incharge_name || "Not assigned"}
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        {viewingLab.incharge_email || "N/A"}
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium">Phone:</span>{" "}
                        {viewingLab.incharge_phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <User
                        className="text-blue-600 mr-1.5 sm:mr-2"
                        size={16}
                      />
                      <h5 className="text-sm sm:text-md font-medium text-gray-800">
                        Lab Assistant
                      </h5>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium">Name:</span>{" "}
                        {viewingLab.assistant_name || "Not assigned"}
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        {viewingLab.assistant_email || "N/A"}
                      </p>
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium">Phone:</span>{" "}
                        {viewingLab.assistant_phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t border-gray-200">
                Last updated:{" "}
                {new Date(viewingLab.last_updated).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
      <EquipmentDetailsModal
        isOpen={showEquipmentModal}
        onClose={() => {
          setShowEquipmentModal(false);
          setSelectedEquipmentType("");
          setSelectedLabForEquipment(null);
        }}
        labId={selectedLabForEquipment?.id}
        equipmentType={selectedEquipmentType}
        labName={
          selectedLabForEquipment
            ? `${selectedLabForEquipment.lab_no} - ${selectedLabForEquipment.lab_name}`
            : ""
        }
      />
    </div>
  );
};

export default Inventory;
