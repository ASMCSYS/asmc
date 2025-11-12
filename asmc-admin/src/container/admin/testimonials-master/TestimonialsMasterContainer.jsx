import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import TestimonialsTableComponent from "../../../components/admin/testimonials-manager/TestimonialsTable";
import { TestimonialsAddDrawer } from "../../../components/admin/testimonials-manager/TestimonialsAddDrawer";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetTestimonialsListQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import { defaultFormValueTestimonials } from "../../../store/masters/mastersSlice";
import HasPermission from "../../../components/Common/HasPermission";

const TestimonialsManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: gallery, isFetching } = useGetTestimonialsListQuery({ ...pagination });

    const handleAddTestimonials = () => {
        props.changeMastersInitialState({
            showDrawer: true,
            formType: "Add",
            initialValues: defaultFormValueTestimonials,
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

    const handleTestimonialsEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        delete payload.activity_data;
        props.changeMastersInitialState({ showDrawer: true, formType: type, initialValues: payload });
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Testimonials</Typography>
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
                        <HasPermission permission={PERMISSIONS.CMS.TESTIMONIAL.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddTestimonials()}
                            >
                                Add new Testimonials
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <TestimonialsTableComponent
                            fetching={isFetching}
                            edit={(val, type) => handleTestimonialsEdit(val, type)}
                            loading={isLoading}
                            count={gallery?.count || 0}
                            data={gallery?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                        />
                    </Paper>
                </Grid>
            </Grid>

            <TestimonialsAddDrawer
                show={showDrawer}
                close={handleDrawerClose}
                formType={formType}
                initialValues={initialValues}
                getMembersList={props.getMembersList}
            />
        </Stack>
    );
};

export default TestimonialsManagerContainer;
