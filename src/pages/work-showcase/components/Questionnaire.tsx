'use client';

import React, { useState } from 'react';
import { supabase } from '../../../config/supabaseClient';
import { INDUSTRIES } from './industries';

type FormType = 'csr' | 'team_building' | 'corporate_event';

interface QuestionnaireProps {
  formType?: FormType;
}

const Questionnaire = ({ formType = 'csr' }: QuestionnaireProps) => {
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
    budget: string;
    hrdc: string;
    location: string;
    languages: string[];
    languagesOther: string;
    remarks: string;
  }>({
    name: '',
    contact: '',
    companyName: '',
    companyEmail: '',
    industryOption: '',
    industryOther: '',
    noOfPax: '',
    duration: '',
    durationOther: '',
    eventMonth: '',
    budget: '',
    hrdc: 'Yes',
    location: '',
    languages: [],
    languagesOther: '',
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ duration?: string; languages?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (lang: string) => {
    setFormData(prev => {
      const isSelected = prev.languages.includes(lang);
      return {
        ...prev,
        languages: isSelected
          ? prev.languages.filter(l => l !== lang)
          : [...prev.languages, lang]
      };
    });
    setFieldErrors(prev => ({ ...prev, languages: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors: { duration?: string; languages?: string } = {};

    if (!formData.duration) {
      nextErrors.duration = 'Please select the duration';
    }

    if (formData.languages.length === 0) {
      nextErrors.languages = 'Please select at least one language';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    setSubmitMessage(null);

    try {
      // Determine which table to insert into
      const tableMap = {
        csr: 'csr_inquiries',
        team_building: 'team_building_inquiries',
        corporate_event: 'corporate_event_inquiries'
      };

      const table = tableMap[formType];

      // Prepare languages array - only include selected languages and custom "Other" text
      const languagesArray = formData.languages.filter(lang => lang !== 'Others');
      if (formData.languagesOther.trim()) {
        languagesArray.push(formData.languagesOther);
      }

      // Prepare data for insertion
      const submitData = {
        name: formData.name,
        contact: formData.contact ? parseInt(formData.contact, 10) : null,
        company_name: formData.companyName,
        company_email: formData.companyEmail,
        industry: formData.industryOption === 'Other' ? formData.industryOther : formData.industryOption,
        no_of_pax: formData.noOfPax ? parseInt(formData.noOfPax) : null,
        duration: formData.duration === 'Others' ? formData.durationOther : formData.duration,
        estimated_event_month: formData.eventMonth,
        budget: formData.budget,
        hrdc: formData.hrdc === 'Yes',
        preferred_location: formData.location,
        language: languagesArray.join(', '),
        remarks: formData.remarks,
      };

      const { error } = await supabase.from(table).insert([submitData]);

      if (error) throw error;

      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your inquiry has been sent. We will get back to you soon.'
      });

      // Reset form
      setFormData({
        name: '',
        contact: '',
        companyName: '',
        companyEmail: '',
        industryOption: '',
        industryOther: '',
        noOfPax: '',
        duration: '',
        durationOther: '',
        eventMonth: '',
        budget: '',
        hrdc: 'Yes',
        location: '',
        languages: [],
        languagesOther: '',
        remarks: ''
      });
      setFieldErrors({});
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Error submitting form. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-4 rounded-xl bg-white border-2 border-gray-200 focus:border-[#fcb22f] focus:outline-none transition-all duration-200 placeholder:text-gray-400 font-medium";

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
      <h3 className="text-3xl font-black mb-8">Let's Connect</h3>

      {submitMessage && (
        <div className={`mb-6 p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              onChange={handleChange}
              onInvalid={(e) => e.currentTarget.setCustomValidity('Please enter your name')}
              onInput={(e) => e.currentTarget.setCustomValidity('')}
              value={formData.name}
              disabled={loading}
              className={inputStyle}
            />
          </div>
          <div>
            <input
              type="number"
              name="contact"
              placeholder="Contact Number"
              required
              onChange={handleChange}
              onInvalid={(e) => e.currentTarget.setCustomValidity('Please enter your contact number')}
              onInput={(e) => e.currentTarget.setCustomValidity('')}
              value={formData.contact}
              disabled={loading}
              min={0}
              step={1}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Company Name */}
        <div>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            required
            onChange={handleChange}
            onInvalid={(e) => e.currentTarget.setCustomValidity('Please enter your company name')}
            onInput={(e) => e.currentTarget.setCustomValidity('')}
            value={formData.companyName}
            disabled={loading}
            className={inputStyle}
          />
        </div>

        {/* Company Email */}
        <div>
          <input
            type="email"
            name="companyEmail"
            placeholder="Company Email"
            required
            onChange={handleChange}
            onInvalid={(e) => {
              if (e.currentTarget.validity.valueMissing) {
                e.currentTarget.setCustomValidity('Please enter your company email');
              } else if (e.currentTarget.validity.typeMismatch) {
                e.currentTarget.setCustomValidity('Please enter a valid email address');
              }
            }}
            onInput={(e) => e.currentTarget.setCustomValidity('')}
            value={formData.companyEmail}
            disabled={loading}
            className={inputStyle}
          />
        </div>

        {/* Industry Selection */}
        <div>
          <select
            name="industryOption"
            onChange={(e) => {
              handleChange(e);
              e.currentTarget.setCustomValidity('');
            }}
            onInvalid={(e) => e.currentTarget.setCustomValidity('Please select your industry')}
            value={formData.industryOption}
            disabled={loading}
            required
            className={inputStyle}
          >
            <option value="" disabled>Select Industry</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Industry Other */}
        {formData.industryOption === 'Other' && (
          <div>
            <input
              type="text"
              name="industryOther"
              placeholder="Please specify your industry"
              required
              onChange={handleChange}
              onInvalid={(e) => e.currentTarget.setCustomValidity('Please specify your industry')}
              onInput={(e) => e.currentTarget.setCustomValidity('')}
              value={formData.industryOther}
              disabled={loading}
              className={inputStyle}
            />
          </div>
        )}

        {/* Number of Pax */}
        <div>
          <input
            type="number"
            name="noOfPax"
            placeholder="No of pax"
            required
            onChange={handleChange}
            onInvalid={(e) => e.currentTarget.setCustomValidity('Please enter the number of participants')}
            onInput={(e) => e.currentTarget.setCustomValidity('')}
            value={formData.noOfPax}
            disabled={loading}
            min={0}
            step={1}
            className={inputStyle}
          />
        </div>

        {/* Duration Selection */}
        <div className="py-2">
          <label className="block mb-3 font-bold text-gray-700">Duration: <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-4">
            {['Half day', 'Full day', '2D1N', '3D2N', 'Others'].map((item) => (
              <label key={item} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="duration"
                  value={item}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldErrors(prev => ({ ...prev, duration: undefined }));
                  }}
                  checked={formData.duration === item}
                  disabled={loading}
                  className="w-5 h-5 accent-[#fcb22f]"
                />
                <span className="text-gray-600">{item}</span>
              </label>
            ))}
          </div>
          {fieldErrors.duration && (
            <p className="mt-2 text-sm font-medium text-red-600">{fieldErrors.duration}</p>
          )}
        </div>

        {/* Duration Other */}
        {formData.duration === 'Others' && (
          <div>
            <input
              type="text"
              name="durationOther"
              placeholder="Please specify duration"
              required
              onChange={handleChange}
              onInvalid={(e) => e.currentTarget.setCustomValidity('Please specify the duration')}
              onInput={(e) => e.currentTarget.setCustomValidity('')}
              value={formData.durationOther}
              disabled={loading}
              className={inputStyle}
            />
          </div>
        )}

        {/* Month & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="eventMonth"
              placeholder="Estimated Event Month (e.g., August 2026)"
              required
              onChange={handleChange}
              onInvalid={(e) => e.currentTarget.setCustomValidity('Please enter the estimated event month')}
              onInput={(e) => e.currentTarget.setCustomValidity('')}
              value={formData.eventMonth}
              disabled={loading}
              className={inputStyle}
            />
          </div>
          <div>
            <input
              type="text"
              name="budget"
              placeholder="Budget (RM)"
              required
              onChange={handleChange}
              onInvalid={(e) => e.currentTarget.setCustomValidity('Please enter your budget')}
              onInput={(e) => e.currentTarget.setCustomValidity('')}
              value={formData.budget}
              disabled={loading}
              className={inputStyle}
            />
          </div>
        </div>

        {/* HRDC Toggle */}
        <div className="flex gap-10 items-center py-2">
          <label className="font-bold text-gray-700">HRDC Claimable?</label>
          <div className="flex gap-4">
            {['Yes', 'No'].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="hrdc"
                  value={opt}
                  checked={formData.hrdc === opt}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-5 h-5 accent-[#fcb22f]"
                />
                <span className="text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Location */}
        <div>
          <input
            type="text"
            name="location"
            placeholder="Preferred Location"
            required
            onChange={handleChange}
            onInvalid={(e) => e.currentTarget.setCustomValidity('Please enter your preferred location')}
            onInput={(e) => e.currentTarget.setCustomValidity('')}
            value={formData.location}
            disabled={loading}
            className={inputStyle}
          />
        </div>

        {/* Languages Checkboxes */}
        <div className="py-2">
          <label className="block mb-3 font-bold text-gray-700">Language to Conduct: <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-6">
            {['English', 'Mandarin', 'BM', 'Others'].map((lang, index) => (
              <label key={lang} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.languages.includes(lang)}
                  onChange={() => handleCheckbox(lang)}
                  disabled={loading}
                  className="w-5 h-5 accent-[#fcb22f]"
                />
                <span className="text-gray-600">{lang}</span>
              </label>
            ))}
          </div>
          {fieldErrors.languages && (
            <p className="mt-2 text-sm font-medium text-red-600">{fieldErrors.languages}</p>
          )}
        </div>

        {/* Languages Other */}
        {formData.languages.includes('Others') && (
          <div>
            <input
              type="text"
              name="languagesOther"
              placeholder="Please specify other language"
              required
              onChange={handleChange}
              onInvalid={(e) => e.currentTarget.setCustomValidity('Please specify the other language')}
              onInput={(e) => e.currentTarget.setCustomValidity('')}
              value={formData.languagesOther}
              disabled={loading}
              className={inputStyle}
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
            className={inputStyle}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-[#fcb22f] text-white font-black text-xl rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
};

export default Questionnaire;
