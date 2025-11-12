import { format } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const BookingScreen = ({
    availableDates,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    data,
}) => {
    // Prepare markedDates for Calendar
    const markedDates = useMemo(() => {
        if (!selectedDate) return {};
        return {
            [selectedDate]: {
                selected: true,
                selectedColor: '#007bff',
            },
        };
    }, [selectedDate]);

    const filteredSlots = useMemo(() => {
        const shortDay = format(new Date(selectedDate), 'EEE');
        console.log(shortDay, 'shortDay');
        return data?.batchData?.flatMap((batch) =>
            batch.slots
                .filter((slotDay) => slotDay.day === shortDay)
                .map((slotDay) => ({
                    batch,
                    slotDay,
                })),
        );
    }, [selectedDate]);

    console.log(JSON.stringify(filteredSlots), 'filteredSlotsfilteredSlots');
    console.log(selectedDate, 'selectedDateselectedDate');

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    setSelectedSlot(null);
                }}
                markedDates={markedDates}
                theme={{
                    arrowColor: '#007bff',
                    todayTextColor: '#007bff',
                    textDayFontWeight: '600',
                    textMonthFontWeight: 'bold',
                }}
            />

            <Text style={styles.subHeader}>Available Time Slots</Text>

            {filteredSlots.length === 0 ? (
                <View style={styles.noSlotsContainer}>
                    <Text style={styles.noSlotsText}>
                        No slots available for this period.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={
                        // Flatten all time slots for the selected day, with batch and slotDay context
                        filteredSlots.flatMap(({ batch, slotDay }) =>
                            (slotDay.time_slots || []).map((slot, idx) => {
                                // Check if slot is booked
                                const bookingDate = selectedDate;
                                const slotTime = format(new Date(slot.from), 'hh:mm a');
                                const isBooked = (batch.booked_slots || []).some(
                                    (b) =>
                                        b.booking_date === bookingDate &&
                                        b.booking_time === slotTime,
                                );
                                return {
                                    batch,
                                    slotDay,
                                    ...slot,
                                    time: slotTime,
                                    price: slot.price,
                                    available: !isBooked,
                                    isBooked,
                                    key: `${batch._id}_${slotDay.day}_${slot.from}_${idx}`,
                                };
                            }),
                        )
                    }
                    keyExtractor={(item) => item.key}
                    numColumns={2}
                    contentContainerStyle={styles.slotContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            disabled={!item.available}
                            style={[
                                styles.slot,
                                selectedSlot?.key === item.key && styles.selectedSlot,
                                !item.available && styles.disabledSlot,
                            ]}
                            onPress={() => setSelectedSlot(item)}
                        >
                            <Text
                                style={[
                                    styles.slotText,
                                    !item.available && styles.disabledText,
                                    selectedSlot?.key === item.key &&
                                        styles.selectedSlotText,
                                ]}
                            >
                                {item.time}
                            </Text>
                            {item.available && (
                                <Text style={styles.priceText}>
                                    {'\u20B9'} {item.price}
                                </Text>
                            )}
                            {!item.available && (
                                <Text style={styles.unavailableText}>Unavailable</Text>
                            )}
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    subHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    filterTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    activeFilter: {
        backgroundColor: '#007bff',
    },
    filterText: {
        color: '#333',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#fff',
    },
    slotContainer: {
        gap: 8,
        paddingBottom: 16,
    },
    slot: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        margin: 6,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    selectedSlot: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    selectedSlotText: {
        color: '#fff',
    },
    disabledSlot: {
        backgroundColor: '#eee',
        borderColor: '#ddd',
    },
    slotText: {
        fontSize: 14,
        fontWeight: '500',
    },
    priceText: {
        fontSize: 12,
        color: '#666',
    },
    unavailableText: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    disabledText: {
        color: '#aaa',
    },
    noSlotsContainer: {
        alignItems: 'center',
        marginVertical: 24,
    },
    noSlotsText: {
        color: '#999',
        fontSize: 15,
        fontStyle: 'italic',
    },
    bookNowBtn: {
        marginTop: 16,
        backgroundColor: '#007bff',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    bookNowText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BookingScreen;
