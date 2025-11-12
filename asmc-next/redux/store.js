import { combineReducers, configureStore } from "@reduxjs/toolkit";
// all api calling using rtk query
import commonApis from "./common/commonApis";
import mastersApis from "./masters/mastersApis";
import authApis from "./auth/authApis";

// redux state slices
import commonSlice from "./common/commonSlice";
import authSlice from "./auth/authSlice";
import mastersSlice from "./masters/mastersSlice";

const reducers = {
    [commonSlice.name]: commonSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [mastersSlice.name]: mastersSlice.reducer,

    [commonApis.reducerPath]: commonApis.reducer,
    [mastersApis.reducerPath]: mastersApis.reducer,
    [authApis.reducerPath]: authApis.reducer,
};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        }).concat([commonApis.middleware, mastersApis.middleware, authApis.middleware]);
    },
});
