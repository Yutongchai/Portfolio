import React, { useMemo, useRef } from 'react';
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
      {/* Day picker pills */}
      <div className="flex items-center gap-3 mb-2 overflow-x-auto px-2">
        {Object.entries(grouped).map(([day, daySlots]: any) => {
          const date = daySlots[0]?.date;
          const blocked = daySlots.every((s: any) => !s.available);
          const reason = daySlots.find((s: any) => s.blockedReason)?.blockedReason;
          return (
            <button
              key={date}
              onClick={() => {
                const el = document.querySelector(`[data-date="${date}"]`);
                (el as HTMLElement | null)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
              }}
              title={blocked && reason ? reason : undefined}
              className={`px-3 py-2 rounded-lg text-sm font-bold border ${blocked ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-[#153462] border-slate-200'}`}
            >
              <div className="leading-none">{new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}</div>
              <div className="text-xs">{new Date(date).getDate()}</div>
            </button>
          );
        })}
      </div>
      {/* Timezone Badge */}
      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] bg-slate-100 w-fit px-3 py-1 rounded-full">
        <Icon name="Globe" size={12} /> Malaysia Time (GMT+8)
      </div>

      <div className="flex flex-row gap-6 overflow-x-auto pb-6 snap-x">
        {Object.entries(grouped).map(([day, daySlots]: any) => {
          const dayBlocked = daySlots.every((s: any) => !s.available);
          const dayReason = daySlots.find((s: any) => s.blockedReason)?.blockedReason;
          const date = daySlots[0]?.date;
          return (
            <div key={day} data-date={date} className="min-w-[180px] snap-start">
              <h4 className={`font-black text-sm mb-4 border-b-2 pb-1 ${dayBlocked ? 'text-slate-400 border-slate-200' : 'text-[#153462] border-orange-200'}`}>
                {day}
                {dayBlocked && dayReason && (
                  <div className="text-xs font-medium text-slate-400 mt-1">{dayReason}</div>
                )}
              </h4>
              <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
                {daySlots.map((slot:any) => (
                  <button
                    key={slot.id}
                    disabled={!slot.available}
                    onClick={() => onBookSlot(slot)}
                    title={!slot.available && slot.blockedReason ? slot.blockedReason : undefined}
                    className={
                      `w-full py-3 px-4 rounded-xl text-xs font-bold transition-all ${slot.available
                        ? 'bg-white text-[#153462] border border-slate-200 hover:border-[#f68921] hover:text-[#f68921] shadow-sm active:scale-95'
                        : 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed opacity-60'}`
                    }
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default AvailabilityCalendar;
