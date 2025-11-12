import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import {useFetchNextPlan} from '../../hooks/useCommon.js';
import {calculatePlanAmount} from '../../helpers/utils.js';
import {format} from 'date-fns';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthContext.js';

// Helper function to safely format month
const formatMonth = monthValue => {
  if (!monthValue || isNaN(monthValue)) {
    return 'N/A';
  }

  const month = parseInt(monthValue);
  if (month < 1 || month > 12) {
    return 'N/A';
  }

  try {
    return format(new Date(2024, month - 1), 'MMMM');
  } catch (error) {
    console.error('[RenewPlan] Date formatting error:', error);
    return 'N/A';
  }
};

const RenewPlanContainer = ({route, navigate}) => {
  const {secondaryMember = null, plan_id, type, bookingData} = route.params;
  const {authData} = useAuth();
  const memberData = authData;
  const [selectedPlan, setSelectedPlan] = useState(null);

  const {
    data: nextPlanData,
    isLoading,
    error,
  } = useFetchNextPlan({
    plan_id: plan_id,
    type: type,
    activity_id: type === 'enrollment' ? bookingData?.activity_id?._id : '',
    batch_id: bookingData?.batch?._id,
  });

  console.log('nextPlanData', nextPlanData);

  const plans = nextPlanData?.result || [];

  // Auto-select first plan if available and no plan is selected
  React.useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0]);
    }
  }, [plans, selectedPlan]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading Plans...</Text>
      </View>
    );
  }

  if (error || !nextPlanData?.success) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to fetch plans.</Text>
        <Text style={styles.errorSubText}>Please try again later.</Text>
      </View>
    );
  }

  // Add safety check for plan data
  if (!plans || plans.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No plans available.</Text>
        <Text style={styles.errorSubText}>
          Please contact support for assistance.
        </Text>
      </View>
    );
  }

  const handlePayment = () => {
    // Navigate to the payment screen or handle payment logic
    navigate.navigate('PaymentScreen', {
      url: '/payment/renew-payment',
      payload: {
        amount: calculatePlanAmount(
          selectedPlan,
          memberData?.family_details,
          secondaryMember,
        ),
        customer_email: authData.email,
        customer_phone: authData.mobile,
        remarks: `Renew Payment from mobile app ${Platform.OS}, payment for Member Id: ${memberData?.member_id} and  Plan Id: ${selectedPlan?.plan_id} and Activity Id: ${bookingData?.activity_id?._id} and Batch Id: ${bookingData?.batch?._id}`,
        plan_id: selectedPlan?.plan_id,
        booking_id: type === 'enrollment' ? bookingData?._id : null,
        renew_member_id: memberData?._id,
        renew_secondary_member_id: secondaryMember?.plans
          ? secondaryMember?._id
          : null,
      },
      goBackPop: 2,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Select a Plan</Text>

        {/* Plan Selection */}
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <TouchableOpacity
              key={plan._id}
              style={[
                styles.planCard,
                selectedPlan?._id === plan._id && styles.selectedPlanCard,
              ]}
              onPress={() => setSelectedPlan(plan)}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.plan_name}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
              </View>

              <View style={styles.planDetails}>
                <View style={styles.row}>
                  <Text style={styles.label}>Start Month:</Text>
                  <Text style={styles.value}>
                    {formatMonth(plan.start_month)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>End Month:</Text>
                  <Text style={styles.value}>
                    {formatMonth(plan.end_month)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Base Amount:</Text>
                  <Text style={styles.value}>₹ {plan.amount}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Your Amount:</Text>
                  <Text style={styles.value}>
                    ₹{' '}
                    {calculatePlanAmount(
                      plan,
                      memberData?.family_details || [],
                      secondaryMember,
                    )}
                  </Text>
                </View>
              </View>

              {selectedPlan?._id === plan._id && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedText}>✓ Selected</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Button */}
        {selectedPlan && (
          <TouchableOpacity
            style={[
              styles.paymentButton,
              (!authData?.email || !authData?.mobile) && {opacity: 0.5},
            ]}
            onPress={handlePayment}
            disabled={!authData?.email || !authData?.mobile}>
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
  },
  errorSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  plansContainer: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: '#007bff',
    shadowColor: '#007bff',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  planHeader: {
    marginBottom: 10,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
  },
  planDetails: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  selectedIndicator: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  selectedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RenewPlanContainer;
