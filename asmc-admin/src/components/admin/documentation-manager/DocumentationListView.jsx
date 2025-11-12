import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Box,
    Chip,
    Skeleton,
} from "@mui/material";
import {
    Download as DownloadIcon,
    Visibility as ViewIcon,
    Description as FileIcon,
    PictureAsPdf as PdfIcon,
} from "@mui/icons-material";

const DocumentationListView = ({ files, onFileSelect, onDownload, selectedFile, isLoading, component }) => {
    const columns = [
        { id: "name", label: "File Name", minWidth: 200 },
        { id: "size", label: "Size", minWidth: 100 },
        { id: "modified", label: "Last Modified", minWidth: 150 },
        { id: "actions", label: "Actions", minWidth: 120, align: "center" },
    ];

    if (isLoading) {
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align}>
                                    <Skeleton variant="text" width="80%" />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align}>
                                        <Skeleton variant="text" width="90%" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((file, index) => (
                        <TableRow
                            key={index}
                            hover
                            sx={{
                                cursor: "pointer",
                                backgroundColor: selectedFile === file.name ? "action.selected" : "inherit",
                                "&:hover": {
                                    backgroundColor: "action.hover",
                                },
                            }}
                            onClick={() => onFileSelect(file.name)}
                        >
                            <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <FileIcon sx={{ mr: 1, color: "primary.main" }} />
                                    <Box>
                                        <Typography variant="body2" fontWeight="medium">
                                            {file.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {file.filename}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip label={file.formattedSize} size="small" variant="outlined" color="info" />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">{file.formattedModified}</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onFileSelect(file.name);
                                        }}
                                        title="View file"
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDownload(component, file.name, "pdf");
                                        }}
                                        title="Download as PDF"
                                    >
                                        <PdfIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="success"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDownload(component, file.name, "md");
                                        }}
                                        title="Download as Markdown"
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DocumentationListView;
