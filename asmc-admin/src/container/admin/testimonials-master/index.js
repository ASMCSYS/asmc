import withNavigate from "../../../routes/withNavigate.jsx";
import TestimonialsMasterContainer from "./TestimonialsMasterContainer.jsx";
import TestimonialsMasterStore from "./TestimonialsMasterStore.js";

export default TestimonialsMasterStore(withNavigate(TestimonialsMasterContainer));
