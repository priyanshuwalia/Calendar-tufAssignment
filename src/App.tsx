import { useState, useEffect } from 'react';
import { WallCalendar } from './components/WallCalendar/WallCalendar';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Synchronous initial check so there's no flash
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Modern and legacy listener attachment
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
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

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center py-2 md:py-4 px-2 md:px-4 transition-colors duration-300 font-sans">
      <div className="w-full max-w-4xl flex justify-end mb-2">
         <button 
           onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
           className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
         >
           {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
         </button>
      </div>
      
      <WallCalendar />
      
      <div className="mt-2 text-zinc-400 dark:text-zinc-600 text-[9px] md:text-[10px] font-medium tracking-wide">
        Created by <a href="https://github.com/priyanshuwalia" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors">Priyanshu Walia</a>
      </div>
    </div>
  );
}

export default App;
