import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeEventInitialState, handlePaginationState } from "../../../store/events/eventsSlice";
import mastersApis from "../../../store/masters/mastersApis";

const mapStateToProps = (state) => {
    return {
        formType: state.event.formType,
        initialValues: state.event.initialValues,
        showDrawer: state.event.showDrawer,
        pagination: state.event.pagination,
    };
};

const mapDispatch = {
    changeEventInitialState,
    handlePaginationState,
    getActiveLocationList: mastersApis.endpoints.getActiveLocationList.initiate,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;