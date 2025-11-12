import withNavigate from "../../../routes/withNavigate.jsx";
import AboutPageCmsContainer from "./AboutPageCmsContainer.jsx";
import AboutPageCmsStore from "./AboutPageCmsStore.js";

export default AboutPageCmsStore(withNavigate(AboutPageCmsContainer));
