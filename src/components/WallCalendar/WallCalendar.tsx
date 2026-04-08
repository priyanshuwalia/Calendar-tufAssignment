import React, { useState, useEffect } from "react";
import { HeroImage } from "./HeroImage";
import { NotesSection } from "./NotesSection";
import { CalendarGrid } from "./CalendarGrid";
import { isSameDay, isBeforeDay } from "../../utils/dateUtils";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const THEMES = [
  {
    name: "Nature",
    color: "#10b981", // emerald-500
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Ocean",
    color: "#3b82f6", // blue-500
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Sunset",
    color: "#f59e0b", // amber-500
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80"
  }
];

export const WallCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [refreshNotesKey, setRefreshNotesKey] = useState(0); 
  
  // Theme state
  const [themeIndex, setThemeIndex] = useState(0);
  const activeTheme = THEMES[themeIndex];

  // Seamless layered fluid animation states
  const [animDate, setAnimDate] = useState<Date | null>(null);
  const [flipDirection, setFlipDirection] = useState<'idle' | 'up' | 'down'>('idle');

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
    
    setAnimDate(prevDate);    // Animating page dropping from top
    setFlipDirection('down'); // Trigger flipInDown (dropping)

    setTimeout(() => {
      setCurrentDate(prevDate);
      setFlipDirection('idle');
      setAnimDate(null);
    }, 400); 
  };

  const handleNextMonth = () => {
    if (flipDirection !== 'idle') return;
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    
    setAnimDate(currentDate);  // The page flipping UP and away
    setCurrentDate(nextDate);  // The target page revealed underneath instantly
    setFlipDirection('up');    // Trigger flipOutUp 

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
        aria-hidden={isAbsolute} // Prevent screen readers from reading duplicating phantom layer
      >
        {/* Physical Calendar Spiral Binding Decor */}
        <div className="absolute top-0 left-0 right-0 flex justify-around px-8 md:px-16 z-50 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
             <div key={i} className="w-1.5 md:w-2 h-4 md:h-5 bg-gradient-to-b from-zinc-200 via-zinc-400 to-zinc-300 dark:from-zinc-500 dark:via-zinc-700 dark:to-zinc-600 rounded-b-full shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-x border-b border-black/20 dark:border-black/50"></div>
          ))}
        </div>

        {/* Top Section */}
        <div className="w-full relative z-10 transition-colors duration-300 border-b-4 border-[var(--theme-accent)]">
          <HeroImage 
            monthName={mName} 
            theme={activeTheme}
            onPrevTheme={isAnimLayer ? () => {} : handlePrevTheme}
            onNextTheme={isAnimLayer ? () => {} : handleNextTheme}
          />
        </div>

        {/* Bottom Section: Notes + Calendar Grid Split */}
        <div className="flex flex-col md:flex-row w-full transition-colors duration-300 relative bg-zinc-50 dark:bg-zinc-950 flex-1">
          {/* Notes Sidebar */}
          <div className="w-full md:w-4/12 lg:w-5/12 bg-white dark:bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 transition-colors duration-300 flex flex-col">
          <NotesSection 
            selectedRange={selectedRange} 
            onNoteUpdate={isAnimLayer ? undefined : handleNoteUpdate}
            onExitSelection={isAnimLayer ? undefined : () => setSelectedRange({ start: null, end: null })}
          />
          </div>

        {/* Interactive Grid */}
        <div className="w-full md:w-8/12 lg:w-7/12 relative flex flex-col">
          <div className="w-full h-full relative flex flex-col">
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
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="w-full max-w-4xl mx-auto perspective-1000 relative z-10">
      
      {/* Selection Exit Prompt */}
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

      {/* The static foundational layer */}
      {renderPage(currentDate, "", "z-10", false)}

      {/* The foreground animating layer (either peeling away up or crashing down) */}
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
