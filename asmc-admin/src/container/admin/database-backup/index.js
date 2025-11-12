import withNavigate from "../../../routes/withNavigate.jsx";
import DatabaseBakcupContainer from "./DatabaseBakcupContainer.jsx";
import DatabaseBakcupStore from "./DatabaseBakcupStore.js";

export default DatabaseBakcupStore(withNavigate(DatabaseBakcupContainer));
