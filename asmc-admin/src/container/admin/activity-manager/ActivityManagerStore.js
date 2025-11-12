import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeActivityInitialState, handlePaginationState } from "../../../store/activity/activitySlice";

const mapStateToProps = (state) => {
    return {
        formType: state.activity.formType,
        initialValues: state.activity.initialValues,
        showDrawer: state.activity.showDrawer,
        pagination: state.activity.pagination,
    };
};

const mapDispatch = {
    changeActivityInitialState,
    handlePaginationState,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;