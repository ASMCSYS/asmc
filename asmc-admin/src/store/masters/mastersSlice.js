import { createSlice } from "@reduxjs/toolkit";

const defaultFormValueLocation = {
    title: "",
    address: "",
    parent_id: 0,
    status: true,
};
const defaultFormValueCategory = {
    title: "",
    parent_id: 0,
    status: true,
};

const defaultFormValueTeams = {
    name: "",
    role: "",
    activity_name: "",
    profile: "",
    display_order: "0",
    status: true,
};

const defaultFormValueGallery = {};

const defaultFormValueBanner = {
    type: "home_page",
    status: "true",
    url: "",
};

export const defaultFormValueFaqs = {
    question: "",
    answer: "",
    category: "",
    newCategory: "",
    status: true,
};

export const defaultFormValueTestimonials = {
    star: "",
    message: "",
    name: "",
    profile: "",
    role: "",
    status: true,
};

export const defaultFormValueNotice = {
    type: "",
    members: "",
    activities: "",
    batches: "",
    content: "",
    title: "",
    status: true,
};

export const defaultFormValueFeesCategories = {
    category_type: "events",
    event_id: "",
    members_type: "",
    event_type: "",
    category_name: "",
    variations: [],
    members_fees: 0,
    non_members_fees: 0,
    status: true,
};

const defaultFormValuePlans = {
    plan_type: "",
    plan_name: "",
    description: "",
    amount: 0,
    dependent_member_price: 0,
    non_dependent_member_price: 0,
    kids_price: 0,
    guest_price: 0,
    start_month: "",
    end_month: "",
    status: true,
};

const defaultFormValueBatch = {
    activity_id: "",
    category_id: "",
    subcategory_name: "",
    location_id: "",
    sublocation_id: "",
    court: "",
    batch_type: "",
    batch_code: "",
    batch_name: "",
    batch_limit: "0",
    type: "enrollment",
    days: [],
    fees: [],
    start_time: "",
    end_time: "",
    status: true,
};

const initialState = {
    // location state
    showDrawerLocation: false,
    formTypeLocation: "",
    initialValuesLocation: { ...defaultFormValueLocation },
    paginationLocation: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },
    // category state
    showDrawerCategory: false,
    formTypeCategory: "",
    initialValuesCategory: { ...defaultFormValueCategory },
    paginationCategory: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },

    // roles state
    showDrawerTeams: false,
    formTypeTeams: "",
    initialValuesTeams: { ...defaultFormValueTeams },
    paginationTeams: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },

    // gallery state
    showDrawerGallery: false,
    formTypeGallery: "",
    initialValuesGallery: { ...defaultFormValueGallery },
    paginationGallery: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },

    // banner
    showDrawerBanner: false,
    formTypeBanner: "",
    initialValuesBanner: { ...defaultFormValueBanner },
    paginationBanner: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },

    // plans
    showDrawerPlans: false,
    formTypePlans: "",
    initialValuesPlans: { ...defaultFormValuePlans },
    paginationPlans: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },

    // batch
    showDrawerBatch: false,
    formTypeBatch: "",
    initialValuesBatch: { ...defaultFormValueBatch },
    paginationBatch: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },

    // faqs
    showDrawerFaqs: false,
    formTypeFaqs: "",
    initialValuesFaqs: { ...defaultFormValueFaqs },
    paginationFaqs: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },

    // faqs
    showDrawerTestimonials: false,
    formTypeTestimonials: "",
    initialValuesTestimonials: { ...defaultFormValueTestimonials },
    paginationTestimonials: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },

    // notices
    showDrawerNotice: false,
    formTypeNotice: "",
    initialValuesNotice: { ...defaultFormValueNotice },
    paginationNotice: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },

    // fees categories
    showDrawerFeesCategories: false,
    formTypeFeesCategories: "",
    initialValuesFeesCategories: { ...defaultFormValueFeesCategories },
    paginationFeesCategories: {
        pageNo: 0,
        limit: 10,
        sortBy: -1,
        sortField: "createdAt",
        keywords: "",
    },
};

