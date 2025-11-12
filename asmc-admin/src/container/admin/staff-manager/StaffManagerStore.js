import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeStaffInitialState, handlePaginationState } from "../../../store/staff/staffSlice.js";
import staffApis from "../../../store/staff/staffApis.js";

const mapStateToProps = (state) => {
    return {
        formType: state.staff.formType,
        initialValues: state.staff.initialValues,
        showDrawer: state.staff.showDrawer,
        pagination: state.staff.pagination,
    };
};

const mapDispatch = {
    changeStaffInitialState,
    handlePaginationState,
    getStaffList: staffApis.endpoints.getStaffList.initiate,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(mapDispatch, dispatch);

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
