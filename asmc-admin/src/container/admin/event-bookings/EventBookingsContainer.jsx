import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import EventBookingTableComponent from "../../../components/admin/event-booking-manager/EventBookingTable";
import { EventBookingAddDrawer } from "../../../components/admin/event-booking-manager/EventBookingAddDrawer";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import { useGetEventBookingListQuery } from "../../../store/events/eventsApis";
import HasPermission from "../../../components/Common/HasPermission";

const EventBookingsContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: bookings, isFetching, refetch } = useGetEventBookingListQuery(pagination);

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
                        <Typography variant="h6">List of Event Bookings</Typography>
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
                        <HasPermission permission={PERMISSIONS.ORDERS.EVENT_BOOKING.CREATE} fallback={null}>
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
                        <EventBookingTableComponent
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
            <EventBookingAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
                getEventsList={props.getEventsList}
                getMembersList={props.getMembersList}
            />
        </Stack>
    );
};

export default EventBookingsContainer;
