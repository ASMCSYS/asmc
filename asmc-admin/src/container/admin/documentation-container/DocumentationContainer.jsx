import React from "react";
import { Paper, Typography, Grid, Stack } from "@mui/material";
import DocumentationManager from "../../../components/admin/documentation-manager/DocumentationManager";
import HasPermission from "../../../components/Common/HasPermission";
import { PERMISSIONS } from "../../../helpers/constants";

const DocumentationContainer = (props) => {
    console.log("DocumentationContainer - props:", props);
    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">System Documentation</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, color: "#071B2A", fontWeight: "400" }} elevation={0}>
                        <HasPermission permission={PERMISSIONS.DOCUMENTATION.READ} fallback={null}>
                            <DocumentationManager {...props} />
                        </HasPermission>
                    </Paper>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default DocumentationContainer;
