import React, {Fragment, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {paymentUrl} from '../../helpers/constants';
import {axios} from '../../helpers/axios.js';
import {JsonDecode} from '../../helpers/utils.js';
import {useAuth} from '../../contexts/AuthContext.js';
import {useGetMemberData} from '../../hooks/useAuth.js';
import defaultStyles from '../../styles/styles';
import {useFocusEffect} from '@react-navigation/native';

const PaymentHistoryContainer = ({route, navigate}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const {authData} = useAuth();

  // Get memberData from route params (passed from ProfileContainer)
  const memberDataFromParams = route?.params?.memberData;

  // Always fetch data using the hook, but use params data initially if available
  const {
    data: fetchedMemberData,
    isLoading,
    isFetching,
    refetch,
  } = useGetMemberData(
    {_id: authData?._id},
    {
      enabled: true, // Always enable to allow refetching
      refetchInterval: false, // Disable auto-refetch
      initialData: memberDataFromParams
        ? {result: memberDataFromParams}
        : undefined, // Use params as initial data
    },
  );

  // Use the fetched data (which includes initial data from params)
  const memberData = fetchedMemberData?.result;

  console.log('🟢 Member data from props:', memberDataFromParams);
  console.log('🟢 Fetched member data:', fetchedMemberData?.result);
  console.log('🟢 Final member data:', memberData);
  console.log('🟢 Route params:', route?.params);

  // Handle refresh when screen comes into focus (after payment)
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 PaymentHistory screen focused - refreshing data...');
      refetch();
    }, []),
  );

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Sort payment history to show latest payments on top
  const sortedPaymentHistory = memberData?.payment_history
    ? [...memberData.payment_history].sort((a, b) => {
        // Sort by creation date (newest first)
        const dateA = new Date(a.createdAt || a.created_at || 0);
        const dateB = new Date(b.createdAt || b.created_at || 0);
        return dateB - dateA;
      })
    : [];

  // Show loading if we're fetching data and don't have memberData from params
  if (!memberDataFromParams && (isLoading || isFetching)) {
    return (
      <View style={defaultStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading payment history...</Text>
      </View>
    );
  }

  useEffect(() => {
    if (memberData) {
      let totalAmount = 0;

      if (!memberData?.fees_paid) {
        totalAmount += memberData?.current_plan?.final_amount || 0;
      }

      memberData?.family_details?.forEach(familyMember => {
        if (!familyMember.fees_paid) {
          totalAmount += familyMember.is_dependent
            ? familyMember?.plans?.dependent_member_price || 0
            : familyMember?.plans?.non_dependent_member_price || 0;
        }
      });

      memberData?.bookings?.forEach(booking => {
        if (booking.payment_status === 'Pending') {
          totalAmount += booking.total_amount || 0;
        }
      });

      setTotalAmount(totalAmount);
    }
  }, [memberData]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
            tintColor="#007bff"
          />
        }>
        <View style={styles.messageContainer}>
          {totalAmount > 0 ? (
            <Text style={styles.messageText}>
              You have pending payments. Please review the details below.
            </Text>
          ) : (
            <Text style={styles.messageText}>All payments are up to date.</Text>
          )}
        </View>

        {!memberData?.fees_paid && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {memberData?.name} ({'P-' + memberData?.member_id}) - Membership
              Plan Details
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
          </View>
        )}

        {memberData?.family_details?.filter(obj => obj.fees_paid === false)
          .length > 0 && (
          <>
            {memberData?.family_details
              ?.filter(obj => obj.fees_paid === false)
              .map((familyData, key) => (
                <View style={styles.infoContainer} key={key}>
                  <Text style={styles.infoText}>
                    {familyData.name} ({`S${key + 1}-${memberData?.member_id}`})
                    - Secondary Membership Plan Details
                  </Text>
                  <View style={styles.tableRow}>
                    <Text style={styles.subText}>Plan Name:</Text>
                    <Text style={styles.valueText}>
                      {familyData?.plans?.plan_name}
                    </Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.subText}>Membership Amount:</Text>
                    <Text style={styles.valueText}>
                      ₹{' '}
                      {familyData?.is_dependent
                        ? familyData?.plans?.dependent_member_price
                        : familyData?.plans?.non_dependent_member_price}
                    </Text>
                  </View>
                </View>
              ))}
          </>
        )}

        {memberData?.bookings?.map((obj, key) => {
          if (obj.payment_status === 'Success') return null;

          const familyData = obj?.family_member.filter(obj => obj !== null);
          const familyIndex =
            familyData.length > 0
              ? memberData.family_details.findIndex(
                  fobj => fobj?._id === familyData[0]?._id,
                )
              : null;

          return (
            <View style={styles.infoContainer} key={key}>
              <Text style={styles.infoText}>
                Activity - {obj?.activity_id?.name}
              </Text>
              <View style={styles.memberInfo}>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Name:</Text>
                  <Text style={styles.valueText}>
                    {familyData.length > 0
                      ? familyData[0]?.name
                      : memberData?.name}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Member Id:</Text>
                  <Text style={styles.valueText}>
                    {familyData.length > 0
                      ? `S${familyIndex + 1}-${memberData?.member_id}`
                      : `P-${memberData?.member_id}`}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>CHSS Id:</Text>
                  <Text style={styles.valueText}>
                    {familyData.length > 0
                      ? `${
                          memberData.family_details[familyIndex]?.card_number ||
                          '-'
                        }`
                      : `${memberData?.chss_number || '-'}`}
                  </Text>
                </View>
              </View>
              <View style={styles.activityInfo}>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Booking ID</Text>
                  <Text style={styles.valueText}>#{obj?.booking_id}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Activity Name</Text>
                  <Text style={styles.valueText}>{obj?.activity_id?.name}</Text>
                </View>
                {obj?.activity_id?.category.length > 0 && (
                  <View style={styles.tableRow}>
                    <Text style={styles.subText}>Category</Text>
                    <Text style={styles.valueText}>
                      {obj?.activity_id?.category[0].label}
                    </Text>
                  </View>
                )}
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Activity Location</Text>
                  <Text style={styles.valueText}>
                    {obj?.batch?.location_id?.address}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Plan Name</Text>
                  <Text style={styles.valueText}>
                    {obj?.fees_breakup?.plan_name}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.subText}>Activity Amount</Text>
                  <Text style={styles.valueText}>₹ {obj?.total_amount}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Payment Summary */}
        {sortedPaymentHistory && sortedPaymentHistory.length > 0 && (
          <View>
            <Text style={styles.infoText}>Payment History</Text>
            {sortedPaymentHistory.map((payment, index) => (
              <View key={index} style={styles.historyContainer}>
                <View style={styles.paymentCard}>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Order ID:</Text>
                    <Text style={styles.paymentValue}>{payment.order_id}</Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Tracking ID:</Text>
                    <Text style={styles.paymentValue}>
                      {JsonDecode(payment.payment_response)?.tracking_id}
                    </Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment For:</Text>
                    <Text style={styles.paymentValue}>
                      {payment?.booking_id?.length > 0
                        ? payment?.booking_id?.length ===
                          payment?.plan_id.length
                          ? 'Activity Payment'
                          : 'Activity and Membership'
                        : 'Membership Payment'}
                    </Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Amount Paid:</Text>
                    <Text style={styles.paymentValue}>
                      ₹ {payment.amount_paid}
                    </Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment Status:</Text>
                    <Text style={styles.paymentValue}>
                      {payment.payment_status}
                    </Text>
                  </View>
                  <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment Mode:</Text>
                    <Text style={styles.paymentValue}>
                      {payment.payment_mode}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {totalAmount > 0 && (
        <TouchableOpacity
          style={styles.payNowButton}
          onPress={() =>
            navigate.navigate('PaymentScreen', {
              payload: {
                amount: totalAmount,
                customer_email: authData.email,
                customer_phone: authData.mobile,
                remarks: `Payment from mobile app ${Platform.OS}, payment for Member Id: ${memberData?.member_id}`,
              },
            })
          }>
          <Text style={styles.payNowText}>Pay Now ₹ {totalAmount}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollView: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    paddingVertical: 16,
    marginBottom: 20,
    backgroundColor: '#fffae6',
    borderRadius: 8,
  },
  messageText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333',
    marginBottom: 10,
  },
  memberInfo: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  activityInfo: {
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    color: '#555',
    flex: 1,
    flexWrap: 'wrap',
  },
  valueText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    color: '#333',
    flex: 2,
    flexWrap: 'wrap',
    wordBreak: 'break-word', // Ensures long words break and wrap
  },
  payNowButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payNowText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  historyContainer: {
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  historyTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333',
    marginBottom: 10,
  },
  paymentCard: {},
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#555',
  },
  paymentValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333',
  },
  loadingText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default PaymentHistoryContainer;
