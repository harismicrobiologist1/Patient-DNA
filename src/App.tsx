import React, { useState } from "react";
import { UserRole, PatientProfile, MedicalHistory, ClinicalRecord, Prescription, Appointment, AuditLog } from "./types";
import {
  INITIAL_PATIENT,
  INITIAL_MEDICAL_HISTORY,
  INITIAL_CLINICAL_RECORDS,
  INITIAL_LAB_REPORTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_APPOINTMENTS,
  DOCTORS_LIST,
  INITIAL_GENETIC_MARKERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PATIENTS_DATABASE,
  PatientFullRecord,
} from "./data/mockDatabase";

import { Header } from "./components/Header";
import { PatientProfileView } from "./components/PatientProfileView";
import { MedicalHistoryView } from "./components/MedicalHistoryView";
import { ClinicalRecordsView } from "./components/ClinicalRecordsView";
import { LabImagingView } from "./components/LabImagingView";
import { PrescriptionCenterView } from "./components/PrescriptionCenterView";
import { AppointmentSystemView } from "./components/AppointmentSystemView";
import { DoctorDashboardView } from "./components/DoctorDashboardView";
import { HospitalDashboardView } from "./components/HospitalDashboardView";
import { AIModuleView } from "./components/AIModuleView";
import { FutureModulesView } from "./components/FutureModulesView";
import { DigitalPatientCard } from "./components/DigitalPatientCard";
import { EmergencyAccessModal } from "./components/EmergencyAccessModal";
import { AddPatientModal } from "./components/AddPatientModal";
import { PatientSwitcherModal } from "./components/PatientSwitcherModal";

import {
  User,
  Activity,
  FileText,
  FlaskConical,
  Pill,
  Calendar,
  Stethoscope,
  Building2,
  Brain,
  Sparkles,
  QrCode,
  Heart,
  ShieldCheck,
  Bell,
  Clock,
  ArrowRight,
  Siren,
  Globe,
  X,
  Users,
  UserPlus,
} from "lucide-react";

