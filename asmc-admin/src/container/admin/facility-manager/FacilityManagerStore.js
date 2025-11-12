import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeFacilityInitialState, handlePaginationState } from "../../../store/facility/facilitySlice";

const mapStateToProps = (state) => {
    return {
        formType: state.facility.formType,
        initialValues: state.facility.initialValues,
        showDrawer: state.facility.showDrawer,
        pagination: state.facility.pagination,
    };
};

const mapDispatch = {
    changeFacilityInitialState,
    handlePaginationState,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;