import withNavigate from "../../../routes/withNavigate.jsx";
import TeamsManagerContainer from "./TeamsManagerContainer.jsx";
import TeamsManagerStore from "./TeamsManagerStore.js";

export default TeamsManagerStore(withNavigate(TeamsManagerContainer));