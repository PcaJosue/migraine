/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#b8dbff",
          300: "#8ec3ff",
          400: "#66a8ff",
          500: "#3a86ff",
          600: "#2d6fe0",
          700: "#2459ba",
          800: "#1e4997",
          900: "#15356b",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: "#f5f4ff",
          100: "#ebe9ff",
          200: "#d7d3ff",
          300: "#b5b1ff",
          400: "#908cff",
          500: "#6c68ff",
          600: "#5854e0",
          700: "#4745bb",
          800: "#3a3899",
          900: "#28286b",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          500: "#16A34A",
        },
        warning: {
          500: "#F59E0B",
        },
        danger: {
          500: "#EF4444",
        },
        neutral: {
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1f2937",
          900: "#0b1220",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        "h1": ["2.125rem", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" }],
        "h2": ["1.75rem", { lineHeight: "1.25", fontWeight: "700" }],
        "h3": ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["0.875rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      boxShadow: {
        "level-1": "0 1px 2px rgba(0,0,0,0.06)",
        "level-2": "0 4px 12px rgba(0,0,0,0.08)",
        "level-3": "0 10px 24px rgba(0,0,0,0.10)",
        "focus": "0 0 0 3px rgba(58,134,255,0.35)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
