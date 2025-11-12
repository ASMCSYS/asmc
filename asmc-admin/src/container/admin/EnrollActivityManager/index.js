import withNavigate from "../../../routes/withNavigate.jsx";
import EnrollActivityContainer from "./EnrollActivityContainer.jsx";
import EnrollActivityStore from "./EnrollActivityStore.js";

export default EnrollActivityStore(withNavigate(EnrollActivityContainer));