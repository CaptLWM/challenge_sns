import type { Config } from "tailwindcss";

import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      sm: { min: "390px", max: "819px" },
      md: { min: "820px", max: "1023px" },
      lg: { min: "1080px" },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".safe-top": {
          paddingTop: "constant(safe-area-inset-top)",
          // paddingTop: "env(safe-area-inset-top)",
        },
        ".safe-left": {
          paddingLeft: "constant(safe-area-inset-left)",
          // paddingLeft: "env(safe-area-inset-left)",
        },
        ".safe-right": {
          paddingRight: "constant(safe-area-inset-right)",
          // paddingRight: "env(safe-area-inset-right)",
        },
        ".safe-bottom": {
          paddingBottom: "constant(safe-area-inset-bottom)",
          // paddingBottom: "env(safe-area-inset-bottom)",
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
export default config;
