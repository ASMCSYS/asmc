import withNavigate from "../../../routes/withNavigate";
import MembersManagerContainer from "./MembersManagerContainer.jsx";
import MembersManagerStore from "./MembersManagerStore";

export default MembersManagerStore(withNavigate(MembersManagerContainer));