import withNavigate from "../../../routes/withNavigate.jsx";
import ContactLeadsContainer from "./ContactLeadsContainer.jsx";
import ContactLeadsStore from "./ContactLeadsStore.js";

export default ContactLeadsStore(withNavigate(ContactLeadsContainer));