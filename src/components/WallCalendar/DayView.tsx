import React, { useState, useEffect } from "react";
import { formatYYYYMMDD } from "../../utils/dateUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DayViewProps {
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const DayView: React.FC<DayViewProps> = ({ currentDate, onPrevDay, onNextDay }) => {
  const [notes, setNotes] = useState<{ [hour: number]: string }>({});
  const dateStr = formatYYYYMMDD(currentDate);

  useEffect(() => {
    const loadedNotes: { [hour: number]: string } = {};
    for (let i = 0; i < 24; i++) {
       const key = `calendar_notes_${dateStr}_h${i}`;
       const val = localStorage.getItem(key);
       if (val) loadedNotes[i] = val;
    }
    setNotes(loadedNotes);
  }, [dateStr]);

  const handleNoteChange = (hour: number, val: string) => {
    setNotes(prev => ({ ...prev, [hour]: val }));
    const key = `calendar_notes_${dateStr}_h${hour}`;
    if (val.trim() === "") {
       localStorage.removeItem(key);
    } else {
       localStorage.setItem(key, val);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="absolute inset-0 p-4 md:p-6 flex flex-col transition-colors duration-300 bg-white dark:bg-zinc-950">
      <div className="w-full flex items-center justify-center gap-6 md:gap-8 mb-2 md:mb-4 mt-1 md:mt-0 flex-shrink-0">
        <button 
          onClick={onPrevDay}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
             {currentDate.toLocaleDateString('default', { weekday: 'long' })}
          </h2>
          <span className="text-sm font-medium text-[var(--theme-accent)]">
             {currentDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <button 
          onClick={onNextDay}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
         <div className="flex flex-col gap-3 pb-8">
            {hours.map(hour => {
               const timeLabel = new Date(2000, 0, 1, hour).toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' });
               return (
                  <div key={hour} className="flex items-start gap-4 w-full group">
                     <div className="w-16 pt-3 text-right text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        {timeLabel}
                     </div>
                     <div className="relative flex-1 group-focus-within:border-[var(--theme-accent)] border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 transition-colors p-3 shadow-sm min-h-[60px]">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--theme-accent)] rounded-l-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                       <textarea
                          placeholder="Event or note..."
                          value={notes[hour] || ''}
                          onChange={(e) => handleNoteChange(hour, e.target.value)}
                          className="w-full h-full min-h-[44px] resize-none bg-transparent border-0 focus:ring-0 text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400/50 dark:placeholder:text-zinc-600/50 outline-none leading-relaxed"
                       />
                     </div>
                  </div>
               )
            })}
         </div>
      </div>
    </div>
  );
};