export default function App() {
  const [currentRole, setRole] = useState<UserRole>("patient");
  const [activeTab, setActiveTab] = useState<string>("patient-dash");

  // Multi-Patient Database State
  const [patientsDatabase, setPatientsDatabase] = useState<Record<string, PatientFullRecord>>(
    INITIAL_PATIENTS_DATABASE
  );
  const [activePatientId, setActivePatientId] = useState<string>("DNA-8924-9012");

  // Global static stores
  const [doctors] = useState(DOCTORS_LIST);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [geneticMarkers] = useState(INITIAL_GENETIC_MARKERS);

  // Derived Active Record Data
  const currentRecord =
    patientsDatabase[activePatientId] || INITIAL_PATIENTS_DATABASE["DNA-8924-9012"];
  const patient = currentRecord.patient;
  const history = currentRecord.history;
  const clinicalRecords = currentRecord.clinicalRecords;
  const labReports = currentRecord.labReports;
  const prescriptions = currentRecord.prescriptions;
  const appointments = currentRecord.appointments;

  // All registered patients list
  const allPatientsList = (Object.values(patientsDatabase) as PatientFullRecord[]).map(
    (r) => r.patient
  );

  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isDigitalIdModalOpen, setIsDigitalIdModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isPatientSwitcherModalOpen, setIsPatientSwitcherModalOpen] = useState(false);

  // State Updates per Active Patient
  const handleUpdatePatient = (updatedPatient: PatientProfile) => {
    setPatientsDatabase((prev) => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        patient: updatedPatient,
      },
    }));
  };

  const handleUpdateHistory = (updatedHistory: MedicalHistory) => {
    setPatientsDatabase((prev) => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        history: updatedHistory,
      },
    }));
  };

  const handleAddClinicalRecord = (newRecord: ClinicalRecord) => {
    setPatientsDatabase((prev) => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        clinicalRecords: [newRecord, ...(prev[activePatientId]?.clinicalRecords || [])],
      },
    }));
  };

  const handleUpdateClinicalRecords = (updatedRecords: ClinicalRecord[]) => {
    setPatientsDatabase((prev) => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        clinicalRecords: updatedRecords,
      },
    }));
  };

  const handleUpdateLabReports = (updatedReports: any[]) => {
    setPatientsDatabase((prev) => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        labReports: updatedReports,
      },
    }));
  };

  const handleAddPrescription = (newRx: Prescription) => {
    setPatientsDatabase((prev) => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        prescriptions: [newRx, ...(prev[activePatientId]?.prescriptions || [])],
      },
    }));
  };

  const handleUpdatePrescriptions = (updatedPrescriptions: Prescription[]) => {
    setPatientsDatabase((prev) => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        prescriptions: updatedPrescriptions,
      },
    }));
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setPatientsDatabase((prev) => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        appointments: [newApt, ...(prev[activePatientId]?.appointments || [])],
      },
    }));
  };

  const handleUpdateAppointments = (updatedAppointments: Appointment[]) => {
    setPatientsDatabase((prev) => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        appointments: updatedAppointments,
      },
    }));
  };

  const handleRegisterPatient = (newRecord: PatientFullRecord) => {
    const newDnaId = newRecord.patient.dnaId;
    setPatientsDatabase((prev) => ({
      ...prev,
      [newDnaId]: newRecord,
    }));
    setActivePatientId(newDnaId);

    // Audit log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "Hospital Registrar",
      role: currentRole,
      action: "New Patient Identity Created",
      details: `Registered profile for ${newRecord.patient.fullName} under ${newDnaId}`,
      ipAddress: "192.168.1.100 (Internal System)",
      securityHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}...AES256`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Universal Header */}
      <Header
        currentRole={currentRole}
        setRole={setRole}
        patient={patient}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenDigitalIdModal={() => setIsDigitalIdModalOpen(true)}
        onOpenPatientSwitcher={() => setIsPatientSwitcherModalOpen(true)}
        onOpenAddPatient={() => setIsAddPatientModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patientCount={allPatientsList.length}
      />

      {/* Main Navigation Sub-Bar */}
      <nav className="bg-white border-b border-slate-200/80 shadow-sm sticky top-20 z-30 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 py-2">
            {[
              { id: "patient-dash", label: "Patient Dashboard", icon: User },
              { id: "profile", label: "Patient Identity", icon: QrCode },
              { id: "history", label: "Medical History", icon: Activity },
              { id: "clinical", label: "Clinical Records", icon: FileText },
              { id: "lab", label: "Lab & Imaging", icon: FlaskConical },
              { id: "prescription", label: "Prescriptions", icon: Pill },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "ai-module", label: "AI Diagnostics", icon: Brain, isAi: true },
              { id: "doctor-dash", label: "Doctor Console", icon: Stethoscope },
              { id: "hospital-dash", label: "Hospital Admin", icon: Building2 },
              { id: "future", label: "Genetics & Labs", icon: Globe },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? item.isAi
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                        : "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PATIENT DASHBOARD OVERVIEW */}
        {activeTab === "patient-dash" && (
          <div className="space-y-8 max-w-6xl mx-auto">
            {/* Hero Welcome Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                    ONE PATIENT • ONE IDENTITY
                  </span>
                  <span className="text-xs text-slate-400">Sync Status: Active</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Welcome back, {patient.fullName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Your complete electronic medical history, lab results, AI disease risk indicators, and prescriptions are unified under DNA ID:{" "}
                  <strong className="text-cyan-300 font-mono">{patient.dnaId}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setIsDigitalIdModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Digital Patient Card</span>
                </button>
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition-all"
                >
                  <Siren className="w-4 h-4" />
                  <span>Emergency Access</span>
                </button>
              </div>
            </div>

            {/* Overview Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab("profile")}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-1"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Blood Group
                </span>
                <p className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span>{patient.bloodGroup}</span>
                </p>
                <p className="text-[11px] text-slate-500">Universal Donor</p>
              </div>

              <div
                onClick={() => setActiveTab("prescription")}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-1"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Active Medicines
                </span>
                <p className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <Pill className="w-5 h-5 text-emerald-600" />
                  <span>{history.medicines.length} Drugs</span>
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold">Refills Available</p>
              </div>

              <div
                onClick={() => setActiveTab("appointments")}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-1"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Next Appointment
                </span>
                <p className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>Aug 20</span>
                </p>
                <p className="text-[11px] text-indigo-700 font-semibold">Queue #4 Confirmed</p>
              </div>

              <div
                onClick={() => setActiveTab("lab")}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-1"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Recent Lab Report
                </span>
                <p className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <FlaskConical className="w-5 h-5 text-cyan-600" />
                  <span>Jul 16</span>
                </p>
                <p className="text-[11px] text-slate-500">Lipid & Metabolic Panel</p>
              </div>
            </div>

            {/* Two Column Layout: Health Timeline & Reminders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Health Timeline */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>Recent Medical Encounters & Timeline</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab("clinical")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {clinicalRecords.slice(0, 3).map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => setActiveTab("clinical")}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold text-[10px] uppercase">
                          {rec.recordType}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{rec.diagnosis}</h3>
                        <p className="text-slate-500">
                          {rec.hospitalName} • {rec.attendingDoctor}
                        </p>
                      </div>
                      <span className="font-mono text-slate-400 text-xs self-end sm:self-auto">{rec.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medicine Reminders & Allergy Alerts */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Bell className="w-5 h-5 text-amber-500" />
                    <span>Daily Medication Reminders</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">Telmisartan 40mg</span>
                        <p className="text-slate-500">Morning Dose • 08:00 AM</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Taken
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">Amlodipine 5mg</span>
                        <p className="text-slate-500">Bedtime Dose • 09:30 PM</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                        Upcoming
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 space-y-3 text-xs">
                  <h3 className="font-bold text-rose-900 flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-rose-600" />
                    <span>Critical Allergy Lock</span>
                  </h3>
                  <p className="text-rose-950">
                    Penicillin Derivatives are strictly blocked on your global electronic prescription profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === "profile" && (
          <PatientProfileView
            patient={patient}
            onUpdatePatient={handleUpdatePatient}
            onOpenDigitalId={() => setIsDigitalIdModalOpen(true)}
          />
        )}

        {activeTab === "history" && (
          <MedicalHistoryView history={history} onUpdateHistory={handleUpdateHistory} />
        )}

        {activeTab === "clinical" && (
          <ClinicalRecordsView
            records={clinicalRecords}
            onAddRecord={handleAddClinicalRecord}
            onUpdateRecords={handleUpdateClinicalRecords}
          />
        )}

        {activeTab === "lab" && (
          <LabImagingView
            reports={labReports}
            onUpdateReports={handleUpdateLabReports}
          />
        )}

        {activeTab === "prescription" && (
          <PrescriptionCenterView
            prescriptions={prescriptions}
            onUpdatePrescriptions={handleUpdatePrescriptions}
          />
        )}

        {activeTab === "appointments" && (
          <AppointmentSystemView
            appointments={appointments}
            doctors={doctors}
            onBookAppointment={handleAddAppointment}
            onUpdateAppointments={handleUpdateAppointments}
          />
        )}

        {activeTab === "doctor-dash" && (
          <DoctorDashboardView
            patient={patient}
            history={history}
            onAddClinicalRecord={handleAddClinicalRecord}
            onAddPrescription={handleAddPrescription}
            allPatients={allPatientsList}
            onSelectPatient={(dnaId) => setActivePatientId(dnaId)}
            onOpenAddPatient={() => setIsAddPatientModalOpen(true)}
          />
        )}

        {activeTab === "hospital-dash" && (
          <HospitalDashboardView
            doctors={doctors}
            auditLogs={auditLogs}
            allPatients={allPatientsList}
            onSelectPatient={(dnaId) => setActivePatientId(dnaId)}
            onOpenAddPatient={() => setIsAddPatientModalOpen(true)}
          />
        )}

        {activeTab === "ai-module" && (
          <AIModuleView
            patient={patient}
            history={history}
            prescriptions={prescriptions}
            clinicalRecords={clinicalRecords}
            labReports={labReports}
          />
        )}

        {activeTab === "future" && (
          <FutureModulesView markers={geneticMarkers} />
        )}
      </main>

      {/* Digital Patient ID Card Modal */}
      {isDigitalIdModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setIsDigitalIdModalOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <DigitalPatientCard patient={patient} onUpdatePatient={handleUpdatePatient} />
          </div>
        </div>
      )}

      {/* Emergency Access Modal */}
      <EmergencyAccessModal
        patient={patient}
        history={history}
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Patient Switcher Modal */}
      <PatientSwitcherModal
        isOpen={isPatientSwitcherModalOpen}
        onClose={() => setIsPatientSwitcherModalOpen(false)}
        patients={allPatientsList}
        activePatientId={activePatientId}
        onSelectPatient={(dnaId) => setActivePatientId(dnaId)}
        onOpenAddPatient={() => setIsAddPatientModalOpen(true)}
      />

      {/* Add New Patient Registration Modal */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onAddPatient={handleRegisterPatient}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">PATIENT DNA</span>
            <span>• Universal Healthcare Identity System</span>
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            Encrypted End-to-End • ISO 27001 Certified • HIPAA Compliant
          </p>
        </div>
      </footer>
    </div>
  );
}
