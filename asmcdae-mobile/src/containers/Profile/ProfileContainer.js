import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import defaultStyles from "../../styles/styles.js";
import { useAuth } from "../../contexts/AuthContext";
import { useGetMemberData } from "../../hooks/useAuth.js";

const { width: screenWidth } = Dimensions.get("window");

const ProfileContainer = ({ navigate }) => {
  const { authData, logout } = useAuth();

  const {
    data: memberData,
    isLoading,
    isFetching,
    refetch,
  } = useGetMemberData({ _id: authData?._id });
  const memberResult = memberData?.result || null;

  const [totalPaymentPending, setTotalPaymentPending] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let total = 0;
    if (!memberResult?.fees_verified) {
      total += 1;
    } else {
      const familyMembers = memberResult.family_details;
      familyMembers.map((obj, key) => {
        if (!obj.fees_paid) {
          total += 1;
        }
      });
    }
    if (memberResult?.bookings) {
      memberResult.bookings.map((obj, key) => {
        if (obj.payment_status === "Pending") {
          total += 1;
        }
      });
    }

    setTotalPaymentPending(total);
  }, [memberResult]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch(); // Refetch data
    setRefreshing(false);
  };

  const links = [
    { title: "Membership Fee Details", route: "MembershipFee" },
    { title: "Enrolled Activity", route: "EnrolledActivity" },
    { title: "Booked Activity", route: "BookedActivity" },
    { title: "Booked Events", route: "BookedEvents" },
    { title: "Booked Halls", route: "BookedHalls" },
    { title: "Payment History", route: "PaymentHistory" },
    { title: "Change Password", route: "ChangePassword" },
    { title: "Logout", route: "Logout" },
  ];

  const handleClick = async (route) => {
    if (route === "Logout") {
      await logout();
      navigate.navigate("Login");
    } else {
      // Pass member data as props to the booking pages
      const props = { memberData: memberResult };
      navigate.navigate(route, props);
    }
  };

  if (isLoading || isFetching) {
    return (
      <View style={defaultStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={defaultStyles.scrollView}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.container]}>
        {/* User Info Section */}
        <View style={styles.userInfoContainer}>
          <Image
            source={{ uri: memberResult?.profile }}
            style={styles.profileImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userText}>{memberResult?.name}</Text>
            <Text style={styles.subText}>#{memberResult?.member_id}</Text>
            <Text style={styles.subText}>{memberResult?.email}</Text>
            <Text style={styles.subText}>{memberResult?.mobile}</Text>
          </View>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => navigate.navigate("EditProfile", { refetch })}
          >
            <Ionicons name="pencil" size={24} color="#007bff" />
          </TouchableOpacity>
        </View>

        {/* Links Section */}
        <View style={styles.linksContainer}>
          {links.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.linkButton}
              onPress={() => handleClick(link.route)}
            >
              <Text style={styles.linkText}>{link.title}</Text>
              {link.title === "Payment History" && totalPaymentPending > 0 && (
                <Text style={styles.badge}>{totalPaymentPending}</Text>
              )}
              <Ionicons name="chevron-forward" size={20} color="#555" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 20,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userInfoContainer: {
    marginVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userText: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#333",
  },
  subText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  editIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: "#eef6ff",
    borderRadius: 20,
  },
  linksContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  linkButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  linkText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: "#333",
  },
  badge: {
    backgroundColor: "#ff4757",
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
});

export default ProfileContainer;
