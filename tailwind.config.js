/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    { pattern: /from-(amber|sky|rose|pink|green|purple|teal|emerald)-(100|50)/ },
    { pattern: /via-(amber|sky|rose|pink|green|purple|teal|emerald)-50/ },
    { pattern: /border-(amber|sky|rose|pink|green|purple|teal|emerald)-(200|300)/ },
    { pattern: /border-(amber|sky|rose|pink|green|purple|teal|emerald)-500\/30/ },
    { pattern: /border-pink-500\/40/ },
    { pattern: /bg-(amber|sky|rose|pink|green|purple|teal|emerald)-500\/20/ },
    { pattern: /bg-(amber|sky|rose|pink|green|purple|teal|emerald)-500/ },
    { pattern: /hover:bg-(amber|sky|rose|pink|green|purple|teal|emerald)-600/ },
    { pattern: /bg-(amber|sky|rose|pink|green|purple|teal|emerald)-50\/50/ },
    { pattern: /text-(amber|sky|rose|pink|green|purple|teal|emerald)-(400|500|600|700|800)/ },
    { pattern: /focus:ring-(rose|pink)-(400|500)/ },
    { pattern: /focus:border-rose-500/ },
    'from-yellow-50'
  ]
}
