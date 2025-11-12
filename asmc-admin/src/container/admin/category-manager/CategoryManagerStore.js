import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMastersInitialStateCategory, handlePaginationStateCategory } from "../../../store/masters/mastersSlice";

const mapStateToProps = (state) => {
    return {
        // location
        formType: state.masters.formTypeCategory,
        initialValues: state.masters.initialValuesCategory,
        showDrawer: state.masters.showDrawerCategory,
        pagination: state.masters.paginationCategory,
    };
};

const mapDispatch = {
    changeCategoryInitialState: changeMastersInitialStateCategory,
    handlePaginationState: handlePaginationStateCategory,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;