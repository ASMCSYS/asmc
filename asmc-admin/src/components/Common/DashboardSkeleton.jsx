import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Grid } from "@mui/material";

const DashboardSkeleton = (props) => {
  return (
    <Grid container spacing={3} pb={3}>
      <Grid item xl={4} lg={4} md={4} sm={6} xs={12} style={{ height: "10rem" }} >
        <Skeleton animation="wave" style={{ transform: "none", height: "100%" }} />
      </Grid>
      <Grid item xl={4} lg={4} md={4} sm={6} xs={12} style={{ height: "10rem" }} >
        <Skeleton animation="wave" style={{ transform: "none", height: "100%" }} />
      </Grid>
      <Grid item xl={4} lg={4} md={4} sm={6} xs={12} style={{ height: "10rem" }} >
        <Skeleton animation="wave" style={{ transform: "none", height: "100%" }} />
      </Grid>
    </Grid>
  );
};

export default DashboardSkeleton;
