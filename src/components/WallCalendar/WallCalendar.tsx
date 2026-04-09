import React, { useState, useEffect } from "react";
import { HeroImage } from "./HeroImage";
import { NotesSection } from "./NotesSection";
import { CalendarGrid } from "./CalendarGrid";
import { DayView } from "./DayView";
import { isSameDay, isBeforeDay } from "../../utils/dateUtils";
interface DateRange {
  start: Date | null;
  end: Date | null;
}
const THEMES = [
  {
    name: "Nature",
    color: "#10b981",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Ocean",
    color: "#3b82f6",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Sunset",
    color: "#f59e0b",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80"
  }
];
export const WallCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [refreshNotesKey, setRefreshNotesKey] = useState(0); 
  
  const [themeIndex, setThemeIndex] = useState(0);
  const activeTheme = THEMES[themeIndex];
  const [animDate, setAnimDate] = useState<Date | null>(null);
  const [flipDirection, setFlipDirection] = useState<'idle' | 'up' | 'down'>('idle');
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedRange({ start: null, end: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const handlePrevMonth = () => {
    if (flipDirection !== 'idle') return;
    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
    setAnimDate(prevDate);
    setFlipDirection('down');
    setTimeout(() => {
      setCurrentDate(prevDate);
      setFlipDirection('idle');
      setAnimDate(null);
    }, 400); 
  };
  const handleNextMonth = () => {
    if (flipDirection !== 'idle') return;
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    
    setAnimDate(currentDate);
    setCurrentDate(nextDate);
    setFlipDirection('up');
    setTimeout(() => {
      setFlipDirection('idle');
      setAnimDate(null);
    }, 400); 
  };

  const handlePrevDay = () => {
    if (flipDirection !== 'idle') return;
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    setAnimDate(prevDate);
    setFlipDirection('down');
    setTimeout(() => {
      setCurrentDate(prevDate);
      setFlipDirection('idle');
      setAnimDate(null);
    }, 400); 
  };

  const handleNextDay = () => {
    if (flipDirection !== 'idle') return;
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    
    setAnimDate(currentDate);
    setCurrentDate(nextDate);
    setFlipDirection('up');
    setTimeout(() => {
      setFlipDirection('idle');
      setAnimDate(null);
    }, 400); 
  };
  const handlePrevTheme = () => {
    setThemeIndex(prev => (prev === 0 ? THEMES.length - 1 : prev - 1));
  };
  const handleNextTheme = () => {
    setThemeIndex(prev => (prev === THEMES.length - 1 ? 0 : prev + 1));
  };
  const handleDateClick = (date: Date) => {
    if (flipDirection !== 'idle') return;
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
    } else {
      if (isSameDay(date, selectedRange.start)) {
         setSelectedRange({ start: selectedRange.start, end: date });
      } else if (isBeforeDay(date, selectedRange.start)) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
      }
    }
  };
  const handleNoteUpdate = () => {
    setRefreshNotesKey(prev => prev + 1);
  };
  const renderPage = (targetDate: Date, animClass: string = "", zIndex: string = "z-10", isAbsolute: boolean = false) => {
    const isAnimLayer = isAbsolute;
    const mName = targetDate.toLocaleString('default', { month: 'long' });
    return (
      <div 
        className={`flex flex-col w-full shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300 preserve-3d origin-top ${animClass} ${zIndex} ${isAbsolute ? 'absolute top-0 left-0 right-0 pointer-events-none' : 'relative'}`}
        style={{ '--theme-accent': activeTheme.color } as React.CSSProperties}
        aria-hidden={isAbsolute}
      >
        <div className="absolute top-0 left-0 right-0 flex justify-around px-6 md:px-12 z-50 pointer-events-none -mt-3">
          {Array.from({ length: 30 }).map((_, i) => (
             <div key={i} className="relative w-3 md:w-4 flex flex-col items-center">
               {/* Punch hole inner shadow */}
               <div className="absolute top-[14px] md:top-[18px] w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-zinc-800 dark:bg-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] z-0"></div>
               {/* Metallic wire */}
               <div className="w-1.5 md:w-2 h-6 md:h-8 bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 dark:from-zinc-500 dark:via-zinc-300 dark:to-zinc-600 rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.5)] border border-black/10 dark:border-black/50 relative z-10 transform translate-y-1">
                 {/* Wire highlight */}
                 <div className="absolute inset-y-0 left-[20%] w-[30%] bg-white/40 dark:bg-white/20 rounded-full"></div>
               </div>
               {/* Wire shadow cast on paper */}
               <div className="absolute top-[28px] md:top-[34px] w-2 md:w-3 h-1 bg-black/20 dark:bg-black/40 blur-[1px] rounded-full translate-y-1"></div>
             </div>
          ))}
        </div>
        <div className="w-full relative z-10 transition-colors duration-300 border-b-4 border-[var(--theme-accent)]">
          <HeroImage 
            monthName={mName} 
            theme={activeTheme}
            onPrevTheme={isAnimLayer ? () => {} : handlePrevTheme}
            onNextTheme={isAnimLayer ? () => {} : handleNextTheme}
          />
        </div>
        <div className="flex flex-col md:flex-row w-full transition-colors duration-300 relative bg-zinc-50 dark:bg-zinc-950 flex-1">
          <div className="w-full md:w-4/12 lg:w-5/12 bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 transition-colors duration-300 flex flex-col">
          <NotesSection 
            selectedRange={selectedRange} 
            onNoteUpdate={isAnimLayer ? undefined : handleNoteUpdate}
            onExitSelection={isAnimLayer ? undefined : () => setSelectedRange({ start: null, end: null })}
          />
          </div>
        <div className="w-full md:w-8/12 lg:w-7/12 relative flex flex-col pt-2 md:pt-0">
          {/* View Toggle */}
          <div className="absolute top-3 right-4 md:top-5 md:right-6 flex items-center bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full p-1 z-30 shadow-inner">
             <button
               onClick={isAnimLayer ? undefined : () => setViewMode('month')}
               className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${viewMode === 'month' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm scale-105' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
             >
               Month
             </button>
             <button
               onClick={isAnimLayer ? undefined : () => setViewMode('day')}
               className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${viewMode === 'day' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm scale-105' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'}`}
             >
               Day
             </button>
          </div>
          <div className="w-full h-full relative flex flex-col">
            <div className={`w-full h-full transition-opacity duration-300 flex flex-col ${viewMode === 'month' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
              <CalendarGrid
                currentDate={targetDate}
                onPrevMonth={isAnimLayer ? () => {} : handlePrevMonth}
                onNextMonth={isAnimLayer ? () => {} : handleNextMonth}
                selectedRange={selectedRange}
                onDateClick={isAnimLayer ? () => {} : handleDateClick}
                hoverDate={hoverDate}
                onDateHover={isAnimLayer ? () => {} : setHoverDate}
                refreshNotesKey={refreshNotesKey}
              />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-300 z-20 overflow-hidden rounded-br-2xl ${viewMode === 'day' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {viewMode === 'day' && (
                <DayView 
                  currentDate={targetDate}
                  onPrevDay={isAnimLayer ? () => {} : handlePrevDay}
                  onNextDay={isAnimLayer ? () => {} : handleNextDay}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  return (
    <div className="w-full max-w-4xl mx-auto perspective-1000 relative z-10">
      
      {selectedRange.start && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/90 dark:bg-white/90 text-white dark:text-zinc-900 px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-6 fade-in duration-300 flex items-center gap-2 transition-all">
          <span className="hidden sm:inline">Press ESC to clear selection</span>
          <span className="inline sm:hidden">Tap outside to clear</span>
          <div className="w-px h-3 bg-white/30 dark:bg-black/30 hidden sm:block"></div>
          <button 
            onClick={() => setSelectedRange({start: null, end: null})}
            className="hidden sm:inline opacity-80 hover:opacity-100 transition-opacity underline decoration-dotted underline-offset-2"
          >
            Clear
          </button>
        </div>
      )}
      {renderPage(currentDate, "", "z-10", false)}
      {flipDirection !== 'idle' && animDate && (
        renderPage(
          animDate, 
          flipDirection === 'up' ? 'animate-flip-out-up' : 'animate-flip-in-down', 
          'z-20', 
          true
        )
      )}
    </div>
  );
};