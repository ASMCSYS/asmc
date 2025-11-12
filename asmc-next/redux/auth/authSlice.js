import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuth: false,
    authData: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsAuth: (state, action) => {
            state.isAuth = action.payload;
        },
        setAuthData: (state, action) => {
            state.authData = action.payload;
        },
    },
    extraReducers: (builder) => {
    }
});

// Action creators are generated for each case reducer function
export const { setIsAuth, setAuthData } = authSlice.actions;

export default authSlice;
