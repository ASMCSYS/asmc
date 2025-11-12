
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export const CommonModal = ({ open, onClose, children, className = "", showCloseIcon = true }) => {
    return (
        <Modal open={open} onClose={onClose} classNames={{ modal: className }} showCloseIcon={showCloseIcon} closeOnEsc={showCloseIcon} closeOnOverlayClick={showCloseIcon}>
            {children}
        </Modal>
    )
}