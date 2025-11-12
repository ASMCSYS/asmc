import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMastersInitialStateLocation, handlePaginationStateLocation } from "../../../store/masters/mastersSlice";

const mapStateToProps = (state) => {
    return {
        // location
        formType: state.masters.formTypeLocation,
        initialValues: state.masters.initialValuesLocation,
        showDrawer: state.masters.showDrawerLocation,
        pagination: state.masters.paginationLocation,
    };
};

const mapDispatch = {
    changeLocationInitialState: changeMastersInitialStateLocation,
    handlePaginationState: handlePaginationStateLocation,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;