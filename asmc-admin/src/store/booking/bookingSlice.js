import { createSlice } from "@reduxjs/toolkit";

const defaultFormValue = {
    member_id: false,
    batch: false,
    activity_id: false,
    primary_eligible: true,
    family_member: [],
    fees_breakup: null,
    total_amount: 0,
}

const initialState = {
    showDrawer: false,
    formType: "",
    initialValues: { ...defaultFormValue },
    pagination: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "booking_id",
        keywords: ""
    }
};

export const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        changeBookingInitialState: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawer = showDrawer;
            if (formType)
                state.formType = formType;
            if (initialValues)
                state.initialValues = initialValues;
            if (!initialValues)
                state.initialValues = defaultFormValue;
        },
        handlePaginationState: (state, action) => {
            const { payload } = action;
            state.pagination = payload;
        }
    },
});

// Action creators are generated for each case reducer function
export const { changeBookingInitialState, handlePaginationState } = bookingSlice.actions;

export default bookingSlice;
