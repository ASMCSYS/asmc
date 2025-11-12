import { StyleSheet } from 'react-native';

const flexStyles = StyleSheet.create({
    // Row Utilities
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowAround: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    rowEvenly: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    rowStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rowEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Column Utilities
    column: {
        flexDirection: 'column',
    },
    columnCenter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnStart: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    columnEnd: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    // Wrapping Grids
    wrap: {
        flexWrap: 'wrap',
    },
    noWrap: {
        flexWrap: 'nowrap',
    },

    // Grid Columns
    grid2: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    grid3: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    // Grid Items (responsive)
    gridItem50: {
        width: '48%',
        marginBottom: 16,
    },
    gridItem33: {
        width: '31%',
        marginBottom: 16,
    },
    gridItem25: {
        width: '23%',
        marginBottom: 16,
    },

    // Center Utility
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Alignments
    alignStart: {
        alignItems: 'flex-start',
    },
    alignEnd: {
        alignItems: 'flex-end',
    },
    alignCenter: {
        alignItems: 'center',
    },
    justifyStart: {
        justifyContent: 'flex-start',
    },
    justifyEnd: {
        justifyContent: 'flex-end',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    justifyBetween: {
        justifyContent: 'space-between',
    },
    justifyAround: {
        justifyContent: 'space-around',
    },
    justifyEvenly: {
        justifyContent: 'space-evenly',
    },

    // Gaps
    gap8: {
        gap: 8,
    },
    gap12: {
        gap: 12,
    },
});

export default flexStyles;
