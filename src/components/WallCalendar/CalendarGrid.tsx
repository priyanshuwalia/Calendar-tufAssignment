import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DAYS_OF_WEEK,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isBeforeDay,
  isAfterDay,
  isWithinRange,
  formatYYYYMMDD,
} from "../../utils/dateUtils";
interface CalendarGridProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedRange: { start: Date | null; end: Date | null };
  onDateClick: (date: Date) => void;
  hoverDate: Date | null;
  onDateHover: (date: Date | null) => void;
  refreshNotesKey?: number;
}

export const CalendarGrid: React.FC<CalendarGridProps> = (props) => {
  const {
    currentDate,
    onPrevMonth,
    onNextMonth,
    selectedRange,
    onDateClick,
    hoverDate,
    onDateHover,
    refreshNotesKey,
  } = props;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const noteColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    for (let i = 0; i < localStorage.length; i++) {
       const key = localStorage.key(i);
       if (key && key.startsWith('calendar_notes_')) {
          const val = localStorage.getItem(key);
          if (!val) continue;
          try {
            const parsed = JSON.parse(val);
            if (!parsed.color) continue;
            
            const keyParts = key.replace('calendar_notes_', '');
            if (keyParts.includes('_to_')) {
              const [startStr, endStr] = keyParts.split('_to_');
              const start = new Date(startStr + "T00:00:00"); 
              const end = new Date(endStr + "T00:00:00");
              if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                 const curr = new Date(start);
                 while(curr <= end) {
                    colorMap.set(formatYYYYMMDD(curr), parsed.color);
                    curr.setDate(curr.getDate() + 1);
                 }
              }
            } else if (keyParts !== 'monthly') {
              colorMap.set(keyParts, parsed.color);
            }
          } catch(e) {}
       }
    }
    return colorMap;
  }, [refreshNotesKey, year, month]);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const daysInPrevMonth = getDaysInMonth(year, month === 0 ? 11 : month - 1);
  const prevMonthPadding = Array.from({ length: firstDay }, (_, i) => daysInPrevMonth - firstDay + i + 1);
  
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const totalCells = 42;
  const remainingCells = totalCells - (firstDay + daysInMonth);
  const nextMonthPadding = Array.from({ length: remainingCells }, (_, i) => i + 1);
  const renderDay = (day: number, isCurrentMonth: boolean, offsetMonth: number = 0) => {
    let cellYear = year;
    let cellMonth = month + offsetMonth;
    if (cellMonth < 0) {
      cellMonth = 11;
      cellYear--;
    } else if (cellMonth > 11) {
      cellMonth = 0;
      cellYear++;
    }
    const cellDate = new Date(cellYear, cellMonth, day);
    
    const dateStr = formatYYYYMMDD(cellDate);
    const noteColor = noteColors.get(dateStr) || null;
    const isStart = selectedRange.start && isSameDay(cellDate, selectedRange.start);
    const isEnd = selectedRange.end && isSameDay(cellDate, selectedRange.end);
    let isInRange = false;
    let isHoverRange = false;
    if (selectedRange.start && selectedRange.end) {
      isInRange = isWithinRange(cellDate, selectedRange.start, selectedRange.end);
    } else if (selectedRange.start && hoverDate && !selectedRange.end) {
      const rStart = isBeforeDay(selectedRange.start, hoverDate) ? selectedRange.start : hoverDate;
      const rEnd = isAfterDay(selectedRange.start, hoverDate) ? selectedRange.start : hoverDate;
      isHoverRange = isWithinRange(cellDate, rStart, rEnd);
    }
    
    const isToday = isSameDay(cellDate, new Date());
    let baseClass = "h-9 w-9 md:h-10 md:w-10 flex flex-col items-center justify-center rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer relative z-10 ";
    let cellStyle: React.CSSProperties = {};
    
    if (!isCurrentMonth) {
      baseClass += "text-zinc-300 dark:text-zinc-600 ";
    } else {
      baseClass += "text-zinc-700 dark:text-zinc-200 ";
    }
    let wrapperClass = "relative w-full h-9 md:h-10 flex items-center justify-center";
    let connectClass = "";
    let connectStyle: React.CSSProperties = {};
    let showConnect = false;

    if (isInRange || isHoverRange || isStart || isEnd) {
      if ((selectedRange.end || isHoverRange) && !(isStart && isEnd)) {
        showConnect = true;
        connectStyle.backgroundColor = "var(--theme-accent)";
        connectStyle.opacity = 0.15;
        
        // Base connect band
        connectClass = "absolute inset-y-0 z-0";
        
        if (isStart) {
          const compareDate = selectedRange.end || hoverDate;
          if (compareDate && selectedRange.start && isBeforeDay(selectedRange.start, compareDate)) {
             connectClass += " right-0 left-1/2"; 
          } else {
             connectClass += " left-0 right-1/2";
          }
        } else if (isEnd && selectedRange.start && selectedRange.end) {
          if (isBeforeDay(selectedRange.start, selectedRange.end)) {
             connectClass += " left-0 right-1/2";
          } else {
             connectClass += " right-0 left-1/2";
          }
        } else {
          // Middle of range
          connectClass += " inset-x-0";
          baseClass = baseClass.replace("text-zinc-700 dark:text-zinc-200", "text-zinc-900 dark:text-zinc-100");
        }
      }
    }

    if (isStart || isEnd) {
      baseClass += " text-white shadow-md scale-105 ";
      cellStyle.backgroundColor = "var(--theme-accent)";
    } else if (isCurrentMonth && !isInRange && !isHoverRange) {
      baseClass += " hover:bg-zinc-100 dark:hover:bg-zinc-800 ";
    }

    if (isToday && !isStart && !isEnd) {
      cellStyle.border = "2px solid var(--theme-accent)";
      cellStyle.color = "var(--theme-accent)";
    }

    return (
      <div 
        key={`${cellYear}-${cellMonth}-${day}-${offsetMonth}`} 
        className={wrapperClass}
        onClick={() => onDateClick(cellDate)}
        onMouseEnter={() => onDateHover(cellDate)}
        onMouseLeave={() => onDateHover(null)}
      >
        {showConnect && (
          <div className={connectClass} style={connectStyle}></div>
        )}
        
        <button 
          className={baseClass}
          style={cellStyle}
          title={(noteColor ? 'Has note tag' : undefined)}
        >
          <span className={(noteColor) && !isStart && !isEnd ? "mt-1 relative z-10" : "relative z-10"}>
            {day}
          </span>
          <div className="flex gap-1 justify-center absolute bottom-1.5 left-0 right-0 z-10">
            {noteColor && (
               <span 
                 className={`block w-1.5 h-1.5 rounded-full shadow-sm ${isStart || isEnd ? 'border border-white/50' : ''}`}
                 style={{ backgroundColor: isStart || isEnd ? 'white' : noteColor }}
               ></span>
            )}
          </div>
        </button>
      </div>
    );
  };
  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col items-center select-none transition-colors duration-300">
      <div className="w-full flex items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6 mt-1 md:mt-0">
        <button 
          onClick={onPrevMonth}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide min-w-[140px] text-center">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button 
          onClick={onNextMonth}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="w-full max-w-md grid grid-cols-7 gap-y-1 md:gap-y-1 place-items-center">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-[9px] md:text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2 md:mb-3">
            {day}
          </div>
        ))}
        
        {prevMonthPadding.map((day) => renderDay(day, false, -1))}
        {currentDays.map((day) => renderDay(day, true, 0))}
        {nextMonthPadding.map((day) => renderDay(day, false, 1))}
      </div>
    </div>
  );
};