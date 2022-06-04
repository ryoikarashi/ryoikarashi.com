module.exports = {
    darkMode: 'class',
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    content: ['./src/**/*.{html,js,ts}'],
    theme: {
        extend: {
            colors: {
                black: '#111111',
            },
            backgroundOpacity: {
                10: '0.1',
            },
            maxWidth: {
                '1/2': '50%',
                '9/10': '90%',
            },
        },
    },
    variants: {
        backgroundColor: ['hover'],
        textColor: ['hover'],
        transitionProperty: ['responsive', 'hover', 'focus'],
        maxWidth: ['responsive', 'hover', 'focus'],
    },
    plugins: [],
};
