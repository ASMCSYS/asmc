import { server } from "./axios-config";

export const fetchSingleBooking = async (id) => {
    const res = await server.get(`/bookings`, { params: { _id: id } });
    return res.data;
};

export const fetchSingleActivity = async ({ activity_id }) => {
    const res = await server.get(`/activity`, { params: { activity_id } });
    return res.data;
};

export const fetchAllActivity = async (params) => {
    const res = await server.get(`/activity/active-list`, { params: params });
    return res.data;
};

export const addNewBooking = async (payload) => {
    const res = await server.post(`/bookings`, payload);
    return res.data;
};

export const initiatePaymentApi = async (payload) => {
    const res = await server.post(`/payment/initiate-payment`, payload);
    return res.data;
};

export const getNextPlan = async (params) => {
    const res = await server.get(`/plans/get-next-plan`, { params });
    return res.data;
};

export const initiateRenewPaymentApi = async (payload) => {
    const res = await server.post(`/payment/renew-payment`, payload);
    return res.data;
};

export const initiateBookingPaymentApi = async (payload) => {
    const res = await server.post("/payment/booking-payment", payload);
    return res.data;
};

// event booking
export const initiateEventBookingApi = async (payload) => {
    const res = await server.post("/events/event-booking", payload);
    console.log(res, "res");
    return res.data;
};
export const initiateEventBookingPaymentApi = async (payload) => {
    const res = await server.post("/payment/initiate-event-payment", payload);
    return res.data;
};

// hall booking
export const initiateHallBookingApi = async (payload) => {
    const res = await server.post("/halls/hall-booking", payload);
    return res.data;
};
export const initiateHallBookingPaymentApi = async (payload) => {
    const res = await server.post("/payment/initiate-hall-payment", payload);
    return res.data;
};

export const initiateRemainHallBookingPaymentApi = async (payload) => {
    const res = await server.post("/payment/initiate-remain-hall-payment", payload);
    return res.data;
};
