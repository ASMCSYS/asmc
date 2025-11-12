import withNavigate from "../../../routes/withNavigate.jsx";
import ReportsContainer from "./ReportsContainer.jsx";
import ReportsStore from "./ReportsStore.js";

export default ReportsStore(withNavigate(ReportsContainer));