import { createSlice } from "@reduxjs/toolkit";

const defaultFormValue = {
    images: [],
    event_name: "",
    location_id: "",
    sublocation_id: "",
    court: "",
    description: "",
    event_type: "Single",
    members_type: "Both",
    players_limit: 0,
    min_players_limit: 0,
};

const defaultEventBookingFormValue = {
    member_id: false,
    batch: false,
    activity_id: false,
    primary_eligible: true,
    family_member: [],
    fees_breakup: null,
    total_amount: 0,
};

const initialState = {
    showDrawer: false,
    formType: "",
    initialValues: { ...defaultFormValue },
    pagination: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "event_id",
        keywords: "",
    },

    // event booking state
    showDrawerEventBooking: false,
    formTypeEventBooking: "",
    initialValuesEventBooking: { ...defaultEventBookingFormValue },
    paginationEventBooking: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "booking_id",
        keywords: "",
    },
};

export const eventsSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        changeEventInitialState: (state, action) => {
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
        changeEventBookingInitialState: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerEventBooking = showDrawer;
            if (formType) state.formTypeEventBooking = formType;
            if (initialValues) state.initialValuesEventBooking = initialValues;
            if (!initialValues) state.initialValuesEventBooking = defaultEventBookingFormValue;
        },
        handleEventBookingPaginationState: (state, action) => {
            const { payload } = action;
            state.paginationEventBooking = payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    changeEventInitialState,
    handlePaginationState,
    changeEventBookingInitialState,
    handleEventBookingPaginationState,
} = eventsSlice.actions;

export default eventsSlice;
