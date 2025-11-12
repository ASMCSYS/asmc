import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
    return {};
};

const mapDispatch = {};

const mapDispatchToProps = (dispatch) => bindActionCreators(mapDispatch, dispatch);

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
