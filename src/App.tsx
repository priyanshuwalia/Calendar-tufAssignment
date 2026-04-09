import { useState, useEffect } from 'react';
import { WallCalendar } from './components/WallCalendar/WallCalendar';
import { Sun, Moon } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) return savedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center py-2 md:py-4 px-2 md:px-4 transition-colors duration-300 font-sans relative overflow-hidden">
      {/* Subtle vignette/spotlight background for focused area */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-200/50 via-zinc-200/20 to-zinc-300/80 dark:from-zinc-800/20 dark:via-zinc-900/40 dark:to-black/80 transition-colors duration-500"></div>

      <div className="w-full max-w-5xl flex justify-end mb-4 md:mb-6 relative z-20">
         <button 
           onClick={toggleTheme}
           className="p-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
           aria-label="Toggle Theme"
         >
           <div className="relative w-5 h-5 flex items-center justify-center">
             <Sun 
               className={`absolute inset-0 transition-transform duration-500 w-5 h-5 ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} 
             />
             <Moon 
               className={`absolute inset-0 transition-transform duration-500 w-5 h-5 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} 
             />
           </div>
         </button>
      </div>
      
      <WallCalendar />
      
      <div className="mt-4 text-zinc-500 dark:text-zinc-500 text-[10px] md:text-xs font-medium tracking-wide relative z-20">
        Created by <a href="https://github.com/priyanshuwalia" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Priyanshu Walia</a>
      </div>
      <Analytics />
    </div>
  );
}

export default App;