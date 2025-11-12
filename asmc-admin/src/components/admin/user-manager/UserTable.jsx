import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import { TableCell, TableRow, Typography } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { handleDateTimeDefault } from "../../../helpers/utils";

const UserTableComponent = ({ loading, count, data, edit, pagination, handlePagination, fetching = false, roles }) => {
    let columns = [
        {
            title: "Sr. No.",
            sort: false,
        },
        {
            title: roles === "users" ? "Member Id" : "Staff Id",
            sort: false,
        },
        {
            title: "Name",
            field: "name",
            sort: true,
        },
        {
            title: "Email",
            field: "email",
            sort: true,
        },
        {
            title: "Created At",
            field: "createdAt",
            sort: true,
        },
    ];

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map(function (row, index) {
                return (
                    <TableRow key={index} sx={{ "td, th": { border: 0, padding: "10px" } }}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                            {roles === "users" ? row?.member_data?.member_id : row?.staff_data?.staff_id}
                        </TableCell>
                        <TableCell align="center">{row?.name}</TableCell>
                        <TableCell align="center">{row?.email}</TableCell>
                        <TableCell align="center">{handleDateTimeDefault(row?.createdAt)}</TableCell>
                    </TableRow>
                );
            })
        ) : (
            <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
                <TableCell colSpan={6} align="center">
                    Data not found
                </TableCell>
            </TableRow>
        );

    return (
        <TableCommon
            columns={columns}
            tableData={renderTableData}
            count={count}
            loading={loading || fetching}
            pagination={pagination}
            handlePagination={handlePagination}
        />
    );
};

export default UserTableComponent;
