import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";

import CategoryTableComponent from "../../../components/admin/category-manager/CategoryTable";
import { CategoryAddDrawer } from "../../../components/admin/category-manager/CategoryAddDrawer";

import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetCategoryListQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const CategoryManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: category, isFetching } = useGetCategoryListQuery(pagination);

    const handleAddCategory = () => {
        props.changeCategoryInitialState({
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
        props.changeCategoryInitialState({ showDrawer: false, formType: "", initialValues: null })
    }

    const handleCategoryEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeCategoryInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Category</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.CATEGORY.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddCategory()}
                            >
                                Add new Category
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
                        <CategoryTableComponent edit={(val, type) => handleCategoryEdit(val, type)} loading={isLoading} fetching={isFetching} count={category?.count} data={category?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>
            <CategoryAddDrawer show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} />
        </Stack >
    );
}

export default CategoryManagerContainer;