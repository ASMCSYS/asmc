import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSkeleton from "./TableSkeleton";
import { Box, IconButton, Paper, TableFooter, TablePagination, TableSortLabel } from "@mui/material";
import { useTheme } from "@emotion/react";
import TablePaginationActions from "./TablePaginationActions";

const TableCommon = (props) => {
    const { columns, tableData, loading, pagination, handlePagination, count, maxHeight = "60vh" } = props;

    const paginationRequest = ({ pageNo, limit, sortBy, sortField, keywords }) => {
        handlePagination({
            pageNo: pageNo !== undefined ? pageNo : pagination?.pageNo,
            limit: limit !== undefined ? limit : pagination?.limit,
            sortBy: sortBy !== undefined ? sortBy : pagination?.sortBy,
            sortField: sortField !== undefined ? sortField : pagination?.sortField,
            keywords: keywords || pagination?.keywords,
        })
    }

    const handleRequestSort = (property) => {
        const isAsc = pagination?.sortField === property && pagination?.sortBy === 1;
        paginationRequest({ sortBy: isAsc ? -1 : 1, sortField: property })
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: maxHeight }}>
                <Table sx={{ minWidth: 650 }} stickyHeader>
                    <TableHead>
                        <TableRow sx={{ th: { border: 0 }, backgroundColor: "#F8F8F8" }}>
                            {columns.map((column, index) => {
                                if (column.hide) {
                                    return false;
                                }
                                return (
                                    <TableCell
                                        align={column?.align || "center"}
                                        sx={{ p: 1.4, fontSize: "14px", fontWeight: "500", minWidth: column.minWidth }}
                                        key={index}
                                        sortDirection={pagination?.sortField === column.field ? (pagination?.sortBy === 1 ? "asc" : "desc") : false}
                                    >
                                        {
                                            column.sort
                                                ?
                                                <TableSortLabel
                                                    active={pagination?.sortField === column.field}
                                                    direction={pagination?.sortField === column.field ? (pagination?.sortBy === 1 ? "asc" : "desc") : 'asc'}
                                                    onClick={() => handleRequestSort(column.field)}
                                                >
                                                    {column.title}
                                                </TableSortLabel>
                                                :
                                                column.title
                                        }

                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? <TableSkeleton rows={columns} /> : tableData}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                pagination
                    ?
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[5, 10, 25, 50, 75, 100, 200, 500, { label: 'All', value: count }]}
                        count={count}
                        rowsPerPage={pagination?.limit}
                        page={pagination?.pageNo}
                        SelectProps={{
                            inputProps: {
                                'aria-label': 'rows per page',
                            },
                            native: true,
                        }}
                        onPageChange={(e, newNo) => paginationRequest({ pageNo: newNo })}
                        onRowsPerPageChange={(e) => paginationRequest({ limit: e.target.value })}
                        ActionsComponent={TablePaginationActions}
                    />
                    :
                    null
            }
        </Paper>
    );
};

export default TableCommon;
