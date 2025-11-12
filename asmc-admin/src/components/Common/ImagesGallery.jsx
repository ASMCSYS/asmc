import { Box, Grid } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import IconButtonIcons from "./IconButtonIcons";

function ImagesGallery({ images, remove }) {
    return (
        <Grid display={"flex"} flexDirection={"row"} flexWrap={"wrap"} >
            {
                images && images.length > 0 && images.map((url, key) => {
                    return (
                        <Box flexDirection={"row"} sx={{ position: "relative", px: 2, py: 1 }}>
                            <Box sx={{ position: "absolute", right: 0, backgroundColor: "#fff", borderRadius: 50 }}>
                                <IconButtonIcons IconComponent={CloseIcon}   color="primary" title="Remove" onClick={() => remove(key)} />
                            </Box>
                            <img src={url.includes("public") ? url : url} alt="someimg" width={100} style={{ padding: 2 }} />
                        </Box>
                    )
                })
            }
        </Grid>
    )
}
export default ImagesGallery;