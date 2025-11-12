import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import EnrollActivityTableComponent from "../../../components/admin/enroll-activity-manager/EnrollActivityTable";
import { EnrollActivityAddDrawer } from "../../../components/admin/enroll-activity-manager/EnrollActivityAddDrawer";

import { useGetBookingListQuery } from "../../../store/booking/bookingApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import ExportData from "../../../components/Common/ExportData";
import { TableFilter } from "../../../components/Common/TableFilter";
import HasPermission from "../../../components/Common/HasPermission";

const EnrollActivityContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: bookings, isFetching, refetch } = useGetBookingListQuery({ ...pagination, type: "enrollment" });

    useEffect(() => {
        props.handlePaginationState({ ...defaultPaginate, sortField: "booking_id" });
    }, [])

    const handleAddEnrollActivity = () => {
        props.changeBookingInitialState({
            showDrawer: true,
            formType: "Add"
        })
    }

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    }

    const handleDrawerClose = () => {
        props.changeBookingInitialState({ showDrawer: false, formType: "", initialValues: null })
    }

    const handleEnrollActivityEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeBookingInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Enrolled Activity</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <HasPermission permission={PERMISSIONS.ORDERS.ENROLL_ACTIVITY.EXPORT_DATA} fallback={null}>
                            <ExportData type="enrollment" />
                        </HasPermission>
                        <HasPermission permission={PERMISSIONS.ORDERS.ENROLL_ACTIVITY.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddEnrollActivity()}
                            >
                                Enroll new activity
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <TableFilter
                handlePagination={handlePagination}
                pagination={pagination}
            />

            <Grid container>
                <Grid item xs={12}>
                    <Paper
                        sx={{ p: 2, color: "#071B2A", fontWeight: "400" }}
                        elevation={0}
                    >
                        <EnrollActivityTableComponent refetch={refetch} type="enrollment" edit={(val, type) => handleEnrollActivityEdit(val, type)} loading={isLoading} fetching={isFetching} count={bookings?.count} data={bookings?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>
            <EnrollActivityAddDrawer type="enrollment" show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} getActivityList={props.getActivityList} getMembersList={props.getMembersList} />
        </Stack >
    );
}

export default EnrollActivityContainer;