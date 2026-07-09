/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark monochrome editorial palette - ink-led, red reserved for SALE
        background:                  '#080808',
        surface:                     '#11110F',
        'surface-low':               '#171715',
        'surface-dim':               '#1F1F1C',
        'surface-container':         '#11110F',
        'surface-container-low':     '#0D0D0C',
        'surface-container-high':    '#24231F',
        'surface-container-highest': '#34312B',
        'surface-container-lowest':  '#080808',
        'on-surface':                '#F3F1ED',
        'on-surface-variant':        '#B8B2A7',
        outline:                     '#7C766C',
        'outline-variant':           '#2D2C28',
        primary:                     '#121211', // navy
        'on-primary':                '#F3F1ED',
        'primary-container':         '#24231F',
        'on-primary-container':      '#F3F1ED',
        secondary:                   '#24231F',
        'on-secondary':              '#F3F1ED',
        tertiary:                    '#8A8175', // terracotta
        'on-tertiary':               '#FBFAF7',
        'inverse-surface':           '#121211',
        'inverse-on-surface':        '#F3F1ED',
        sale:                        '#D8231E',
        'sale-dark':                 '#B01A16',
        // Aliases — keep old class names working with new palette
        gold:                        '#8A8175', // terracotta
        'gold-dark':                 '#625C51', // terracotta deep
        navy:                        '#F3F1ED',
        'navy-deep':                 '#F3F1ED',
        sky:                         '#24231F',
        'sky-soft':                  '#171715',
        sand:                        '#2D2C28',
        terracotta:                  '#8A8175',
        'terracotta-soft':           '#B8B2A7',
        slate:                       '#7C766C',
        cream:                       '#080808',
        charcoal:                    '#121211',
      },
      fontFamily: {
        headline: ['Noto Serif', 'serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
        sans: ['Manrope', 'sans-serif'],
        hand: ['Caveat', 'Architects Daughter', 'cursive'],
      },
      backgroundImage: {
        'gold-shimmer': 'none',
      },
    },
  },
  plugins: [],
}
