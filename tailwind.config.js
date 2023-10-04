/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				mainBackgroundColor: colors.slate[900], //'#0D1117',
				columnBackgroundColor: colors.slate[800], //'#161C22',
			},
		},
	},
	plugins: [],
};
