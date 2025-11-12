import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    changeMastersInitialStateTestimonials,
    handlePaginationStateTestimonials,
} from "../../../store/masters/mastersSlice";
import membersApis from "../../../store/members/membersApis";

const mapStateToProps = (state) => {
    return {
        formType: state.masters.formTypeTestimonials,
        initialValues: state.masters.initialValuesTestimonials,
        showDrawer: state.masters.showDrawerTestimonials,
        pagination: state.masters.paginationTestimonials,
    };
};

const mapDispatch = {
    changeMastersInitialState: changeMastersInitialStateTestimonials,
    handlePaginationState: handlePaginationStateTestimonials,
    getMembersList: membersApis.endpoints.getMembersList.initiate,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(mapDispatch, dispatch);

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
