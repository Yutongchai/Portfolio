/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "2rem",
      },
      screens: {
        sm: "100%",
        md: "728px",
        lg: "984px",
        xl: "1240px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Foundation (60%) - Light backgrounds
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",

        // Primary (30%) - Main UI elements
        // Citrus: #e1620b & #fcb22f | Jewel: #12a28f & #695da5
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },

        // Accent (10%) - Buttons, notifications, links
        // #ee424c (red) & #0074b4 (blue)
        accent: {
          DEFAULT: "var(--color-accent)",
          secondary: "var(--color-accent-secondary)",
          foreground: "var(--color-accent-foreground)",
        },

        // Supporting colors
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-error-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "var(--color-success-foreground)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          foreground: "var(--color-warning-foreground)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-error-foreground)",
        },
        cta: {
          DEFAULT: "var(--color-cta)",
          foreground: "var(--color-cta-foreground)",
        },

        // Legacy support
        trust: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Lora", "serif"],
        serif: [
          "Playfair Display",
          "Lora",
          "Libre Baskerville",
          "Georgia",
          "serif",
        ],
        display: ["Playfair Display", "serif"],
        body: ["Lora", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
        hero: [
          "clamp(2rem, 8vw, 4rem)",
          { lineHeight: "1.1", fontWeight: "700" },
        ],
        tagline: [
          "clamp(1rem, 4vw, 1.5rem)",
          { lineHeight: "1.5", fontWeight: "500" },
        ],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.15)",
        elevation: "0 4px 20px rgba(0, 0, 0, 0.08)",
        button: "0 2px 10px rgba(0, 0, 0, 0.05)",
        accent: "0 4px 20px rgba(212, 175, 55, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "slide-up": "slideUp 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "scale-in": "scaleIn 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "pulse-slow": "pulseSlow 8s ease-in-out infinite",
        float: "float 10s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    // Hide scrollbar while maintaining scroll functionality
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      });
    },
  ],
};
