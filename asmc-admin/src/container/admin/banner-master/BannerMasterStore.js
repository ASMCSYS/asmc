import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMastersInitialStateBanner, handlePaginationStateBanner } from "../../../store/masters/mastersSlice";

const mapStateToProps = (state) => {
    return {
        formType: state.masters.formTypeBanner,
        initialValues: state.masters.initialValuesBanner,
        showDrawer: state.masters.showDrawerBanner,
        pagination: state.masters.paginationBanner,
    };
};

const mapDispatch = {
    changeMastersInitialState: changeMastersInitialStateBanner,
    handlePaginationState: handlePaginationStateBanner,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;