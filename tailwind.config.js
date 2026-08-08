/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        'bg-body': '#f4f5f7',
        'bg-surface': '#ffffff',
        
        // Text colors
        'text-primary': '#1a1a1a',
        'text-heading': '#111111',
        'text-body': '#222222',
        'text-secondary': '#555555',
        'text-muted': '#888888',
        'text-faint': '#aaaaaa',
        
        // Border colors
        'border-default': '#e8e8e8',
        'border-medium': '#e0e0e0',
        'border-input': '#d0d0d0',
        'border-light': '#f0f0f0',
        'border-faint': '#f5f5f5',
        
        // Brand colors (green)
        'brand-primary': '#1D9E75',
        'brand-primary-dark': '#0F6E56',
        'brand-primary-bg': '#e8f8f2',
        'brand-primary-bg-hover': '#f0fdf9',
        
        // Status pill colors
        'pill-green-bg': '#e8f8f2',
        'pill-green-text': '#0F6E56',
        'pill-amber-bg': '#fef3c7',
        'pill-amber-text': '#92400e',
        'pill-blue-bg': '#dbeafe',
        'pill-blue-text': '#1e40af',
        'pill-red-bg': '#fee2e2',
        'pill-red-text': '#991b1b',
        'pill-gray-bg': '#f3f4f6',
        'pill-gray-text': '#6b7280',
        'pill-purple-bg': '#ede9fe',
        'pill-purple-text': '#5b21b6',
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '9px',
        'lg': '12px',
        'xl': '14px',
        'full': '50%',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
