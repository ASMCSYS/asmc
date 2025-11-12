import withNavigate from "../../../routes/withNavigate.jsx";
import BatchyManagerContainer from "./BatchManagerContainer.jsx";
import BatchyManagerStore from "./BatchManagerStore.js";

export default BatchyManagerStore(withNavigate(BatchyManagerContainer));