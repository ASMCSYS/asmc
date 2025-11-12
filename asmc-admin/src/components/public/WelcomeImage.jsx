import React from "react";
import Stack from "@mui/material/Stack";
import { Box, Typography } from "@mui/material";

const WelcomeImage = () => {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                height: { xs: "10vh", sm: "20vh", md: "100vh", lg: "100vh" },
                width: "auto",
                backgroundColor: "primary.main",
                display: "flex",
                flexDirection: { xs: "row", sm: "row", md: "column", lg: "column" },
            }}
        >
            <Box sx={{ width: { xs: "20%", sm: "20%", md: "20%", lg: "20%" } }}>
                <img
                    src="assets/images/logo.png"
                    alt="asmc-logo"
                    width={"100%"}
                />
            </Box>
            <Typography variant="h6" color={"white"}>Anushaktinagar Sports Management Committee</Typography>
        </Stack>
    );
};

export default WelcomeImage;
