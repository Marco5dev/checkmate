/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        slideUp: 'slideUp 0.7s ease-out forwards',
        slideDown: 'slideDown 0.7s ease-out forwards',
      },
      fontFamily: {
        edu: ["EduAUVICWANTPre", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
      },
      backgroundImage: {
        "login-bg": "var(--wallpaper, url('/wallpapers/login.png'))",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        custom: {
          primary: "#B85C38",
          "primary-content": "#FFFFFF", // Example content color for primary
          secondary: "#5C3D2E",
          "secondary-content": "#FFFFFF", // Example content color for secondary
          accent: "#E0C097",
          "accent-content": "#000000", // Example content color for accent
          neutral: "#2D2424",
          "neutral-content": "#FFFFFF", // Example content color for neutral
          "base-100": "#121212",
          "base-200": "#1c1c1c", // Darker tone of base-100
          "base-300": "#2c2c2c", // Even darker tone of base-200
          "base-400": "#2D2424", // Even darker tone of base-300
          "base-500": "#1E1717", // Even darker tone of base-400
          "base-600": "#0F0B0B", // Even darker tone of base-500
          "base-content": "#FFFFFF", // Example content color for base
          info: "#0277BD",
          "info-content": "#FFFFFF", // Example content color for info
          success: "#00C853",
          "success-content": "#000000", // Example content color for success
          warning: "#F9A825",
          "warning-content": "#000000", // Example content color for warning
          error: "#D32F2F",
          "error-content": "#FFFFFF", // Example content color for error

          "--rounded-box": "1.2rem", // more modern rounded corners for card elements
          "--rounded-btn": "0.5rem", // slightly smoother button edges
          "--rounded-badge": "1.4rem", // consistent with smoother design trends
          "--animation-btn": "0.25s", // longer, smoother button click animations
          "--animation-input": "0.2s", // smoother input animations
          "--btn-focus-scale": "0.98", // slight focus scale for better UI feedback
          "--border-btn": "2px", // thicker border for a more premium button look
          "--tab-border": "2px", // consistent with button borders
          "--tab-radius": "1rem", // rounder tabs for modern design
          "--tab-bg": "#2D2424",
          "--tab-border-color": "#B85C38",
          "--tab-padding": "1.25rem",
          "--tooltip-color": "#B85C38",
          "--tooltip-text-color": "#FFFFFF",
          "--tooltip-offset": "10px",
          "--tooltip-tail": "6px",
          "--chkbg": "#B85C38",
          "--chkfg": "#FFFFFF",
          "--glass-blur": "12px",
          "--glass-opacity": "0.15",
          "--glass-border-opacity": "0.2",
          "--glass-reflex-degree": "120deg",
          "--glass-reflex-opacity": "0.1",
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "custom", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
