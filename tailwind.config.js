module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: ['./src/**/*.{html,js,ts}'],
    theme: {
        extend: {
            backgroundOpacity: {
                10: '0.1',
            },
        },
    },
    variants: {
        backgroundColor: ['hover'],
        textColor: ['hover'],
        transitionProperty: ['responsive', 'hover', 'focus'],
    },
    plugins: [],
};
