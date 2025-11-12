import {addDays, format, isAfter, isBefore, isValid, subDays} from 'date-fns';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import defaultStyles from '../../styles/styles';
import advancedStyles from '../../styles/advancedStyles';
import flexStyles from '../../styles/flexStyles';
import {useAuth} from '../../contexts/AuthContext.js';
import {useGetMemberData} from '../../hooks/useAuth.js';
import {useRenewSettings} from '../../hooks/useRenewSettings.js';

const EnrolledActivityContainer = ({navigate, route}) => {
  const {authData} = useAuth();

  // Get renew settings
  const {renewSettings} = useRenewSettings();

  // Get memberData from route params (passed from ProfileContainer)
  const memberDataFromParams = route?.params?.memberData;

  // If memberData is not in params, fetch it using the hook
  const {
    data: fetchedMemberData,
    isLoading,
    isFetching,
    refetch,
  } = useGetMemberData(
    {_id: authData?._id},
    {
      enabled: !memberDataFromParams, // Only fetch if memberData is not in params
    },
  );

  // Use memberData from params if available, otherwise use fetched data
  const memberData =
    memberDataFromParams || fetchedMemberData?.result || authData;

  console.log('🟢 Member data from props:', memberDataFromParams);
  console.log('🟢 Fetched member data:', fetchedMemberData?.result);
  console.log('🟢 Final member data:', memberData);
  console.log('🟢 Route params:', route?.params);

  const bookingsData =
    memberData?.bookings?.filter(obj => obj.type === 'enrollment').reverse() ||
    [];

  // Show loading if we're fetching data and don't have memberData from params
  if (!memberDataFromParams && (isLoading || isFetching)) {
    return (
      <View style={defaultStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading enrolled activities...</Text>
      </View>
    );
  }

  const renderRenewButton = onPress => (
    <View style={styles.renewButtonContainer}>
      <TouchableOpacity style={styles.renewButton} onPress={onPress}>
        <Text style={styles.renewButtonText}>Renew Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {bookingsData && bookingsData.length > 0 ? (
          bookingsData?.map((obj, key) => {
            let paymentSuccess =
              obj.payment_status === 'Success' ? true : false;

            const [day, month, year] = obj?.fees_breakup?.end_date
              .split('/')
              .map(Number);
            const expirePlanDate = new Date(year, month - 1, day);
            let showRenewButton = false;

            if (isValid(expirePlanDate)) {
              // Use activity-specific renew settings from admin panel
              const renewStartDays = renewSettings.activity_renew_start_days;
              const renewEndDays = renewSettings.activity_renew_end_days;

              console.log(
                renewStartDays,
                renewEndDays,
                'renewStartDays, renewEndDays',
              );

              const renewButtonDate = subDays(expirePlanDate, renewStartDays);
              const renewButtonAfterDays = addDays(
                expirePlanDate,
                renewEndDays,
              );

              // Check if current date is within the renew period (between start and end dates)
              const currentDate = new Date();
              if (
                isAfter(currentDate, renewButtonDate) &&
                isBefore(currentDate, renewButtonAfterDays)
              ) {
                showRenewButton = true;
              } else if (obj.show_renew_button) {
                showRenewButton = obj.show_renew_button;
              } else {
                showRenewButton = false;
              }
            }

            const familyData = obj?.family_member.filter(obj => obj !== null);

            const familyIndex =
              familyData.length > 0
                ? memberData.family_details.findIndex(
                    fobj => fobj?._id === familyData[0]?._id,
                  )
                : null;

            return (
              <View style={styles.infoContainer} key={key}>
                <View style={defaultStyles.sectionHeader}>
                  <Text style={defaultStyles.sectionHeaderText}>
                    Activity - {obj?.activity_id?.name}
                  </Text>
                </View>
                <View style={[advancedStyles.tableContainer]}>
                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}>
                    <Text style={advancedStyles.tablelabel}>Name</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {familyData.length > 0
                        ? familyData[0]?.name
                        : memberData?.name}
                    </Text>
                  </View>

                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}>
                    <Text style={advancedStyles.tablelabel}>Member Id</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {familyData.length > 0
                        ? `S${familyIndex + 1}-${memberData?.member_id}`
                        : `P-${memberData?.member_id}`}
                    </Text>
                  </View>
                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}>
                    <Text style={advancedStyles.tablelabel}>CHSS Id</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {familyData.length > 0
                        ? `${
                            memberData.family_details[familyIndex]
                              ?.card_number || '-'
                          }`
                        : `${memberData?.chss_number || '-'}`}
                    </Text>
                  </View>
                </View>
                <View style={[advancedStyles.tableContainer]}>
                  <View style={defaultStyles.sectionHeader}>
                    <Text style={defaultStyles.sectionHeaderText}>
                      Booking Details
                    </Text>
                  </View>
                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}>
                    <Text style={advancedStyles.tablelabel}>Booking ID</Text>
                    <Text style={advancedStyles.tablevalue}>
                      #{obj?.booking_id}
                    </Text>
                  </View>
                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}>
                    <Text style={advancedStyles.tablelabel}>Activity Name</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.activity_id?.name}
                    </Text>
                  </View>
                  {obj?.activity_id?.category.length > 0 && (
                    <View
                      style={[flexStyles.rowBetween, advancedStyles.tableRow]}>
                      <Text style={advancedStyles.tablelabel}>Category</Text>
                      <Text style={advancedStyles.tablevalue}>
                        {obj?.activity_id?.category[0].label}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}>
                    <Text style={advancedStyles.tablelabel}>
                      Activity Location
                    </Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.batch?.location_id?.address}
                    </Text>
                  </View>
                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}>
                    <Text style={advancedStyles.tablelabel}>Plan Name</Text>
                    <Text style={advancedStyles.tablevalue}>
                      {obj?.fees_breakup?.plan_name}
                    </Text>
                  </View>
                  <View
                    style={[flexStyles.rowBetween, advancedStyles.tableRow]}>
                    <Text style={advancedStyles.tablelabel}>
                      Activity Amount
                    </Text>
                    <Text style={advancedStyles.tablevalue}>
                      ₹ {obj?.total_amount}
                    </Text>
                  </View>
                  {obj?.payment_status === 'Success' &&
                    obj?.fees_breakup?.start_date &&
                    obj?.fees_breakup?.end_date && (
                      <View
                        style={[
                          flexStyles.rowBetween,
                          advancedStyles.tableRow,
                        ]}>
                        <Text style={advancedStyles.tablelabel}>
                          Your plan will expire on
                        </Text>
                        <Text style={advancedStyles.tablevalue}>
                          {format(expirePlanDate, 'dd MMM, yyyy')}
                        </Text>
                      </View>
                    )}
                </View>

                {showRenewButton &&
                  renderRenewButton(() =>
                    navigate.navigate('RenewPlan', {
                      type: 'enrollment',
                      bookingData: obj,
                      plan_id: obj?.fees_breakup?.plan_id,
                    }),
                  )}

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
                        navigate.navigate('PaymentHistory', {
                          memberData,
                        })
                      }>
                      <Text style={styles.payNowText}>Go To Payment Page</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>No Enrolled Activity Found</Text>
          </View>
        )}
      </ScrollView>
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
    wordBreak: 'break-word',
  },
  renewButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  renewButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    width: 150,
  },
  renewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paymentWarningContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f8d7da',
  },
  paymentWarningText: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#d9534f',
    marginBottom: 8,
  },
  paymentDetailsText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#d9534f',
    marginBottom: 16,
  },
  payNowButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  payNowText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  loadingText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default EnrolledActivityContainer;
