import withNavigate from "../../../routes/withNavigate.jsx";
import HomePageCmsContainer from "./HomePageCmsContainer.jsx";
import HomePageCmsStore from "./HomePageCmsStore.js";

export default HomePageCmsStore(withNavigate(HomePageCmsContainer));
