import withNavigate from "../../../routes/withNavigate.jsx";
import DocumentationContainer from "./DocumentationContainer.jsx";
import DocumentationStore from "./DocumentationStore.js";

export default DocumentationStore(withNavigate(DocumentationContainer));
