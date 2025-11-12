import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import TeamsTableComponent from "../../../components/admin/teams-manager/TeamsTable";
import { TeamsAddDrawer } from "../../../components/admin/teams-manager/TeamsAddDrawer";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetTeamsListQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const TeamsManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: teams, isFetching } = useGetTeamsListQuery(pagination);

    const handleAddTeams = () => {
        props.changeTeamsInitialState({
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
        props.changeTeamsInitialState({ showDrawer: false, formType: "", initialValues: null })
    }

    const handleTeamsEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeTeamsInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Teams</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <HasPermission permission={PERMISSIONS.CMS.TEAM.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddTeams()}
                            >
                                Add new Teams
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
                        <TeamsTableComponent edit={(val, type) => handleTeamsEdit(val, type)} loading={isLoading} fetching={isFetching} count={teams?.count} data={teams?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>
            <TeamsAddDrawer show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} />
        </Stack >
    );
}

export default TeamsManagerContainer;