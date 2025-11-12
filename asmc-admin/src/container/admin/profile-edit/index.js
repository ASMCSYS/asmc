import withNavigate from "../../../routes/withNavigate";
import ProfileEditContainer from "./ProfileEditContainer.jsx";
import ProfileEditStore from "./ProfileEditStore";

export default ProfileEditStore(withNavigate(ProfileEditContainer)); 