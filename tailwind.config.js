/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        chatBg: '#000000',
        chatSurface: '#171717',
        chatElevated: '#212121',
        chatPrimary: '#3B82F6',
        chatSecondary: '#10B981',
        chatText: '#ECECF1',
        chatMuted: '#8E8EA0',
        chatBorder: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
};
