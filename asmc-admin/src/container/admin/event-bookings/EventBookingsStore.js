import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeEventBookingInitialState, handleEventBookingPaginationState } from "../../../store/events/eventsSlice";
import membersApis from "../../../store/members/membersApis";
import eventsApis from "../../../store/events/eventsApis";

const mapStateToProps = (state) => {
    return {
        formType: state.event.formTypeEventBooking,
        initialValues: state.event.initialValuesEventBooking,
        showDrawer: state.event.showDrawerEventBooking,
        pagination: state.event.paginationEventBooking,
    };
};

const mapDispatch = {
    changeBookingInitialState: changeEventBookingInitialState,
    handlePaginationState: handleEventBookingPaginationState,
    getEventsList: eventsApis.endpoints.getEventList.initiate,
    getMembersList: membersApis.endpoints.getMembersList.initiate,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(mapDispatch, dispatch);

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
