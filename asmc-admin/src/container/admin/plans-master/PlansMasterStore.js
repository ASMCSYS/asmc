import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMastersInitialStatePlans, handlePaginationStatePlans } from "../../../store/masters/mastersSlice";

const mapStateToProps = (state) => {
    return {
        formType: state.masters.formTypePlans,
        initialValues: state.masters.initialValuesPlans,
        showDrawer: state.masters.showDrawerPlans,
        pagination: state.masters.paginationPlans,
    };
};

const mapDispatch = {
    changeMastersInitialState: changeMastersInitialStatePlans,
    handlePaginationState: handlePaginationStatePlans,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;