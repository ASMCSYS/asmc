import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeHallInitialState, handlePaginationState } from "../../../store/halls/hallsSlice";
import mastersApis from "../../../store/masters/mastersApis";

const mapStateToProps = (state) => {
    return {
        formType: state.halls.formType,
        initialValues: state.halls.initialValues,
        showDrawer: state.halls.showDrawer,
        pagination: state.halls.pagination,
    };
};

const mapDispatch = {
    changeHallInitialState,
    handlePaginationState,
    getActiveLocationList: mastersApis.endpoints.getActiveLocationList.initiate,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;