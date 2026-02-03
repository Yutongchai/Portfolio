import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Info } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { AvailabilitySlot } from '../types';

interface AvailabilityCalendarProps {
  slots: AvailabilitySlot[];
  onBookSlot: (slot: AvailabilitySlot) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  slots,
  onBookSlot,
}) => {
  const grouped = slots.reduce((acc: any, s) => {
    if (!acc[s.day]) acc[s.day] = [];
    acc[s.day].push(s);
    return acc;
  }, {});
  if (!slots || slots.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center text-slate-400 font-medium">
        No available slots at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timezone Badge */}
      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] bg-slate-100 w-fit px-3 py-1 rounded-full">
        <Icon name="Globe" size={12} /> Malaysia Time (GMT+8)
      </div>

      <div className="flex flex-row gap-6 overflow-x-auto pb-6 snap-x">
        {Object.entries(grouped).map(([day, daySlots]: any) => (
          <div key={day} className="min-w-[180px] snap-start">
            <h4 className="font-black text-[#153462] text-sm mb-4 border-b-2 border-orange-200 pb-1">
              {day}
            </h4>
            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
              {daySlots.map((slot:any) => (
                <button
                  key={slot.id}
                  disabled={!slot.available}
                  onClick={() => onBookSlot(slot)}
                  className={`
                    w-full py-3 px-4 rounded-xl text-xs font-bold transition-all
                    ${slot.available
                      ? "bg-white text-[#153462] border border-slate-200 hover:border-[#f68921] hover:text-[#f68921] shadow-sm active:scale-95"
                      : "bg-slate-100 text-slate-300 border-transparent cursor-not-allowed opacity-60"}
                  `}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default AvailabilityCalendar;
