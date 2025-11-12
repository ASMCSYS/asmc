import { useNavigation, useIsFocused } from '@react-navigation/native';

const withNavigate = (Component) => (props) => {
    const navigate = useNavigation();
    const isFocused = useIsFocused();
    return <Component {...props} navigate={navigate} isFocused={isFocused} />;
};

export default withNavigate;
