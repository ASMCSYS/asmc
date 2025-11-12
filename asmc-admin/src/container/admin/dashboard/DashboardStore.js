import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({}, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;