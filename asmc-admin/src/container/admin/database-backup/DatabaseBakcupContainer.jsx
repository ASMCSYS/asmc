import React, { useEffect, useState } from "react";
import { Grid, Paper, Stack, Typography } from "@mui/material";

import { defaultPaginate, PERMISSIONS } from "../../../helpers/constants";
import { useGenerateNewDatabaseBackupMutation, useGetDatabaseBackupListQuery } from "../../../store/common/commonApis";
import BackupTableComponent from "../../../components/admin/database-backup/BackupTable";
import Button from "../../../components/Common/Button";
import HasPermission from "../../../components/Common/HasPermission";

const ActivityManagerContainer = (props) => {
    const { pagination } = props;
    const { isLoading, data, isFetching } = useGetDatabaseBackupListQuery({ ...pagination });
    const [generateBackup, { isLoading: isLoadingBackup }] = useGenerateNewDatabaseBackupMutation();

    useEffect(() => {
        props.handlePaginationState(defaultPaginate);
    }, []);

    const handlePagination = (setting) => {
        props.handlePaginationState(setting);
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">List of Activity</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sx={{ alignSelf: "center" }}
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"flex-end"}
                    >
                        <HasPermission permission={PERMISSIONS.SETTINGS.READ} fallback={null}>
                            <Button
                                variant="contained"
                                fullWidth={false}
                                onClick={() => generateBackup()}
                                loading={isLoadingBackup}
                            >
                                Generate Backup
                            </Button>
                        </HasPermission>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <BackupTableComponent
                            loading={isLoading}
                            fetching={isFetching}
                            count={data?.count}
                            data={data?.result || []}
                            pagination={pagination}
                            handlePagination={(val) => handlePagination(val)}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default ActivityManagerContainer;
