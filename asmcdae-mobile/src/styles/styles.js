import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    },
    logoContainer: {
        marginBottom: 50,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    input: {
        fontFamily: 'PlusJakartaSans',
        fontSize: 16,
        padding: 5,
        borderRadius: 8,
        backgroundColor: '#fff',
        width: '100%',
    },
    label: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 18,
        marginBottom: 8,
        color: '#fff',
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: '#014aad',
        paddingVertical: 16,
        width: '80%',
        borderRadius: 8,
        marginTop: 10,
    },
    submitButtonText: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    page_title: {
        fontSize: 24,
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#333',
        marginBottom: 16,
    },

    sectionHeader: {
        backgroundColor: '#f2f4f7',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#007bff', // You can use a primary color here
    },

    sectionHeaderText: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#1c1c1c',
    },
});

export default defaultStyles;
