import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import defaultStyles from "../../styles/styles";
import advancedStyles from "../../styles/advancedStyles";
import flexStyles from "../../styles/flexStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../contexts/AuthContext.js";
import { useGetMemberData } from "../../hooks/useAuth.js";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Helper function to format time
const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper function to format currency
const formatCurrency = (amount) => {
  if (!amount) return "₹0";
  return `₹${parseInt(amount).toLocaleString("en-IN")}`;
};

const BookedHallContainer = ({ navigate, route }) => {
  const { authData } = useAuth();

  // Get memberData from route params (passed from ProfileContainer)
  const memberDataFromParams = route?.params?.memberData;

  // If memberData is not in params, fetch it using the hook
  const {
    data: fetchedMemberData,
    isLoading,
    isFetching,
    refetch,
  } = useGetMemberData(
    { _id: authData?._id },
    {
      enabled: !memberDataFromParams, // Only fetch if memberData is not in params
    }
  );

  // Use memberData from params if available, otherwise use fetched data
  const memberData =
    memberDataFromParams || fetchedMemberData?.result || authData;

  console.log("🟢 Member data from props:", memberDataFromParams);
  console.log("🟢 Fetched member data:", fetchedMemberData?.result);
  console.log("🟢 Final member data:", memberData);
  console.log("🟢 Route params:", route?.params);

  const bookingsData = memberData?.halls || [];

  // Show loading if we're fetching data and don't have memberData from params
  if (!memberDataFromParams && (isLoading || isFetching)) {
    return (
      <View style={defaultStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading booked halls...</Text>
      </View>
    );
  }

  const renderBookings = useMemo(() => {
    return (
      <Fragment>
        {bookingsData && bookingsData.length > 0 ? (
          bookingsData?.map((obj, key) => {
            let paymentSuccess =
              obj.payment_status === "Success" ? true : false;
            let isCancelled = obj.is_cancelled || false;
            let isRefunded = obj.is_refunded || false;

            return (
              <View style={styles.infoContainer} key={key}>
                {/* Header with Hall Name and Status */}
                <View style={flexStyles.rowBetween}>
                  <View style={[flexStyles.center, { flex: 1 }]}>
                    <Text style={styles.infoText}>
                      Hall - {obj?.hall_id?.name}
                    </Text>
                  </View>
                  <View style={[flexStyles.center]}>
                    {isCancelled ? (
                      <Ionicons name="close-circle" size={30} color="#ff6b6b" />
                    ) : isRefunded ? (
                      <Ionicons name="refresh" size={30} color="#ffa500" />
                    ) : (
                      <Ionicons
                        name={
                          paymentSuccess ? "checkmark-circle" : "close-circle"
                        }
                        size={30}
                        color={paymentSuccess ? "#0e7a31" : "red"}
                      />
                    )}
                  </View>
                </View>

                {/* Hall Details Section */}
                <View style={styles.sectionContainer}>
                  <View style={defaultStyles.sectionHeader}>
                    <Text style={defaultStyles.sectionHeaderText}>
                      Hall Details
                    </Text>
                  </View>
                  <View
                    style={[
                      advancedStyles.tableContainer,
                      advancedStyles.pt5,
                      advancedStyles.pb5,
                    ]}
                  >
                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>Hall Name</Text>
                      <Text style={advancedStyles.tablevalue}>
                        {obj?.hall_id?.name || "-"}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>Court</Text>
                      <Text style={advancedStyles.tablevalue}>
                        {obj?.hall_id?.court || "-"}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>Location</Text>
                      <Text style={advancedStyles.tablevalue}>
                        {obj?.hall_id?.location_id?.title || "-"}
                      </Text>
                    </View>

                    {obj?.hall_id?.sublocation_id && (
                      <View
                        style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                      >
                        <Text style={advancedStyles.tablelabel}>
                          Sub Location
                        </Text>
                        <Text style={advancedStyles.tablevalue}>
                          {obj?.hall_id?.sublocation_id?.title || "-"}
                        </Text>
                      </View>
                    )}

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Advance Booking Period
                      </Text>
                      <Text style={advancedStyles.tablevalue}>
                        {obj?.hall_id?.advance_booking_period || "-"} days
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Booking Details Section */}
                <View style={styles.sectionContainer}>
                  <View style={defaultStyles.sectionHeader}>
                    <Text style={defaultStyles.sectionHeaderText}>
                      Booking Details
                    </Text>
                  </View>
                  <View
                    style={[
                      advancedStyles.tableContainer,
                      advancedStyles.pt5,
                      advancedStyles.pb5,
                    ]}
                  >
                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>Booking ID</Text>
                      <Text style={advancedStyles.tablevalue}>
                        #{obj?.booking_id}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>Hall ID</Text>
                      <Text style={advancedStyles.tablevalue}>
                        #{obj?.hall_id?.hall_id}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Booking Date
                      </Text>
                      <Text style={advancedStyles.tablevalue}>
                        {formatDate(obj?.booking_date)}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Booking Time
                      </Text>
                      <Text style={advancedStyles.tablevalue}>
                        {formatTime(obj?.slot_from)} -{" "}
                        {formatTime(obj?.slot_to)}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Payment Status
                      </Text>
                      <View style={styles.statusContainer}>
                        <Text
                          style={[
                            styles.statusText,
                            {
                              color: paymentSuccess ? "#0e7a31" : "#ff6b6b",
                            },
                          ]}
                        >
                          {paymentSuccess ? "Success" : "Pending"}
                        </Text>
                        {paymentSuccess && (
                          <Ionicons
                            name={
                              paymentSuccess
                                ? "checkmark-circle"
                                : "close-circle"
                            }
                            size={30}
                            color={paymentSuccess ? "#0e7a31" : "red"}
                          />
                        )}
                      </View>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>Amount Paid</Text>
                      <Text
                        style={[advancedStyles.tablevalue, styles.amountText]}
                      >
                        {formatCurrency(obj?.amount_paid)}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Refundable Deposit
                      </Text>
                      <Text
                        style={[advancedStyles.tablevalue, styles.depositText]}
                      >
                        {formatCurrency(obj?.refundable_deposit)}
                      </Text>
                    </View>

                    {obj?.cancellation_charges > 0 && (
                      <View
                        style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                      >
                        <Text style={advancedStyles.tablelabel}>
                          Cancellation Charges
                        </Text>
                        <Text
                          style={[
                            advancedStyles.tablevalue,
                            { color: "#ff6b6b" },
                          ]}
                        >
                          {formatCurrency(obj?.cancellation_charges)}
                        </Text>
                      </View>
                    )}

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Payment Type
                      </Text>
                      <Text style={advancedStyles.tablevalue}>
                        {obj?.is_full_payment
                          ? "Full Payment"
                          : "Partial Payment"}
                      </Text>
                    </View>

                    {obj?.payment_verified_at && (
                      <View
                        style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                      >
                        <Text style={advancedStyles.tablelabel}>
                          Payment Verified
                        </Text>
                        <Text style={advancedStyles.tablevalue}>
                          {formatDate(obj?.payment_verified_at)}
                        </Text>
                      </View>
                    )}

                    {obj?.partial_payment_verified_at && (
                      <View
                        style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                      >
                        <Text style={advancedStyles.tablelabel}>
                          Partial Payment Verified
                        </Text>
                        <Text style={advancedStyles.tablevalue}>
                          {formatDate(obj?.partial_payment_verified_at)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Hall Pricing Breakdown */}
                <View style={styles.sectionContainer}>
                  <View style={defaultStyles.sectionHeader}>
                    <Text style={defaultStyles.sectionHeaderText}>
                      Pricing Breakdown
                    </Text>
                  </View>
                  <View
                    style={[
                      advancedStyles.tableContainer,
                      advancedStyles.pt5,
                      advancedStyles.pb5,
                    ]}
                  >
                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Booking Amount
                      </Text>
                      <Text style={advancedStyles.tablevalue}>
                        {formatCurrency(obj?.hall_id?.booking_amount)}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Advance Payment
                      </Text>
                      <Text style={advancedStyles.tablevalue}>
                        {formatCurrency(obj?.hall_id?.advance_payment_amount)}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Cleaning Charges
                      </Text>
                      <Text style={advancedStyles.tablevalue}>
                        {formatCurrency(obj?.hall_id?.cleaning_charges)}
                      </Text>
                    </View>

                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>
                        Additional Charges
                      </Text>
                      <Text style={advancedStyles.tablevalue}>
                        {formatCurrency(obj?.hall_id?.additional_charges)}
                      </Text>
                    </View>

                    <View
                      style={[
                        flexStyles.rowBetween,
                        advancedStyles.tableRow,
                        styles.totalRow,
                      ]}
                    >
                      <Text
                        style={[advancedStyles.tablelabel, styles.totalLabel]}
                      >
                        Total
                      </Text>
                      <Text
                        style={[advancedStyles.tablevalue, styles.totalAmount]}
                      >
                        {formatCurrency(obj?.total_amount)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Time Slots Information */}
                {obj?.hall_id?.time_slots &&
                  obj.hall_id.time_slots.length > 0 && (
                    <View style={styles.sectionContainer}>
                      <View style={defaultStyles.sectionHeader}>
                        <Text style={defaultStyles.sectionHeaderText}>
                          Available Time Slots
                        </Text>
                      </View>
                      <View
                        style={[
                          advancedStyles.tableContainer,
                          advancedStyles.pt5,
                          advancedStyles.pb5,
                        ]}
                      >
                        {obj.hall_id.time_slots.map((slot, index) => (
                          <View
                            key={index}
                            style={[
                              flexStyles.rowBetween,
                              advancedStyles.tableRow,
                            ]}
                          >
                            <Text style={advancedStyles.tablelabel}>
                              Time Slot {index + 1}
                            </Text>
                            <Text style={advancedStyles.tablevalue}>
                              {formatTime(slot.from)} - {formatTime(slot.to)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                {/* Hall Description */}
                {obj?.hall_id?.description && (
                  <View style={styles.sectionContainer}>
                    <View style={defaultStyles.sectionHeader}>
                      <Text style={defaultStyles.sectionHeaderText}>
                        Hall Description
                      </Text>
                    </View>
                    <View
                      style={[
                        advancedStyles.tableContainer,
                        advancedStyles.pt5,
                        advancedStyles.pb5,
                      ]}
                    >
                      <Text style={styles.descriptionText}>
                        {obj.hall_id.description}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Payment Warning for Pending Payments */}
                {!paymentSuccess && (
                  <View style={styles.paymentWarningContainer}>
                    <Text style={styles.paymentWarningText}>
                      ⚠️ Payment Pending
                    </Text>
                    <Text style={styles.paymentDetailsText}>
                      Your hall booking is confirmed but payment is pending.
                      Please complete the payment to secure your booking.
                    </Text>
                    <TouchableOpacity style={styles.payNowButton}>
                      <Text style={styles.payNowText}>Pay Now</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Cancellation Warning */}
                {isCancelled && (
                  <View
                    style={[
                      styles.paymentWarningContainer,
                      {
                        backgroundColor: "#fff5f5",
                        borderColor: "#f8d7da",
                      },
                    ]}
                  >
                    <Text
                      style={[styles.paymentWarningText, { color: "#d9534f" }]}
                    >
                      ❌ Booking Cancelled
                    </Text>
                    <Text
                      style={[styles.paymentDetailsText, { color: "#d9534f" }]}
                    >
                      This booking has been cancelled. Please contact support
                      for any refund queries.
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>No Booked Halls Found</Text>
          </View>
        )}
      </Fragment>
    );
  }, [bookingsData]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {renderBookings}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    paddingVertical: 16,
    marginBottom: 20,
    backgroundColor: "#fffae6",
    borderRadius: 8,
  },
  messageText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoText: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#333",
    marginBottom: 16,
    lineHeight: 24,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
  },
  amountText: {
    color: "#0e7a31",
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
  },
  depositText: {
    color: "#1976d2",
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#333",
  },
  totalAmount: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#0e7a31",
  },
  descriptionText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  paymentWarningContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f8d7da",
  },
  paymentWarningText: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#d9534f",
    marginBottom: 8,
  },
  paymentDetailsText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#d9534f",
    marginBottom: 16,
    lineHeight: 20,
  },
  payNowButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  payNowText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
  },
});

export default BookedHallContainer;
