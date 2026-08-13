import React, { useState } from "react";
import { PatientProfile, MedicalHistory } from "../types";
import { PatientFullRecord } from "../data/mockDatabase";
import {
  UserPlus,
  X,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  Building,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newRecord: PatientFullRecord) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [bloodGroup, setBloodGroup] = useState("O Positive (O+)");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [registeredHospital, setRegisteredHospital] = useState("Apex National University Medical Center");
  const [organDonorStatus, setOrganDonorStatus] = useState(true);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("Spouse");

  // Insurance Info
  const [insuranceProvider, setInsuranceProvider] = useState("Aetna Healthcare");
  const [policyNumber, setPolicyNumber] = useState("");

  // Clinical Defaults
  const [initialAllergy, setInitialAllergy] = useState("");
  const [initialChronicCondition, setInitialChronicCondition] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dob) return;

    const random1 = Math.floor(1000 + Math.random() * 9000);
    const random2 = Math.floor(1000 + Math.random() * 9000);
    const dnaId = `DNA-${random1}-${random2}`;

    // Avatar based on gender selection
    const maleAvatars = [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    ];
    const femaleAvatars = [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    ];
    const defaultAvatar =
      gender === "Female"
        ? femaleAvatars[Math.floor(Math.random() * femaleAvatars.length)]
        : maleAvatars[Math.floor(Math.random() * maleAvatars.length)];

    const avatarUrl = customAvatarUrl.trim() || defaultAvatar;

    const newPatient: PatientProfile = {
      dnaId,
      fullName,
      dob,
      gender,
      bloodGroup,
      avatarUrl,
      phone: phone || "+1 (555) 019-0000",
      email: email || `${fullName.toLowerCase().replace(/\s+/g, ".")}@healthdna.org`,
      address: address || "100 Medical Plaza, District 1",
      nationalId: nationalId || `US-NY-${Math.floor(100000 + Math.random() * 900000)}-X`,
      biometricStatus: "Verified",
      organDonorStatus,
      registeredHospital,
      insurance: {
        provider: insuranceProvider || "Standard Health Care",
        policyNumber: policyNumber || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        groupNumber: "GRP-0012",
        status: "Active",
        coverageAmount: "$500,000 Standard Coverage",
      },
      emergencyContacts: [
        {
          id: `ec-${Date.now()}`,
          name: emergencyName || "Emergency Contact",
          relationship: emergencyRelation || "Relative",
          phone: emergencyPhone || "+1 (555) 999-0000",
          isPrimary: true,
        },
      ],
    };

    const newHistory: MedicalHistory = {
      diseases: initialChronicCondition
        ? [
            {
              id: `dis-${Date.now()}`,
              name: initialChronicCondition,
              diagnosedDate: new Date().toISOString().split("T")[0],
              status: "Managed",
              doctor: "Dr. Marcus Vance",
              severity: "Moderate",
            },
          ]
        : [],
      surgeries: [],
      vaccinations: [],
      medicines: [],
      allergies: initialAllergy
        ? [
            {
              id: `alg-${Date.now()}`,
              allergen: initialAllergy,
              reaction: "Hypersensitivity / Rash",
              severity: "Severe",
              onsetDate: new Date().toISOString().split("T")[0],
            },
          ]
        : [],
      familyHistory: [],
      chronicIllnesses: initialChronicCondition
        ? [
            {
              id: `chr-${Date.now()}`,
              condition: initialChronicCondition,
              diagnosedYear: new Date().getFullYear().toString(),
              carePlan: "Standard Monitoring",
              currentControlStatus: "Optimal",
            },
          ]
        : [],
      lifestyle: {
        smokingStatus: "Non-smoker",
        alcoholConsumption: "None",
        physicalActivity: "Light (1-2 days/wk)",
        sleepAvgHours: 7.5,
        dietType: "Balanced",
      },
    };

    const newRecord: PatientFullRecord = {
      patient: newPatient,
      history: newHistory,
      clinicalRecords: [],
      labReports: [],
      prescriptions: [],
      appointments: [],
    };

    onAddPatient(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
              <UserPlus className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Register New Patient</h2>
              <p className="text-xs text-blue-200">
                Issue DNA ID & Create Encrypted Universal Health Profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Identity & Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Personal Identity & Demographics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Eleanor Vance / Michael Scott"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="O Negative (O-)">O Negative (O-) [Universal Donor]</option>
                  <option value="O Positive (O+)">O Positive (O+)</option>
                  <option value="A Positive (A+)">A Positive (A+)</option>
                  <option value="A Negative (A-)">A Negative (A-)</option>
                  <option value="B Positive (B+)">B Positive (B+)</option>
                  <option value="B Negative (B-)">B Negative (B-)</option>
                  <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                  <option value="AB Negative (AB-)">AB Negative (AB-)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Profile Photo (URL or Upload)</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Optional - Defaults to medical avatar
                  </span>
                </label>
                <div className="flex items-center space-x-3">
                  {customAvatarUrl && (
                    <img
                      src={customAvatarUrl}
                      alt="Custom Preview"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/40 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";
                      }}
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Paste image URL (https://...) or upload file below"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer whitespace-nowrap">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (reader.result) setCustomAvatarUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Contact & Address Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-1234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="patient@healthdna.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State, Zip Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Hospital & Emergency Contact */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Hospital & Emergency Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Network Hospital</label>
                <select
                  value={registeredHospital}
                  onChange={(e) => setRegisteredHospital(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="Apex National University Medical Center">Apex National Medical Center</option>
                  <option value="Saint Jude Memorial Hospital">Saint Jude Memorial Hospital</option>
                  <option value="City Care Specialty Clinic">City Care Specialty Clinic</option>
                  <option value="Apex Orthopedic Specialty Center">Apex Orthopedic Center</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">National ID / Passport No.</label>
                <input
                  type="text"
                  placeholder="US-NY-991204-X"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Contact Person</label>
                <input
                  type="text"
                  placeholder="Relative / Guardian Name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 999-8877"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Initial Medical Profile */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase text-blue-600 tracking-wider flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Initial Allergies & Medical Notes</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Drug Allergy (If any)</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa, Latex"
                  value={initialAllergy}
                  onChange={(e) => setInitialAllergy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pre-existing Condition</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
                  value={initialChronicCondition}
                  onChange={(e) => setInitialChronicCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="organDonor"
                checked={organDonorStatus}
                onChange={(e) => setOrganDonorStatus(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <label htmlFor="organDonor" className="text-xs font-bold text-slate-700">
                Registered Organ Donor
              </label>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Patient Profile & DNA ID</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
