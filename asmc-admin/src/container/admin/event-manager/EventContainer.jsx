import React, { useEffect } from 'react';
import { Button, Grid, Paper, Stack, Typography } from '@mui/material';

import { SearchRecords } from '../../../components/Common/SearchRecords';
import { useGetEventListQuery } from '../../../store/events/eventsApis';
import { defaultPaginate, PERMISSIONS } from '../../../helpers/constants';
import EventsTableComponent from '../../../components/admin/events-manager/EventsTable';
import { EventsAddDrawer } from '../../../components/admin/events-manager/EventsAddDrawer';
import HasPermission from '../../../components/Common/HasPermission';

const EventsContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: events, isFetching } = useGetEventListQuery(pagination);

    useEffect(() => {
        props.handlePaginationState({ ...defaultPaginate, sortField: 'event_id' });
    }, []);

    const handleAddEvent = () => {
        props.changeEventInitialState({
            showDrawer: true,
            formType: 'Add',
        });
    };

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    const handleDrawerClose = () => {
        props.changeEventInitialState({
            showDrawer: false,
            formType: '',
            initialValues: null,
        });
    };

    const handleEventEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeEventInitialState({
            showDrawer: true,
            formType: type,
            initialValues: payload,
        });
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: '24px', padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: 'center' }}>
                        <Typography variant="h6">List of Events</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sx={{ alignSelf: 'center' }}
                        display={'flex'}
                        flexDirection={'row'}
                        justifyContent={'flex-end'}
                    >
                        {/* <Button
                            disableElevation
                            variant="contained"
                            sx={{ borderRadius: '50px', marginRight: 2 }}
                            onClick={() =>
                                props.navigate('/fees-categories?category_type=events')
                            }
                        >
                            Fees Categories
                        </Button> */}
                        <SearchRecords
                            handlePagination={handlePagination}
                            pagination={pagination}
                        />
                        <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.EVENT.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: '50px', marginLeft: 2 }}
                                onClick={() => handleAddEvent()}
                            >
                                Create Events
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper
                        sx={{ p: 2, color: '#071B2A', fontWeight: '400' }}
                        elevation={0}
                    >
                        <EventsTableComponent
                            edit={(val, type) => handleEventEdit(val, type)}
                            loading={isLoading}
                            fetching={isFetching}
                            count={events?.count || 0}
                            data={events?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <EventsAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
                getActiveLocationList={props.getActiveLocationList}
            />

            {/* <FeesAddDrawer show={showFeesDrawer} close={handleFeesDrawerClose} initialValues={initialValues} /> */}
        </Stack>
    );
};

export default EventsContainer;
