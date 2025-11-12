import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMastersInitialStateGallery, handlePaginationStateGallery } from "../../../store/masters/mastersSlice";

const mapStateToProps = (state) => {
    return {
        formType: state.masters.formTypeGallery,
        initialValues: state.masters.initialValuesGallery,
        showDrawer: state.masters.showDrawerGallery,
        pagination: state.masters.paginationGallery,
    };
};

const mapDispatch = {
    changeMastersInitialState: changeMastersInitialStateGallery,
    handlePaginationState: handlePaginationStateGallery,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;