import { getNextPlan, initiateBookingPaymentApi, initiateRenewPaymentApi } from '@/apis/bookings.api';
import { toast_popup } from '@/utils/toast';
import { Formik } from 'formik';
import { Fragment, useEffect, useState } from 'react';
import { InputBox } from '../common/InputBox';
import { verifyMember } from '@/apis/members.api';
import * as yup from 'yup';
import { paymentUrl } from '@/utils/constants';

const bookingSchema = yup.object().shape({
    players: yup
        .array()
        .of(yup.string().required('This field is required'))
        .required('You must add at least one friend')
        .min(1, 'At least one friend is required'),
});

export const BookingModal = ({ data, selectedSlot, authData }) => {
    const [checkMember, isMemberCheck] = useState(Array.from({ length: selectedSlot?.no_of_player }, () => false));
    const [memberId, setMemberId] = useState(Array.from({ length: selectedSlot?.no_of_player }, () => ''));
    const [isAllMembers, setIsAllMembers] = useState(false);
    const [verifiedMember, setVerifiedMember] = useState(
        Array.from({ length: selectedSlot?.no_of_player }, () => false)
    );

    useEffect(() => {
        if (verifiedMember.includes(false)) {
            setIsAllMembers(false);
        } else {
            setIsAllMembers(true);
        }
    }, [verifiedMember]);

    const handleIsMemberCheck = (index, event) => {
        checkMember[index] = event.target.checked;
        isMemberCheck([...checkMember]);
    };

    const handleMembershipId = (index, event) => {
        memberId[index] = event.target.value;
        setMemberId([...memberId]);
    };

    const confirmBooking = async (values) => {
        try {
            if (!values?.players || values?.players?.length !== selectedSlot?.no_of_player) {
                toast_popup('Please enter the name of all players required for this game.', 'error');
                return;
            }

            // check values entered by uesr value added or not
            if (values?.players.find((item) => item === '')) {
                toast_popup('Please enter the name of all players required for this game.', 'error');
                return;
            }

            const plan_details = {
                _id: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?._id : null,
                plan_id: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_id : null,
                plan_type: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_type : null,
                plan_name: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.plan_name : null,
                member_price: selectedSlot?.fees.length > 0 ? selectedSlot?.fees[0]?.member_price : null,
                day: selectedSlot?.day,
                start_time: selectedSlot?.start_time,
                end_time: selectedSlot?.end_time,
            };

            let payload = {
                amount: parseInt(isAllMembers ? selectedSlot.member_price : selectedSlot.price),
                customer_email: authData.email,
                customer_phone: authData.mobile,
                remarks: `Booking Payment Member Id: ${authData?.member_id}`,
                batch_id: selectedSlot?._id,
                players: values?.players,
                chss_number: memberId,
                activity_id: data?._id,
                plan_details: plan_details,
            };
            // console.log(payload, "payload");
            const response = await initiateBookingPaymentApi(payload);

            const { accessCode, encryptedData, order_id } = response.result;

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = paymentUrl;
            form.style.display = 'none';

            const accessCodeField = document.createElement('input');
            accessCodeField.name = 'access_code';
            accessCodeField.value = accessCode;
            form.appendChild(accessCodeField);

            const encRequestField = document.createElement('input');
            encRequestField.name = 'encRequest';
            encRequestField.value = encryptedData;
            form.appendChild(encRequestField);

            const orderIdField = document.createElement('input');
            orderIdField.name = 'order_id';
            orderIdField.value = order_id;
            form.appendChild(orderIdField);

            document.body.appendChild(form);

            form.submit(); // Submit form to CCAvenue
        } catch (error) {
            toast_popup(error?.message, 'error');
        }
    };

    const handleVerify = async (index) => {
        try {
            if (memberId[index] === '') {
                toast_popup('Please enter membership id', 'error');
                return;
            }

            // set isallmember true if all member is verified
            const response = await verifyMember(memberId[index]);
            if (response.success && response.result) {
                setVerifiedMember((prev) => {
                    prev[index] = true;
                    return [...prev];
                });
            }
        } catch (error) {
            toast_popup(error?.message, 'error');
        }
    };

    return (
        <div className="container pt-lg-5">
            <div className="row  justify-content-center">
                {data ? (
                    <div
                        className="col-12 col-md-12 card shadow-lg"
                        style={{ border: '1px solid #ddd', borderRadius: '10px' }}
                    >
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12">
                                    <h5 className="text-center">Booking Details</h5>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>Activity Name:</strong> {data?.name}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>Location:</strong> {data?.location?.[0]?.label}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <p>
                                        <strong>Batch Name</strong> {selectedSlot?.batch_name} -{' '}
                                        {selectedSlot?.batch_type}
                                    </p>
                                </div>
                            </div>

                            {selectedSlot?.no_of_player > 0 && (
                                <Formik
                                    initialValues={{}}
                                    // validationSchema={bookingSchema}
                                    onSubmit={(values) => confirmBooking(values)}
                                    enableReinitialize
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                                        <Fragment>
                                            <div className="input-group">
                                                <p>Please enter the name of all players required for this game.</p>
                                            </div>
                                            <div className="container">
                                                {Array.from({ length: selectedSlot?.no_of_player }, (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="row mb-4 p-3"
                                                        style={{
                                                            border: '1px solid #ddd',
                                                            borderRadius: '10px',
                                                            alignItems: 'center',
                                                            backgroundColor: '#f9f9f9',
                                                        }}
                                                    >
                                                        <div className="col-md-4">
                                                            <InputBox
                                                                type="text"
                                                                name={`players[${i}]`}
                                                                label={`Player Name ${i + 1}`}
                                                                onChange={(e) => handleChange(e)}
                                                                value={values?.players?.[i] || ''}
                                                                errors={errors?.players}
                                                                disabled={verifiedMember[i]}
                                                            />
                                                        </div>
                                                        <div className="col-md-2 text-center">
                                                            <div class="input-single input-check">
                                                                <input
                                                                    disabled={verifiedMember[i]}
                                                                    type="checkbox"
                                                                    name="save-for-next"
                                                                    id={`saveForNext-${i + 1}`}
                                                                    checked={checkMember[i]}
                                                                    onClick={(e) => handleIsMemberCheck(i, e)}
                                                                />
                                                                <label for={`saveForNext-${i + 1}`}>Is Member?</label>
                                                            </div>
                                                        </div>
                                                        {checkMember[i] && (
                                                            <>
                                                                <div className="col-md-4">
                                                                    <InputBox
                                                                        type="text"
                                                                        name={`member_id_${i + 1}`}
                                                                        label="Membership ID"
                                                                        onChange={(e) => handleMembershipId(i, e)}
                                                                        disabled={verifiedMember[i]}
                                                                    />
                                                                </div>
                                                                <div className="col-md-2 text-center">
                                                                    {verifiedMember[i] ? (
                                                                        <button className="btn btn-success" disabled>
                                                                            <i className="fas fa-check-circle"></i>{' '}
                                                                            Verified
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="btn btn-primary"
                                                                            onClick={() => handleVerify(i)}
                                                                        >
                                                                            <i className="fas fa-user-check"></i> Verify
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="input-group">
                                                <h5>
                                                    <strong>Total Amount:</strong>{' '}
                                                    {isAllMembers ? selectedSlot.member_price : selectedSlot.price} Rs.
                                                </h5>
                                            </div>

                                            <div className="text-center cta-btn">
                                                <button
                                                    type="submit"
                                                    className="cmn-button"
                                                    onClick={() => handleSubmit()}
                                                >
                                                    Pay Now
                                                </button>
                                            </div>
                                        </Fragment>
                                    )}
                                </Formik>
                            )}
                            {/* <div className="row mt-3">
                                    
                                    <div className="text-center cta-btn m-0" onClick={() => confirmBooking()}>
                                        <button className="cmn-button cmn-button-small m-lg-2">Confirm</button>
                                    </div>
                                </div> */}
                        </div>
                    </div>
                ) : (
                    <div className="col-12 text-center mt-5 mb-5">
                        No plan available to upgrade, please contact admin for more details.
                    </div>
                )}
            </div>
        </div>
    );
};
