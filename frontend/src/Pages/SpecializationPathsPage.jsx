import React, { useEffect, useState } from "react";
// import SearchPaths from '../Components/SearchPaths'
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";
import { fetchDetails } from "../Actions/PathsDetailsActions";

function SpecializationPathsPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDetails());
  }, []);
  const { paths, loading } = useSelector((state) => ({
    paths: state.pathDetails.paths,
    loading: state.pathDetails.loading,
  }));
  return (
    <>
      <div>SpecializationPathsPage</div>
      <Grid container columns={12}>
        {!loading ? (
          Object.keys(paths).map((key) => (
            <Grid item xs={6}>
              <Card sx={{height:"500px"}}>
                <CardMedia
                  component="img"
                  sx={{ "object-fit": "fill" }}
                  // image={`data:image/png;base64,${details['photo']}`}

                  image={`data:image/png;base64,${paths[key]}`}
                  alt="DP"
                  // onClick={handleChangeProfile}
                />
				<CardContent>
					<Typography>
						{key}
					</Typography>
				</CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <>Loading!!!</>
        )}
      </Grid>
    </>
  );
}

export default SpecializationPathsPage;
