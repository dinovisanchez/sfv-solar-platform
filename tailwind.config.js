/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Instrument Serif", "serif"],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ]
      },
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a"
        },
        solar: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706"
        },
        surface: {
          light: "#ffffff",
          dark: "#0b0f19"
        }
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.12), transparent 40%), radial-gradient(circle at 80% 0%, rgba(245,158,11,0.10), transparent 35%)",
        "brand-gradient": "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #f59e0b 100%)"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.08)",
        "soft-dark": "0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px -8px rgba(0, 0, 0, 0.5)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.5s ease both",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both"
      }
    }
  },
  plugins: []
};
