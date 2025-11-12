import { CloseOutlined } from "@mui/icons-material";
import { Dialog, DialogTitle, IconButton } from "@mui/material";

export default function CommonModal({ show, close, title, child_component, maxWidth = "sm" }) {
    return (
        <Dialog open={show} onClose={close} fullWidth maxWidth={maxWidth}>
            <DialogTitle>{title}</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={close}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseOutlined />
            </IconButton>
            {child_component}
        </Dialog>
    );
}
