import React, { useState } from 'react';

const Questionnaire = () => {
  // 1. Setup State for all fields
  const [formData, setFormData] = useState<{
    name: string;
    contact: string;
    companyName: string;
    companyEmail: string;
    industry: string;
    noOfPax: string;
    duration: string;
    durationOther: string;
    eventMonth: string;
    budget: string;
    hrdc: string;
    location: string;
    languages: string[];
    remarks: string;
  }>({
    name: '',
    contact: '',
    companyName: '',
    companyEmail: '',
    industry: '',
    noOfPax: '',
    duration: '',
    durationOther: '',
    eventMonth: '',
    budget: '',
    hrdc: 'Yes',
    location: '',
    languages: [],
    remarks: ''
  });

  // 2. Handle simple input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Handle checkbox array (Languages)
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
  };

  // 4. Submit Logic
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    
    // Example: Trigger an alert or API call
    alert("Thank you! Your inquiry has been sent.");
    
    // Reset form or redirect user here
  };

  // Reusable input style
  const inputStyle = "w-full p-4 rounded-xl bg-white border-2 border-gray-200 focus:border-[#fcb22f] focus:outline-none transition-all duration-200 placeholder:text-gray-400 font-medium";

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
      <h3 className="text-3xl font-black mb-8">Let's Connect</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Row: Name & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" required onChange={handleChange} className={inputStyle} />
          <input type="text" name="contact" placeholder="Contact Number" required onChange={handleChange} className={inputStyle} />
        </div>

        <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} className={inputStyle} />
        <input type="email" name="companyEmail" placeholder="Company Email" required onChange={handleChange} className={inputStyle} />
        <input type="text" name="industry" placeholder="Industry" onChange={handleChange} className={inputStyle} />
        <input type="number" name="noOfPax" placeholder="No of pax" onChange={handleChange} className={inputStyle} />

        {/* Duration Selection */}
        <div className="py-2">
          <label className="block mb-3 font-bold text-gray-700">Duration:</label>
          <div className="flex flex-wrap gap-4">
            {['Half day', 'Full day', '2D1N', '3D2N'].map((item) => (
              <label key={item} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="duration" 
                  value={item} 
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#fcb22f]" 
                />
                <span className="text-gray-600">{item}</span>
              </label>
            ))}
            <div className="flex items-center gap-2">
               <input type="radio" name="duration" value="Others" onChange={handleChange} className="w-5 h-5 accent-[#fcb22f]" />
               <input 
                type="text" 
                name="durationOther"
                placeholder="Others: Specify" 
                onChange={handleChange}
                className="border-b-2 border-gray-200 focus:border-[#fcb22f] outline-none px-2 py-1 text-sm w-32" 
               />
            </div>
          </div>
        </div>

        {/* Row: Month & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="eventMonth" placeholder="Estimated Event Month" onChange={handleChange} className={inputStyle} />
          <input type="text" name="budget" placeholder="Budget (RM)" onChange={handleChange} className={inputStyle} />
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
                  className="w-5 h-5 accent-[#fcb22f]" 
                />
                <span className="text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <input type="text" name="location" placeholder="Preferred Location" onChange={handleChange} className={inputStyle} />

        {/* Languages Checkboxes */}
        <div className="py-2">
          <label className="block mb-3 font-bold text-gray-700">Language to Conduct:</label>
          <div className="flex flex-wrap gap-6">
            {['English', 'Mandarin', 'BM', 'Others'].map((lang) => (
              <label key={lang} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.languages.includes(lang)}
                  onChange={() => handleCheckbox(lang)}
                  className="w-5 h-5 rounded accent-[#fcb22f]" 
                />
                <span className="text-gray-600">{lang}</span>
              </label>
            ))}
          </div>
        </div>

        <textarea 
          name="remarks" 
          rows={3} 
          placeholder="Additional Remarks" 
          onChange={handleChange}
          className={inputStyle}
        ></textarea>

        <button 
          type="submit"
          className="w-full py-5 bg-[#fcb22f] text-white font-black text-xl rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          Submit Inquiry
        </button>
      </form>
    </div>
  );
};

export default Questionnaire;