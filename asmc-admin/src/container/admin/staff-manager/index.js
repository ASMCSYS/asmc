import withNavigate from "../../../routes/withNavigate.jsx";
import StaffManagerContainer from "./StaffManagerContainer.jsx";
import StaffManagerStore from "./StaffManagerStore.js";

export default StaffManagerStore(withNavigate(StaffManagerContainer));
