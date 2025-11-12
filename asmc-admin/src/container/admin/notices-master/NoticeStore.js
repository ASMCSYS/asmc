import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMastersInitialStateNotice, handlePaginationStateNotice } from "../../../store/masters/mastersSlice";
import activityApis from "../../../store/activity/activityApis";
import membersApis from "../../../store/members/membersApis";
import mastersApis from "../../../store/masters/mastersApis";

const mapStateToProps = (state) => {
    return {
        formType: state.masters.formTypeNotice,
        initialValues: state.masters.initialValuesNotice,
        showDrawer: state.masters.showDrawerNotice,
        pagination: state.masters.paginationNotice,
    };
};

const mapDispatch = {
    changeMastersInitialState: changeMastersInitialStateNotice,
    handlePaginationState: handlePaginationStateNotice,
    getActivityList: activityApis.endpoints.getActivityList.initiate,
    getMembersList: membersApis.endpoints.getMembersList.initiate,
    getBatchList: mastersApis.endpoints.getBatchList.initiate,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;