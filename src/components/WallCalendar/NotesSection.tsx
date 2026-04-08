import React, { useState, useEffect } from "react";
import { formatYYYYMMDD } from "../../utils/dateUtils";

interface NotesSectionProps {
  selectedRange: { start: Date | null; end: Date | null };
  onNoteUpdate?: () => void;
  onExitSelection?: () => void;
}

const TAG_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']; // Red, Amber, Emerald, Blue, Violet

export const NotesSection: React.FC<NotesSectionProps> = ({ selectedRange, onNoteUpdate, onExitSelection }) => {
  const [notes, setNotes] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(TAG_COLORS[0]);
  const [contextTitle, setContextTitle] = useState<string>("Monthly Notes");
  const [storageKey, setStorageKey] = useState<string>("calendar_notes_monthly");
  const [animateKey, setAnimateKey] = useState<number>(0);

  // Determine the context based on selected dates
  useEffect(() => {
    let key = "calendar_notes_monthly";
    let title = "Monthly Notes";

    const formatTitleDate = (date: Date) => {
      const d = date.getDate();
      const m = date.toLocaleString('default', { month: 'long' });
      const y = date.getFullYear();
      return `${d} ${m}, ${y}`;
    };

    if (selectedRange.start && selectedRange.end) {
      if (selectedRange.start.getTime() === selectedRange.end.getTime()) {
        const dateStr = formatYYYYMMDD(selectedRange.start);
        key = `calendar_notes_${dateStr}`;
        title = `Notes for ${formatTitleDate(selectedRange.start)}`;
      } else {
        const startStr = formatYYYYMMDD(selectedRange.start);
        const endStr = formatYYYYMMDD(selectedRange.end);
        key = `calendar_notes_${startStr}_to_${endStr}`;
        title = `Notes (${formatTitleDate(selectedRange.start)} - ${formatTitleDate(selectedRange.end)})`;
      }
    } else if (selectedRange.start) {
      const dateStr = formatYYYYMMDD(selectedRange.start);
      key = `calendar_notes_${dateStr}`;
      title = `Notes for ${formatTitleDate(selectedRange.start)}`;
    }

    if (key !== storageKey) {
      setStorageKey(key);
      setContextTitle(title);
      setAnimateKey(prev => prev + 1); // trigger re-render animation
      
      // Load from local storage
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setNotes(parsed.text || "");
          setSelectedColor(parsed.color || TAG_COLORS[0]);
        } catch (e) {
          // Backward compatibility for raw strings
          setNotes(saved);
          setSelectedColor(TAG_COLORS[0]);
        }
      } else {
        setNotes("");
        setSelectedColor(TAG_COLORS[0]);
      }
    }
  }, [selectedRange, storageKey]);

  const saveToStorage = (text: string, color: string) => {
    const payload = JSON.stringify({ text, color });
    localStorage.setItem(storageKey, payload);
    if (onNoteUpdate) onNoteUpdate();
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    saveToStorage(val, selectedColor);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    saveToStorage(notes, color);
  };

  return (
    <div className="flex flex-col flex-1 p-4 md:p-6 bg-white dark:bg-zinc-900 border-t md:border-t-0 md:border-r border-zinc-200 dark:border-zinc-800 rounded-b-2xl md:rounded-bl-2xl md:rounded-br-none transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative pin or binding could go here */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full opacity-50"></div>

      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between mt-2 gap-2">
        <h3 
          key={animateKey} 
          className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 transition-colors"
          style={{ animation: 'flipInRight 0.3s ease-out forwards' }}
        >
          {contextTitle}
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Color tag selector */}
          <div className="flex items-center gap-1.5 mr-2">
            {TAG_COLORS.map(color => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-3.5 h-3.5 rounded-full transition-transform ${selectedColor === color ? 'scale-125 ring-2 ring-offset-1 ring-zinc-300 dark:ring-zinc-600 dark:ring-offset-zinc-900' : 'hover:scale-110'}`}
                style={{ backgroundColor: color }}
                title="Add colored tag"
                aria-label={`Select tag color ${color}`}
              />
            ))}
          </div>

          {selectedRange.start && (
            <button 
              onClick={onExitSelection}
              className="text-xs px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md font-semibold transition-opacity opacity-90 hover:opacity-100 flex items-center gap-1 shadow-sm ml-1"
            >
              Done
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 relative mt-2 min-h-[160px] md:min-h-0">
        <textarea
          key={`textarea-${animateKey}`} // Animate text in
          className="w-full h-full resize-none bg-ruled-light dark:bg-ruled-dark border-0 focus:ring-0 text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none transition-colors absolute inset-0"
          style={{ 
            animation: 'flipInRight 0.5s ease-out forwards',
            paddingTop: '2px' // align with lines if needed, line-height 32px
          }}
          placeholder={selectedRange.start ? "Jot down events or reminders for this selection..." : "General objectives and tasks for the month..."}
          value={notes}
          onChange={handleNotesChange}
        />
      </div>
      
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
          {notes.length > 0 ? "Saved automatically" : ""}
        </p>
      </div>
    </div>
  );
};
