import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from "react-native";
import { useGetSingleActivity } from "../../hooks/useActivity.js";
import Toast from "react-native-toast-message";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useVerifyMember } from "../../hooks/useAuth.js";
import { useAuth } from "../../contexts/AuthContext.js";

const { width } = Dimensions.get("window");

const BookingFormContainer = ({ route, navigate }) => {
  const { params } = route;
  const { authData } = useAuth();

  const { activity_id, selectedSlot, selectedDate } = params;

  const confirmBooking = async (values) => {
    try {
      // if (
      //     !values?.players ||
      //     values?.players?.length !== selectedSlot?.no_of_player
      // ) {
      //     Toast.show({
      //         type: 'error',
      //         text1: 'Please enter the name of all players required for this game',
      //     });
      //     return;
      // }
      // // check values entered by uesr value added or not
      // if (values?.players.find((item) => item === '')) {
      //     Toast.show({
      //         text1: 'Please enter the name of all players required for this game.',
      //         type: 'error',
      //     });
      //     return;
      // }
      // const plan_details = {
      //     _id: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?._id : null,
      //     plan_id:
      //         selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_id : null,
      //     plan_type:
      //         selectedSlot?.fees.length > 0
      //             ? selectedSlot?.fees[0]?.plan_type
      //             : null,
      //     plan_name:
      //         selectedSlot?.fees.length > 0
      //             ? selectedSlot?.fees[0]?.plan_name
      //             : null,
      //     member_price:
      //         selectedSlot?.fees.length > 0
      //             ? selectedSlot?.fees[0]?.member_price
      //             : null,
      //     day: selectedSlot?.day,
      //     start_time: selectedSlot?.start_time,
      //     end_time: selectedSlot?.end_time,
      // };
      // navigate.navigate('PaymentScreen', {
      //     url: '/payment/booking-payment',
      //     payload: {
      //         amount: parseInt(
      //             isAllMembers ? selectedSlot.member_price : selectedSlot.price,
      //         ),
      //         customer_email: authData.email,
      //         customer_phone: authData.mobile,
      //         remarks: `Booking Payment Member Id: ${authData?.member_id}`,
      //         batch_id: selectedSlot?._id,
      //         players: values?.players,
      //         chss_number: memberId,
      //         activity_id: data?._id,
      //         plan_details: plan_details,
      //     },
      //     goBackPop: 1,
      //     navigateTo: 'BookedActivity',
      // });
    } catch (error) {
      Toast.show({
        text1: error?.message,
        type: "error",
      });
    }
  };

  return (
    <View style={[styles.container]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollContainer}
      ></ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    // backgroundColor: '#fff',
  },
});

export default BookingFormContainer;
