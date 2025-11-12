import { connect } from 'react-redux';

const ProfileEditStore = (Component) => {
    const mapStateToProps = (state) => ({
        // Add any state mappings here if needed
    });

    const mapDispatchToProps = (dispatch) => ({
        // Add any dispatch mappings here if needed
    });

    return connect(mapStateToProps, mapDispatchToProps)(Component);
};

export default ProfileEditStore; 