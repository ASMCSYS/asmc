import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useGetSingleActivity } from "../../hooks/useActivity.js";
import RenderHtml from "react-native-render-html";
import Ionicons from "react-native-vector-icons/Ionicons";
import { defaultThumbnailActivity } from "../../helpers/constants.js";
import CarouselCards from "../../components/Home/CrouselCards.js";
import advancedStyles from "../../styles/advancedStyles.js";
import flexStyles from "../../styles/flexStyles.js";
import { format } from "date-fns";
import { useGetSettings } from "../../hooks/useCommon.js";
import BookingScreen from "./BookingScreen.js";

const { width } = Dimensions.get("window");

const BookingActivityContainer = ({ route, navigate }) => {
  const { params } = route;

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModel, setShowBookingModel] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const { data: settings } = useGetSettings();

  const { data: activityData, isLoading } = useGetSingleActivity(
    params.activity_id
  );

  const data = activityData?.result;

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const generateNextDays = (daysCount = 14) => {
    const today = new Date();
    return Array.from({ length: daysCount }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return {
        label: format(date, "EEE, dd MMM"),
        value: format(date, "yyyy-MM-dd"),
        shortDay: format(date, "EEE"), // "Mon", "Tue", etc.
      };
    });
  };

  useEffect(() => {
    const nextDays = generateNextDays(
      parseInt(settings?.json?.booking_prior_days) || 15
    );
    setAvailableDates(nextDays);
    setSelectedDate(nextDays[0]);
  }, [data]);

  const getSlotsForDate = () => {
    const shortDay = selectedDate?.shortDay;
    return data?.batchData?.flatMap((batch) =>
      batch.slots
        .filter((slotDay) => slotDay.day === shortDay)
        .map((slotDay) => ({
          batch,
          slotDay,
        }))
    );
  };

  return (
    <View style={[styles.container]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollContainer}
      >
        {/* Activity Title */}
        <Text style={styles.title}>{data.name}</Text>

        {/* Batches and Slots */}
        <View style={{ marginBottom: 100 }}>
          <BookingScreen
            availableDates={availableDates}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            setSelectedDate={setSelectedDate}
            setSelectedSlot={setSelectedSlot}
            data={data}
          />
        </View>
      </ScrollView>

      {/* Floating Book Now Button */}
      {selectedSlot && (
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() =>
            navigate.navigate("BookingForm", {
              activity_id: data.activity_id,
              selectedSlot,
              selectedDate,
            })
          }
        >
          <Text style={styles.bookNowText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const DateSelector = ({
  availableDates,
  selectedDate,
  setSelectedDate,
  setSelectedSlot,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {availableDates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              selectedDate?.value === date.value
                ? styles.selected
                : styles.unselected,
            ]}
            onPress={() => {
              setSelectedDate(date);
              setSelectedSlot(null);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                selectedDate?.value === date.value
                  ? styles.selectedText
                  : styles.unselectedText,
              ]}
            >
              {date.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fafafa",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    fontFamily: "PlusJakartaSans-Bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
    color: "#333",
    fontFamily: "PlusJakartaSans-Bold",
  },
  bookNowButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#007bff",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  bookNowText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
  },

  scrollContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    backgroundColor: "#f2f4f7",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  sectionHeaderText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#333",
  },
});

export default BookingActivityContainer;
