import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";

// all api calling using rtk query
import membersApis from "./members/membersApis";
import commonApis from "./common/commonApis";
import plansApis from "./plans/plansApis";
import facilityApis from "./facility/facilityApis";
import activityApis from "./activity/activityApis";
import mastersApis from "./masters/mastersApis";
import bookingApis from "./booking/bookingApis";
import eventsApis from "./events/eventsApis";
import hallsApis from "./halls/hallsApis";
import staffApis from "./staff/staffApis";
import { documentationApi } from "./documentation/documentationApis";

// redux state slices
import commonSlice from "./common/commonSlice";
import membersSlice from "./members/membersSlice";
import plansSlice from "./plans/plansSlice";
import facilitySlice from "./facility/facilitySlice";
import activitySlice from "./activity/activitySlice";
import mastersSlice from "./masters/mastersSlice";
import bookingSlice from "./booking/bookingSlice";
import eventsSlice from "./events/eventsSlice";
import hallsSlice from "./halls/hallsSlice";
import staffSlice from "./staff/staffSlice";
import documentationSlice from "./documentation/documentationSlice";

// axios interceptor
import axiosInterceptor from "../helpers/axios";

const reducers = {
    [commonSlice.name]: commonSlice.reducer,
    [membersSlice.name]: membersSlice.reducer,
    [plansSlice.name]: plansSlice.reducer,
    [facilitySlice.name]: facilitySlice.reducer,
    [activitySlice.name]: activitySlice.reducer,
    [mastersSlice.name]: mastersSlice.reducer,
    [bookingSlice.name]: bookingSlice.reducer,
    [eventsSlice.name]: eventsSlice.reducer,
    [hallsSlice.name]: hallsSlice.reducer,
    [staffSlice.name]: staffSlice.reducer,
    [documentationSlice.name]: documentationSlice.reducer,

    [membersApis.reducerPath]: membersApis.reducer,
    [commonApis.reducerPath]: commonApis.reducer,
    [plansApis.reducerPath]: plansApis.reducer,
    [facilityApis.reducerPath]: facilityApis.reducer,
    [activityApis.reducerPath]: activityApis.reducer,
    [mastersApis.reducerPath]: mastersApis.reducer,
    [bookingApis.reducerPath]: bookingApis.reducer,
    [eventsApis.reducerPath]: eventsApis.reducer,
    [hallsApis.reducerPath]: hallsApis.reducer,
    [staffApis.reducerPath]: staffApis.reducer,
    [documentationApi.reducerPath]: documentationApi.reducer,
};

const initialState = {};

const rootReducer = combineReducers(reducers);

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        }).concat([
            membersApis.middleware,
            commonApis.middleware,
            plansApis.middleware,
            facilityApis.middleware,
            activityApis.middleware,
            mastersApis.middleware,
            bookingApis.middleware,
            eventsApis.middleware,
            hallsApis.middleware,
            staffApis.middleware,
            documentationApi.middleware,
        ]);
    },
    devTools: true,
    preloadedState: initialState,
    enhancers: (defaultEnhancers) => [...defaultEnhancers],
});

export const useAppSelector = () => useSelector(rootReducer);
export const useAppDispatch = () => useDispatch(store.dispatch);

axiosInterceptor(store.dispatch);

export default store;
