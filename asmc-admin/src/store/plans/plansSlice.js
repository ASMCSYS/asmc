import { createSlice } from "@reduxjs/toolkit";

const defaultFormValue = {
    name: "",
    email: "",
    mobile: ""
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

export const plansSlice = createSlice({
    name: "plans",
    initialState,
    reducers: {
        changePlansInitialState: (state, action) => {
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
export const { changePlansInitialState, handlePaginationState } = plansSlice.actions;

export default plansSlice;
