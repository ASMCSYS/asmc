import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import NoticeTableComponent from "../../../components/admin/notice-manager/NoticeTable";
import { NoticeAddDrawer } from "../../../components/admin/notice-manager/NoticeAddDrawer";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetNoticeListQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import { defaultFormValueNotice } from "../../../store/masters/mastersSlice";
import HasPermission from "../../../components/Common/HasPermission";

const NoticeContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: gallery, isFetching } = useGetNoticeListQuery({ ...pagination });

    const handleAddNotice = () => {
        props.changeMastersInitialState({
            showDrawer: true,
            formType: "Add",
            initialValues: defaultFormValueNotice
        })
    }

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, [])

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    }

    const handleDrawerClose = () => {
        props.changeMastersInitialState({ showDrawer: false, formType: "", initialValues: {} })
    }

    const handleNoticeEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        delete payload.activity_data;
        props.changeMastersInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Notice</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <HasPermission permission={PERMISSIONS.NOTICE.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddNotice()}
                            >
                                Add new Notice
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper
                        sx={{ p: 2, color: "#071B2A", fontWeight: "400" }}
                        elevation={0}
                    >
                        <NoticeTableComponent fetching={isFetching} edit={(val, type) => handleNoticeEdit(val, type)} loading={isLoading} count={gallery?.count || 0} data={gallery?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>

            <NoticeAddDrawer show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} getActivityList={props.getActivityList} getMembersList={props.getMembersList} getBatchList={props.getBatchList} />

        </Stack >
    );
}

export default NoticeContainer;