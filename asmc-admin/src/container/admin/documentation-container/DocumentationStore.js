import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    setSelectedComponent,
    setSelectedFile,
    setSearchQuery,
    setViewMode,
    setFilterComponent,
    clearSelection,
    clearSearch,
} from "../../../store/documentation/documentationSlice";

const mapStateToProps = (state) => {
    console.log("DocumentationStore - state:", state);
    console.log("DocumentationStore - state.documentation:", state.documentation);
    return {
        selectedComponent: state.documentation?.selectedComponent,
        selectedFile: state.documentation?.selectedFile,
        searchQuery: state.documentation?.searchQuery,
        viewMode: state.documentation?.viewMode,
        filterComponent: state.documentation?.filterComponent,
        searchResults: state.documentation?.searchResults,
    };
};

const mapDispatch = {
    setSelectedComponent,
    setSelectedFile,
    setSearchQuery,
    setViewMode,
    setFilterComponent,
    clearSelection,
    clearSearch,
};

const mapDispatchToProps = (dispatch) => {
    console.log("DocumentationStore - mapDispatch:", mapDispatch);
    const boundActions = bindActionCreators(mapDispatch, dispatch);
    console.log("DocumentationStore - boundActions:", boundActions);
    return boundActions;
};

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
