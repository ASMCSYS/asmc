import withNavigate from "../../../routes/withNavigate";
import UserManagerContainer from "./UserManagerContainer.jsx";
import UserManagerStore from "./UserManagerStore";

export default UserManagerStore(withNavigate(UserManagerContainer));