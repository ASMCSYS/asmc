import {
  addDays,
  format,
  isBefore,
  isValid,
  parseISO,
  subDays,
} from "date-fns";
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

const BookedEventsContainer = ({ navigate, route }) => {
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

  const bookingsData = memberData?.events || [];

  // Show loading if we're fetching data and don't have memberData from params
  if (!memberDataFromParams && (isLoading || isFetching)) {
    return (
      <View style={defaultStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading booked events...</Text>
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

            const allMemberData = [
              ...obj?.member_data,
              ...obj?.non_member_data,
            ];

            return (
              <View style={styles.infoContainer} key={key}>
                <View style={flexStyles.rowBetween}>
                  <View style={[flexStyles.center]}>
                    <Text style={styles.infoText}>
                      Event - {obj?.event_id?.event_name}
                    </Text>
                  </View>
                  <View style={[flexStyles.center]}>
                    <Ionicons
                      name={
                        paymentSuccess ? "checkmark-circle" : "close-circle"
                      }
                      size={30}
                      color={paymentSuccess ? "#0e7a31" : "red"}
                    />
                  </View>
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
                    <Text style={advancedStyles.tablelabel}>Event Name</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.event_id?.event_name || "-"}
                    </Text>
                  </View>

                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                  >
                    <Text style={advancedStyles.tablelabel}>
                      Event Start Dates
                    </Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.event_id?.event_start_date
                        ? `${format(obj.event_id.event_start_date, "dd-MM-yyyy")} - ${format(obj.event_id.event_end_date, "dd-MM-yyyy")}`
                        : "-"}
                    </Text>
                  </View>

                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                  >
                    <Text style={advancedStyles.tablelabel}>Location</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.event_id?.location_id?.title || "-"}
                    </Text>
                  </View>
                </View>
                {allMemberData.length > 0 ? (
                  <View style={styles.tableContainer}>
                    <View style={defaultStyles.sectionHeader}>
                      <Text style={defaultStyles.sectionHeaderText}>
                        Players Details
                      </Text>
                    </View>
                    <View
                      style={[
                        advancedStyles.tableContainer,
                        advancedStyles.pt5,
                        advancedStyles.pb5,
                      ]}
                    >
                      <View style={[flexStyles.row, advancedStyles.tableRow]}>
                        <Text
                          style={[
                            advancedStyles.tablelabel,
                            advancedStyles.maxW20,
                          ]}
                        >
                          Sr. No.
                        </Text>
                        <Text style={[advancedStyles.tablelabel]}>Info</Text>
                      </View>
                      {allMemberData.map((pobj, pkey) => (
                        <View
                          style={[flexStyles.row, advancedStyles.tableRow]}
                          key={pkey}
                        >
                          <Text
                            style={[
                              advancedStyles.tablelabel,
                              advancedStyles.maxW20,
                            ]}
                          >
                            {pkey + 1}
                          </Text>
                          <View style={[flexStyles.column]}>
                            <Text style={styles.tablelabel}>
                              Name: {pobj?.name || "-"}
                            </Text>
                            <Text style={styles.tablelabel}>
                              Email: {pobj?.email || "-"}
                            </Text>
                            <Text style={styles.tablelabel}>
                              Mobile: {pobj?.mobile || "-"}
                            </Text>
                            <Text style={styles.tablelabel}>
                              CHSS Number: {pobj?.chss_number || "-"}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
                <View style={[advancedStyles.tableContainer]}>
                  <View style={defaultStyles.sectionHeader}>
                    <Text style={defaultStyles.sectionHeaderText}>
                      Booking Details
                    </Text>
                  </View>
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
                    <Text style={advancedStyles.tablelabel}>Event ID</Text>
                    <Text style={advancedStyles.tablevalue}>
                      #{obj?.event_id?.event_id}
                    </Text>
                  </View>
                  {obj?.category_data ? (
                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>Category</Text>
                      <Text style={advancedStyles.tablevalue}>
                        {obj?.category_data?.category_name}
                      </Text>
                    </View>
                  ) : null}
                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                  >
                    <Text style={advancedStyles.tablelabel}>
                      Total Amount {paymentSuccess ? "" : "to be"} Paid
                    </Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.amount_paid} Rs.
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>No Booked Events Found</Text>
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
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  infoText: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#333",
    marginBottom: 10,
  },
  memberInfo: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  activityInfo: {
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  subText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: "#555",
    flex: 1,
    flexWrap: "wrap",
  },
  valueText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: "#333",
    flex: 2,
    flexWrap: "wrap",
    wordBreak: "break-word",
  },
  renewButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  renewButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    width: 150,
  },
  renewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
  },
  payNowButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  payNowText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
  },
  loadingText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 16,
  },
});

export default BookedEventsContainer;
