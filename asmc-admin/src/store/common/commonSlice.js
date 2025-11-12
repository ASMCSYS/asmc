import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dark_mode: "dark",
    sidebar_open: true,
    snackbar: {
        open: false,
        message: "",
        severity: "info",
    },
    authentication_loading: false,
    pagination: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },
    pagination_db: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },
};

export const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        set_dark_mode: (state, action) => {
            state.dark_mode = action.payload ? action.payload : state.dark_mode === "light" ? "dark" : "light";
        },
        setSidebarMenu: (state, action) => {
            state.sidebar_open = action.payload;
        },
        setSnackBar: (state, action) => {
            state.snackbar = action.payload;
        },
        setAuthenticationLoading: (state, action) => {
            state.authentication_loading = action.payload.state;
        },
        handlePaginationState: (state, action) => {
            const { payload } = action;
            state.pagination = payload;
        },

        handleBakcupPaginationState: (state, action) => {
            const { payload } = action;
            state.pagination_db = payload;
        },
    },
    extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const {
    setAuthenticationLoading,
    setSnackBar,
    setSidebarMenu,
    set_dark_mode,
    handlePaginationState,
    handleBakcupPaginationState,
} = commonSlice.actions;

export default commonSlice;
