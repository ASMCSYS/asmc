import { createSlice } from "@reduxjs/toolkit";

const defaultFormValue = {
    name: "",
    email: "",
    designation: "",
    department: "",
    phone: "",
    address: "",
    status: true,
    joiningDate: "",
    smartOfficeId: "",
    team: "",
    reportingTo: "",
    permissions: [],
    biometric: {
        thumbprint: "",
        deviceId: "",
        registeredAt: "",
    },
};

const initialState = {
    showDrawer: false,
    formType: "",
    initialValues: { ...defaultFormValue },
    pagination: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },
};

export const staffSlice = createSlice({
    name: "staff",
    initialState,
    reducers: {
        changeStaffInitialState: (state, action) => {
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
    },
});

export const { changeStaffInitialState, handlePaginationState } = staffSlice.actions;

export default staffSlice;
