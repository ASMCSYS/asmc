import React from "react";
import { Grid, Popover, Typography } from "@mui/material";

const PopoverComponent = (props) => {
  const { anchorEl, popoverData } = props;
  return (
    <>
      <Popover
        id="mouse-over-popover"
        className="simple-popover"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        anchorPosition={{ left: 475, top: 420 }}
        sx={{
          pointerEvents: "none",
        }}
        disableRestoreFocus
      >
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ p: 1 }}>
          <Grid item xs={12}>
            <Typography variant="body2" component="body2">
              <strong>Meeting Title:</strong> {popoverData?.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" component="body2">
              <strong>Meeting Status:</strong> {popoverData?.status}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" component="body2">
              <strong>Learner Name:</strong> {popoverData?.learner}
            </Typography>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};

export default PopoverComponent;
