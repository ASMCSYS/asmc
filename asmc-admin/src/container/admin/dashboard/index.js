import withNavigate from "../../../routes/withNavigate";
import DashboardContainer from "./DashboardContainer.jsx";
import DashboardStore from "./DashboardStore";

export default DashboardStore(withNavigate(DashboardContainer));