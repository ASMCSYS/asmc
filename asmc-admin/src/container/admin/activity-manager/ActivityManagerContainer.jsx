import React, { useEffect, useState } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import ActivityTableComponent from "../../../components/admin/activity-manager/ActivityTable";
import { ActivityAddDrawer } from "../../../components/admin/activity-manager/ActivityAddDrawer";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetActivityListQuery } from "../../../store/activity/activityApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import { GenerateBookingSlot } from "../../../components/admin/activity-manager/GenerateBookingSlot";
import HasPermission from "../../../components/Common/HasPermission";

const ActivityManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: activities, isFetching } = useGetActivityListQuery({ ...pagination });
    const [showGenerateSlot, setShowGenerateSlot] = useState(false);

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, []);

    const handleAddActivity = () => {
        props.changeActivityInitialState({
            showDrawer: true,
            formType: "Add",
        });
    };

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    const handleDrawerClose = () => {
        setShowGenerateSlot(false);
        props.changeActivityInitialState({ showDrawer: false, formType: "", initialValues: null });
    };

    const handleGenerateSlot = (data) => {
        let payload = { ...data };
        delete payload.createdAt;
        setShowGenerateSlot(true);
        props.changeActivityInitialState({ initialValues: payload });
    };

    const handleActivityEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeActivityInitialState({ showDrawer: true, formType: type, initialValues: payload });
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Activity</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sx={{ alignSelf: "center" }}
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"flex-end"}
                    >
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.ACTIVITY.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddActivity()}
                            >
                                Add new Activity
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <ActivityTableComponent
                            handleGenerateSlot={handleGenerateSlot}
                            edit={(val, type) => handleActivityEdit(val, type)}
                            loading={isLoading}
                            fetching={isFetching}
                            count={activities?.count}
                            data={activities?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <ActivityAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
            />
            <GenerateBookingSlot
                show={showGenerateSlot}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
            />
        </Stack>
    );
};

export default ActivityManagerContainer;
