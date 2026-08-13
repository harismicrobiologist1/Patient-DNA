import React, { useState } from "react";
import { PatientProfile } from "../types";
import {
  Users,
  Search,
  Check,
  UserPlus,
  X,
  QrCode,
  ShieldCheck,
  Building,
  Heart,
  Calendar,
  Phone,
} from "lucide-react";

interface PatientSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientProfile[];
  activePatientId: string;
  onSelectPatient: (dnaId: string) => void;
  onOpenAddPatient: () => void;
}

export const PatientSwitcherModal: React.FC<PatientSwitcherModalProps> = ({
  isOpen,
  onClose,
  patients,
  activePatientId,
  onSelectPatient,
  onOpenAddPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dnaId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.registeredHospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Patient Directory & Switcher</h2>
              <p className="text-xs text-slate-400">
                Select active patient or register new medical identity ({patients.length} Registered)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenAddPatient();
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Register New</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search patients by name, DNA ID (e.g. DNA-8924), phone number, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Patient Cards List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">No patient profiles found</p>
              <p className="text-xs text-slate-400">Try searching with a different name or DNA ID</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAddPatient();
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Patient Profile Now</span>
              </button>
            </div>
          ) : (
            filteredPatients.map((p) => {
              const isSelected = p.dnaId === activePatientId;
              return (
                <div
                  key={p.dnaId}
                  onClick={() => {
                    onSelectPatient(p.dnaId);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500"
                      : "bg-white border-slate-200/90 hover:border-blue-300 hover:bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={p.avatarUrl}
                      alt={p.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-extrabold text-slate-900">{p.fullName}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                          {p.dnaId}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span>{p.bloodGroup}</span>
                        </span>
                        <span>•</span>
                        <span>{p.gender}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{p.registeredHospital}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isSelected ? (
                      <div className="p-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Selected</span>
                      </div>
                    ) : (
                      <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-all">
                        Select
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total Registered Patients: <strong>{patients.length}</strong></span>
          <button
            onClick={() => {
              onClose();
              onOpenAddPatient();
            }}
            className="text-blue-600 font-bold hover:underline flex items-center space-x-1"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add New Patient Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
