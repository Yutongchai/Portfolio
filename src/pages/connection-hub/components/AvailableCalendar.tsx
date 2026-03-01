import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Info } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { AvailabilitySlot } from '../types';

interface AvailabilityCalendarProps {
  slots: AvailabilitySlot[];
  onBookSlot: (slot: AvailabilitySlot) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ slots, onBookSlot }) => {
  const [step, setStep] = React.useState(1);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Group slots by Month first, then by Date
  const monthlyGroups = useMemo(() => {
    const months: Record<string, any> = {};
    slots.forEach(s => {
      if (!s.date) return; // Skip slots without dates
      const dateObj = new Date(s.date);
      const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!months[monthName]) months[monthName] = {};
      if (!months[monthName][s.date]) months[monthName][s.date] = [];
      months[monthName][s.date].push(s);
    });
    return months;
  }, [slots]);

  return (
    <div className="space-y-10">
      {step === 1 && Object.entries(monthlyGroups).map(([monthName, dates]) => (
        <div key={monthName} className="space-y-4">
          <h3 className="text-2xl font-black text-[#153462] uppercase italic border-b-4 border-[#153462] inline-block pr-8">
            {monthName}
          </h3>
          
          <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {Object.entries(dates).map(([dateStr, daySlots]: any) => {
              const blocked = daySlots.every((s: any) => !s.available);
              const reason = daySlots.find((s: any) => s.blockedReason)?.blockedReason;
              const isSelected = selectedDate === dateStr;
              const d = new Date(dateStr);

              return (
                <div key={dateStr} className="relative group">
                  <button
                    onClick={() => { setSelectedDate(dateStr); setStep(2); }}
                    disabled={blocked}
                    className={`w-full p-3 sm:p-4 border-4 sm:border-4 border-[#153462] transition-all text-left
                      ${isSelected 
                        ? 'bg-[#fcb22f] border-[#153462] text-[#153462] shadow-none translate-x-1 translate-y-1' 
                        : 'bg-white text-[#153462] shadow-[4px_4px_0px_0px_#153462]'}
                      ${blocked ? 'bg-slate-100 opacity-40 grayscale' : ''}
                    `}
                  >
                    <span className="text-[9px] sm:text-[10px] font-black uppercase block">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                    <span className="text-xl sm:text-2xl font-black block">{d.getDate()}</span>
                  </button>

                  {/* Show reason if blocked */}
                  {blocked && reason && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#ee424c] text-white text-[10px] font-bold px-2 py-1 rounded border-2 border-[#153462] z-10 whitespace-nowrap pointer-events-none">
                      {reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* STEP 2: TIME SELECTION (Modified selected style) */}
      {step === 2 && selectedDate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <button onClick={() => setStep(1)} className="font-black text-[#153462] underline decoration-[#fcb22f] decoration-4">
            ← BACK TO CALENDAR
          </button>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* Find slots for the selected date across the monthlyGroups */}
            {Object.values(monthlyGroups)
              .flatMap(month => month[selectedDate] || [])
              .filter((slot: any) => slot.available)
              .map((slot: any) => (
                <button
                  key={slot.id}
                  onClick={() => onBookSlot(slot)}
                  className="py-3 sm:py-4 border-4 border-[#153462] bg-white text-[#153462] font-black shadow-[4px_4px_0px_0px_#153462] hover:bg-[#12a28f] hover:text-white transition-all text-sm"
                >
                  {slot.time}
                </button>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
