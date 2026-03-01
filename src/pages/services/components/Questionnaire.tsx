"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { INDUSTRIES } from "./industries";
import { motion } from 'framer-motion';
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

type FormType = "csr" | "team_building" | "corporate_event";

interface QuestionnaireProps {
  formType?: FormType;
}

const Questionnaire = ({ formType = "csr" }: QuestionnaireProps) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = (currentYear + i).toString();
    return { value: year, label: year };
  });
  const monthOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    companyName: "",
    companyEmail: "",
    industryOption: "",
    industryOther: "",
    noOfPax: "",
    duration: "",
    durationOther: "",
    eventMonth: "",
    eventYear: "",
    budget: "",
    hrdc: "Yes",
    location: "",
    languages: [] as string[],
    languagesOther: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    duration?: string;
    languages?: string;
    privacyConsent?: string;
  }>({});
  const [privacyConsent, setPrivacyConsent] = useState(false);

  useEffect(() => {
    if (!submitMessage) return;
    const timer = setTimeout(() => setSubmitMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [submitMessage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    // Prevent negative values for noOfPax
    if (name === "noOfPax") {
      const num = Number(value);
      if (num < 0) return;
    }
    // Validate contact number - only allow numbers, +, and spaces
    if (name === "contact") {
      const sanitized = value.replace(/[^0-9+\s]/g, '');
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (lang: string) => {
    setFormData((prev) => {
      const isSelected = prev.languages.includes(lang);
      return {
        ...prev,
        languages: isSelected
          ? prev.languages.filter((l) => l !== lang)
          : [...prev.languages, lang],
      };
    });
    setFieldErrors((prev) => ({ ...prev, languages: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage(null);

    const requiredFields = ["name", "contact", "companyName", "companyEmail", "industryOption", "noOfPax", "duration", "eventMonth", "eventYear", "budget", "location"];
    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData]);
    const nextErrors: any = {};

    if (missingFields.length > 0 || formData.languages.length === 0 || !privacyConsent) {
      if (!formData.duration) nextErrors.duration = "Please select the duration";
      if (formData.languages.length === 0) nextErrors.languages = "Please select at least one language";
      if (!privacyConsent) nextErrors.privacyConsent = "Please agree to the Privacy Policy";
      setFieldErrors(nextErrors);
      setSubmitMessage({ type: "error", text: "Please fill in all required fields" });
      setLoading(false);
      return;
    }

    try {
      const tableMap = {
        csr: "csr_inquiries",
        team_building: "team_building_inquiries",
        corporate_event: "corporate_event_inquiries",
      } as const;

      const languagesArray = formData.languages.filter((lang) => lang !== "Others");
      if (formData.languagesOther.trim()) languagesArray.push(formData.languagesOther);

      const submitData = {
        name: formData.name,
        contact: formData.contact,
        company_name: formData.companyName,
        company_email: formData.companyEmail,
        industry: formData.industryOption === "Other" ? formData.industryOther : formData.industryOption,
        no_of_pax: parseInt(formData.noOfPax),
        duration: formData.duration === "Others" ? formData.durationOther : formData.duration,
        estimated_event_month: `${formData.eventMonth} ${formData.eventYear}`,
        budget: formData.budget,
        hrdc: formData.hrdc === "Yes",
        preferred_location: formData.location,
        language: languagesArray.join(", "),
        remarks: formData.remarks,
      };

      const { error } = await supabase.from(tableMap[formType]).insert(submitData);
      if (error) throw error;

      setSubmitMessage({ type: "success", text: "Sent! We'll get back to you soon." });
      // Reset logic...
    } catch (error: any) {
      setSubmitMessage({ type: "error", text: "Database error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      return !!(formData.name && formData.contact && formData.companyName && formData.companyEmail && formData.industryOption);
    }
    if (currentStep === 2) {
      return !!(formData.noOfPax && formData.duration && formData.eventMonth && formData.eventYear && formData.budget && formData.location);
    }
    return true;
  };

  const goToNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      setSubmitMessage({ type: "error", text: "Please fill in all required fields" });
    }
  };

  // Neo-Brutalist Shared Styles
  const brutInputStyle = "border-4 border-[#153462] p-4 font-bold placeholder:text-slate-400 focus:ring-0 shadow-[4px_4px_0px_0px_#153462] transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none";
  const labelStyle = "block text-xs font-black uppercase tracking-widest text-[#153462] mb-2";
  const inputWrapperStyle = "mb-6";

  return (
    <div className="max-w-4xl mx-auto bg-white border-4 border-[#153462] rounded-[2rem] md:rounded-[3rem] shadow-[12px_12px_0px_0px_#153462] p-8 md:p-12">

      {/* Header + Progress Bar */}
      <div className="mb-10">
        <div className="inline-block border-4 border-[#153462] bg-[#f68921] px-4 py-1 mb-2 rotate-[-1deg] shadow-[4px_4px_0px_0px_#153462]">
          <span className="text-white font-black uppercase tracking-widest text-sm">Get a Quote</span>
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-[#153462] uppercase italic tracking-tighter mb-8">
          Let's <span className="text-[#f68921]">Connect_</span>
        </h3>

        {/* Progress Bar */}
        <div className="flex justify-between gap-4 mb-6 border-b-4 border-[#153462] pb-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-2 flex-1 justify-center">
              <div className={`w-8 h-8 flex items-center justify-center font-black border-2 border-[#153462] transition-all ${step === num ? 'bg-[#f68921] text-white scale-110' :
                step > num ? 'bg-[#153462] text-white' : 'bg-gray-100 text-[#153462]'
                }`}>
                {num}
              </div>
              <span className={`text-[10px] font-black uppercase hidden md:block ${step === num ? 'text-[#f68921]' : 'text-slate-400'
                }`}>
                {num === 1 ? 'Company' : num === 2 ? 'Event Details' : 'Preferences'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {submitMessage && (
        <div className={`mb-8 p-4 border-4 border-[#153462] font-black uppercase italic ${submitMessage.type === "success" ? "bg-green-400" : "bg-red-400"} shadow-[4px_4px_0px_0px_#153462]`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* STEP 1: COMPANY DETAILS */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <h3 className="text-2xl font-black text-[#153462] mb-6 uppercase italic">Step 1: Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>Full Name *</label>
                <Input
                  className={brutInputStyle + " focus:border-[#f68921]"}
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>Contact Number *</label>
                <Input
                  className={brutInputStyle + " focus:border-[#f68921]"}
                  name="contact"
                  placeholder="e.g. +60 12 345 6789"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={inputWrapperStyle}>
              <label className={labelStyle}>Company Name *</label>
              <Input
                className={brutInputStyle + " focus:border-[#f68921]"}
                name="companyName"
                placeholder="Company Ltd"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={inputWrapperStyle}>
              <label className={labelStyle}>Work Email Address *</label>
              <Input
                className={brutInputStyle + " focus:border-[#f68921]"}
                type="email"
                name="companyEmail"
                placeholder="name@company.com"
                value={formData.companyEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className={inputWrapperStyle}>
              <label className={labelStyle}>Industry *</label>
              <Select
                name="industryOption"
                className="border-4 border-[#153462] rounded-[2rem] md:rounded-[2rem]  font-bold h-full shadow-[4px_4px_0px_0px_#153462]"
                value={formData.industryOption}
                onChange={(val) => setFormData(p => ({ ...p, industryOption: val }))}
                options={INDUSTRIES.map(i => ({ value: i, label: i }))}
                placeholder="Select industry"
              />
            </div>
            <button
              type="button"
              onClick={goToNextStep}
              className="w-full bg-[#153462] text-[#fcb22f] py-4 font-black uppercase tracking-widest hover:bg-[#f68921] hover:text-white transition-all shadow-[4px_4px_0px_0px_#f68921] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              Next: Event Details →
            </button>
          </motion.div>
        )}

        {/* STEP 2: EVENT LOGISTICS */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <h3 className="text-2xl font-black text-[#153462] mb-6 uppercase italic">Step 2: Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>Number of Pax *</label>
                <Input
                  className={brutInputStyle + " focus:border-[#f68921]"}
                  type="number"
                  name="noOfPax"
                  placeholder="e.g. 30"
                  value={formData.noOfPax}
                  onChange={handleChange}
                  min={0}
                />
              </div>
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>Location Preference *</label>
                <Input
                  className={brutInputStyle + " focus:border-[#f68921]"}
                  name="location"
                  placeholder="City / Venue"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={inputWrapperStyle}>
              <label className={labelStyle}>Duration *</label>
              <div className="flex flex-wrap gap-3">
                {["Half day", "Full day", "2D1N", "3D2N", "Others"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, duration: item }))}
                    className={`px-4 py-2 border-2 border-[#153462] font-black uppercase text-xs transition-all ${formData.duration === item ? "bg-[#153462] text-white -translate-y-1 shadow-[4px_4px_0px_0px_#fcb22f]" : "bg-white text-[#153462]"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              {fieldErrors.duration && <div className="text-sm text-red-600 mt-2">{fieldErrors.duration}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>Event Month *</label>
                <Select
                  name="eventMonth"
                  className="border-4 border-[#153462] font-bold shadow-[4px_4px_0px_0px_#153462]"
                  value={formData.eventMonth}
                  onChange={(val) => setFormData(p => ({ ...p, eventMonth: val }))}
                  options={monthOptions}
                  placeholder="Month"
                />
              </div>
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>Event Year *</label>
                <Select
                  name="eventYear"
                  className="border-4 border-[#153462] font-bold shadow-[4px_4px_0px_0px_#153462]"
                  value={formData.eventYear}
                  onChange={(val) => setFormData(p => ({ ...p, eventYear: val }))}
                  options={yearOptions}
                  placeholder="Year"
                />
              </div>
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>Budget (RM) *</label>
                <Input
                  className={brutInputStyle + " focus:border-[#f68921]"}
                  name="budget"
                  placeholder="e.g. 5000"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border-4 border-[#153462] py-4 font-black uppercase hover:bg-gray-100 transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className="flex-1 bg-[#153462] text-[#fcb22f] py-4 font-black uppercase shadow-[4px_4px_0px_0px_#f68921] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Next: Preferences →
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: FINAL REQUIREMENTS */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <h3 className="text-2xl font-black text-[#153462] mb-6 uppercase italic">Step 3: Preferences</h3>

            <div className={inputWrapperStyle}>
              <label className={labelStyle}>HRDC Claimable?</label>
              <div className="flex gap-4">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, hrdc: opt }))}
                    className={`flex-1 py-3 border-2 border-[#153462] font-black uppercase transition-all ${formData.hrdc === opt ? 'bg-[#153462] text-white shadow-[4px_4px_0px_0px_#fcb22f]' : 'bg-white text-[#153462]'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className={inputWrapperStyle}>
              <label className={labelStyle}>Language Conducted In *</label>
              <div className="flex flex-wrap gap-4">
                {["English", "Mandarin", "BM", "Others"].map((lang) => (
                  <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.languages.includes(lang)}
                        onChange={() => handleCheckbox(lang)}
                      />
                      <div className={`w-6 h-6 border-2 border-[#153462] transition-all shadow-[2px_2px_0px_0px_#153462] ${formData.languages.includes(lang) ? "bg-[#f68921]" : "bg-white"
                        }`} />
                    </div>
                    <span className="font-bold uppercase text-xs text-[#153462]">{lang}</span>
                  </label>
                ))}
              </div>
              {fieldErrors.languages && <div className="text-sm text-red-600 mt-2">{fieldErrors.languages}</div>}
            </div>

            <div className={inputWrapperStyle}>
              <label className={labelStyle}>Special Remarks (Optional)</label>
              <textarea
                name="remarks"
                className={`${brutInputStyle} focus:border-[#f68921] w-full py-2 text-sm`}
                rows={4}
                placeholder="Any special notes or requests"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={privacyConsent}
                  onChange={() => setPrivacyConsent(!privacyConsent)}
                />
                <div className={`mt-1 min-w-[20px] h-5 w-5 border-2 border-[#153462] shadow-[2px_2px_0px_0px_#153462] transition-all ${privacyConsent ? "bg-[#153462]" : "bg-white"
                  }`} />
                <span className="text-sm font-bold text-[#153462] uppercase leading-tight">
                  I AGREE TO THE <a href="/privacy-policy" className="underline text-[#f68921]">PRIVACY POLICY</a> AND DATA PROCESSING.
                </span>
              </label>
              {fieldErrors.privacyConsent && <div className="text-sm text-red-600 mt-2">{fieldErrors.privacyConsent}</div>}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 border-4 border-[#153462] py-4 font-black uppercase hover:bg-gray-100 transition-all"
              >
                ← Back
              </button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 py-5 bg-[#153462] text-[#fcb22f] font-black text-lg uppercase italic border-4 border-[#153462] shadow-[8px_8px_0px_0px_#f68921] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                {loading ? "SENDING..." : "GET MY QUOTE →"}
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default Questionnaire;