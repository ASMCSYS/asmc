import { setIsAuth } from "@/redux/auth/authSlice";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth,
        authData: state.auth.authData
    }
}

const mapDispatch = {
    setIsAuth
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(mapDispatch, dispatch);

const Store = (Container) =>
    connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;