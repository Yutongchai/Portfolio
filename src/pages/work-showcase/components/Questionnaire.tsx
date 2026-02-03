"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../config/supabaseClient";
import { INDUSTRIES } from "./industries";
import Select from "../../../components/ui/Select";
import Input from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/CheckBox";
import Button from "../../../components/ui/Button";

type FormType = "csr" | "team_building" | "corporate_event";

interface QuestionnaireProps {
  formType?: FormType;
}

const Questionnaire = ({ formType = "csr" }: QuestionnaireProps) => {
  // Generate years dynamically from current year + 10 years ahead
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = (currentYear + i).toString();
    return { value: year, label: year };
  });

  const [formData, setFormData] = useState<{
    name: string;
    contact: string;
    companyName: string;
    companyEmail: string;
    industryOption: string;
    industryOther: string;
    noOfPax: string;
    duration: string;
    durationOther: string;
    eventMonth: string;
    eventYear: string;
    budget: string;
    hrdc: string;
    location: string;
    languages: string[];
    languagesOther: string;
    remarks: string;
  }>({
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
    languages: [],
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
  }>({});

  useEffect(() => {
    if (!submitMessage) return;
    const timer = setTimeout(() => setSubmitMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [submitMessage]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

    // 1. Manual Validation Check
    const requiredFields = [
      "name",
      "contact",
      "companyName",
      "companyEmail",
      "industryOption",
      "noOfPax",
      "duration",
      "eventMonth",
      "eventYear",
      "budget",
      "location",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData],
    );

    const nextErrors: { duration?: string; languages?: string } = {};

    if (missingFields.length > 0 || formData.languages.length === 0) {
      if (!formData.duration)
        nextErrors.duration = "Please select the duration";

      if (formData.languages.length === 0)
        nextErrors.languages = "Please select at least one language";

      setFieldErrors(nextErrors);

      setSubmitMessage({
        type: "error",

        text: "Please fill in all required fields",
      });

      setLoading(false);

      return;
    }

    try {
      const tableMap = {
        csr: "csr_inquiries",
        team_building: "team_building_inquiries",
        corporate_event: "corporate_event_inquiries",
      };

      const languagesArray = formData.languages.filter(
        (lang) => lang !== "Others",
      );

      if (formData.languagesOther.trim())
        languagesArray.push(formData.languagesOther);

      const submitData = {
        name: formData.name,
        contact: formData.contact,
        company_name: formData.companyName,
        company_email: formData.companyEmail,
        industry:
          formData.industryOption === "Other"
            ? formData.industryOther
            : formData.industryOption,

        no_of_pax: parseInt(formData.noOfPax),

        duration:
          formData.duration === "Others"
            ? formData.durationOther
            : formData.duration,

        estimated_event_month: `${formData.eventMonth} ${formData.eventYear}`,
        budget: formData.budget,
        hrdc: formData.hrdc === "Yes",
        preferred_location: formData.location,
        language: languagesArray.join(", "),
        remarks: formData.remarks,
      };

      const { error } = await supabase
        .from(tableMap[formType])
        .insert([submitData]);

      if (error) throw error;

      setSubmitMessage({
        type: "success",
        text: "Thank you! Your inquiry has been sent.",
      });

      // Reset Form...
      setFormData({
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
        languages: [],
        languagesOther: "",
        remarks: "",
      });
    } catch (error: any) {
      console.error("Submission error:", error);

      setSubmitMessage({
        type: "error",

        text: "Database error. Please ensure all fields are valid.",
      });
    } finally {
      setLoading(false);
    }
  };

  const textAreaStyle =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
      <h3 className="text-2xl md:text-3xl font-black mb-6 md:mb-8">
        Let's Connect
      </h3>

      {submitMessage && (
        <div
          className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:w-auto px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-in fade-in slide-in-from-top-4 ${submitMessage.type === "success"
            ? "bg-green-600 text-white border-green-400"
            : "bg-red-600 text-white border-red-400"
            }`}
        >
          <p className="font-bold text-center">{submitMessage.text}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 md:space-y-5"
        noValidate
      >
        {/* Name & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              required
              onChange={handleChange}
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity("Please enter your name")
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              value={formData.name}
              disabled={loading}
            />
          </div>
          <div>
            <Input
              type="text"
              name="contact"
              placeholder="Contact Number"
              required
              onChange={handleChange}
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity(
                  "Please enter your contact number",
                )
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              value={formData.contact}
              disabled={loading}
              min={0}
              step={1}
            />
          </div>
        </div>

        {/* Company Name */}
        <div>
          <Input
            type="text"
            name="companyName"
            placeholder="Company Name"
            required
            onChange={handleChange}
            onInvalid={(e) =>
              e.currentTarget.setCustomValidity(
                "Please enter your company name",
              )
            }
            onInput={(e) => e.currentTarget.setCustomValidity("")}
            value={formData.companyName}
            disabled={loading}
          />
        </div>

        {/* Company Email */}
        <div>
          <Input
            type="email"
            name="companyEmail"
            placeholder="Company Email"
            required
            onChange={handleChange}
            onInvalid={(e) => {
              if (e.currentTarget.validity.valueMissing) {
                e.currentTarget.setCustomValidity(
                  "Please enter your company email",
                );
              } else if (e.currentTarget.validity.typeMismatch) {
                e.currentTarget.setCustomValidity(
                  "Please enter a valid email address",
                );
              }
            }}
            onInput={(e) => e.currentTarget.setCustomValidity("")}
            value={formData.companyEmail}
            disabled={loading}
          />
        </div>

        {/* Industry Selection */}
        <div>
          <Select
            name="industryOption"
            // Ensure your Select component internally uses text-base (16px)
            // to match standard HTML inputs
            className="text-base"
            value={formData.industryOption}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, industryOption: value }))
            }
            options={INDUSTRIES.map((industry) => ({
              value: industry,
              label: industry,
            }))}
            placeholder="Select Industry"
            searchable
            disabled={loading}
          />
        </div>

        {/* Industry Other */}
        {formData.industryOption === "Other" && (
          <div>
            <Input
              type="text"
              name="industryOther"
              placeholder="Please specify your industry"
              required
              onChange={handleChange}
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity(
                  "Please specify your industry",
                )
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              value={formData.industryOther}
              disabled={loading}
            />
          </div>
        )}

        {/* Number of Pax */}
        <div>
          <Input
            type="number"
            name="noOfPax"
            placeholder="No of pax"
            required
            onChange={handleChange}
            onInvalid={(e) =>
              e.currentTarget.setCustomValidity(
                "Please enter the number of participants",
              )
            }
            onInput={(e) => e.currentTarget.setCustomValidity("")}
            value={formData.noOfPax}
            disabled={loading}
            min={0}
            step={1}
          />
        </div>

        {/* Duration Selection */}
        <div className="py-2">
          <label className="block mb-3 font-bold text-gray-700">
            Duration: <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {["Half day", "Full day", "2D1N", "3D2N", "Others"].map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Input
                  type="radio"
                  name="duration"
                  value={item}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldErrors((prev) => ({
                      ...prev,
                      duration: undefined,
                    }));
                  }}
                  checked={formData.duration === item}
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">{item}</span>
              </label>
            ))}
          </div>
          {fieldErrors.duration && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {fieldErrors.duration}
            </p>
          )}
        </div>

        {/* Duration Other */}
        {formData.duration === "Others" && (
          <div>
            <Input
              type="text"
              name="durationOther"
              placeholder="Please specify duration"
              required
              onChange={handleChange}
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity("Please specify the duration")
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              value={formData.durationOther}
              disabled={loading}
            />
          </div>
        )}

        {/* Month & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Select
              name="eventMonth"
              value={formData.eventMonth}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, eventMonth: value }))
              }
              options={[
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
              ]}
              placeholder="Month"
              disabled={loading}
            />
            <Select
              name="eventYear"
              value={formData.eventYear}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, eventYear: value }))
              }
              options={yearOptions}
              placeholder="Year"
              disabled={loading}
            />
          </div>
          <div>
            <Input
              type="number"
              name="budget"
              placeholder="Budget (RM)"
              required
              onChange={handleChange}
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity("Please enter your budget")
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              value={formData.budget}
              disabled={loading}
            />
          </div>
        </div>

        {/* HRDC Toggle */}
        <div className="flex gap-10 items-center py-2">
          <label className="font-bold text-gray-700">HRDC Claimable?</label>
          <div className="flex gap-4">
            {["Yes", "No"].map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Input
                  type="radio"
                  name="hrdc"
                  value={opt}
                  checked={formData.hrdc === opt}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Location */}
        <div>
          <Input
            type="text"
            name="location"
            placeholder="Preferred Location"
            required
            onChange={handleChange}
            onInvalid={(e) =>
              e.currentTarget.setCustomValidity(
                "Please enter your preferred location",
              )
            }
            onInput={(e) => e.currentTarget.setCustomValidity("")}
            value={formData.location}
            disabled={loading}
          />
        </div>

        {/* Languages Checkboxes */}
        <div className="py-2">
          <label className="block mb-3 font-bold text-gray-700">
            Language to Conduct: <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-6">
            {["English", "Mandarin", "BM", "Others"].map((lang, index) => (
              <Checkbox
                key={lang}
                checked={formData.languages.includes(lang)}
                onChange={() => handleCheckbox(lang)}
                disabled={loading}
                label={lang}
              />
            ))}
          </div>
          {fieldErrors.languages && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {fieldErrors.languages}
            </p>
          )}
        </div>

        {/* Languages Other */}
        {formData.languages.includes("Others") && (
          <div>
            <Input
              type="text"
              name="languagesOther"
              placeholder="Please specify other language"
              required
              onChange={handleChange}
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity(
                  "Please specify the other language",
                )
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              value={formData.languagesOther}
              disabled={loading}
            />
          </div>
        )}

        {/* Remarks (Optional) */}
        <div>
          <textarea
            name="remarks"
            rows={3}
            placeholder="Additional Remarks (Optional)"
            onChange={handleChange}
            value={formData.remarks}
            disabled={loading}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          fullWidth
          className="py-4 md:py-5 bg-[#fcb22f] text-white font-black text-lg md:text-xl rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          {loading ? "Submitting..." : "Submit Inquiry"}
        </Button>
      </form>
    </div>
  );
};

export default Questionnaire;
