import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetHallListQuery } from "../../../store/halls/hallsApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import HallsTableComponent from "../../../components/admin/halls-manager/HallsTable";
import { HallsAddDrawer } from "../../../components/admin/halls-manager/HallsAddDrawer";
import HasPermission from "../../../components/Common/HasPermission";

const HallContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: halls, isFetching } = useGetHallListQuery(pagination);

    useEffect(() => {
        props.handlePaginationState({ ...defaultPaginate, sortField: "hall_id" });
    }, []);

    const handleAddHall = () => {
        props.changeHallInitialState({
            showDrawer: true,
            formType: "Add",
        });
    };

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    const handleDrawerClose = () => {
        props.changeHallInitialState({ showDrawer: false, formType: "", initialValues: null });
    };

    const handleHallEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeHallInitialState({ showDrawer: true, formType: type, initialValues: payload });
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Hall</Typography>
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
                        <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.HALL.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddHall()}
                            >
                                Create Hall
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <HallsTableComponent
                            edit={(val, type) => handleHallEdit(val, type)}
                            loading={isLoading}
                            fetching={isFetching}
                            count={halls?.count || 0}
                            data={halls?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <HallsAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
                getActiveLocationList={props.getActiveLocationList}
            />
        </Stack>
    );
};

export default HallContainer;
