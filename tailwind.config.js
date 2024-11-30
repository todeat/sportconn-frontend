module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F2421', // Fundal principal
          100: '#216869', // Secțiuni secundare, hover-uri
          200: '#49A078', // Elemente interactive și accente
          300: '#9CC5A1', // Fundaluri subtile, texte secundare
          400: '#DCE1DE', // Highlight-uri și detalii
        },
      },
    },
  },
  plugins: [],
  
};