import withNavigate from "../../routes/withNavigate";
import LayoutContainer from "./LayoutContainer.jsx";
import LayoutStore from "./LayoutStore";

export default LayoutStore(withNavigate(LayoutContainer));