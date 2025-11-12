import React from "react";
import { Grid, Card, CardContent, Typography, Box, Chip, Skeleton, Button } from "@mui/material";
import { Description as FileIcon, PictureAsPdf as PdfIcon } from "@mui/icons-material";

const DocumentationCard = ({ files, onDownload, isLoading, component }) => {
    if (isLoading) {
        return (
            <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="text" width="80%" height={24} />
                                <Skeleton variant="text" width="60%" height={20} />
                                <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (!files || files.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    No documentation files found
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            {files.map((file, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                        sx={{
                            transition: "all 0.2s",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: 3,
                            },
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <FileIcon sx={{ mr: 1, color: "primary.main" }} />
                                <Typography variant="h6" component="div" noWrap>
                                    {file.name}
                                </Typography>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {file.filename}
                            </Typography>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Chip label={file.formattedSize} size="small" variant="outlined" color="info" />
                                <Typography variant="caption" color="text.secondary">
                                    Modified: {file.formattedModified}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    startIcon={<PdfIcon />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDownload(component, file.name, "pdf");
                                    }}
                                    sx={{ minWidth: 120 }}
                                >
                                    Download PDF
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default DocumentationCard;
