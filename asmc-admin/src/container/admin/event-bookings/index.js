import withNavigate from "../../../routes/withNavigate.jsx";
import EventBookingsContainer from "./EventBookingsContainer.jsx";
import EventBookingsStore from "./EventBookingsStore.js";

export default EventBookingsStore(withNavigate(EventBookingsContainer));
