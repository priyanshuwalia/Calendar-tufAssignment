import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface Theme {
  name: string;
  color: string;
  image: string;
}
interface HeroImageProps {
  monthName: string;
  theme: Theme;
  onNextTheme: () => void;
  onPrevTheme: () => void;
}
export const HeroImage: React.FC<HeroImageProps> = ({ 
  monthName, 
  theme,
  onNextTheme,
  onPrevTheme
}) => {
  return (
    <div className="relative w-full h-40 md:h-56 lg:h-64 rounded-t-2xl overflow-hidden shadow-sm group">
      <img
        key={theme.image}
        src={theme.image}
        alt={`${monthName} aesthetics`}
        className="object-cover w-full h-full transition-opacity duration-500 animate-in fade-in"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      
      <div className="absolute bottom-2 md:bottom-3 left-4 md:left-6 right-4 md:right-6 flex items-end justify-between z-10">
        <div>
          <div className="text-white/80 text-[9px] md:text-[10px] font-semibold tracking-widest uppercase drop-shadow mb-0 flex items-center gap-1.5">
            Collection: <span style={{ color: theme.color }}>{theme.name}</span>
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-light tracking-wide drop-shadow-md">
            {monthName}
          </h2>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={onPrevTheme}
          className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
          aria-label="Previous Theme"
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          onClick={onNextTheme}
          className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-colors"
          aria-label="Next Theme"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};