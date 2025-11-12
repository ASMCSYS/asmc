import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeBookingInitialState, handlePaginationState } from "../../../store/booking/bookingSlice";
import activityApis from "../../../store/activity/activityApis";
import membersApis from "../../../store/members/membersApis";

const mapStateToProps = (state) => {
    return {
        formType: state.booking.formType,
        initialValues: state.booking.initialValues,
        showDrawer: state.booking.showDrawer,
        pagination: state.booking.pagination,
    };
};

const mapDispatch = {
    changeBookingInitialState,
    handlePaginationState,
    getActivityList: activityApis.endpoints.getActivityList.initiate,
    getMembersList: membersApis.endpoints.getMembersList.initiate,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;