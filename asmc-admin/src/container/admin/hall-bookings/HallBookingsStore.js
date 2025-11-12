import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeHallBookingInitialState, handleHallBookingPaginationState } from "../../../store/halls/hallsSlice";
import membersApis from "../../../store/members/membersApis";
import hallsApis from "../../../store/halls/hallsApis";

const mapStateToProps = (state) => {
    return {
        formType: state.halls.formTypeHallBooking,
        initialValues: state.halls.initialValuesHallBooking,
        showDrawer: state.halls.showDrawerHallBooking,
        pagination: state.halls.paginationHallBooking,
    };
};

const mapDispatch = {
    changeBookingInitialState: changeHallBookingInitialState,
    handlePaginationState: handleHallBookingPaginationState,
    getHallsList: hallsApis.endpoints.getHallList.initiate,
    getMembersList: membersApis.endpoints.getMembersList.initiate,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(mapDispatch, dispatch);

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
