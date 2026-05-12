/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Coastal Mediterranean palette — cream + navy + terracotta + sky
        background:                  '#F4EDE0', // cream warm
        surface:                     '#FFFBF2', // warm ivory
        'surface-low':               '#EFE7D6', // cream-down (inner light panel)
        'surface-dim':               '#E0D3BC', // sand
        'surface-container':         '#F4EDE0',
        'surface-container-low':     '#FFFBF2',
        'surface-container-high':    '#E0D3BC',
        'surface-container-highest': '#CDBFA1',
        'surface-container-lowest':  '#FFFBF2',
        'on-surface':                '#13243A', // deep navy ink
        'on-surface-variant':        '#5A6B7F', // slate
        outline:                     '#8AA3B8', // slate blue
        'outline-variant':           '#E0D3BC', // sand
        primary:                     '#1B2E4B', // navy
        'on-primary':                '#F4EDE0',
        'primary-container':         '#A8C4D6', // sky soft
        'on-primary-container':      '#13243A',
        secondary:                   '#A8C4D6', // sky soft
        'on-secondary':              '#13243A',
        tertiary:                    '#C47A5C', // terracotta
        'on-tertiary':               '#FFFBF2',
        'inverse-surface':           '#1B2E4B',
        'inverse-on-surface':        '#F4EDE0',
        // Aliases — keep old class names working with new palette
        gold:                        '#C47A5C', // terracotta
        'gold-dark':                 '#9C5A40', // terracotta deep
        navy:                        '#1B2E4B',
        'navy-deep':                 '#13243A',
        sky:                         '#A8C4D6',
        'sky-soft':                  '#D8E6EE',
        sand:                        '#E0D3BC',
        terracotta:                  '#C47A5C',
        'terracotta-soft':           '#E0AB94',
        slate:                       '#8AA3B8',
        cream:                       '#F4EDE0',
        charcoal:                    '#13243A',
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
