// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Include paths to all your components/files here (e.g., "./src/**/*.{js,ts,jsx,tsx}")
  ],
  theme: {
    extend: {
      colors: {
        // 👇 ADD THIS SECTION to map the 'border' class to the '--border' CSS variable.
        border: "hsl(var(--border))", 
        // 👇 ADD THESE LINES for other colors you defined in your :root block
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Add all other custom colors (card, popover, etc.) following this pattern
      },
    },
  },
  plugins: [
    // ... any plugins you are using (e.g., require('tailwindcss-animate'))
  ],
};