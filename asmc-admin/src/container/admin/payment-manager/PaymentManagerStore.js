import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMembersInitialState, handlePaginationState } from "../../../store/members/membersSlice";
import activityApis from "../../../store/activity/activityApis";
import membersApis from "../../../store/members/membersApis";
// import sansthaApis from "../../../store/sanstha/sansthaApis";

const mapStateToProps = (state) => {
    return {
        formType: state.members.formType,
        initialValues: state.members.initialValues,
        showDrawer: state.members.showDrawer,
        pagination: state.members.pagination,
    };
};

const mapDispatch = {
    changeMembersInitialState,
    handlePaginationState,
    getActivityList: activityApis.endpoints.getActivityList.initiate,
    getMembersList: membersApis.endpoints.getMembersList.initiate,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(mapDispatch, dispatch);

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
