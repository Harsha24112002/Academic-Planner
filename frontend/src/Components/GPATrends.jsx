import { Card, CardContent, CardMedia, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";

function GPATrends() {
  return (
    <Grid container spacing={2} columns={12} marginTop={-15}>
      <Grid item xs={6}>
        <Skeleton sx={{height:420}} animation="wave"></Skeleton>
      </Grid>
      <Grid item xs={6}>
      <Skeleton sx={{height:420}} animation="wave"></Skeleton>
      </Grid>
    </Grid>
  );
}

export default GPATrends;
