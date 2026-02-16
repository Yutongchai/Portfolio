import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import Footer from "../../components/ui/Footer";
import ConnectImg from '/connect.jpg';
import Icon from "../../components/AppIcon";
import AvailabilityCalendar from "./components/AvailableCalendar";
import { AvailabilitySlot } from "./types";
import { X, Send, Mail, Phone, Briefcase, Download, Image, Video, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import supabase from "../../config/supabaseClient";

const COLORS = {
  NAVY: '#153462',
  GOLD: '#fcb22f',
  TEAL: '#12a28f',
  ORANGE: '#f68921',
  PURPLE: '#695da5',
  CORAL: '#ee424c',
};

const ConnectionHub = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [bookingData, setBookingData] = useState({ name: "", company: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlotIds, setBookedSlotIds] = useState<string[]>([]);

  const contactMethods = [
    {
      id: "2",
      type: "email",
      label: "Custom Event!",
      value: "yutongchai2@gmail.com",
      icon: <Mail size={32} strokeWidth={3} />,
      color: COLORS.ORANGE,
      description: "Need a tailored team experience? We got you covered!",
      actionLabel: "Drop a Mail"
    },
    {
      id: "3",
      type: "whatsapp",
      label: "Coach Chat",
      value: "60163287947",
      icon: <Phone size={32} strokeWidth={3} />,
      color: COLORS.TEAL,
      description: "Instant access to a certified team building coach!",
      actionLabel: "WhatsApp Us"
    },
    {
      id: "4",
      type: "scroll",
      label: "Corporate Pro",
      value: "availability-calendar",
      icon: <Briefcase size={32} strokeWidth={3} />,
      color: COLORS.NAVY,
      description: "HR or Partnerships? Let's talk business seriously (sort of).",
      actionLabel: "Pick a Time"
    },
  ];

  const quickActions = [
    { label: "Brochure!", icon: <Download size={20} strokeWidth={3} />, color: COLORS.NAVY, action: () => window.open("/brochure.pdf", "_blank") },
    { label: "Cool Stuff", icon: <Image size={20} strokeWidth={3} />, color: COLORS.TEAL, action: () => navigate("/work-showcase") },
    { label: "Talk to Us", icon: <Video size={20} strokeWidth={3} />, color: COLORS.ORANGE, action: () => document.getElementById("availability-calendar")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Our Story", icon: <Sparkles size={20} strokeWidth={3} />, color: COLORS.PURPLE, action: () => navigate("/") },
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

      <div className="min-h-screen bg-[#FFEBD2]"> {/* Warm background like AltHeader */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed top-28 right-6 z-[100] bg-[#12a28f] border-4 border-[#153462] text-white px-8 py-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(21,52,98,1)] flex items-center space-x-3"
            >
              <CheckCircle2 size={24} strokeWidth={3} />
              <span className="font-black uppercase tracking-tight">Boom! Sent! 🚀</span>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6">

            {/* --- ENERGETIC HERO --- */}
            <section className="relative h-[60vh] flex items-center justify-center mb-24 group">
              <div className="absolute inset-0 z-0 rounded-[3rem] overflow-hidden border-8 border-[#153462] shadow-[12px_12px_0px_0px_#153462] transform group-hover:-rotate-1 transition-transform duration-500">
                <img src={ConnectImg} alt="Connect" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#153462]/80 to-transparent" />
              </div>

              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <h1 className="text-6xl md:text-9xl font-black text-white mb-2 tracking-tighter italic uppercase">
                    Let's Link!
                  </h1>
                  <p className="inline-block bg-[#fcb22f] text-[#153462] px-6 py-2 text-2xl md:text-3xl font-black rounded-full border-4 border-[#153462] -rotate-3 hover:rotate-3 transition-transform cursor-pointer">
                    The EITO Way ✨
                  </p>
                </motion.div>
              </div>
            </section>

            {/* --- CARTOONY CONTACT METHODS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
              {contactMethods.map((method, idx) => (
                <motion.div
                  key={method.id}
                  whileHover={{ y: -10, rotate: idx % 2 === 0 ? 2 : -2 }}
                  className="bg-white border-4 border-[#153462] p-10 rounded-[2.5rem] shadow-[8px_8px_0px_0px_#153462] hover:shadow-[16px_16px_0px_0px_#153462] transition-all cursor-pointer"
                  onClick={() => {/* ... existing click logic ... */ }}
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border-4 border-[#153462] shadow-[4px_4px_0px_0px_#153462]"
                    style={{ backgroundColor: method.color, color: 'white' }}
                  >
                    {method.icon}
                  </div>
                  <h3 className="text-2xl font-black text-[#153462] uppercase mb-3 italic">{method.label}</h3>
                  <p className="text-slate-600 font-bold mb-8">{method.description}</p>
                  <div className="flex items-center gap-2 font-black uppercase text-sm" style={{ color: method.color }}>
                    {method.actionLabel} <ArrowRight strokeWidth={3} size={20} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* --- QUICK ACTIONS BAR (Bubbly) --- */}
            <div className="bg-[#153462] rounded-[3rem] p-6 mb-32 shadow-[0_20px_0_0_#0a1a31]">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-[#153462] border-2 border-transparent hover:border-[#fcb22f] transition-all group active:scale-95"
                  >
                    <span className="transition-transform group-hover:scale-125 group-hover:rotate-12">{action.icon}</span>
                    <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* --- CALENDAR SECTION --- */}
            <div className="grid grid-cols-1 gap-16 mb-32">
              {/* Main Container - Neo-Brutalist Style */}
              <div id="availability-calendar" className="relative bg-white p-8 md:p-12 border-4 border-[#153462] shadow-[12px_12px_0px_0px_#153462]">

                {/* Header Logic */}
                <div className="mb-12 flex justify-between items-start">
                  <div>
                    {/* Decorative Badge */}
                    <div className="inline-block bg-[#fcb22f] border-2 border-[#153462] px-3 py-1 mb-3 rotate-[-1deg] shadow-[3px_3px_0px_0px_#153462]">
                      <p className="text-[#153462] font-black uppercase tracking-widest text-[10px]">
                        {selectedSlot ? "Step 02" : "Step 01"}
                      </p>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-black text-[#153462] uppercase italic tracking-tighter">
                      {selectedSlot ? "Confirm Details" : "Check Availability"} <span className="text-[#f68921]">_</span>
                    </h3>
                    <p className="text-[#79989f] font-bold uppercase tracking-[0.2em] text-xs mt-1">
                      {selectedSlot ? "Almost there" : "Live Facilitator Schedule"}
                    </p>
                  </div>

                  {selectedSlot && (
                    <button
                      onClick={() => setSelectedSlot(null)}
                      className="p-3 bg-white border-4 border-[#153462] text-[#153462] hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0px_0px_#153462] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                      <X size={24} strokeWidth={3} />
                    </button>
                  )}
                </div>

                <div className="relative min-h-[450px]">
                  <AnimatePresence mode="wait">
                    {!selectedSlot ? (
                      <motion.div
                        key="calendar"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="border-4 border-[#153462] p-4 bg-[#FFEBD2]/30"
                      >
                        <AvailabilityCalendar
                          slots={sampleSlots}
                          onBookSlot={(slot: any) => setSelectedSlot(slot)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="booking-form"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="max-w-2xl mx-auto bg-white border-8 border-[#153462] p-8 md:p-12 shadow-[16px_16px_0px_0px_#f68921]"
                      >
                        {/* Selected Slot Ticket Style */}
                        <div className="mb-10 p-6 bg-[#153462] text-white border-4 border-dashed border-[#fcb22f] relative overflow-hidden">
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-[#153462]" />
                          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-[#153462]" />

                          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#fcb22f] mb-1">Confirmed Selection</p>
                          <p className="text-2xl font-black italic">{selectedSlot.day} @ {selectedSlot.time}</p>
                        </div>

                        <form onSubmit={triggerEmailNotification} className="space-y-8">
                          {[
                            { label: 'Your Full Name', val: 'name', ph: 'e.g. Adam Smith' },
                            { label: 'Company Name', val: 'company', ph: 'e.g. EITO Group' },
                            { label: 'Email Address', val: 'email', ph: 'your@email.com', type: 'email' }
                          ].map((input) => (
                            <div key={input.val}>
                              <label className="block text-xs font-black uppercase tracking-widest text-[#153462] mb-3">
                                {input.label}
                              </label>
                              <input
                                required
                                type={input.type || "text"}
                                className="w-full bg-white border-4 border-[#153462] px-5 py-4 font-bold text-[#153462] focus:bg-[#FFEBD2] outline-none shadow-[4px_4px_0px_0px_#153462] transition-all focus:shadow-none focus:translate-x-1 focus:translate-y-1"
                                placeholder={input.ph}
                                value={bookingData[input.val as keyof typeof bookingData]}
                                onChange={(e) => setBookingData({ ...bookingData, [input.val]: e.target.value })}
                              />
                            </div>
                          ))}

                          <button
                            type="submit"
                            className="w-full bg-[#f68921] text-[#153462] border-4 border-[#153462] py-6 font-black uppercase tracking-widest text-lg flex items-center justify-center gap-4 transition-all shadow-[8px_8px_0px_0px_#153462] hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-50"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              "Sending..."
                            ) : (
                              <>Generate Request <Send size={24} strokeWidth={3} /></>
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