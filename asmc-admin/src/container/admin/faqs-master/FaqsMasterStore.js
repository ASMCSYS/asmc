import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMastersInitialStateFaqs, handlePaginationStateFaqs } from "../../../store/masters/mastersSlice";

const mapStateToProps = (state) => {
    return {
        formType: state.masters.formTypeFaqs,
        initialValues: state.masters.initialValuesFaqs,
        showDrawer: state.masters.showDrawerFaqs,
        pagination: state.masters.paginationFaqs,
    };
};

const mapDispatch = {
    changeMastersInitialState: changeMastersInitialStateFaqs,
    handlePaginationState: handlePaginationStateFaqs,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;