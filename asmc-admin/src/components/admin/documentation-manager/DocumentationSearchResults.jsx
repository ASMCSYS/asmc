import React from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Skeleton,
    CircularProgress,
} from "@mui/material";
import {
    ExpandMore as ExpandMoreIcon,
    Download as DownloadIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    Description as FileIcon,
} from "@mui/icons-material";

const DocumentationSearchResults = ({ searchResults, onComponentSelect, onFileSelect, onDownload, isLoading }) => {
    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SearchIcon sx={{ mr: 1 }} />
                    <Skeleton variant="text" width={200} height={32} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        Searching...
                    </Typography>
                </Box>
                {[1, 2, 3].map((index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                            <Skeleton variant="text" width="80%" height={24} />
                            <Skeleton variant="text" width="60%" height={20} />
                            <Skeleton variant="rectangular" height={40} sx={{ mt: 1 }} />
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    }

    if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <SearchIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No results found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try different keywords or check your spelling
                </Typography>
            </Box>
        );
    }

    const groupResultsByComponent = (results) => {
        return results.reduce((groups, result) => {
            const component = result.component;
            if (!groups[component]) {
                groups[component] = [];
            }
            groups[component].push(result);
            return groups;
        }, {});
    };

    const groupedResults = groupResultsByComponent(searchResults.results);

    return (
        <Box sx={{ p: 3 }}>
            {/* Search Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    <SearchIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Search Results for "{searchResults.query}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Found {searchResults.totalResults} result(s) in {Object.keys(groupedResults).length} component(s)
                </Typography>
            </Box>

            {/* Search Results */}
            <Box>
                {Object.entries(groupedResults).map(([component, results]) => (
                    <Accordion key={component} defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    {results[0].componentName} ({results.length} results)
                                </Typography>
                                <Chip label={results[0].componentIcon} size="small" sx={{ mr: 2 }} />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {results.map((result, index) => (
                                    <Card key={index} variant="outlined">
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "flex-start",
                                                    mb: 2,
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <FileIcon sx={{ mr: 1, color: "primary.main" }} />
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                            {result.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {result.filename} • {result.matchCount} matches
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: "flex", gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => {
                                                            onComponentSelect(result.component);
                                                            onFileSelect(result.name);
                                                        }}
                                                        title="View file"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => onDownload(result.component, result.name, "md")}
                                                        title="Download file"
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            {/* Matching Lines */}
                                            {result.matchingLines && result.matchingLines.length > 0 && (
                                                <Box>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Matching Content:
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: "grey.50",
                                                            borderRadius: 1,
                                                            p: 2,
                                                            maxHeight: 200,
                                                            overflow: "auto",
                                                            fontFamily: "monospace",
                                                            fontSize: "0.875rem",
                                                        }}
                                                    >
                                                        {result.matchingLines.map((line, lineIndex) => (
                                                            <Box key={lineIndex} sx={{ mb: 1 }}>
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                    sx={{ mr: 1 }}
                                                                >
                                                                    Line {line.lineNumber}:
                                                                </Typography>
                                                                <Typography
                                                                    component="span"
                                                                    sx={{
                                                                        backgroundColor: line.content
                                                                            .toLowerCase()
                                                                            .includes(searchResults.query.toLowerCase())
                                                                            ? "warning.light"
                                                                            : "transparent",
                                                                        px: 0.5,
                                                                        borderRadius: 0.5,
                                                                    }}
                                                                >
                                                                    {line.content}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
};

export default DocumentationSearchResults;
