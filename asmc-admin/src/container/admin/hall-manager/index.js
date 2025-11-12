import withNavigate from "../../../routes/withNavigate.jsx";
import HallContainer from "./HallContainer.jsx";
import HallStore from "./HallStore.js";

export default HallStore(withNavigate(HallContainer));