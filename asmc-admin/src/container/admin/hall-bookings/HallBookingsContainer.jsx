import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import HallBookingTableComponent from "../../../components/admin/hall-booking-manager/HallBookingTable";
import { HallBookingAddDrawer } from "../../../components/admin/hall-booking-manager/HallBookingAddDrawer";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import { useGetHallBookingListQuery } from "../../../store/halls/hallsApis";
import HasPermission from "../../../components/Common/HasPermission";

const HallBookingsContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: bookings, isFetching, refetch } = useGetHallBookingListQuery(pagination);

    useEffect(() => {
        props.handlePaginationState({ ...defaultPaginate, sortField: "booking_id" });
    }, []);

    const handleAddBooking = () => {
        props.changeBookingInitialState({
            showDrawer: true,
            formType: "Add",
            initialValues: null,
        });
    };

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    const handleDrawerClose = () => {
        props.changeBookingInitialState({ showDrawer: false, formType: "", initialValues: null });
    };

    const handleBookingEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeBookingInitialState({ showDrawer: true, formType: type, initialValues: payload });
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Hall Bookings</Typography>
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
                        <HasPermission permission={PERMISSIONS.ORDERS.HALL_BOOKING.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddBooking()}
                            >
                                Create Booking
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <HallBookingTableComponent
                            edit={(val, type) => handleBookingEdit(val, type)}
                            loading={isLoading}
                            fetching={isFetching}
                            count={bookings?.count}
                            data={bookings?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                            refetch={refetch}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <HallBookingAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
                getHallsList={props.getHallsList}
                getMembersList={props.getMembersList}
            />
        </Stack>
    );
};

export default HallBookingsContainer;
