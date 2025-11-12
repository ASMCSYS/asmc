import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import BannerTableComponent from "../../../components/admin/banner-manager/BannerTable";
import { BannerAddDrawer } from "../../../components/admin/banner-manager/BannerAddDrawer";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetBannerListQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const BannerManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: gallery, isFetching } = useGetBannerListQuery(pagination);

    const handleAddBanner = () => {
        props.changeMastersInitialState({
            showDrawer: true,
            formType: "Add"
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

    const handleBannerEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeMastersInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Banner</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.BANNER.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddBanner()}
                            >
                                Add new Banner
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
                        <BannerTableComponent fetching={isFetching} edit={(val, type) => handleBannerEdit(val, type)} loading={isLoading} count={gallery?.count || 0} data={gallery?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>

            <BannerAddDrawer show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} />
        </Stack >
    );
}

export default BannerManagerContainer;