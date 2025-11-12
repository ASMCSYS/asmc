import withNavigate from "../../../routes/withNavigate.jsx";
import LocationManagerContainer from "./LocationManagerContainer.jsx";
import LocationManagerStore from "./LocationManagerStore.js";

export default LocationManagerStore(withNavigate(LocationManagerContainer));