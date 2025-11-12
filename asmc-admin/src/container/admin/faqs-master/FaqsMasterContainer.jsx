import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import FaqsTableComponent from "../../../components/admin/faqs-manager/FaqsTable";
import { FaqsAddDrawer } from "../../../components/admin/faqs-manager/FaqsAddDrawer";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetFaqsListQuery, useGetFaqsCategoriesQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import { defaultFormValueFaqs } from "../../../store/masters/mastersSlice";
import HasPermission from "../../../components/Common/HasPermission";

const FaqsManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: gallery, isFetching } = useGetFaqsListQuery({ ...pagination });
    const { data: categories = [] } = useGetFaqsCategoriesQuery();

    const handleAddFaqs = () => {
        props.changeMastersInitialState({
            showDrawer: true,
            formType: "Add",
            initialValues: defaultFormValueFaqs
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

    const handleFaqsEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        delete payload.activity_data;
        // Add newCategory field for edit form
        payload.newCategory = "";
        props.changeMastersInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Faqs</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <SearchRecords 
                            handlePagination={handlePagination} 
                            pagination={pagination} 
                            type="filter_by_with"
                            filterOptions={[
                                { label: "Any Word", value: "any_word" },
                                { label: "Question", value: "question" },
                                { label: "Answer", value: "answer" },
                                { label: "Category", value: "category" },
                                ...categories.map(cat => ({ label: cat, value: `category_${cat}` }))
                            ]}
                            filterLabel="Filter By"
                        />
                        <HasPermission permission={PERMISSIONS.CMS.FAQ.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddFaqs()}
                            >
                                Add new Faqs
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
                        <FaqsTableComponent fetching={isFetching} edit={(val, type) => handleFaqsEdit(val, type)} loading={isLoading} count={gallery?.count || 0} data={gallery?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>

            <FaqsAddDrawer show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} />

        </Stack >
    );
}

export default FaqsManagerContainer;