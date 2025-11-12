import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import LocationTableComponent from "../../../components/admin/location-manager/LocationTable";
import { LocationAddDrawer } from "../../../components/admin/location-manager/LocationAddDrawer";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetLocationListQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const LocationManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: location, isFetching } = useGetLocationListQuery(pagination);

    const handleAddLocation = () => {
        props.changeLocationInitialState({
            showDrawer: true,
            formType: "Add",
            initialValues: null
        })
    }

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, [])

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    }

    const handleDrawerClose = () => {
        props.changeLocationInitialState({ showDrawer: false, formType: "", initialValues: null })
    }

    const handleLocationEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeLocationInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Location</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.LOCATION.CREATE}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddLocation()}
                            >
                                Add new Location
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper
                        sx={{ p: 2, color: "#071B2A", fontWeight: "400" }}
                        elevation={0}
                    >
                        <LocationTableComponent edit={(val, type) => handleLocationEdit(val, type)} loading={isLoading} fetching={isFetching} count={location?.count} data={location?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>
            <LocationAddDrawer show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} />
        </Stack >
    );
}

export default LocationManagerContainer;