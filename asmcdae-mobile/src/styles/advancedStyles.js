import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const advancedStyles = StyleSheet.create({
    // Spacing (Margin / Padding)
    m0: { margin: 0 },
    m1: { margin: 4 },
    m2: { margin: 8 },
    m3: { margin: 12 },
    m4: { margin: 16 },
    m5: { margin: 20 },

    p0: { padding: 0 },
    p1: { padding: 4 },
    p2: { padding: 8 },
    p3: { padding: 12 },
    p4: { padding: 16 },
    p5: { padding: 20 },

    mt1: { marginTop: 4 },
    mt2: { marginTop: 8 },
    mt3: { marginTop: 12 },
    mt4: { marginTop: 16 },
    mt5: { marginTop: 20 },

    mb1: { marginBottom: 4 },
    mb2: { marginBottom: 8 },
    mb3: { marginBottom: 12 },
    mb4: { marginBottom: 16 },
    mb5: { marginBottom: 20 },

    pt1: { paddingTop: 4 },
    pt2: { paddingTop: 8 },
    pt3: { paddingTop: 12 },
    pt4: { paddingTop: 16 },
    pt5: { paddingTop: 20 },

    pb1: { paddingBottom: 4 },
    pb2: { paddingBottom: 8 },
    pb3: { paddingBottom: 12 },
    pb4: { paddingBottom: 16 },
    pb5: { paddingBottom: 20 },

    // Widths (percentage-based and fixed for mobile)
    wFull: { width: '100%' },
    wHalf: { width: '50%' },
    wThird: { width: '33.33%' },
    wTwoThird: { width: '66.66%' },
    wQuarter: { width: '25%' },
    wThreeQuarter: { width: '75%' },
    wAuto: { width: 'auto' },

    // Fixed widths (pixels — optimized for phones)
    w40: { width: 40 },
    w80: { width: 80 },
    w100: { width: 100 },
    w120: { width: 120 },
    w150: { width: 150 },
    w180: { width: 180 },
    w200: { width: 200 },
    w250: { width: 250 },
    w300: { width: 300 },

    // Max width helpers
    maxWFull: { maxWidth: '100%' },
    maxW90: { maxWidth: '90%' },
    maxW80: { maxWidth: '80%' },
    maxW75: { maxWidth: '75%' },
    maxW50: { maxWidth: '50%' },
    maxW30: { maxWidth: '30%' },
    maxW20: { maxWidth: '20%' },
    maxW10: { maxWidth: '10%' },

    // Borders
    border: {
        borderWidth: 1,
        borderColor: '#ccc',
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    borderLeft: {
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },

    // Border Radius
    roundedSm: { borderRadius: 4 },
    roundedMd: { borderRadius: 8 },
    roundedLg: { borderRadius: 12 },
    roundedXl: { borderRadius: 20 },
    roundedFull: { borderRadius: 999 },

    // Shadow (iOS + Android)
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    shadowMd: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 6,
            },
        }),
    },

    // Text
    textBase: {
        fontSize: 14,
        color: '#333',
    },
    textSm: {
        fontSize: 12,
    },
    textLg: {
        fontSize: 18,
    },
    textXl: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    textCenter: {
        textAlign: 'center',
    },
    textRight: {
        textAlign: 'right',
    },
    textBold: {
        fontWeight: 'bold',
    },

    // tabels
    tableContainer: {
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    tableRow: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tablelabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        flex: 1,
    },
    tablevalue: {
        fontSize: 14,
        color: '#222',
        flex: 1,
        textAlign: 'right',
    },
});

export default advancedStyles;
