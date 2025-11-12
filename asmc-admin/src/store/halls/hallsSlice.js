import { createSlice } from "@reduxjs/toolkit";

const defaultFormValue = {
    court: "Any",
};

const defaultHallBookingFormValue = {
    hall_id: "",
    member_id: "",
    slot_from: "",
    slot_to: "",
    booking_date: null,
    is_full_payment: null,
};

const initialState = {
    showDrawer: false,
    formType: "",
    initialValues: { ...defaultFormValue },
    pagination: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "hall_id",
        keywords: "",
    },

    // hall booking state
    showDrawerHallBooking: false,
    formTypeHallBooking: "",
    initialValuesHallBooking: { ...defaultHallBookingFormValue },
    paginationHallBooking: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "booking_id",
        keywords: "",
    },
};

export const hallsSlice = createSlice({
    name: "halls",
    initialState,
    reducers: {
        changeHallInitialState: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawer = showDrawer;
            if (formType) state.formType = formType;
            if (initialValues) state.initialValues = initialValues;
            if (!initialValues) state.initialValues = defaultFormValue;
        },
        handlePaginationState: (state, action) => {
            const { payload } = action;
            state.pagination = payload;
        },
        changeHallBookingInitialState: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerHallBooking = showDrawer;
            if (formType) state.formTypeHallBooking = formType;
            if (initialValues) state.initialValuesHallBooking = initialValues;
            if (!initialValues) state.initialValuesHallBooking = defaultHallBookingFormValue;
        },
        handleHallBookingPaginationState: (state, action) => {
            const { payload } = action;
            state.paginationHallBooking = payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    changeHallInitialState,
    handlePaginationState,
    changeHallBookingInitialState,
    handleHallBookingPaginationState,
} = hallsSlice.actions;

export default hallsSlice;
