import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import FeesCategoriesTableComponent from "../../../components/admin/fees-categories/FeesCategoriesTable";
import { FeesCategoryAddDrawer } from "../../../components/admin/fees-categories/FeesCategoriesAddDrawer";
import { useGetFeesCategoriesListQuery } from "../../../store/masters/mastersApis";
import { useSearchParams } from "react-router-dom";
import HasPermission from "../../../components/Common/HasPermission";

const FeesCategoriesContainer = (props) => {
    const [searchParams] = useSearchParams();
    const categoryType = searchParams.get('category_type');

    if (!categoryType) {
        props.navigate('/dashboard')
    }

    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: feesCategories, isFetching } = useGetFeesCategoriesListQuery({ ...pagination, category_type: categoryType });

    const handleAddFeesCategories = () => {
        props.changeInitialState({
            showDrawer: true,
            formType: "Add",
            initialValues: null
        })
    }

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, [])

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    }

    const handleDrawerClose = () => {
        props.changeInitialState({ showDrawer: false, formType: "", initialValues: null })
    }

    const handleFeesCategoriesEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Fees Categories for Events</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.EVENT.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddFeesCategories()}
                            >
                                Create New
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
                        <FeesCategoriesTableComponent
                            edit={(val, type) => handleFeesCategoriesEdit(val, type)}
                            loading={isLoading}
                            fetching={isFetching}
                            count={feesCategories?.count || 0}
                            data={feesCategories?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <FeesCategoryAddDrawer show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} categoryType={categoryType} getEventDropdown={props.getEventDropdown} />

            {/* <FeesAddDrawer show={showFeesDrawer} close={handleFeesDrawerClose} initialValues={initialValues} /> */}
        </Stack >
    );
}

export default FeesCategoriesContainer;