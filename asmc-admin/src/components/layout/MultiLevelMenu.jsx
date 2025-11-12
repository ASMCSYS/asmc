import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Tooltip } from "@mui/material"
import { useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SingleLevelMenu } from "./SingleLevelMenu";
import { expandDrawerWidth } from "../../helpers/constants";

export const MultiLevelMenu = ({ key, module, path_url, theme, navigate, opened }) => {
    const { items } = module;
    const [open, setOpen] = useState(Boolean(items.find((obj) => obj.link === path_url)) || false);

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    return (
        <Tooltip
            key={key}
            placement='right'
            title={module.title}
        >
            <ListItemButton
                button={"true"}
                key={module.id}
                onClick={handleClick}
                selected={
                    path_url === module.link || (path_url === "/" && module.link === "/dashboard")
                        ? true
                        : false
                }
                sx={{
                    my: 0.5,
                    width: expandDrawerWidth,
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
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: opened ? 3 : 0 }}>
                    {items.map((child, key) => {
                        return (
                            <SingleLevelMenu
                                key={("module_", key)}
                                module={child}
                                onClick={() => navigate(child.link)}
                                path_url={path_url}
                                theme={theme}
                                haveParent={true}
                            />
                        )
                    })}
                </List>
            </Collapse>
        </Tooltip>
    )
}