import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: {
          DEFAULT: "#FFF",
          100: "#BEC1DD",
          200: "#C1C2D3",
        },
        blue: {
          "100": "#E4ECFF",
          500: "#79B5EC",
          600: "#152432",
        },
        green: {
          500: "#24AE7C",
          700: "#0D2A1F",
        },
        dark: {
          200: "#0D0F10",
          300: "#131619",
          400: "#1A1D21",
          500: "#363A3D",
          600: "#76828D",
          700: "#ABB8C4",
        },

        light: {
          200: "#E8E9E9",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        "shiny-text": "shiny-text 8s infinite",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        rainbow: {
          "0%": {
            "background-position": "0%",
          },
          "100%": {
            "background-position": "200%",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "shiny-text": {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shiny-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shiny-width)) 0",
          },
        },
      },
    },
  },

  plugins: [require("tailwindcss-animate"), heroui()],
} satisfies Config;
