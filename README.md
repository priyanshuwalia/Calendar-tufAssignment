# Calendar Frontend Challenge - Priyanshu Walia

Hey! This is my submission for the TUF Frontend Engineering Challenge. I built this interactive wall calendar from scratch using React, TypeScript, Vite, and Tailwind CSS v4.

I wanted it to feel like a real physical wall calendar, so I added some cool 3D page flipping animations, a fully responsive split-view layout for mobile, and a local-storage synchronized notes tagging system!

## Tech Stack
- React 19 
- Vite for fast dev builds
- Tailwind CSS v4 for all the styling and dark mode
- Lucide React for icons

## Running it locally

Just clone the repo and run:

```bash
npm install
npm run dev
```

Then open up `http://localhost:5173/` in your browser.

## Features
- **Day View functionality:** A dedicated daily tab allowing you to track hourly notes and schedule tasks from 8:00 AM onwards!
- **Dynamic Aesthetics:** Automatically shifts typography and outline accent colors based on your chosen thematic photo collection
- Full fluid dark/light mode toggle with animated Sun/Moon icons that sync with your OS
- Range selection for dates with beautifully rounded pill outlines
- Color-coded tags and notes for individual hourly blocks (Day View) or wide date ranges (Month View)
- Automatically saves notes to your browser local storage so they don't get lost
- Heavy bespoke CSS shadow elevations and spotlight backgrounds to make the calendar "pop" off the screen
- Natural, cubic-bezier (slow-fast-slow) CSS animations for flipping calendar pages with realistic 3D spiral wires

Hope you like checking it out as much as I liked building it! Let me know if you run into any issues.
