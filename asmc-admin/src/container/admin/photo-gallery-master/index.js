import withNavigate from "../../../routes/withNavigate";
import PhotoGalleryMasterContainer from "./PhotoGalleryMasterContainer.jsx";
import PhotoGalleryMasterStore from "./PhotoGalleryMasterStore";

export default PhotoGalleryMasterStore(withNavigate(PhotoGalleryMasterContainer));