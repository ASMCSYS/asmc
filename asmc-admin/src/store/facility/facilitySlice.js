import { createSlice } from "@reduxjs/toolkit";

const defaultFormValue = {
    title: "",
    permalink: "",
    banner_url: "",
    status: true
}

const initialState = {
    showDrawer: false,
    formType: "",
    initialValues: { ...defaultFormValue },
    pagination: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: ""
    }
};

export const facilitySlice = createSlice({
    name: "facility",
    initialState,
    reducers: {
        changeFacilityInitialState: (state, action) => {
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
export const { changeFacilityInitialState, handlePaginationState } = facilitySlice.actions;

export default facilitySlice;
