import React from "react";
import { Box, Grid, Card, CardContent, Typography, Chip, Button, IconButton, Alert, Skeleton } from "@mui/material";
import {
    Download as DownloadIcon,
    Visibility as ViewIcon,
    GridView as GridViewIcon,
    ViewList as ListViewIcon,
    Refresh as RefreshIcon,
    KeyboardBackspace as BackIcon,
} from "@mui/icons-material";
import {
    useGetDocumentationListQuery,
    useGetDocumentationComponentQuery,
    useDownloadDocumentationMutation,
} from "../../../store/documentation/documentationApis";
import { parseDocumentationList, parseDocumentationComponent } from "../../../store/documentation/documentationParser";
import DocumentationCard from "./DocumentationCard";
import DocumentationListView from "./DocumentationListView";

const DocumentationManager = (props) => {
    const {
        selectedComponent,
        selectedFile,
        viewMode,
        setSelectedComponent,
        setSelectedFile,
        setViewMode,
        clearSelection,
    } = props;

    // API queries
    const {
        data: documentationListData,
        isLoading: isLoadingList,
        error: listError,
        refetch: refetchList,
    } = useGetDocumentationListQuery();

    const {
        data: componentData,
        isLoading: isLoadingComponent,
        error: componentError,
    } = useGetDocumentationComponentQuery(selectedComponent, {
        skip: !selectedComponent,
    });

    const [downloadDocumentation] = useDownloadDocumentationMutation();

    // Parse data
    const documentationList = parseDocumentationList(documentationListData);
    const componentInfo = parseDocumentationComponent(componentData);

    // Handlers
    const handleComponentSelect = (componentKey) => {
        if (setSelectedComponent && typeof setSelectedComponent === "function") {
            setSelectedComponent(componentKey);
        }
        if (setSelectedFile && typeof setSelectedFile === "function") {
            setSelectedFile(null);
        }
    };

    const handleDownloadFile = async (component, filename, format = "pdf") => {
        // Use selectedComponent if component is undefined
        const actualComponent = component || selectedComponent;

        if (!actualComponent) {
            alert("No component selected. Please select a documentation component first.");
            return;
        }

        try {
            // Handle PDF download
            await handleDownloadPDF(actualComponent, filename);
        } catch (error) {
            console.error("Download failed:", error);
            alert(`Download failed: ${error.message || "Unknown error"}`);
        }
    };

    const handleDownloadPDF = async (component, filename) => {
        try {
            await downloadDocumentation({
                component,
                filename,
                format: "pdf",
            }).unwrap();
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert("Error downloading PDF. Please try again.");
        }
    };

    const handleRefresh = () => {
        refetchList();
        if (clearSelection && typeof clearSelection === "function") {
            clearSelection();
        }
    };

    const handleBackToComponents = () => {
        if (clearSelection && typeof clearSelection === "function") {
            clearSelection();
        }
    };

    const toggleViewMode = () => {
        if (setViewMode && typeof setViewMode === "function") {
            setViewMode(viewMode === "grid" ? "list" : "grid");
        }
    };

    // Render loading state
    if (isLoadingList) {
        return (
            <Box>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Skeleton variant="text" width="80%" height={32} />
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    // Render error state
    if (listError) {
        return (
            <Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load documentation: {listError?.data?.message || listError?.message}
                </Alert>
                <Button variant="contained" onClick={handleRefresh} startIcon={<RefreshIcon />}>
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header Actions */}
            <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                <Button variant="outlined" onClick={handleRefresh} startIcon={<RefreshIcon />}>
                    Refresh
                </Button>
            </Box>
            {selectedComponent && componentInfo ? (
                <Box>
                    {/* Component Header */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <IconButton
                                onClick={handleBackToComponents}
                                sx={{ mr: 2 }}
                                title="Back to all documentation"
                            >
                                <BackIcon />
                            </IconButton>
                            <Typography variant="h5">{componentInfo.name}</Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {componentInfo.description}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                            {componentInfo.techStack.map((tech) => (
                                <Chip key={tech} label={tech} size="small" variant="outlined" />
                            ))}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            {componentInfo.totalFiles} files available
                        </Typography>
                    </Box>

                    {/* File List */}
                    <DocumentationCard
                        files={componentInfo.files}
                        onDownload={handleDownloadFile}
                        isLoading={isLoadingComponent}
                        component={selectedComponent}
                    />
                </Box>
            ) : (
                /* Documentation Overview */
                <Box>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                        Available Documentation Components
                    </Typography>
                    <Grid container spacing={3}>
                        {documentationList.map((component) => (
                            <Grid item xs={12} sm={6} md={4} key={component.key}>
                                <Card
                                    sx={{
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: 4,
                                        },
                                    }}
                                    onClick={() => handleComponentSelect(component.key)}
                                >
                                    <CardContent>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                            <Typography variant="h4" sx={{ mr: 2 }}>
                                                {component.icon}
                                            </Typography>
                                            <Typography variant="h6" component="div">
                                                {component.name}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {component.description}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Chip
                                                label={`${component.files.length} files`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                            <Button
                                                size="small"
                                                startIcon={<ViewIcon />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleComponentSelect(component.key);
                                                }}
                                            >
                                                View
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default DocumentationManager;
