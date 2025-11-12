import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMastersInitialStateTeams, handlePaginationStateTeams } from "../../../store/masters/mastersSlice";

const mapStateToProps = (state) => {
    return {
        // location
        formType: state.masters.formTypeTeams,
        initialValues: state.masters.initialValuesTeams,
        showDrawer: state.masters.showDrawerTeams,
        pagination: state.masters.paginationTeams,
    };
};

const mapDispatch = {
    changeTeamsInitialState: changeMastersInitialStateTeams,
    handlePaginationState: handlePaginationStateTeams,
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;