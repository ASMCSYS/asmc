import withNavigate from "../../../routes/withNavigate.jsx";
import SettingsDefaultContainer from "./SettingsDefaultContainer.jsx";
import SettingsDefaultStore from "./SettingsDefaultStore.js";

export default SettingsDefaultStore(withNavigate(SettingsDefaultContainer));
