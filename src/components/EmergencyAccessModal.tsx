import React, { useState } from "react";
import { PatientProfile, MedicalHistory } from "../types";
import { QRCodeGenerator } from "./QRCodeGenerator";
import {
  Siren,
  Heart,
  AlertTriangle,
  PhoneCall,
  ShieldCheck,
  X,
  Pill,
  Radio,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface EmergencyAccessModalProps {
  patient: PatientProfile;
  history: MedicalHistory;
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyAccessModal: React.FC<EmergencyAccessModalProps> = ({
  patient,
  history,
  isOpen,
  onClose,
}) => {
  const [dispatchAlertSent, setDispatchAlertSent] = useState(false);

  if (!isOpen) return null;

  const handleSimulateDispatch = () => {
    setDispatchAlertSent(true);
    setTimeout(() => setDispatchAlertSent(false), 4000);
  };

  const emergencyQrPayload = JSON.stringify({
    dnaId: patient.dnaId,
    name: patient.fullName,
    bloodGroup: patient.bloodGroup,
    allergies: history.allergies.map((a) => a.allergen),
    primaryContact: patient.emergencyContacts[0]?.phone,
  });

  return (
    <div className="fixed inset-0 z-50 bg-red-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-3xl w-full border-2 border-red-600 text-white shadow-2xl relative overflow-hidden my-8">
        {/* Top Emergency Siren Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white text-red-600 rounded-2xl animate-bounce shadow-md">
              <Siren className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded-md text-red-100">
                  CRITICAL MODE
                </span>
                <span className="text-xs text-red-100">PARAMEDIC / ER PROTOCOL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                EMERGENCY MEDICAL PASSPORT
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dispatch Alert Confirmation Bar */}
        {dispatchAlertSent && (
          <div className="bg-emerald-500 text-slate-950 px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                EMERGENCY DISPATCH SIGNAL BROADCASTED • GPS Coordinates sent to Apex Trauma Center
              </span>
            </span>
            <span className="font-mono text-[10px]">ETA 4 Mins</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Patient Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={patient.avatarUrl}
                alt={patient.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-red-500 shadow-md"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{patient.fullName}</h3>
                <p className="text-xs font-mono font-bold text-cyan-300">
                  {patient.dnaId} • DOB: {patient.dob}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Address: {patient.address}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-center min-w-[120px] self-end sm:self-auto">
              <span className="text-[10px] text-red-300 font-bold uppercase block">
                Blood Group
              </span>
              <span className="text-2xl font-black text-red-400 block flex items-center justify-center space-x-1 mt-0.5">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                <span>{patient.bloodGroup}</span>
              </span>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Critical Allergies & Meds */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 space-y-2">
                <span className="text-xs font-extrabold uppercase text-rose-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>CRITICAL ALLERGY WARNINGS</span>
                </span>
                <div className="space-y-1 text-xs">
                  {history.allergies.map((alg) => (
                    <div key={alg.id} className="p-2 rounded-xl bg-rose-900/40 border border-rose-800/80 text-rose-100 flex items-center justify-between">
                      <span className="font-bold">{alg.allergen}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-extrabold">
                        {alg.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider block flex items-center space-x-1.5">
                  <Pill className="w-4 h-4 text-cyan-400" />
                  <span>Active Current Medications</span>
                </span>
                <div className="space-y-1 text-slate-200">
                  {history.medicines.map((med) => (
                    <p key={med.id} className="font-semibold text-slate-100">
                      • {med.name} ({med.dosage}) - {med.frequency}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Emergency Contacts & Scan */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider block flex items-center space-x-1.5">
                  <PhoneCall className="w-4 h-4 text-red-400" />
                  <span>Immediate Emergency Contacts</span>
                </span>
                {patient.emergencyContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-white">
                        {contact.name} ({contact.relationship})
                      </p>
                      <p className="font-mono text-cyan-300 font-bold mt-0.5">
                        {contact.phone}
                      </p>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSimulateDispatch}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
              >
                <Radio className="w-4 h-4 animate-ping" />
                <span>DISPATCH EMERGENCY RESPONSE TEAM</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
