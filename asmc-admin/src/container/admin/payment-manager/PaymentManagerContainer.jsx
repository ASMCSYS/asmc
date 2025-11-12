import React, { useEffect } from "react";
import { Grid, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import PaymentTableComponent from "../../../components/admin/payment-manager/PaymentTable";
import { useGetPaymentHistoryListQuery } from "../../../store/common/commonApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import HasPermission from "../../../components/Common/HasPermission";

const MembersManagerContainer = (props) => {
    const { pagination } = props;
    const [paymentType, setPaymentType] = React.useState("Success");
    const {
        isLoading,
        data: paymentHistory,
        isFetching,
    } = useGetPaymentHistoryListQuery({ ...pagination, payment_status: paymentType });

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, []);

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Payment Request</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sx={{ alignSelf: "center" }}
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"flex-end"}
                    >
                        <SearchRecords
                            handlePagination={handlePagination}
                            pagination={pagination}
                            type="filter_by_with"
                            filterOptions={[
                                { label: "Any Word", value: "any_word" },
                                { label: "Member Id", value: "member_id" },
                                // { label: "Booking Id", value: "order_id" },
                                { label: "Payment Id", value: "payment_id" },
                            ]}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Grid container gap={10} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                <Grid item display={"flex"} flexDirection={"row"} gap={1}>
                    <Grid item display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"}>
                        <Typography variant="subtitle2" color="textPrimary">
                            Payment Type{" "}
                        </Typography>
                        <ToggleButtonGroup
                            color="primary"
                            value={paymentType}
                            exclusive
                            onChange={(e, val) => setPaymentType(val ? val : "success")}
                            aria-label="image"
                            size="small"
                        >
                            <ToggleButton value="Success" aria-label="" sx={{ px: 2 }}>
                                Success
                            </ToggleButton>
                            <ToggleButton value="Failed" aria-label="" sx={{ px: 2 }}>
                                Failed
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <PaymentTableComponent
                            loading={isLoading}
                            fetching={isFetching}
                            count={paymentHistory?.count || 0}
                            data={paymentHistory?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                            getActivityList={props.getActivityList}
                            getMembersList={props.getMembersList}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default MembersManagerContainer;
