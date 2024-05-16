/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['index.html', './src/**/*.{vue,js}'],
    theme: {
        container: {
            center: true,
        },
        extend: {},
    },
    plugins: [require('@tailwindcss/forms')],
}