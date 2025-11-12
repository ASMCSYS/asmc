import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { set_dark_mode } from "../../store/common/commonSlice";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { SingleLevelMenu } from "./SingleLevelMenu";
import { Fragment } from "react";
import { MultiLevelMenu } from "./MultiLevelMenu";
import { expandDrawerWidth } from "../../helpers/constants";

const MenuList = ({ modules, navigate, path_url, theme, opened }) => {
    const dispatch = useDispatch();

    return (
        <>
            <List sx={{ padding: 0 }}>
                <Tooltip placement="right" title="Dark Mode">
                    <ListItemButton
                        button={"true"}
                        key={"Dark Mode"}
                        onClick={() => {
                            dispatch(set_dark_mode());
                            // window.location.reload();
                        }}
                        sx={{
                            my: 0.5,
                            width: expandDrawerWidth,
                            gap: "10px",
                            borderRadius: "10px",
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: "35px" }}>
                            <Brightness4Icon />
                        </ListItemIcon>
                        <ListItemText primary={"Dark Mode"} />
                    </ListItemButton>
                </Tooltip>
            </List>
            <Divider />
            <List>
                {modules.map((module, i) => {
                    return (
                        <Fragment key={i}>
                            {module.items && module.items.length > 0 ? (
                                <MultiLevelMenu
                                    module={module}
                                    navigate={navigate}
                                    path_url={path_url}
                                    theme={theme}
                                    opened={opened}
                                />
                            ) : (
                                <SingleLevelMenu
                                    module={module}
                                    onClick={() => navigate(module.link)}
                                    path_url={path_url}
                                    theme={theme}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </List>
        </>
    );
};

export default MenuList;
