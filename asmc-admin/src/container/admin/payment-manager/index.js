import withNavigate from "../../../routes/withNavigate";
import PaymentManagerContainer from "./PaymentManagerContainer.jsx";
import PaymentManagerStore from "./PaymentManagerStore";

export default PaymentManagerStore(withNavigate(PaymentManagerContainer));