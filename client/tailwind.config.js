module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'mobile-nav-bg': 'rgba(51, 65, 85, 0.95)',
        'default-background': '#060606',
        'default-background-opaque': 'rgba(6, 6, 6, 0.8)'
      },
      inset: {
        '40px': '40px',
        '90px': '90px',
        '10px': '10px',
        '14px': '14px',
      },
      height: {
        '900': '900px',
        '270px': '270px',
        '450px': '450px',
        '576px': '576px',
        '80vh': '80vh',
        '70vh': '70vh',
        '90px': '90px',
        '40px': '40px',
        '12px': '12px',
        '14px': '14px',
        '240px': '240px',
        '340px': '340px',
        '95vh': '95vh',
        '5.25rem': '5.25rem'
      },
      width: {
        '576px': '576px',
        '450px': '450px',
        '500px': '500px',
        '90px': '90px',
        '40px': '40px',
        '12px': '12px',
        '14px': '14px',
        '240px': '240px',
        '340px': '340px',
        '95vw': '95vw',
      },
      minHeight: {
        '100px': '100px',
      },
      right: {
        '40px': '40px',
      },
      top: {
        '40p': '40%'
      },
      outline: {
        "solid-white": ['1rem solid rgba(255, 255, 255, .75)', '16px']
      },
      padding: {
        '30rem': '30rem',
      },
      screens: {
        '3xl': '1700px',
        '4xl': '2000px'
      },
    },
  },
  variants: {
    extend: {
      zIndex: ['hover', 'active'],
      outline: ['hover', 'active'],
      transitionProperty: ['hover', 'focus'],
      scale: ['active', 'group-hover', 'hover'],
    },
  },
  plugins: [],
};