import { createSlice } from "@reduxjs/toolkit";

const defaultFormValue = {
    name: "",
    email: "",
    gender: "Male",
    mobile: "",
    dob: null,
    chss_number: "",
    chss_card_link: "",
    profile: "",
    address: "",
    family_details: [],
    current_plan: null,
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
    userPagination: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },
};

export const membersSlice = createSlice({
    name: "members",
    initialState,
    reducers: {
        changeMembersInitialState: (state, action) => {
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
        handleUserPaginationState: (state, action) => {
            const { payload } = action;
            state.userPagination = payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { changeMembersInitialState, handlePaginationState, handleUserPaginationState } = membersSlice.actions;

export default membersSlice;
