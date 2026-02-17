"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { INDUSTRIES } from "./industries";
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
    const { name, value } = e.target;
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
      };

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

      const { error } = await supabase.from(tableMap[formType]).insert([submitData]);
      if (error) throw error;

      setSubmitMessage({ type: "success", text: "Sent! We'll get back to you soon." });
      // Reset logic...
    } catch (error: any) {
      setSubmitMessage({ type: "error", text: "Database error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Neo-Brutalist Shared Styles
  const brutInputStyle = "border-4 border-[#153462] p-4 font-bold placeholder:text-slate-400 focus:ring-0 focus:border-[#f68921] shadow-[4px_4px_0px_0px_#153462] transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none";

  return (
    <div className="bg-white p-6 md:p-12 border-8 border-[#153462] rounded-[2rem] md:rounded-[3rem] shadow-[12px_12px_0px_0px_#fcb22f]">

      {/* Neo-Brutalist Header */}
      <div className="mb-10">
        <div className="inline-block border-4 border-[#153462] bg-[#f68921] px-4 py-1 mb-2 rotate-[-1deg] shadow-[4px_4px_0px_0px_#153462]">
          <span className="text-white font-black uppercase tracking-widest text-sm">Get a Quote</span>
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-[#153462] uppercase italic tracking-tighter">
          Let's <span className="text-[#f68921]">Connect_</span>
        </h3>
      </div>

      {submitMessage && (
        <div className={`mb-8 p-4 border-4 border-[#153462] font-black uppercase italic ${submitMessage.type === "success" ? "bg-green-400" : "bg-red-400"} shadow-[4px_4px_0px_0px_#153462]`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8" noValidate>

        {/* Row 1: Name & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            className={brutInputStyle}
            name="name"
            placeholder="YOUR NAME"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            className={brutInputStyle}
            name="contact"
            placeholder="CONTACT NUMBER"
            value={formData.contact}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Row 2: Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            className={brutInputStyle}
            name="companyName"
            placeholder="COMPANY NAME"
            value={formData.companyName}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            className={brutInputStyle}
            type="email"
            name="companyEmail"
            placeholder="WORK EMAIL"
            value={formData.companyEmail}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Row 3: Industry & Pax */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            name="industryOption"
            className="border-4 border-[#153462] font-bold h-full shadow-[4px_4px_0px_0px_#153462]"
            value={formData.industryOption}
            onChange={(val) => setFormData(p => ({ ...p, industryOption: val }))}
            options={INDUSTRIES.map(i => ({ value: i, label: i.toUpperCase() }))}
            placeholder="SELECT INDUSTRY"
          />
          <Input
            className={brutInputStyle}
            type="number"
            name="noOfPax"
            placeholder="NO. OF PAX"
            value={formData.noOfPax}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Duration: Custom Radio Style */}
        <div className="border-4 border-[#153462] p-6 bg-slate-50 shadow-[4px_4px_0px_0px_#153462]">
          <label className="block mb-4 font-black uppercase italic text-[#153462]">
            Duration <span className="text-[#f68921]">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {["Half day", "Full day", "2D1N", "3D2N", "Others"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFormData(p => ({ ...p, duration: item }))}
                className={`px-4 py-2 border-2 border-[#153462] font-black uppercase text-xs transition-all ${formData.duration === item ? "bg-[#153462] text-white -translate-y-1 shadow-[4px_4px_0px_0px_#f68921]" : "bg-white text-[#153462]"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Month, Year, Budget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            name="eventMonth"
            className="border-4 border-[#153462] font-bold shadow-[4px_4px_0px_0px_#153462]"
            value={formData.eventMonth}
            onChange={(val) => setFormData(p => ({ ...p, eventMonth: val }))}
            options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => ({ value: m, label: m.toUpperCase() }))}
            placeholder="MONTH"
          />
          <Select
            name="eventYear"
            className="border-4 border-[#153462] font-bold shadow-[4px_4px_0px_0px_#153462]"
            value={formData.eventYear}
            onChange={(val) => setFormData(p => ({ ...p, eventYear: val }))}
            options={yearOptions}
            placeholder="YEAR"
          />
          <Input
            className={brutInputStyle}
            name="budget"
            placeholder="BUDGET (RM)"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>

        {/* HRDC & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="border-4 border-[#153462] p-6 bg-slate-50 shadow-[4px_4px_0px_0px_#153462]">
            <label className="block mb-4 font-black uppercase italic text-[#153462]">HRDC Claimable?</label>
            <div className="flex gap-4">
              {["Yes", "No"].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, hrdc: opt }))}
                  className={`flex-1 py-2 border-2 border-[#153462] font-black transition-all ${formData.hrdc === opt ? "bg-[#153462] text-white shadow-[4px_4px_0px_0px_#fcb22f]" : "bg-white"
                    }`}
                >
                  {opt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <Input
            className={brutInputStyle}
            name="location"
            placeholder="PREFERRED LOCATION"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* Languages: Custom Checkbox Style */}
        <div className="border-4 border-[#153462] p-6 bg-slate-50 shadow-[4px_4px_0px_0px_#153462]">
          <label className="block mb-4 font-black uppercase italic text-[#153462]">Language Conducted In</label>
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
                  <div className={`w-6 h-6 border-2 border-[#153462] transition-all shadow-[2px_2px_0px_0px_#153462] ${formData.languages.includes(lang) ? "bg-[#f68921]" : "bg-white"}`} />
                </div>
                <span className="font-bold uppercase text-xs text-[#153462]">{lang}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <textarea
          name="remarks"
          rows={3}
          placeholder="ADDITIONAL REMARKS (OPTIONAL)"
          className={`${brutInputStyle} w-full py-2 uppercase text-xs`}
          onChange={handleChange}
          value={formData.remarks}
        />

        {/* Consent */}
        <label className="flex items-start gap-4 cursor-pointer group">
          <input
            type="checkbox"
            className="sr-only"
            checked={privacyConsent}
            onChange={() => setPrivacyConsent(!privacyConsent)}
          />
          <div className={`mt-1 min-w-[20px] h-5 w-5 border-2 border-[#153462] shadow-[2px_2px_0px_0px_#153462] transition-all ${privacyConsent ? "bg-[#153462]" : "bg-white"}`} />
          <span className="text-[10px] md:text-xs font-bold text-[#153462] uppercase leading-tight">
            I AGREE TO THE <a href="/privacy-policy" className="underline text-[#f68921]">PRIVACY POLICY</a> AND DATA PROCESSING.
          </span>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-[#153462] text-[#fcb22f] font-black text-2xl uppercase italic border-4 border-[#153462] shadow-[8px_8px_0px_0px_#f68921] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          {loading ? "SENDING..." : "GET MY QUOTE →"}
        </Button>
      </form>
    </div>
  );
};

export default Questionnaire;