import withNavigate from "../../../routes/withNavigate";
import BannerMasterContainer from "./BannerMasterContainer.jsx";
import BannerMasterStore from "./BannerMasterStore";

export default BannerMasterStore(withNavigate(BannerMasterContainer));