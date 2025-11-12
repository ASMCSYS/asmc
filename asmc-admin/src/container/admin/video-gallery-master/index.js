import withNavigate from "../../../routes/withNavigate";
import VideoGalleryMasterContainer from "./VideoGalleryMasterContainer.jsx";
import VideoGalleryMasterStore from "./VideoGalleryMasterStore";

export default VideoGalleryMasterStore(withNavigate(VideoGalleryMasterContainer));