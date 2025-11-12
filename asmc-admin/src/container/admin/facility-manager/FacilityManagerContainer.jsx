import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import FacilityTableComponent from "../../../components/admin/facility-manager/FacilityTable";
import { FacilityAddDrawer } from "../../../components/admin/facility-manager/FacilityAddDrawer";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetFacilityListQuery } from "../../../store/facility/facilityApis";
import { defaultPaginate } from "../../../helpers/constants";

const FacilityManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: facility, isFetching } = useGetFacilityListQuery(pagination);

    const handleAddFacility = () => {
        props.changeFacilityInitialState({
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
        props.changeFacilityInitialState({ showDrawer: false, formType: "", initialValues: null })
    }

    const handleFacilityEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeFacilityInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Facility</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <Button
                            disableElevation
                            variant="contained"
                            sx={{ borderRadius: "50px", marginLeft: 2 }}
                            onClick={() => handleAddFacility()}
                        >
                            Add new Facility
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper
                        sx={{ p: 2, color: "#071B2A", fontWeight: "400" }}
                        elevation={0}
                    >
                        <FacilityTableComponent edit={(val, type) => handleFacilityEdit(val, type)} loading={isLoading} fetching={isFetching} count={facility?.count} data={facility?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>
            <FacilityAddDrawer show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} />
        </Stack >
    );
}

export default FacilityManagerContainer;