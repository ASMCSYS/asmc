import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedComponent: null,
    selectedFile: null,
    searchQuery: "",
    searchResults: [],
    isLoading: false,
    error: null,
    viewMode: "grid", // grid or list
    filterComponent: "all",
};

export const documentationSlice = createSlice({
    name: "documentation",
    initialState,
    reducers: {
        setSelectedComponent: (state, action) => {
            state.selectedComponent = action.payload;
            state.selectedFile = null;
        },
        setSelectedFile: (state, action) => {
            state.selectedFile = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setSearchResults: (state, action) => {
            state.searchResults = action.payload;
        },
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },
        setFilterComponent: (state, action) => {
            state.filterComponent = action.payload;
        },
        clearSelection: (state) => {
            state.selectedComponent = null;
            state.selectedFile = null;
        },
        clearSearch: (state) => {
            state.searchQuery = "";
            state.searchResults = [];
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setSelectedComponent,
    setSelectedFile,
    setSearchQuery,
    setSearchResults,
    setViewMode,
    setFilterComponent,
    clearSelection,
    clearSearch,
    setLoading,
    setError,
    clearError,
} = documentationSlice.actions;

export default documentationSlice;
