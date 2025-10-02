import React, { useEffect, useState, useMemo } from "react";
import jsPDF from "jspdf";
import {
  CheckCircle,
  AlertCircle,
  X,
  Clock,
  User,
  FileText,
  Settings,
  CheckSquare,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Modal({ isOpen, onClose, type, title, message }) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "info":
        return <AlertCircle className="w-8 h-8 text-blue-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className={`p-4 rounded-lg border ${getBgColor()}`}>
            <p className="text-gray-700">{message}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ steps, currentStep, completedSteps = 0 }) {
  const pct = useMemo(() => {
    // guard against negative widths when completedSteps is 0
    const clamped = Math.max(0, completedSteps - 1);
    return (clamped / (steps.length - 1)) * 100;
  }, [completedSteps]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200"></div>
        <div
          className="absolute top-6 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-in-out"
          style={{ width: `${pct}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = step.id <= completedSteps;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.id <= Math.max(completedSteps, 2);
            return (
              <div key={step.id} className="flex flex-col items-center group">
                <div
                  className={`
                    relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                        : isCurrent
                        ? "bg-white border-blue-600 text-blue-600 shadow-lg ring-4 ring-blue-100"
                        : isAccessible
                        ? "bg-white border-gray-300 text-gray-400"
                        : "bg-gray-100 border-gray-200 text-gray-300"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-3 text-center max-w-24">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? "text-blue-700"
                        : isCompleted
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step.subtitle}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrent
                        ? "text-blue-500"
                        : isCompleted
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    ({step.role})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LabInchargeForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  const [equipmentList, setEquipmentList] = useState([]);

  const [form, setForm] = useState({
    typeOfProblem: "",
    date: "",
    department: "",
    location: "",
    complaintDetails: "",
    recurringComplaint: "no",
    recurringTimes: "",
    labAssistant: "",
    labAssistantDate: "",
    hod: "",
    hodDate: "",
    inChargeDate: "",
    inChargeSignature: "",
    assignedPerson: "",
    verificationRemarks: "",
    materialsUsed: "",
    resolvedInhouse: "yes",
    resolvedRemark: "",
    consumablesNeeded: "no",
    consumableDetails: "",
    externalAgencyNeeded: "no",
    agencyName: "",
    approxExpenditure: "",
    completionRemarkLab: "",
    labCompletionName: "",
    labCompletionSignature: "",
    labCompletionDate: "",
    completionRemarkMaintenance: "",
    maintenanceClosedDate: "",
    maintenanceClosedSignature: "",
    adminApprovalStatus: "",
    adminApprovalDate: "",
    equipment_id: "",
    equipmentStatus: "",
  });
  const { requestId } = useParams();
  const isViewMode = !!requestId;

  const showModal = (type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  };
  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "" });
  };

  const stepFields = {
    1: ["typeOfProblem", "date"],
    2: [
      "department",
      "location",
      "complaintDetails",
      "labAssistant",
      "labAssistantDate",
      "hod",
      "hodDate",
    ],
    3: ["assignedPerson", "inChargeDate", "verificationRemarks"],
    4: ["materialsUsed", "resolvedInhouse", "resolvedRemark"],
    5: ["adminApprovalStatus"], // NEW step
    6: [
      "completionRemarkLab",
      "labCompletionName",
      "labCompletionDate",
      "completionRemarkMaintenance",
      "maintenanceClosedDate",
    ],
  };

  const steps = [
    {
      id: 1,
      title: "Problem Details",
      subtitle: "Type & Date",
      icon: FileText,
      role: "Lab In-charge",
    },
    {
      id: 2,
      title: "Submit Request",
      subtitle: "Originator Info",
      icon: User,
      role: "Lab In-charge",
    },
    {
      id: 3,
      title: "Verification",
      subtitle: "Under Review",
      icon: Clock,
      role: "Maintenance Team",
    },
    {
      id: 4,
      title: "Corrective Action",
      subtitle: "In Progress",
      icon: Settings,
      role: "Maintenance Team",
    },
    ...(form?.resolvedInhouse === "yes"
      ? []
      : [
          {
            id: 5,
            title: "Admin Approval",
            subtitle:
              form?.adminApprovalStatus === "approved"
                ? "Approved"
                : form?.adminApprovalStatus === "rejected"
                ? "Rejected"
                : "Pending Review",
            icon: AlertCircle,
            role: "Admin",
          },
        ]),
    {
      id: 6,
      title: "Closure",
      subtitle: "Completed",
      icon: CheckSquare,
      role: "Maintenance Team",
    },
  ];

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const staffId = localStorage.getItem("staffId");
        const res = await axios.get(`/api/labs/equipment/by-staff/${staffId}`);

        // ✅ Use flat array (items)
        if (res.data && Array.isArray(res.data.items)) {
          setEquipmentList(res.data.items);
        } else {
          setEquipmentList([]);
        }
      } catch (err) {
        console.error("Error fetching equipments:", err);
        setEquipmentList([]);
      }
    };

    fetchEquipments();
  }, []);

  const isStepCompleted = (step) => {
    if (step === 5) {
      // ✅ Only count completed when Admin actually approves/rejects
      return (
        form?.adminApprovalStatus === "approved" ||
        form?.adminApprovalStatus === "rejected"
      );
    }

    const fields = stepFields[step];
    return fields.every(
      (field) => form[field] && form[field].toString().trim() !== ""
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    const stepIds = steps.map((s) => s.id); // dynamic step order
    const currentIndex = stepIds.indexOf(currentStep);

    if (currentIndex < stepIds.length - 1) {
      const next = stepIds[currentIndex + 1];
      setCurrentStep(next);
      if (next > completedSteps) {
        setCompletedSteps(next);
      }
    }
  };

  const prevStep = () => {
    const stepIds = steps.map((s) => s.id);
    const currentIndex = stepIds.indexOf(currentStep);

    if (currentIndex > 0) {
      const prev = stepIds[currentIndex - 1];
      setCurrentStep(prev);
    }
  };

  const handleSubmitRequest = async () => {
    const staffId = localStorage.getItem("staffId");
    const cleanedForm = {
      ...form,
      recurringTimes:
        form.recurringComplaint === "yes" ? form.recurringTimes : null,
    };
    try {
      const response = await fetch("/api/requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form: cleanedForm,
          staff_id: staffId,
          equipment_id: form.equipment_id,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      const data = await response.json();
      setCompletedSteps(2);
      setCurrentStep(3);
      showModal(
        "info",
        "Request Submitted Successfully",
        `Your maintenance request has been submitted (Request ID: ${data.requestId}).`
      );
    } catch (error) {
      console.error("Submit error:", error);
      showModal("info", "Submission Failed", "Please try again.");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const addText = (label, value, isBold = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(11);
      doc.text(`${label}: ${value || "-"}`, 14, y);
      y += 7;
    };
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Maintenance Request Form - Lab In-charge Copy", 14, y);
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(14, y, 195, y);
    y += 10;
    addText("Type of Problem", form.typeOfProblem, true);
    addText("Date", form.date);
    addText("Department", form.department);
    addText("Location", form.location);
    addText("Complaint Details", form.complaintDetails);
    addText("Recurring Complaint", form.recurringComplaint);
    if (form.recurringComplaint === "yes") {
      addText("Number of times", form.recurringTimes);
    }
    addText("Lab Assistant", form.labAssistant);
    addText("Lab Assistant Date", form.labAssistantDate);
    addText("Head of Department", form.hod);
    addText("HOD Date", form.hodDate);
    doc.save("maintenance_request_lab_incharge.pdf");
  };

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;
      try {
        setLoading(true);
        const res = await axios.get(`/api/requests/${requestId}`);
        const data = res.data || {};
        setForm({
          typeOfProblem: data.type_of_problem || "",
          date: data.date ? String(data.date).split("T")[0] : "",
          department: data.department || "",
          location: data.location || "",
          complaintDetails: data.complaint_details || "",
          recurringComplaint: data.recurring_complaint || "no",
          recurringTimes: data.recurring_times ?? "",
          labAssistant: data.lab_assistant || "",
          labAssistantDate: data.lab_assistant_date
            ? String(data.lab_assistant_date).split("T")[0]
            : "",
          hod: data.hod || "",
          hodDate: data.hod_date ? String(data.hod_date).split("T")[0] : "",
          inChargeDate: data.in_charge_date
            ? String(data.in_charge_date).split("T")[0]
            : "",
          inChargeSignature: data.in_charge_signature || "",
          assignedPerson: data.assigned_person || "",
          verificationRemarks: data.verification_remarks || "",
          materialsUsed: data.materials_used || "",
          resolvedInhouse: data.resolved_inhouse || "yes",
          resolvedRemark: data.resolved_remark || "",
          consumablesNeeded: data.consumables_needed || "no",
          consumableDetails: data.consumable_details || "",
          externalAgencyNeeded: data.external_agency_needed || "no",
          agencyName: data.agency_name || "",
          approxExpenditure: data.approx_expenditure || "",
          completionRemarkLab: data.completion_remark_lab || "",
          labCompletionName: data.lab_completion_name || "",
          labCompletionSignature: data.lab_completion_signature || "",
          labCompletionDate: data.lab_completion_date
            ? String(data.lab_completion_date).split("T")[0]
            : "",
          completionRemarkMaintenance: data.completion_remark_maintenance || "",
          maintenanceClosedDate: data.maintenance_closed_date
            ? String(data.maintenance_closed_date).split("T")[0]
            : "",
          maintenanceClosedSignature: data.maintenance_closed_signature || "",
          adminApprovalStatus: data.admin_approval_status || "",
          adminApprovalDate: data.admin_approval_date
            ? String(data.admin_approval_date).split("T")[0]
            : "",
          equipment_id: res.data.equipment_id
            ? res.data.equipment_id.toString()
            : "",
          equipmentStatus:
            data.equipment_status === "0"
              ? "active"
              : data.equipment_status === "1"
              ? "damaged"
              : "maintenance",
        });
        let maxCompleted = 0;
        for (let step = 1; step <= 6; step++) {
          if (isStepCompleted(step)) {
            maxCompleted = step;
          } else {
            break;
          }
        }
        setCompletedSteps(maxCompleted);
        setCurrentStep(data.current_step || 1);
      } catch (err) {
        console.error("Error fetching request:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);

  useEffect(() => {
    let maxCompleted = 0;
    for (let step = 1; step <= 6; step++) {
      if (isStepCompleted(step)) {
        maxCompleted = step;
      } else {
        break;
      }
    }
    setCompletedSteps(maxCompleted);
  }, [form]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
      <div className="max-w-4xl mx-auto w-full">
        <ProgressBar
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
          {loading ? (
            <div className="animate-pulse text-gray-500 text-center py-8">
              Loading request...
            </div>
          ) : (
            <>
              {/* Step 1: Problem Details */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                      Problem Details
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      Please provide the basic information about the maintenance
                      issue
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Type of Problem <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="typeOfProblem"
                        value={form.typeOfProblem}
                        onChange={handleChange}
                        required
                        disabled={isViewMode}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Problem Type</option>
                        <option value="System">System</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Civil">Civil</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        disabled={isViewMode}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Select Equipment
                      </label>
                      <select
                        value={form.equipment_id}
                        onChange={(e) =>
                          setForm({ ...form, equipment_id: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">-- Select Equipment --</option>
                        {equipmentList.length > 0 ? (
                          equipmentList.map((eq) => (
                            <option
                              key={eq.equipment_id}
                              value={eq.equipment_id}
                            >
                              {eq.equipment_name} ({eq.equipment_type}) -{" "}
                              {eq.equipment_code}
                            </option>
                          ))
                        ) : (
                          <option disabled>No equipment available</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Request Details */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <User className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                      Request Details
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      Complete the request information and submit for processing
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        required
                        disabled={isViewMode}
                        placeholder="Enter department name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        disabled={isViewMode}
                        placeholder="Enter specific location"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Complaint Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="complaintDetails"
                      value={form.complaintDetails}
                      onChange={handleChange}
                      required
                      disabled={isViewMode}
                      placeholder="Describe the issue in detail..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 mt-4 sm:mt-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Recurring Complaint?
                      </label>
                      <select
                        name="recurringComplaint"
                        value={form.recurringComplaint}
                        onChange={handleChange}
                        disabled={isViewMode}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    {form.recurringComplaint === "yes" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          How many times?
                        </label>
                        <input
                          type="number"
                          name="recurringTimes"
                          min="1"
                          value={form.recurringTimes}
                          onChange={handleChange}
                          disabled={isViewMode}
                          placeholder="Enter number"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mt-4 sm:mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Approval Information
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Lab Assistant Name
                        </label>
                        <input
                          name="labAssistant"
                          value={form.labAssistant}
                          onChange={handleChange}
                          disabled={isViewMode}
                          placeholder="Enter lab assistant name"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          name="labAssistantDate"
                          value={form.labAssistantDate}
                          onChange={handleChange}
                          disabled={isViewMode}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Head of Department
                        </label>
                        <input
                          name="hod"
                          value={form.hod}
                          onChange={handleChange}
                          disabled={isViewMode}
                          placeholder="Enter HOD name"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          name="hodDate"
                          value={form.hodDate}
                          onChange={handleChange}
                          disabled={isViewMode}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Verification Stage */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-500 flex items-center gap-2 sm:gap-3">
                      <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-orange-500" />
                      Verification Stage
                    </h2>
                    <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                      Your request is being reviewed by the maintenance team
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-orange-800">
                        Under Review
                      </h3>
                    </div>
                    <p className="text-orange-700 text-sm sm:text-base">
                      The maintenance team is currently reviewing your request.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Person
                      </label>
                      <input
                        value={form.assignedPerson || ""}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Date
                      </label>
                      <input
                        type="date"
                        value={form.inChargeDate || ""}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Remarks
                      </label>
                      <textarea
                        value={form.verificationRemarks || ""}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Corrective Action */}
              {currentStep === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-500 flex items-center gap-2 sm:gap-3">
                      <Settings className="w-5 h-5 sm:w-7 sm:h-7 text-blue-500" />
                      Corrective Action
                    </h2>
                    <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                      Maintenance work is in progress
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-blue-800">
                        Work in Progress
                      </h3>
                    </div>
                    <p className="text-blue-700 text-sm sm:text-base">
                      The maintenance team is actively working on resolving your
                      issue.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Materials Used
                      </label>
                      <textarea
                        value={form.materialsUsed || ""}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resolved In-house?
                      </label>
                      <select
                        value={form.resolvedInhouse || "yes"}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resolution Remark
                      </label>
                      <input
                        value={form.resolvedRemark || ""}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Admin Approval */}
              {currentStep === 5 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-500 flex items-center gap-2 sm:gap-3">
                      <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7 text-purple-500" />
                      Admin Approval
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      {form?.adminApprovalStatus === "approved"
                        ? "This request has been approved by Admin."
                        : form?.adminApprovalStatus === "rejected"
                        ? "This request was rejected by Admin."
                        : "This request is pending admin approval."}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 6: Closure */}
              {currentStep === 6 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-500 flex items-center gap-2 sm:gap-3">
                      <CheckSquare className="w-5 h-5 sm:w-7 sm:h-7 text-green-500" />
                      Closure
                    </h2>
                    <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                      Final completion and sign-off
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <CheckSquare className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-green-800">
                        Finalize Request
                      </h3>
                    </div>
                    <p className="text-green-700 text-sm sm:text-base">
                      Complete the final details for this maintenance request.
                    </p>
                  </div>

                  {/* Equipment Status Section */}
                  <div className="mt-3 sm:mt-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                      Equipment Status
                    </h3>
                    <p className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full mb-2 sm:mb-3">
                      Current Status:{" "}
                      {form.equipmentStatus === "active"
                        ? "Active"
                        : form.equipmentStatus === "damaged"
                        ? "Damaged"
                        : "In Maintenance"}
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="equipmentStatus"
                          value="active"
                          checked={form.equipmentStatus === "active"}
                          onChange={handleChange}
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Active
                        </span>
                      </label>
                      <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="equipmentStatus"
                          value="damaged"
                          checked={form.equipmentStatus === "damaged"}
                          onChange={handleChange}
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Damaged
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Completion Remarks (Lab)
                      </label>
                      <textarea
                        value={form.completionRemarkLab || ""}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Completed By (Lab)
                        </label>
                        <input
                          value={form.labCompletionName || ""}
                          disabled
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Completion Date (Lab)
                        </label>
                        <input
                          type="date"
                          value={form.labCompletionDate || ""}
                          disabled
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Completion Remarks (Maintenance)
                      </label>
                      <textarea
                        value={form.completionRemarkMaintenance || ""}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Closed Date (Maintenance)
                      </label>
                      <input
                        type="date"
                        value={form.maintenanceClosedDate || ""}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className={`w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium text-sm sm:text-base ${
                    currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  ← Previous
                </button>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  {currentStep === 2 && (
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all font-medium text-sm sm:text-base"
                      onClick={handleSubmitRequest}
                      disabled={!isStepCompleted(currentStep)}
                    >
                      🚀 Submit Request
                    </button>
                  )}
                  {currentStep < 6 && currentStep <= completedSteps && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium text-sm sm:text-base"
                    >
                      Next →
                    </button>
                  )}
                  {completedSteps >= 2 && (
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all font-medium text-sm sm:text-base"
                      onClick={downloadPDF}
                    >
                      📄 Download PDF
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LabInchargeForm;
