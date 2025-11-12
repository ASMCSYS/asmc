import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material"
import { expandDrawerWidth, drawerWidth } from "../../helpers/constants"

export const SingleLevelMenu = ({ key, module, onClick, path_url, theme, haveParent = false }) => {
    return (
        <Tooltip
            key={key}
            placement='right'
            title={module.title}
        >
            <ListItemButton
                button={"true"}
                key={module.id}
                onClick={onClick}
                selected={
                    path_url === module.link || (path_url === "/" && module.link === "/dashboard")
                        ? true
                        : false
                }
                sx={{
                    my: 0.5,
                    width: haveParent ? (expandDrawerWidth - 20) : expandDrawerWidth,
                    gap: "10px",
                    borderRadius: "10px",
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: "35px",
                        ...(path_url ===
                            module.link || (path_url === "/" && module.link === "/dashboard") ? {
                            color: theme.palette.primary.main,
                        } : null),
                        ...(theme.palette.mode === "dark" &&
                            module.title === "Connections"
                            ? { filter: "invert(1)" }
                            : ""),
                    }}
                >
                    {module.logo}
                </ListItemIcon>
                <ListItemText
                    primary={module.title}
                    sx={{
                        ...(path_url ===
                            module.link || (path_url === "/" && module.link === "/dashboard") ? {
                            color: theme.palette.primary.main,
                        } : null),
                    }}
                />
            </ListItemButton>
        </Tooltip>
    )
}