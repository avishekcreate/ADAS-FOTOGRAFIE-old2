import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				'border-subtle': 'hsl(var(--border-subtle))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Surface colors
				surface: 'hsl(var(--surface))',
				'surface-secondary': 'hsl(var(--surface-secondary))',
				'surface-tertiary': 'hsl(var(--surface-tertiary))',
				
				// Text hierarchy
				'text-primary': 'hsl(var(--text-primary))',
				'text-secondary': 'hsl(var(--text-secondary))',
				'text-muted': 'hsl(var(--text-muted))',
				'text-subtle': 'hsl(var(--text-subtle))',
				
				// Interactive states
				hover: 'hsl(var(--hover))',
				active: 'hsl(var(--active))',
				overlay: 'hsl(var(--overlay))',
				'overlay-light': 'hsl(var(--overlay-light))',
				
				// Shadows
				'shadow-soft': 'hsl(var(--shadow-soft))',
				'shadow-medium': 'hsl(var(--shadow-medium))',
				'shadow-strong': 'hsl(var(--shadow-strong))',
				
				// Legacy compatibility
				primary: {
					DEFAULT: 'hsl(var(--text-primary))',
					foreground: 'hsl(var(--surface))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--surface-secondary))',
					foreground: 'hsl(var(--text-primary))'
				},
				muted: {
					DEFAULT: 'hsl(var(--surface-tertiary))',
					foreground: 'hsl(var(--text-muted))'
				},
				accent: {
					DEFAULT: 'hsl(var(--surface-secondary))',
					foreground: 'hsl(var(--text-primary))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
