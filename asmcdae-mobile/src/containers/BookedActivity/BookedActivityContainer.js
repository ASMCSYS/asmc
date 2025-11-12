import {
  addDays,
  format,
  isBefore,
  isValid,
  parseISO,
  subDays,
} from "date-fns";
import React, { Fragment } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import defaultStyles from "../../styles/styles";
import flexStyles from "../../styles/flexStyles";
import advancedStyles from "../../styles/advancedStyles";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { useAuth } from "../../contexts/AuthContext.js";
import { useGetMemberData } from "../../hooks/useAuth.js";

const BookedActivityContainer = ({ navigate, route }) => {
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

  const bookingsData =
    memberData?.bookings?.filter((obj) => obj.type === "booking") || [];

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (!navigate.canGoBack()) {
          navigate.navigate("Home");
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [navigate])
  );

  // Show loading if we're fetching data and don't have memberData from params
  if (!memberDataFromParams && (isLoading || isFetching)) {
    return (
      <View style={defaultStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading booked activities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {bookingsData && bookingsData.length > 0 ? (
          bookingsData?.map((obj, key) => {
            let paymentSuccess =
              obj.payment_status === "Success" ? true : false;

            return (
              <View style={styles.infoContainer} key={key}>
                <View style={defaultStyles.sectionHeader}>
                  <Text style={defaultStyles.sectionHeaderText}>
                    Activity ({key + 1}) - {obj?.activity_id?.name}
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
                    <Text style={advancedStyles.tablelabel}>Activity Name</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.activity_id?.name || "-"}
                    </Text>
                  </View>

                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                  >
                    <Text style={advancedStyles.tablelabel}>Plan</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.fees_breakup?.plan_name || "-"}
                    </Text>
                  </View>

                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                  >
                    <Text style={advancedStyles.tablelabel}>Date</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.booking_date || "-"}
                    </Text>
                  </View>

                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                  >
                    <Text style={advancedStyles.tablelabel}>Timing</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.fees_breakup?.start_time} to{" "}
                      {obj?.fees_breakup?.end_time}
                    </Text>
                  </View>
                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                  >
                    <Text style={advancedStyles.tablelabel}>Location</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.activity_id?.location?.[0]?.label}
                    </Text>
                  </View>
                </View>

                {obj?.players.length > 0 ? (
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
                      {obj?.players.map((pobj, pkey) => (
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
                    <Text style={advancedStyles.tablelabel}>Activity ID</Text>
                    <Text style={advancedStyles.tablevalue}>
                      #{obj?.activity_id?.activity_id}
                    </Text>
                  </View>
                  {obj?.activity_id?.category ? (
                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}
                    >
                      <Text style={advancedStyles.tablelabel}>Category</Text>
                      <Text style={advancedStyles.tablevalue}>
                        {obj?.activity_id?.category?.[0]?.label}
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
                      {obj?.total_amount} Rs.
                    </Text>
                  </View>
                </View>

                {/* Payment Status UI Improvement */}
                {!paymentSuccess && (
                  <View style={styles.paymentWarningContainer}>
                    <Text style={styles.paymentWarningText}>
                      Payment Pending
                    </Text>
                    <Text style={styles.paymentDetailsText}>
                      It looks like your payment is still pending for this
                      activity. Please complete your payment to continue.
                    </Text>
                    <TouchableOpacity
                      style={styles.payNowButton}
                      onPress={() =>
                        navigate.navigate("PaymentHistory", {
                          memberData,
                        })
                      }
                    >
                      <Text style={styles.payNowText}>Go To Payment Page</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>No Booked Activity Found</Text>
          </View>
        )}
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

export default BookedActivityContainer;