export const mastersSlice = createSlice({
    name: "masters",
    initialState,
    reducers: {
        // location state
        changeMastersInitialStateLocation: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerLocation = showDrawer;
            if (formType) state.formTypeLocation = formType;
            if (initialValues) state.initialValuesLocation = initialValues;
            if (!initialValues) state.initialValuesLocation = defaultFormValueLocation;
        },
        handlePaginationStateLocation: (state, action) => {
            const { payload } = action;
            state.paginationLocation = payload;
        },
        // category state
        changeMastersInitialStateCategory: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerCategory = showDrawer;
            if (formType) state.formTypeCategory = formType;
            if (initialValues) state.initialValuesCategory = initialValues;
            if (!initialValues) state.initialValuesCategory = defaultFormValueCategory;
        },
        handlePaginationStateCategory: (state, action) => {
            const { payload } = action;
            state.paginationCategory = payload;
        },
        // roles state
        changeMastersInitialStateTeams: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerTeams = showDrawer;
            if (formType) state.formTypeTeams = formType;
            if (initialValues) state.initialValuesTeams = initialValues;
            if (!initialValues) state.initialValuesTeams = defaultFormValueTeams;
        },
        handlePaginationStateTeams: (state, action) => {
            const { payload } = action;
            state.paginationTeams = payload;
        },
        // gallery state
        changeMastersInitialStateGallery: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerGallery = showDrawer;
            if (formType) state.formTypeGallery = formType;
            if (initialValues) state.initialValuesGallery = initialValues;
            if (!initialValues) state.initialValuesGallery = defaultFormValueGallery;
        },
        handlePaginationStateGallery: (state, action) => {
            const { payload } = action;
            state.paginationGallery = payload;
        },
        // banner state
        changeMastersInitialStateBanner: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerBanner = showDrawer;
            if (formType) state.formTypeBanner = formType;
            if (initialValues) state.initialValuesBanner = initialValues;
            if (!initialValues) state.initialValuesBanner = defaultFormValueBanner;
        },
        handlePaginationStateBanner: (state, action) => {
            const { payload } = action;
            state.paginationBanner = payload;
        },
        // plans state
        changeMastersInitialStatePlans: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerPlans = showDrawer;
            if (formType) state.formTypePlans = formType;
            if (initialValues) state.initialValuesPlans = initialValues;
            if (!initialValues) state.initialValuesPlans = defaultFormValuePlans;
        },
        handlePaginationStatePlans: (state, action) => {
            const { payload } = action;
            state.paginationPlans = payload;
        },
        // batch state
        changeMastersInitialStateBatch: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerBatch = showDrawer;
            if (formType) state.formTypeBatch = formType;
            if (initialValues) state.initialValuesBatch = initialValues;
            if (!initialValues) state.initialValuesBatch = defaultFormValueBatch;
        },
        handlePaginationStateBatch: (state, action) => {
            const { payload } = action;
            state.paginationBatch = payload;
        },
        // faqs state
        changeMastersInitialStateFaqs: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerFaqs = showDrawer;
            if (formType) state.formTypeFaqs = formType;
            if (initialValues) state.initialValuesFaqs = initialValues;
            if (!initialValues) state.initialValuesFaqs = defaultFormValueFaqs;
        },
        handlePaginationStateFaqs: (state, action) => {
            const { payload } = action;
            state.paginationFaqs = payload;
        },
        // testimonials state
        changeMastersInitialStateTestimonials: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerTestimonials = showDrawer;
            if (formType) state.formTypeTestimonials = formType;
            if (initialValues) state.initialValuesTestimonials = initialValues;
            if (!initialValues) state.initialValuesTestimonials = defaultFormValueTestimonials;
        },
        handlePaginationStateTestimonials: (state, action) => {
            const { payload } = action;
            state.paginationTestimonials = payload;
        },
        // notice state
        changeMastersInitialStateNotice: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerNotice = showDrawer;
            if (formType) state.formTypeNotice = formType;
            if (initialValues) state.initialValuesNotice = initialValues;
            if (!initialValues) state.initialValuesNotice = defaultFormValueNotice;
        },
        handlePaginationStateNotice: (state, action) => {
            const { payload } = action;
            state.paginationNotice = payload;
        },
        // fees categproes state
        changeMastersInitialStateFeesCategories: (state, action) => {
            const { showDrawer, formType, initialValues } = action.payload;

            state.showDrawerFeesCategories = showDrawer;
            if (formType) state.formTypeFeesCategories = formType;
            if (initialValues) state.initialValuesFeesCategories = initialValues;
            if (!initialValues) state.initialValuesFeesCategories = defaultFormValueFeesCategories;
        },
        handlePaginationStateFeesCategories: (state, action) => {
            const { payload } = action;
            state.paginationFeesCategories = payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    changeMastersInitialStateLocation,
    handlePaginationStateLocation,
    changeMastersInitialStateCategory,
    handlePaginationStateCategory,
    changeMastersInitialStateTeams,
    handlePaginationStateTeams,
    changeMastersInitialStateGallery,
    handlePaginationStateGallery,
    changeMastersInitialStateBanner,
    handlePaginationStateBanner,
    changeMastersInitialStatePlans,
    handlePaginationStatePlans,
    changeMastersInitialStateBatch,
    handlePaginationStateBatch,
    changeMastersInitialStateFaqs,
    handlePaginationStateFaqs,
    changeMastersInitialStateTestimonials,
    handlePaginationStateTestimonials,
    changeMastersInitialStateNotice,
    handlePaginationStateNotice,
    changeMastersInitialStateFeesCategories,
    handlePaginationStateFeesCategories,
} = mastersSlice.actions;

export default mastersSlice;
