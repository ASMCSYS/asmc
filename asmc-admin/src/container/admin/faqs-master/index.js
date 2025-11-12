import withNavigate from "../../../routes/withNavigate.jsx";
import FaqsMasterContainer from "./FaqsMasterContainer.jsx";
import FaqsMasterStore from "./FaqsMasterStore.js";

export default FaqsMasterStore(withNavigate(FaqsMasterContainer));