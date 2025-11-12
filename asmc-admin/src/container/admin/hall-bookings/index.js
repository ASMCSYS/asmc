import withNavigate from "../../../routes/withNavigate.jsx";
import HallBookingsContainer from "./HallBookingsContainer.jsx";
import HallBookingsStore from "./HallBookingsStore.js";

export default HallBookingsStore(withNavigate(HallBookingsContainer));
