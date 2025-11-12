import withNavigate from "../../../routes/withNavigate.jsx";
import EventContainer from "./EventContainer.jsx";
import EventStore from "./EventStore.js";

export default EventStore(withNavigate(EventContainer));