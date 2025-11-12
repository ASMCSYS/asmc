import withNavigate from "../../../routes/withNavigate.jsx";
import NoticeContainer from "./NoticeContainer.jsx";
import NoticeStore from "./NoticeStore.js";

export default NoticeStore(withNavigate(NoticeContainer));