'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabaseClient';
import { INDUSTRIES } from './industries';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/CheckBox';
import Button from '../../../components/ui/Button';

const QuestionnaireTP = () => {
  const [formData, setFormData] = useState<{
    name: string;
    contact: string;
    companyName: string;
    companyEmail: string;
    industryOption: string;
    industryOther: string;
    noOfPax: string;
    duration: string;
    trainingTypes: string[];
    trainingOther: string;
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
    trainingTypes: [],
    trainingOther: '',
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

  useEffect(() => {
    if (!submitMessage) return;
    const timer = setTimeout(() => setSubmitMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [submitMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (name: string, value: string) => {
    setFormData(prev => {
      const arr = prev[name as keyof typeof prev] as string[];
      const isSelected = arr.includes(value);
      return {
        ...prev,
        [name]: isSelected ? arr.filter(l => l !== value) : [...arr, value]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // --- LOGICAL VALIDATION START ---
    const requiredFields = [
      'name', 'contact', 'companyName', 'companyEmail',
      'industryOption', 'noOfPax', 'duration', 'eventMonth',
      'budget', 'location'
    ];

    const isMissingField = requiredFields.some(field => !formData[field as keyof typeof formData]);
    const isMissingCheckboxes = formData.trainingTypes.length === 0 || formData.languages.length === 0;

    if (isMissingField || isMissingCheckboxes) {
      setSubmitMessage({
        type: 'error',
        text: 'Please fill in all required fields'
      });
      return;
    }
    // --- LOGICAL VALIDATION END ---

    setLoading(true);
    setSubmitMessage(null);

    try {
      const trainingTypesArray = formData.trainingTypes.filter(type => type !== 'Others');
      if (formData.trainingOther.trim()) {
        trainingTypesArray.push(formData.trainingOther);
      }

      const languagesArray = formData.languages.filter(lang => lang !== 'Others');
      if (formData.languagesOther.trim()) {
        languagesArray.push(formData.languagesOther);
      }

      const submitData = {
        name: formData.name,
        contact: formData.contact ? parseInt(formData.contact, 10) : null,
        company_name: formData.companyName,
        company_email: formData.companyEmail,
        industry: formData.industryOption === 'Other' ? formData.industryOther : formData.industryOption,
        no_of_pax: formData.noOfPax ? parseInt(formData.noOfPax) : null,
        duration: formData.duration,
        types_of_training: trainingTypesArray,
        estimated_training_month: formData.eventMonth,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        hrdc: formData.hrdc === 'Yes',
        preferred_location: formData.location,
        language: languagesArray.join(', '),
        remarks: formData.remarks,
      };

      const { error } = await supabase
        .from('training_program_inquiries')
        .insert([submitData]);

      if (error) throw error;

      setSubmitMessage({
        type: 'success',
        text: 'Thank you! Your inquiry has been sent. We will get back to you soon.'
      });

      setFormData({
        name: '',
        contact: '',
        companyName: '',
        companyEmail: '',
        industryOption: '',
        industryOther: '',
        noOfPax: '',
        duration: '',
        trainingTypes: [],
        trainingOther: '',
        eventMonth: '',
        budget: '',
        hrdc: 'Yes',
        location: '',
        languages: [],
        languagesOther: '',
        remarks: ''
      });
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Error submitting form. Please ensure all data is valid and try again.'
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
      <h3 className="text-2xl md:text-3xl font-black mb-6 md:mb-8">Let's Connect</h3>

      {submitMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-4 right-4 top-6 md:left-auto md:right-6 md:top-6 z-[60] rounded-xl px-5 md:px-6 py-3 md:py-4 shadow-xl border font-bold ${submitMessage.type === 'success'
            ? 'bg-green-600 text-white border-green-400'
            : 'bg-red-600 text-white border-red-400'
            }`}
        >
          {submitMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5" noValidate>
        {/* Name & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              required
              onChange={handleChange}
              value={formData.name}
              disabled={loading}
            />
          </div>
          <div>
            <Input
              type="text"
              name="contact"
              placeholder="Contact"
              required
              onChange={handleChange}
              value={formData.contact}
              disabled={loading}
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
            value={formData.companyEmail}
            disabled={loading}
          />
        </div>

        {/* Industry Selection */}
        <div>
          <Select
            name="industryOption"
            value={formData.industryOption}
            onChange={(value) => setFormData(prev => ({ ...prev, industryOption: value }))}
            options={INDUSTRIES.map((industry) => ({ value: industry, label: industry }))}
            placeholder="Select Industry"
            searchable
            required
            disabled={loading}
          />
        </div>

        {/* Industry Other */}
        {formData.industryOption === 'Other' && (
          <div>
            <Input
              type="text"
              name="industryOther"
              placeholder="Please specify your industry"
              required
              onChange={handleChange}
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
            value={formData.noOfPax}
            disabled={loading}
            min={0}
            step={1}
          />
        </div>

        {/* Duration of Training */}
        <div className="py-2">
          <label className="block mb-3 font-bold text-gray-700">Duration of Training: <span className="text-red-500">*</span></label>
          <div className="flex gap-6">
            {['Half day', 'Full day'].map((item) => (
              <label key={item} className="flex items-center gap-2 cursor-pointer">
                <Input
                  type="radio"
                  name="duration"
                  value={item}
                  onChange={handleChange}
                  checked={formData.duration === item}
                  disabled={loading}
                />
                <span className="text-gray-600 text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Types of Training */}
        <div className="py-2">
          <label className="block mb-3 font-bold text-gray-700">Types of Training: <span className="text-red-500">*</span></label>
          <div className="flex flex-col gap-3">
            {['Mental Health & Wellbeing', 'Leadership & Management', 'Personal Development & Soft Skills', 'Others'].map((type) => (
              <Checkbox
                key={type}
                checked={formData.trainingTypes.includes(type)}
                onChange={() => handleCheckbox('trainingTypes', type)}
                disabled={loading}
                label={type}
              />
            ))}
          </div>
        </div>

        {/* Training Other */}
        {formData.trainingTypes.includes('Others') && (
          <div>
            <Input
              type="text"
              name="trainingOther"
              placeholder="Please specify other training type"
              required
              onChange={handleChange}
              value={formData.trainingOther}
              disabled={loading}
            />
          </div>
        )}

        {/* Month & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              name="eventMonth"
              placeholder="Estimated Training Month (e.g., August 2026)"
              required
              onChange={handleChange}
              value={formData.eventMonth}
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
              value={formData.budget}
              disabled={loading}
              min={0}
              step="0.01"
            />
          </div>
        </div>

        {/* HRDC Toggle */}
        <div className="flex gap-10 items-center py-2">
          <label className="font-bold text-gray-700">HRDC Claimable?</label>
          <div className="flex gap-4">
            {['Yes', 'No'].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <Input
                  type="radio"
                  name="hrdc"
                  value={opt}
                  checked={formData.hrdc === opt}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">{opt}</span>
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
            value={formData.location}
            disabled={loading}
          />
        </div>

        {/* Languages Checkboxes */}
        <div className="py-2">
          <label className="block mb-3 font-bold text-gray-700">Language to Conduct: <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-6">
            {['English', 'Mandarin', 'BM', 'Others'].map((lang) => (
              <Checkbox
                key={lang}
                checked={formData.languages.includes(lang)}
                onChange={() => handleCheckbox('languages', lang)}
                disabled={loading}
                label={lang}
              />
            ))}
          </div>
        </div>

        {/* Languages Other */}
        {formData.languages.includes('Others') && (
          <div>
            <Input
              type="text"
              name="languagesOther"
              placeholder="Please specify other language"
              required
              onChange={handleChange}
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
            placeholder="Remarks (Optional)"
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
          {loading ? 'Submitting...' : 'Submit Inquiry'}
        </Button>
      </form>
    </div>
  );
};

export default QuestionnaireTP;