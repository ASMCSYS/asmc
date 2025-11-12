import withNavigate from "../../../routes/withNavigate";
import ActivityManagerContainer from "./ActivityManagerContainer.jsx";
import ActivityManagerStore from "./ActivityManagerStore";

export default ActivityManagerStore(withNavigate(ActivityManagerContainer));