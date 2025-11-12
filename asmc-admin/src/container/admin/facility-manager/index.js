import withNavigate from "../../../routes/withNavigate.jsx";
import FacilityManagerContainer from "./FacilityManagerContainer.jsx";
import FacilityManagerStore from "./FacilityManagerStore.js";

export default FacilityManagerStore(withNavigate(FacilityManagerContainer));