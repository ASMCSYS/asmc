import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { handleBakcupPaginationState } from "../../../store/common/commonSlice";

const mapStateToProps = (state) => {
    return {
        pagination: state.common.pagination_db,
    };
};

const mapDispatch = {
    handlePaginationState: handleBakcupPaginationState,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(mapDispatch, dispatch);

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
