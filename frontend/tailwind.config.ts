import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Vertex Tech Modern Design System (MDS) tokens
        'blue-60': '#1F6BCC',
        'blue-50': '#2B7DE0',
        'blue-10': '#C7E0FF',
        'neutral-5': '#F5F5F5',
        'neutral-10': '#E8E8E8',
        'neutral-20': '#D0D0D0',
        'neutral-30': '#999999',
        'neutral-60': '#666666',
        'neutral-90': '#1A1A1A',
        'success-60': '#1A8917',
        'danger-60': '#D92D20',
        'warning-60': '#DC6803',
        'danger-5': '#FEF3F2',
        'success-5': '#F0FFF0',
        'warning-5': '#FFFBF0',
      },
      spacing: {
        // 8px grid
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
      },
      borderRadius: {
        'rds': '16px',
        'rds-sm': '8px',
        'rds-lg': '24px',
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(0,0,0,0.12)',
        'level-2': '0 4px 12px rgba(0,0,0,0.15)',
      },
      fontSize: {
        'rds-xs': ['11px', '16px'],
        'rds-sm': ['12px', '18px'],
        'rds-base': ['14px', '20px'],
        'rds-lg': ['16px', '24px'],
        'rds-xl': ['20px', '28px'],
        'rds-2xl': ['24px', '32px'],
        'rds-3xl': ['32px', '40px'],
      },
    },
  },
  plugins: [],
} satisfies Config
