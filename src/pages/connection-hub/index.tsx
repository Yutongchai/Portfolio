import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import Footer from "../../components/ui/Footer";
import ConnectImg from '/connect.jpg';
import AvailabilityCalendar from "./components/AvailableCalendar";
import { AvailabilitySlot } from "./types";
import { X, Send, Mail, Phone, Briefcase, Download, Image, Video, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import supabase from "../../config/supabaseClient";

// Import your TextGenerateEffect component
import { TextGenerateEffect } from '../../components/ui/TextGenerateEffect';

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
  const [unavailableDates, setUnavailableDates] = useState<any[]>([]);

  const contactMethods = [
    {
      id: "2",
      type: "email",
      label: "Custom Event",
      value: "info@eitogroup.com.my",
      icon: <Mail size={28} />,
      color: COLORS.ORANGE,
      description: "Need a tailored team experience? We've got you covered.",
      actionLabel: "Drop a Mail",
      action: () => {
        window.location.href = "mailto:info@eitogroup.com.my";
      }
    },
    {
      id: "3",
      type: "whatsapp",
      label: "Coach Chat",
      value: "60163287947",
      icon: <Phone size={28} />,
      color: COLORS.TEAL,
      description: "Instant access to a certified team building coach.",
      actionLabel: "WhatsApp Us",
      action: () => {
        window.open("https://wa.me/60163287947?text=I%20have%20a%20query", "_blank");
      }
    },
    {
      id: "4",
      type: "scroll",
      label: "Corporate Pro",
      value: "availability-calendar",
      icon: <Briefcase size={28} />,
      color: COLORS.NAVY,
      description: "HR or Partnerships? Let's discuss your business goals.",
      actionLabel: "Pick a Time",
      action: () => {
        document.getElementById("availability-calendar")?.scrollIntoView({ behavior: "smooth" });
      }
    },
  ];

  // Utility: Smooth scroll and mask URL
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const quickActions = [
    {
      label: "Services",
      icon: <Image size={20} />,
      action: () => {
        // If already on home, scroll. If not, go home and scroll after navigation.
        if (window.location.pathname === "/") {
          scrollToSection("ActionSection");
        } else {
          navigate("/", { replace: false });
          // Wait for navigation, then scroll (simple setTimeout, or use a more robust event in a real app)
          setTimeout(() => scrollToSection("ActionSection"), 400);
        }
      }
    },
    { label: "Book Video", icon: <Video size={20} />, action: () => document.getElementById("availability-calendar")?.scrollIntoView({ behavior: "smooth" }) },
    { label: "Our Story", icon: <Sparkles size={20} />, action: () => navigate("/") },
  ];

  // Logic sections (triggerEmailNotification, fetchBooked, sampleSlots) remain identical to previous state
  const triggerEmailNotification = async (e: any) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      const { data: inserted, error: insertError } = await supabase
        .from("bookings" as any)
        .insert([{
          slot_id: selectedSlot.id,
          customer_name: bookingData.name,
          customer_email: bookingData.email,
          company_name: bookingData.company,
          appointment_time: `${selectedSlot.day} ${selectedSlot.time}`,
        }])
        .select().single();
      if (insertError) throw insertError;
      await supabase.functions.invoke("send-booking-email", {
        body: { email: bookingData.email, slot: selectedSlot, customerName: bookingData.name, companyName: bookingData.company, bookingId: (inserted as any)?.id },
      });
      setShowSuccessMessage(true);
      setSelectedSlot(null);
      setBookingData({ name: "", company: "", email: "" });
      setTimeout(() => setShowSuccessMessage(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchBooked() {
      const { data } = await supabase.from('bookings' as any).select('slot_id');
      setBookedSlotIds((data || []).map((r: any) => r.slot_id));
    }
    fetchBooked();
    // fetch unavailable dates
    async function fetchUnavailable() {
      const { data } = await supabase.from('unavailable_dates' as any).select('*').eq('is_active', true);
      setUnavailableDates(data || []);
    }
    fetchUnavailable();
  }, []);

  const sampleSlots = useMemo(() => {
    const slots: AvailabilitySlot[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      const dateKey = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      // determine if this whole day is blocked
      const unavailableForDate = unavailableDates.find((u: any) => {
        if (!u) return false;
        if (u.is_recurring) {
          const ud = new Date(u.date);
          return ud.getUTCDate() === d.getDate() && ud.getUTCMonth() === d.getMonth();
        }
        return u.date === dateKey;
      });
      const dayBlocked = !!unavailableForDate;
      for (let hour = 8; hour < 17; hour++) {
        ["00", "30"].forEach((min) => {
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          const timeStr = `${displayHour}:${min} ${ampm}`;
          const slotId = `${dateKey}-${hour}${min}`;
          slots.push({ id: slotId, date: dateKey, day: dayLabel, time: timeStr, available: !bookedSlotIds.includes(slotId) && !dayBlocked, blockedReason: dayBlocked ? (unavailableForDate?.reason || 'Unavailable') : undefined });
        });
      }
    }
    return slots;
  }, [bookedSlotIds]);

  return (
    <>
      <Helmet>
        <title>Connection Hub | EITO Group</title>
      </Helmet>

      <div className="min-h-screen bg-[#fcfaf8]">
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-24 right-6 z-[100] bg-[#12a28f] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 font-bold"
            >
              <CheckCircle2 size={24} />
              <span>Request Sent Successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- BIG HERO SECTION --- */}
        <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={ConnectImg} alt="Connect" className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#153462]/90 via-[#153462]/60 to-[#fcfaf8]" />
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#fcb22f] font-bold tracking-[0.4em] uppercase text-sm mb-6 block">Get in Touch</span>

              <h1 className="text-7xl md:text-[120px] font-bold mb-8 tracking-tighter leading-[0.85]">
                <TextGenerateEffect
                  words={"Let's Talk."}
                  className="text-white text-7xl md:text-[120px] leading-[0.85]"
                />
              </h1>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => scrollToSection("availability-calendar")}
                  className="bg-[#f68921] hover:bg-[#e07810] text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-[#f68921]/20 flex items-center gap-2"
                >
                  Book a Consultation <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <main className="relative -mt-20 z-20 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              {contactMethods.map((method, idx) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all border border-slate-100 group cursor-pointer"
                  onClick={method.action}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') method.action && method.action(); }}
                  role="button"
                  aria-label={method.actionLabel}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg" style={{ backgroundColor: method.color }}>
                    {method.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#153462] mb-3">{method.label}</h3>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">{method.description}</p>
                  <div className="flex items-center gap-2 font-bold uppercase text-xs tracking-widest" style={{ color: method.color }}>
                    {method.actionLabel} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* QUICK ACTIONS BAR */}
            <div className="bg-[#153462] rounded-[3rem] p-4 mb-32 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.action}
                    className="flex items-center justify-center gap-3 py-6 rounded-[2rem] bg-white/5 hover:bg-white text-white hover:text-[#153462] transition-all font-bold text-sm uppercase tracking-widest border border-white/10 hover:border-transparent"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CALENDAR DESIGN PRESERVED */}
            <div id="availability-calendar" className="relative bg-white p-8 md:p-12 border-4 border-[#153462] shadow-[12px_12px_0px_0px_#153462] mb-32">
              {/* ... rest of your calendar code remains exactly the same ... */}
              <div className="mb-12 flex justify-between items-start">
                <div>
                  <div className="inline-block bg-[#fcb22f] border-2 border-[#153462] px-3 py-1 mb-3 rotate-[-1deg] shadow-[3px_3px_0px_0px_#153462]">
                    <p className="text-[#153462] font-black uppercase tracking-widest text-[10px]">
                      {selectedSlot ? "Step 02" : "Step 01"}
                    </p>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-[#153462] uppercase italic tracking-tighter">
                    {selectedSlot ? "Confirm Details" : "Check Availability"} <span className="text-[#f68921]">_</span>
                  </h3>
                </div>
                {selectedSlot && (
                  <button onClick={() => setSelectedSlot(null)} className="p-3 bg-white border-4 border-[#153462] text-[#153462] hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0px_0px_#153462]">
                    <X size={24} strokeWidth={3} />
                  </button>
                )}
              </div>

              <div className="relative min-h-[450px]">
                <AnimatePresence mode="wait">
                  {!selectedSlot ? (
                    <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-4 border-[#153462] p-4 bg-[#FFEBD2]/30">
                      <AvailabilityCalendar slots={sampleSlots} onBookSlot={(slot: any) => setSelectedSlot(slot)} />
                    </motion.div>
                  ) : (
                    <motion.div key="booking-form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto bg-white border-8 border-[#153462] p-8 md:p-12 shadow-[16px_16px_0px_0px_#f68921]">
                      <div className="mb-10 p-6 bg-[#153462] text-white border-4 border-dashed border-[#fcb22f] relative overflow-hidden">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#fcb22f] mb-1">Confirmed Selection</p>
                        <p className="text-2xl font-black italic">{selectedSlot.day} @ {selectedSlot.time}</p>
                      </div>
                      <form onSubmit={triggerEmailNotification} className="space-y-8">
                        {[{ label: 'Full Name', val: 'name', ph: 'Adam Smith' }, { label: 'Company', val: 'company', ph: 'EITO Group' }, { label: 'Email', val: 'email', ph: 'your@email.com', type: 'email' }].map((input) => (
                          <div key={input.val}>
                            <label className="block text-xs font-black uppercase tracking-widest text-[#153462] mb-3">{input.label}</label>
                            <input required type={input.type || "text"} className="w-full border-4 border-[#153462] px-5 py-4 font-bold outline-none shadow-[4px_4px_0px_0px_#153462] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all" placeholder={input.ph} value={bookingData[input.val as keyof typeof bookingData]} onChange={(e) => setBookingData({ ...bookingData, [input.val]: e.target.value })} />
                          </div>
                        ))}
                        <button type="submit" disabled={isSubmitting} className="w-full bg-[#f68921] text-white border-4 border-[#153462] py-6 font-black uppercase tracking-widest text-lg flex items-center justify-center gap-4 shadow-[8px_8px_0px_0px_#153462] hover:shadow-none transition-all">
                          {isSubmitting ? "Sending..." : "Generate Request"}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
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