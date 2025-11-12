import withNavigate from "../../../routes/withNavigate";
import PlansMasterContainer from "./PlansMasterContainer.jsx";
import PlansMasterStore from "./PlansMasterStore";

export default PlansMasterStore(withNavigate(PlansMasterContainer));