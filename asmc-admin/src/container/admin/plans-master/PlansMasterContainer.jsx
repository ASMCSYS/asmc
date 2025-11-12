import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import PlansTableComponent from "../../../components/admin/plans-manager/PlansTable";
import { PlansAddDrawer } from "../../../components/admin/plans-manager/PlansAddDrawer";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetPlansListQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const PlansManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const [planType, setPlanType] = React.useState("all");
    const {
        isLoading,
        data: plans,
        isFetching,
    } = useGetPlansListQuery({ ...pagination, plan_type: planType === "all" ? undefined : planType });

    const handleAddPlans = () => {
        props.changeMastersInitialState({
            showDrawer: true,
            formType: "Add",
        });
    };

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, []);

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    const handleDrawerClose = () => {
        props.changeMastersInitialState({ showDrawer: false, formType: "", initialValues: {} });
    };

    const handlePlansEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeMastersInitialState({ showDrawer: true, formType: type, initialValues: payload });
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Plans</Typography>
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
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.PLANS.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddPlans()}
                            >
                                Add new Plans
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container gap={10} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                <Grid item display={"flex"} flexDirection={"row"} gap={1}>
                    <Grid item display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"}>
                        <Typography variant="subtitle2" color="textPrimary">
                            Batch Type{" "}
                        </Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={planType}
                            exclusive
                            onChange={(e, val) => setPlanType(val ? val : "all")}
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
                            <ToggleButton value="membership" aria-label="" sx={{ px: 2 }}>
                                Membership
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <PlansTableComponent
                            fetching={isFetching}
                            edit={(val, type) => handlePlansEdit(val, type)}
                            loading={isLoading}
                            count={plans?.count || 0}
                            data={plans?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                        />
                    </Paper>
                </Grid>
            </Grid>

            <PlansAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
            />
        </Stack>
    );
};

export default PlansManagerContainer;
