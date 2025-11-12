import React, { Fragment, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SelectPicker = ({ selectedValue, onValueChange, options, label }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handlePickerPress = () => {
        if (Platform.OS === 'ios') {
            setShowPicker(true);
        }
    };

    const closePicker = () => {
        if (Platform.OS === 'ios') {
            setShowPicker(false);
        }
    };

    return (
        <View style={styles.container}>
            {Platform.OS === 'ios' ? (
                <Fragment>
                    <TouchableOpacity
                        style={styles.placeholder}
                        onPress={Platform.OS === 'ios' ? handlePickerPress : undefined}
                    >
                        <Text style={styles.placeholderText}>
                            {selectedValue
                                ? options.find((option) => option.value === selectedValue)
                                      ?.label
                                : label}
                        </Text>
                    </TouchableOpacity>
                    {showPicker && (
                        <Modal
                            transparent={true}
                            animationType="slide"
                            onRequestClose={closePicker}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedValue}
                                        onValueChange={(itemValue) => {
                                            onValueChange(itemValue);
                                            closePicker();
                                        }}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label={label} value="" />
                                        {options.map((option, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={option.label}
                                                value={option.value}
                                            />
                                        ))}
                                    </Picker>
                                    <TouchableOpacity
                                        onPress={closePicker}
                                        style={styles.closeButton}
                                    >
                                        <Text style={styles.closeButtonText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )}
                </Fragment>
            ) : (
                // For Android, directly render the picker in the view.
                <View style={styles.pickerAndroidContainer}>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(itemValue) => onValueChange(itemValue)}
                        style={styles.pickerAndroid}
                    >
                        <Picker.Item label={label} value="" />
                        {options.map((option, index) => (
                            <Picker.Item
                                key={index}
                                label={option.label}
                                value={option.value}
                            />
                        ))}
                    </Picker>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    placeholder: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    pickerAndroidContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    placeholderText: {
        fontSize: 16,
        color: '#555',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingBottom: 20,
    },
    picker: {
        width: '100%',
    },
    pickerAndroid: {
        width: '100%',
    },
    closeButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#007bff',
    },
});

export default SelectPicker;
