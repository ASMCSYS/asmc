import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    changeMastersInitialStateFeesCategories,
    handlePaginationStateFeesCategories,
} from '../../../store/masters/mastersSlice';
import eventsApis from '../../../store/events/eventsApis';

const mapStateToProps = (state) => {
    return {
        formType: state.masters.formTypeFeesCategories,
        initialValues: state.masters.initialValuesFeesCategories,
        showDrawer: state.masters.showDrawerFeesCategories,
        pagination: state.masters.paginationFeesCategories,
    };
};

const mapDispatch = {
    changeInitialState: changeMastersInitialStateFeesCategories,
    handlePaginationState: handlePaginationStateFeesCategories,
    getEventDropdown: eventsApis.endpoints.getEventDropdown.initiate,
};

const mapDispatchToProps = (dispatch) => bindActionCreators(mapDispatch, dispatch);

const Store = (Container) => connect(mapStateToProps, mapDispatchToProps)(Container);

export default Store;
