import withNavigate from "../../../routes/withNavigate.jsx";
import FeesCategoriesContainer from "./FeesCategoriesContainer.jsx";
import FeesCategoriesStore from "./FeesCategoriesStore.js";

export default FeesCategoriesStore(withNavigate(FeesCategoriesContainer));