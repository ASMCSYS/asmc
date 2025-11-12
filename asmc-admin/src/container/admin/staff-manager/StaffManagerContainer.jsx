import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Grid, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import StaffTableComponent from "../../../components/admin/staff-manager/StaffTableComponent";
import { StaffAddDrawer } from "../../../components/admin/staff-manager/StaffAddDrawer.jsx";
import { useDispatch } from "react-redux";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import { useGetStaffListQuery } from "../../../store/staff/staffApis";
import HasPermission from "../../../components/Common/HasPermission";

const StaffManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const [activeFilter, setActiveFilter] = useState("true");

    const {
        isLoading,
        data: staff,
        refetch,
        isFetching,
    } = useGetStaffListQuery({ ...pagination, active: activeFilter });

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, []);

    const handleAddStaff = () => {
        props.changeStaffInitialState({
            showDrawer: true,
            formType: "Add",
        });
    };

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    const handleDrawerClose = () => {
        props.changeStaffInitialState({ showDrawer: false, formType: "", initialValues: null });
    };

    const handleStaffEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeStaffInitialState({ showDrawer: true, formType: type, initialValues: payload });
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Staff</Typography>
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
                        <HasPermission permission={PERMISSIONS.STAFF.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddStaff()}
                            >
                                Add new Staff
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container direction="column" gap={2}>
                    <Typography variant="subtitle1" color="textPrimary">
                        Filters
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Active Filter */}
                        <Grid item display="flex" alignItems="center" gap={2}>
                            <Typography variant="subtitle2" color="textSecondary" minWidth={100}>
                                Active Filter:
                            </Typography>
                            <ToggleButtonGroup
                                color="primary"
                                value={activeFilter}
                                exclusive
                                onChange={(e, val) => setActiveFilter(val ? val : null)}
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
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <StaffTableComponent
                            edit={(val, type) => handleStaffEdit(val, type)}
                            loading={isLoading}
                            fetching={isFetching}
                            count={staff?.count || 0}
                            data={staff?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                            getStaffList={props.getStaffList}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <StaffAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
            />
            {/* <StaffCard show={Boolean(generateCard)} data={generateCard} close={() => setGenerateCard(false)} /> */}
        </Stack>
    );
};

export default StaffManagerContainer;
