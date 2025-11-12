import withNavigate from "../../../routes/withNavigate.jsx";
import CategoryManagerContainer from "./CategoryManagerContainer.jsx";
import CategoryManagerStore from "./CategoryManagerStore.js";

export default CategoryManagerStore(withNavigate(CategoryManagerContainer));