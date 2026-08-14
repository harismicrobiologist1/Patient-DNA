import React, { useState } from "react";
import { PatientProfile } from "../types";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Shield,
} from "lucide-react";

interface PatientSecurityAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPatient: PatientProfile;
  currentPatient: PatientProfile;
  onUnlockSuccess: (dnaId: string) => void;
  onViewPublicCard: (patient: PatientProfile) => void;
}

export const PatientSecurityAuthModal: React.FC<PatientSecurityAuthModalProps> = ({
  isOpen,
  onClose,
  targetPatient,
  currentPatient,
  onUnlockSuccess,
  onViewPublicCard,
}) => {
  const [authMethod, setAuthMethod] = useState<"password" | "pin">("password");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !targetPatient) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const correctPassword = targetPatient.password || "Patient@123";
    const correctPin = targetPatient.securityPin || "1234";

    if (authMethod === "password") {
      if (enteredPassword.trim() === correctPassword.trim()) {
        onUnlockSuccess(targetPatient.dnaId);
        onClose();
      } else {
        setErrorMsg(
          "Access Denied: Incorrect password. Please enter the valid account password for " +
            targetPatient.fullName +
            "."
        );
      }
    } else {
      if (enteredPin.trim() === correctPin.trim()) {
        onUnlockSuccess(targetPatient.dnaId);
        onClose();
      } else {
        setErrorMsg(
          "Access Denied: Incorrect 4-digit PIN. Please enter the valid security PIN for " +
            targetPatient.fullName +
            "."
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl shadow-md text-white border border-amber-400/30">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                  PATIENT VAULT AUTHENTICATION
                </span>
                <span className="text-[10px] text-slate-400">Password Protected</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-1">
                Patient Self-Login Verification
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Notice */}
        <div className="p-6 space-y-6">
          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">
                Switching to Patient Account: {targetPatient.fullName}
              </p>
              <p className="mt-1 text-amber-800 text-[11px] leading-relaxed">
                To protect electronic health data privacy, please enter the account password created during patient registration or the 4-digit security PIN.
              </p>
            </div>
          </div>

          {/* Target Patient Card Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <img
                src={targetPatient.avatarUrl}
                alt={targetPatient.fullName}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-300"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-extrabold text-slate-900">{targetPatient.fullName}</h3>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                    {targetPatient.dnaId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Blood Group: <strong>{targetPatient.bloodGroup}</strong> • {targetPatient.registeredHospital}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onViewPublicCard(targetPatient);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center space-x-1.5 shadow-sm"
              title="View Emergency Digital ID Card"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>Public Card</span>
            </button>
          </div>

          {/* Auth Method Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("password");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
                authMethod === "password"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Account Password</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("pin");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
                authMethod === "pin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>4-Digit PIN</span>
            </button>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            {authMethod === "password" ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Enter {targetPatient.fullName}'s Account Password:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter patient account password"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Enter {targetPatient.fullName}'s 4-Digit Security PIN:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Enter 4-digit security PIN"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  />
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onViewPublicCard(targetPatient);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                <span>View Public Emergency Card</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={authMethod === "password" ? !enteredPassword : !enteredPin}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Log In</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
