import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMastersInitialStateBatch, handlePaginationStateBatch } from "../../../store/masters/mastersSlice";
import activityApis from "../../../store/activity/activityApis";
import mastersApis from "../../../store/masters/mastersApis";

const mapStateToProps = (state) => {
    return {
        formType: state.masters.formTypeBatch,
        initialValues: state.masters.initialValuesBatch,
        showDrawer: state.masters.showDrawerBatch,
        pagination: state.masters.paginationBatch,
    };
};

const mapDispatch = {
    changeBatchInitialState: changeMastersInitialStateBatch,
    handlePaginationState: handlePaginationStateBatch,
    getActivityList: activityApis.endpoints.getActivityList.initiate,
    getActiveLocationList: mastersApis.endpoints.getActiveLocationList.initiate,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;