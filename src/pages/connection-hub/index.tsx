import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";
import { HoverEffect } from "../../components/ui/HoverEffect";
import TestimonialCard from "./components/TestimonialCard";
import AvailabilityCalendar from "./components/AvailableCalendar";
import {
  ContactMethod,
  AvailabilitySlot,
} from "./types";
import { X, Send } from "lucide-react";
import { ArrowRight, CheckCircle2, Download, Image, Video, Mail, Phone, Briefcase } from "lucide-react";
import supabase from "../../config/supabaseClient";

const ConnectionHub = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [bookingData, setBookingData] = useState({ name: "", company: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlotIds, setBookedSlotIds] = useState<string[]>([]);
  // Enhanced Colors & Icons for Methods
  // Enhanced Colors & Icons for Methods
  const contactMethods = [
    {
      id: "2",
      type: "email",
      label: "Request Custom Event",
      value: "yutongchai2@gmail.com",
      icon: <Mail size={28} />,
      color: "#f68921",
      description: "Tailored team building experiences for your company.",
      actionLabel: "Send Email"
    },
    {
      id: "3",
      type: "whatsapp", // Linked to WhatsApp
      label: "Consult Team Coach",
      value: "60163287947", // Format: Country code + number without '+'
      icon: <Phone size={28} />,
      color: "#153462",
      description: "Speak directly with a certified team building coach.",
      actionLabel: "Chat on WhatsApp"
    },
    {
      id: "4",
      type: "scroll", // Linked to Calendar
      label: "Corporate Inquiry",
      value: "availability-calendar",
      icon: <Briefcase size={28} />,
      color: "#18616e",
      description: "For HR and corporate partnership inquiries.",
      actionLabel: "Book Consultation"
    },
  ];

  const socialLinks = [
    {
      title: "WhatsApp",
      description: "Chat with us directly for quick responses.",
      link: "https://wa.me/60163287947",
      icon: "MessageCircle",
    },
    {
      title: "Instagram",
      description: "Follow @eitogroup for behind-the-scenes.",
      link: "https://www.instagram.com/eitogroup/",
      icon: "Instagram",
    },
    {
      title: "Email",
      description: "Send us an email for formal requests.",
      link: "mailto:yutongchai2@gmail.com",
      icon: "Mail",
    },
  ];

  const quickActions = [
    { label: "Service Brochure", icon: <Download size={20} />, color: "#153462", action: () => window.open("/brochure.pdf", "_blank") },
    { label: "Event Gallery", icon: <Image size={20} />, color: "#18616e", action: () => navigate("/work-showcase") },
    { label: "Discovery Call", icon: <Video size={20} />, color: "#f68921", action: () => document.getElementById("availability-calendar")?.scrollIntoView({ behavior: "smooth" }) },
  ];

  const triggerEmailNotification = async (e: any) => {
    e.preventDefault();

    if (!selectedSlot) {
      console.warn("No slot selected for booking");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1) Persist booking to Supabase
      const { data: inserted, error: insertError } = await supabase
        .from("bookings" as any)
        .insert([
          {
            slot_id: selectedSlot.id,
            customer_name: bookingData.name,
            customer_email: bookingData.email,
            company_name: bookingData.company,
            appointment_time: `${selectedSlot.day} ${selectedSlot.time}`,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Booking insert failed", insertError);
        // Postgres unique violation code is 23505; supabase may return that code
        const isUniqueViolation = insertError?.code === '23505' || (insertError?.message || '').toLowerCase().includes('duplicate');
        if (isUniqueViolation) {
          alert('Sorry — that slot was just booked by someone else. Please choose another slot.');
          setSelectedSlot(null);
          return;
        }
        console.log("Database Success:", inserted);
        throw insertError;
      }

      const bookingId = (inserted as any)?.id;

      // 2) Invoke Edge Function to send email (Resend / provider)
      // Make sure you deployed `send-booking-email` via Supabase Functions
      const fnPayload = {
        email: bookingData.email,
        slot: selectedSlot,
        customerName: bookingData.name,
        companyName: bookingData.company,
        bookingId,
      };

      console.log("Invoking send-booking-email with payload:", fnPayload);
      const { data: fnData, error: fnError } = await supabase.functions.invoke("send-booking-email", {
        body: fnPayload,
      });

      console.log("Function response - data:", fnData, "error:", fnError);

      if (fnError) {
        console.error("Edge function error details:", {
          message: fnError.message,
          context: fnError.context,
          details: fnError
        });
        // not fatal for UI — booking exists, but email failed
        alert(`Booking saved but email failed to send: ${fnError.message || 'Unknown error'}. Check console for details.`);
      } else if (fnData?.error) {
        console.error("Function returned error in response:", fnData);
        alert(`Booking saved but email failed: ${fnData.error}`);
      }

      // Success UI
      setShowSuccessMessage(true);
      setSelectedSlot(null);
      setBookingData({ name: "", company: "", email: "" });
      setTimeout(() => setShowSuccessMessage(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no slots are provided from props/backend, render a generated sample week
  // Fetch booked slots from Supabase so we can disable them in the calendar
  useEffect(() => {
    let mounted = true;
    async function fetchBooked() {
      try {
        const { data, error } = await supabase.from('bookings' as any).select('slot_id');
        if (error) throw error;
        if (!mounted) return;
        setBookedSlotIds((data || []).map((r: any) => r.slot_id));
      } catch (err) {
        console.error('Failed to load booked slots', err);
      }
    }
    fetchBooked();
    return () => { mounted = false; };
  }, []);

  // Handle hash navigation for direct links
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);
  const sampleSlots = useMemo(() => {
    const slots: AvailabilitySlot[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      // Skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) continue;

      const dateKey = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

      // 8:00 AM to 5:00 PM (17:00)
      for (let hour = 8; hour < 17; hour++) {
        ["00", "30"].forEach((min) => {
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          const timeStr = `${displayHour}:${min} ${ampm}`;
          const slotId = `${dateKey}-${hour}${min}`;

          slots.push({
            id: slotId,
            day: dayLabel,
            time: timeStr,
            available: !bookedSlotIds.includes(slotId),
          });
        });
      }
    }
    return slots;
  }, [bookedSlotIds]);
  // Helper to create deterministic minute key for slot ids
  function hourMinuteKey(timeStr: string, dayIndex: number, idx: number) {
    // Normalize times like "10:00 AM" -> "1000" or "2:30 PM" -> "1430"
    const [hpart, ampm] = timeStr.split(' ');
    const [h, m] = hpart.split(':').map(Number);
    let hour24 = h % 12 + (ampm === 'PM' ? 12 : 0);
    const hh = String(hour24).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${hh}${mm}`;
  }

  return (
    <>
      <Helmet>
        <title>Connection Hub | EITO Group</title>
        <link rel="icon" type="image/png" href="/Portfolio/EITO bw.png" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Success Toast */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="fixed top-28 right-6 z-[100] bg-[#153462] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border-l-4 border-[#f68921]"
            >
              <CheckCircle2 className="text-[#f68921]" size={24} />
              <span className="font-bold uppercase tracking-tight text-sm">Message Sent Successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">

            {/* --- HERO SECTION --- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-24"
            >
              <p className="text-[#f68921] font-black uppercase tracking-[0.4em] text-sm mb-4">Let's Connect</p>
              <h1 className="text-5xl md:text-8xl font-black text-[#153462] uppercase tracking-tighter leading-[0.85] mb-8">
                Build Stronger <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#153462] to-[#79989f]">
                  Teams With EITO
                </span>
              </h1>
              <div className="w-24 h-2 bg-[#f68921] mx-auto rounded-full mb-8" />
            </motion.div>

            {/* --- CONTACT METHODS GRID --- */}
            <div id="contact-methods" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
              {contactMethods.map((method, idx) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    if (method.type === 'email') {
                      window.location.href = `mailto:${method.value}`;
                    } else if (method.type === 'whatsapp') {
                      const msg = encodeURIComponent("Hi EITO Group, I'd like to consult a coach regarding a team building program.");
                      window.open(`https://wa.me/${method.value}?text=${msg}`, '_blank');
                    } else if (method.type === 'scroll') {
                      document.getElementById(method.value)?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="group cursor-pointer relative bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(21,52,98,0.05)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Decorative Background Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 rounded-[2.5rem] transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-12 group-hover:scale-110"
                      style={{ backgroundColor: `${method.color}10`, color: method.color }}
                    >
                      {method.icon}
                    </div>

                    <h3 className="text-xl font-black text-[#153462] uppercase mb-3 tracking-tight">
                      {method.label}
                    </h3>

                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                      {method.description}
                    </p>

                    <div
                      className="flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all group-hover:gap-4"
                      style={{ color: method.color }}
                    >
                      {method.actionLabel} <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* --- QUICK ACTIONS BAR --- */}
            <div className="bg-[#153462] rounded-[3rem] p-4 mb-32 shadow-2xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className="flex items-center justify-center gap-3 py-4 px-6 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all group"
                  >
                    <span className="text-[#f68921] group-hover:scale-125 transition-transform">{action.icon}</span>
                    <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* --- CALENDAR SECTION --- */}
            <div className="grid grid-cols-1 gap-16 mb-32">
              <div id="availability-calendar" className="relative bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 overflow-hidden">

                {/* Header Logic */}
                <div className="mb-8 flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black text-[#153462] uppercase tracking-tight mb-2">
                      {selectedSlot ? "Confirm Details" : "Check Availability"}
                    </h3>
                    <p className="text-[#79989f] font-bold uppercase tracking-widest text-xs">
                      {selectedSlot ? "Almost there" : "Live Facilitator Schedule"}
                    </p>
                  </div>
                  {selectedSlot && (
                    <button
                      onClick={() => setSelectedSlot(null)}
                      className="p-3 bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div className="relative min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {!selectedSlot ? (
                      <motion.div
                        key="calendar"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {/* Ensure AvailabilityCalendar accepts onBookSlot to set the local selectedSlot */}
                        <AvailabilityCalendar
                          slots={sampleSlots}
                          onBookSlot={(slot: any) => setSelectedSlot(slot)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="booking-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-50"
                      >
                        <div className="mb-8 p-4 bg-slate-50 rounded-xl border-l-4 border-[#f68921]">
                          <p className="text-sm font-bold text-[#153462]">SELECTED SLOT</p>
                          <p className="text-[#153462]">{selectedSlot.day} • {selectedSlot.time}</p>
                        </div>

                        <form onSubmit={triggerEmailNotification} className="space-y-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Your Full Name</label>
                            <input
                              required
                              type="text"
                              className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#f68921] transition-all outline-none"
                              placeholder="e.g. Adam Smith"
                              value={bookingData.name}
                              onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Company Name</label>
                            <input
                              required
                              type="text"
                              className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#f68921] transition-all outline-none"
                              placeholder="e.g. EITO Group"
                              value={bookingData.company}
                              onChange={(e) => setBookingData({ ...bookingData, company: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                            <input
                              required
                              type="email"
                              className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#f68921] transition-all outline-none"
                              placeholder="your@email.com"
                              value={bookingData.email}
                              onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-[#153462] hover:bg-[#1e4a8a] text-white py-5 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>Sending... <Send size={14} /></>
                            ) : (
                              <>Generate Email Request <Send size={18} /></>
                            )}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ConnectionHub;