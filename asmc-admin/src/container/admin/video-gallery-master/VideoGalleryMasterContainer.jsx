import React, { useEffect } from "react";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import VideoGalleryTableComponent from "../../../components/admin/video-gallery-manager/VideoGalleryTable";
import { VideoGalleryAddDrawer } from "../../../components/admin/video-gallery-manager/VideoGalleryAddDrawer";
import { SearchRecords } from "../../../components/Common/SearchRecords";
import { useGetGalleryListQuery } from "../../../store/masters/mastersApis";
import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const VideoGalleryManagerContainer = (props) => {
    const { showDrawer, formType, initialValues, pagination } = props;
    const { isLoading, data: gallery, isFetching } = useGetGalleryListQuery({ ...pagination, type: "video" });

    const handleAddVideoGallery = () => {
        props.changeMastersInitialState({
            showDrawer: true,
            formType: "Add",
            initialValues: {
                url: ""
            }
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

    const handleVideoGalleryEdit = (data, type) => {
        let payload = { ...data };
        delete payload.createdAt;
        props.changeMastersInitialState({ showDrawer: true, formType: type, initialValues: payload })
    }

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Video Gallery</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ alignSelf: "center" }} display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                        <SearchRecords handlePagination={handlePagination} pagination={pagination} />
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.VIDEO_GALLERY.CREATE} fallback={null}>
                            <Button
                                disableElevation
                                variant="contained"
                                sx={{ borderRadius: "50px", marginLeft: 2 }}
                                onClick={() => handleAddVideoGallery()}
                            >
                                Add new Video Gallery
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
                        <VideoGalleryTableComponent fetching={isFetching} edit={(val, type) => handleVideoGalleryEdit(val, type)} loading={isLoading} count={gallery?.count || 0} data={gallery?.result || []} pagination={pagination} handlePagination={(val) => handlePagination(val)} />
                    </Paper>
                </Grid>
            </Grid>

            <VideoGalleryAddDrawer show={showDrawer} close={handleDrawerClose} formType={formType} initialValues={initialValues} />

        </Stack >
    );
}

export default VideoGalleryManagerContainer;