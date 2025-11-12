import { addDays, format, isBefore, isValid, subDays } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext.js";
import { useGetMemberData } from "../../hooks/useAuth.js";
import defaultStyles from "../../styles/styles";

const MembershipFeeContainer = ({ navigate, route }) => {
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

  const [expirePlanDate, setExpirePlanDate] = useState(null);
  const [showRenewButton, setShowRenewButton] = useState(false);

  // Show loading if we're fetching data and don't have memberData from params
  if (!memberDataFromParams && (isLoading || isFetching)) {
    return (
      <View style={defaultStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading membership details...</Text>
      </View>
    );
  }

  useEffect(() => {
    if (memberData?.current_plan?.end_date) {
      const [day, month, year] = memberData?.current_plan?.end_date
        .split("/")
        .map(Number);
      const expireDate = new Date(year, month - 1, day);

      if (isValid(expireDate)) {
        setExpirePlanDate(expireDate);

        // Calculate the date when the Renew button should appear (15 days before expiry)
        const renewButtonDate = subDays(expireDate, 15);

        // Show the Renew button if the current date is after the renewButtonDate
        if (isBefore(renewButtonDate, new Date())) {
          setShowRenewButton(true);
        }
      }
    }
  }, [memberData]);

  const renderRenewButton = (onPress) => (
    <View style={styles.renewButtonContainer}>
      <TouchableOpacity style={styles.renewButton} onPress={onPress}>
        <Text style={styles.renewButtonText}>Renew Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {memberData?.name} ({"P-" + memberData?.member_id}) - Primary Member
          </Text>
          <View style={styles.tableRow}>
            <Text style={styles.subText}>Plan Name:</Text>
            <Text style={styles.valueText}>
              {memberData?.current_plan?.plan_name}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.subText}>Membership Amount:</Text>
            <Text style={styles.valueText}>
              ₹ {memberData?.current_plan?.amount}
            </Text>
          </View>
          {memberData?.current_plan?.start_date && (
            <View style={styles.tableRow}>
              <Text style={styles.subText}>Start Date:</Text>
              <Text style={styles.valueText}>
                {memberData?.current_plan?.start_date}
              </Text>
            </View>
          )}
          {memberData?.current_plan?.end_date && (
            <View style={styles.tableRow}>
              <Text style={styles.subText}>Expire Date:</Text>
              <Text style={styles.valueText}>
                {memberData?.current_plan?.end_date}
              </Text>
            </View>
          )}

          {!memberData?.fees_paid && (
            <View style={styles.paymentWarningContainer}>
              <Text style={styles.paymentWarningText}>Payment Pending</Text>
              <Text style={styles.paymentDetailsText}>
                It looks like your payment is still pending for this membership.
                Please complete your payment to continue.
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

          {showRenewButton &&
            renderRenewButton(() =>
              navigate.navigate("RenewPlan", {
                memberData,
                type: "membership",
                plan_id: memberData?.current_plan?.plan_id,
              })
            )}
        </View>

        {memberData?.family_details?.length > 0 &&
          memberData.family_details.map((member, index) => {
            let expireMemberDate = "";
            let showRenew = false;

            if (member?.plans?.end_date) {
              const [day, month, year] = member?.plans?.end_date
                .split("/")
                .map(Number);
              expireMemberDate = new Date(year, month - 1, day);

              if (isValid(expireMemberDate)) {
                showRenew = isBefore(subDays(expireMemberDate, 15), new Date());
              }
            }
            return (
              <View style={styles.infoContainer} key={index}>
                <Text style={styles.infoText}>
                  {member.name} ({`S${index + 1}-${memberData?.member_id}`})
                </Text>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Relationship:</Text>
                  <Text style={styles.valueText}>
                    {member.relation || "N/A"}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Plan Name</Text>
                  <Text style={styles.valueText}>
                    {member?.plans?.plan_name || "N/A"}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Membership Amount</Text>
                  <Text style={styles.valueText}>
                    ₹{" "}
                    {member?.is_dependent
                      ? member.plans?.dependent_member_price || 0
                      : member.plans?.non_dependent_member_price || 0}{" "}
                  </Text>
                </View>
                {member?.plans?.start_date && (
                  <View style={styles.tableRow}>
                    <Text style={styles.subText}>Start Date:</Text>
                    <Text style={styles.valueText}>
                      {member?.plans?.start_date}
                    </Text>
                  </View>
                )}
                {member?.plans?.end_date && (
                  <View style={styles.tableRow}>
                    <Text style={styles.subText}>Expire Date:</Text>
                    <Text style={styles.valueText}>
                      {member?.plans?.end_date}
                    </Text>
                  </View>
                )}

                {!member?.fees_paid && (
                  <View style={styles.paymentWarningContainer}>
                    <Text style={styles.paymentWarningText}>
                      Payment Pending
                    </Text>
                    <Text style={styles.paymentDetailsText}>
                      It looks like your payment is still pending for this
                      membership. Please complete your payment to continue.
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

                {showRenew &&
                  renderRenewButton(() =>
                    navigate.navigate("RenewPlan", {
                      memberData: member,
                      secondaryMember: member,
                      type: "membership",
                      plan_id: member?.plans?.plan_id,
                    })
                  )}
              </View>
            );
          })}
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
    padding: 20,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#555",
  },
  valueText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
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

export default MembershipFeeContainer;
