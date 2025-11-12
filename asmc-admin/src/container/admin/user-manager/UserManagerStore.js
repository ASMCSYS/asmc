import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { handleUserPaginationState } from "../../../store/members/membersSlice";

const mapStateToProps = (state) => {
    return {
        pagination: state.members.userPagination,
    };
};

const mapDispatch = {
    handleUserPaginationState,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(mapDispatch, dispatch);

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
