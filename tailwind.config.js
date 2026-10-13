module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 70%, 55%)',
        secondary: 'hsl(340, 65%, 55%)',
        glass: 'rgba(255,255,255,0.15)'
      },
      backdropBlur: {
        xs: '2px'
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0,0,0,0.1)'
      }
    }
  },
  plugins: []
};
