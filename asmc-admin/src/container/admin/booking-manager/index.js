import withNavigate from "../../../routes/withNavigate.jsx";
import BookingsContainer from "./BookingsContainer.jsx";
import BookingsStore from "./BookingsStore.js";

export default BookingsStore(withNavigate(BookingsContainer));