"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { INDUSTRIES } from "./industries";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const QuestionnaireTP = () => {
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
    trainingTypes: [] as string[],
    trainingOther: "",
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
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ privacyConsent?: string }>({});

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (name: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[name as keyof typeof prev] as string[];
      const isSelected = arr.includes(value);
      return {
        ...prev,
        [name]: isSelected ? arr.filter((l) => l !== value) : [...arr, value],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requiredFields = ["name", "contact", "companyName", "companyEmail", "industryOption", "noOfPax", "duration", "eventMonth", "eventYear", "budget", "location"];
    const isMissingField = requiredFields.some((field) => !formData[field as keyof typeof formData]);
    const isMissingCheckboxes = formData.trainingTypes.length === 0 || formData.languages.length === 0;

    if (isMissingField || isMissingCheckboxes || !privacyConsent) {
      if (!privacyConsent) setFieldErrors({ privacyConsent: "Agreement required" });
      setSubmitMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    try {
      const trainingTypesArray = formData.trainingTypes.filter((type) => type !== "Others");
      if (formData.trainingOther.trim()) trainingTypesArray.push(formData.trainingOther);

      const languagesArray = formData.languages.filter((lang) => lang !== "Others");
      if (formData.languagesOther.trim()) languagesArray.push(formData.languagesOther);

      const submitData = {
        name: formData.name,
        contact: formData.contact ? parseInt(formData.contact, 10) : null,
        company_name: formData.companyName,
        company_email: formData.companyEmail,
        industry: formData.industryOption === "Other" ? formData.industryOther : formData.industryOption,
        no_of_pax: formData.noOfPax ? parseInt(formData.noOfPax) : null,
        duration: formData.duration,
        types_of_training: trainingTypesArray,
        estimated_training_month: `${formData.eventMonth} ${formData.eventYear}`,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        hrdc: formData.hrdc === "Yes",
        preferred_location: formData.location,
        language: languagesArray.join(", "),
        remarks: formData.remarks,
      };

      const { error } = await supabase.from("training_program_inquiries").insert([submitData]);
      if (error) throw error;

      setSubmitMessage({ type: "success", text: "Success! We will contact you shortly." });
      // Reset form logic here...
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Error submitting form. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const brutInputStyle = "border-4 border-[#153462] p-4 font-bold placeholder:text-slate-400 focus:ring-0 focus:border-[#f68921] shadow-[4px_4px_0px_0px_#153462] transition-all focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none";

  return (
    <div className="bg-white p-6 md:p-12 border-8 border-[#153462] rounded-[2rem] md:rounded-[3rem] shadow-[12px_12px_0px_0px_#fcb22f]">
      
      {/* Neo-Brutalist Header */}
      <div className="mb-10">
        <div className="inline-block border-4 border-[#153462] bg-[#f68921] px-4 py-1 mb-2 rotate-[-1.5deg] shadow-[4px_4px_0px_0px_#153462]">
          <span className="text-white font-black uppercase tracking-widest text-sm">Training Inquiry</span>
        </div>
        <h3 className="text-4xl md:text-5xl font-black text-[#153462] uppercase italic tracking-tighter">
          Elevate Your <span className="text-[#f68921]">Team_</span>
        </h3>
      </div>

      {submitMessage && (
        <div className={`mb-8 p-4 border-4 border-[#153462] font-black uppercase italic ${submitMessage.type === "success" ? "bg-green-400" : "bg-red-400"} shadow-[4px_4px_0px_0px_#153462]`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8" noValidate>
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input className={brutInputStyle} name="name" placeholder="YOUR NAME" value={formData.name} onChange={handleChange} disabled={loading} />
          <Input className={brutInputStyle} name="contact" placeholder="CONTACT NUMBER" value={formData.contact} onChange={handleChange} disabled={loading} />
        </div>

        {/* Row 2: Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input className={brutInputStyle} name="companyName" placeholder="COMPANY NAME" value={formData.companyName} onChange={handleChange} disabled={loading} />
          <Input className={brutInputStyle} type="email" name="companyEmail" placeholder="WORK EMAIL" value={formData.companyEmail} onChange={handleChange} disabled={loading} />
        </div>

        {/* Row 3: Industry & Pax */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            name="industryOption"
            className="border-4 border-[#153462] font-bold h-full shadow-[4px_4px_0px_0px_#153462]"
            value={formData.industryOption}
            onChange={(val) => setFormData((p) => ({ ...p, industryOption: val }))}
            options={INDUSTRIES.map((i) => ({ value: i, label: i.toUpperCase() }))}
            placeholder="SELECT INDUSTRY"
          />
          <Input className={brutInputStyle} type="number" name="noOfPax" placeholder="NO. OF PAX" value={formData.noOfPax} onChange={handleChange} disabled={loading} min={0} />
        </div>

        {/* Training Duration Selection */}
        <div className="border-4 border-[#153462] p-6 bg-slate-50 shadow-[4px_4px_0px_0px_#153462]">
          <label className="block mb-4 font-black uppercase italic text-[#153462]">Duration of Training <span className="text-[#f68921]">*</span></label>
          <div className="flex gap-4">
            {["Half day", "Full day"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, duration: item }))}
                className={`flex-1 py-3 border-2 border-[#153462] font-black uppercase transition-all ${
                  formData.duration === item ? "bg-[#153462] text-white -translate-y-1 shadow-[4px_4px_0px_0px_#f68921]" : "bg-white text-[#153462]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Types of Training Checklist */}
        <div className="border-4 border-[#153462] p-6 bg-slate-50 shadow-[4px_4px_0px_0px_#153462]">
          <label className="block mb-4 font-black uppercase italic text-[#153462]">Types of Training <span className="text-[#f68921]">*</span></label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Mental Health & Wellbeing", "Leadership & Management", "Personal Development & Soft Skills", "Others"].map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={formData.trainingTypes.includes(type)} onChange={() => handleCheckbox("trainingTypes", type)} />
                  <div className={`w-6 h-6 border-2 border-[#153462] transition-all shadow-[2px_2px_0px_0px_#153462] ${formData.trainingTypes.includes(type) ? "bg-[#f68921]" : "bg-white"}`} />
                </div>
                <span className="font-bold uppercase text-[10px] md:text-xs text-[#153462]">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Month, Year, Budget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            name="eventMonth"
            className="border-4 border-[#153462] font-bold shadow-[4px_4px_0px_0px_#153462]"
            value={formData.eventMonth}
            onChange={(val) => setFormData((p) => ({ ...p, eventMonth: val }))}
            options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => ({ value: m, label: m.toUpperCase() }))}
            placeholder="MONTH"
          />
          <Select
            name="eventYear"
            className="border-4 border-[#153462] font-bold shadow-[4px_4px_0px_0px_#153462]"
            value={formData.eventYear}
            onChange={(val) => setFormData((p) => ({ ...p, eventYear: val }))}
            options={yearOptions}
            placeholder="YEAR"
          />
          <Input className={brutInputStyle} name="budget" placeholder="BUDGET (RM)" value={formData.budget} onChange={handleChange} />
        </div>

        {/* HRDC & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="border-4 border-[#153462] p-6 bg-slate-50 shadow-[4px_4px_0px_0px_#153462]">
            <label className="block mb-4 font-black uppercase italic text-[#153462]">HRDC Claimable?</label>
            <div className="flex gap-4">
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, hrdc: opt }))}
                  className={`flex-1 py-2 border-2 border-[#153462] font-black transition-all ${
                    formData.hrdc === opt ? "bg-[#153462] text-white shadow-[4px_4px_0px_0px_#fcb22f]" : "bg-white"
                  }`}
                >
                  {opt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <Input className={brutInputStyle} name="location" placeholder="PREFERRED LOCATION" value={formData.location} onChange={handleChange} />
        </div>

        {/* Languages Checklist */}
        <div className="border-4 border-[#153462] p-6 bg-slate-50 shadow-[4px_4px_0px_0px_#153462]">
          <label className="block mb-4 font-black uppercase italic text-[#153462]">Language to Conduct <span className="text-[#f68921]">*</span></label>
          <div className="flex flex-wrap gap-6">
            {["English", "Mandarin", "BM", "Others"].map((lang) => (
              <label key={lang} className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={formData.languages.includes(lang)} onChange={() => handleCheckbox("languages", lang)} />
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
          placeholder="REMARKS (OPTIONAL)"
          className={`${brutInputStyle} w-full py-2 uppercase text-xs`}
          onChange={handleChange}
          value={formData.remarks}
        />

        {/* Privacy Consent */}
        <label className="flex items-start gap-4 cursor-pointer group">
          <input type="checkbox" className="sr-only" checked={privacyConsent} onChange={() => setPrivacyConsent(!privacyConsent)} />
          <div className={`mt-1 min-w-[20px] h-5 w-5 border-2 border-[#153462] shadow-[2px_2px_0px_0px_#153462] transition-all ${privacyConsent ? "bg-[#153462]" : "bg-white"}`} />
          <span className="text-[10px] md:text-xs font-bold text-[#153462] uppercase leading-tight">
            I AGREE TO THE <a href="/privacy-policy" className="underline text-[#f68921]">PRIVACY POLICY</a> AND DATA PROCESSING.
          </span>
        </label>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-[#153462] text-[#fcb22f] font-black text-2xl uppercase italic border-4 border-[#153462] shadow-[8px_8px_0px_0px_#f68921] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          {loading ? "SENDING..." : "SUBMIT REQUEST →"}
        </Button>
      </form>
    </div>
  );
};

export default QuestionnaireTP;