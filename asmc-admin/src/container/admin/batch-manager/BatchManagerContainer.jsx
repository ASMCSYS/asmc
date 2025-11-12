import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

import BatchTableComponent from "../../../components/admin/batch-manager/BatchTable";
import { BatchAddDrawer } from "../../../components/admin/batch-manager/BatchAddDrawer";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetBatchListQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const BatchManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const [batchType, setBatchType] = React.useState("all");
    const [activeFilter, setActiveFilter] = React.useState("true");
    const {
        isLoading,
        data: batch,
        isFetching,
    } = useGetBatchListQuery({ ...pagination, batch_type: batchType, active: activeFilter });

    const handleAddBatch = () => {
        props.changeBatchInitialState({
            showDrawer: true,
            formType: "Add",
            initialValues: null,
        });
    };

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, []);

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    const handleDrawerClose = () => {
        props.changeBatchInitialState({ showDrawer: false, formType: "", initialValues: null });
    };

    const handleBatchEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeBatchInitialState({ showDrawer: true, formType: type, initialValues: payload });
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Batch</Typography>
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
                        <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.BATCH.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddBatch()}
                            >
                                Add new Batch
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container gap={10} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                <Grid item display={"flex"} flexDirection={"row"} gap={2}>
                    <Grid item display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"}>
                        <Typography variant="subtitle2" color="textPrimary">
                            Batch Type{" "}
                        </Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={batchType}
                            exclusive
                            onChange={(e, val) => setBatchType(val ? val : "all")}
                            aria-label="image"
                            size="small"
                        >
                            <ToggleButton value="all" aria-label="all" sx={{ px: 2 }}>
                                All
                            </ToggleButton>
                            <ToggleButton value="enrollment" aria-label="" sx={{ px: 2 }}>
                                Enrollment
                            </ToggleButton>
                            <ToggleButton value="booking" aria-label="" sx={{ px: 2 }}>
                                Booking
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item display="flex" alignItems="center" gap={0}>
                        <Typography variant="subtitle2" color="textSecondary" minWidth={100}>
                            Active Filter:
                        </Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={activeFilter}
                            exclusive
                            onChange={(e, val) => setActiveFilter(val ? val : "true")}
                            aria-label="active filter"
                            size="small"
                        >
                            <ToggleButton value="true" aria-label="active">
                                Active
                            </ToggleButton>
                            <ToggleButton value="false" aria-label="not active">
                                Not Active
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <BatchTableComponent
                            edit={(val, type) => handleBatchEdit(val, type)}
                            loading={isLoading}
                            fetching={isFetching}
                            count={batch?.count}
                            data={batch?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <BatchAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
                getActivityList={props.getActivityList}
                getActiveLocationList={props.getActiveLocationList}
            />
        </Stack>
    );
};

export default BatchManagerContainer;
