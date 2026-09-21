import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FCF9F4', // latar halaman
        sand: '#F3EEE6', // blok / placeholder foto
        ink: '#1C1B19', // teks & tombol utama
        muted: '#7A756D', // teks sekunder
        gold: '#C8A45C', // aksen (eyebrow, link kecil)
        line: '#E6DFD3', // garis tipis
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
