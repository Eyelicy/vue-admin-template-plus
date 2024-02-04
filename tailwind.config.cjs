/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
        fontSize: {
            xs: ['0.875rem', '0.875rem'],
            xl: ['1.6rem', '1.6rem'],
            '2xl': ['2.2rem', '2.2rem'],
            '3xl': ['3.2rem', '3.2rem'],
        },
        backgroundColor: (theme) => ({
            ...theme('colors'),
            blue: '#569DED',
        }),
        textColor: (theme) => ({
            ...theme('colors'),
            primary: '#348DED',
            text: '#222222',
            title: '#515864',
            help: '#888888',
            explanation: '#C2C2C2',
            'test-black': '#515864',
            'WAITING': '#FA9F16',
            'PROCESSING': '#348DED',
            'COMPLETED': '#16D585',
            'CANCELLED': '#F34628',
        }),
    },
    plugins: [],
}
