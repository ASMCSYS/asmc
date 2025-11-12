import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { handlePaginationState } from "../../../store/common/commonSlice";

const mapStateToProps = (state) => {
    return {
        pagination: state.common.pagination,
    };
};

const mapDispatch = {
    handlePaginationState
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;