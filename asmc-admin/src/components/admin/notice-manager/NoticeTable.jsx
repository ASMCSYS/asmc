import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { FormControlLabel, Link, Switch, TableCell, TableRow, Chip } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import TableCommon from "../../Common/Table";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useDispatch } from "react-redux";
import { isAuth } from "../../../helpers/cookies";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { baseUrl, PERMISSIONS } from "../../../helpers/constants";
import { useDeleteNoticeMutation, useUpdateNoticeMutation } from "../../../store/masters/mastersApis";
import HasPermission from "../../Common/HasPermission";
import { getStatusColor } from "../../../helpers/statusUtils";

const NoticeTableComponent = ({ loading, count, data, edit, pagination, handlePagination, fetching = false }) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteNoticeMutation();
    const [updateNotice] = useUpdateNoticeMutation();

    let columns = [
        {
            title: "Sr. No.",
            sort: false
        },
        {
            title: "Title",
            sort: true,
            field: "title"
        },
        {
            title: "Content",
            sort: true,
            field: "content"
        },
        {
            title: "Created At",
            field: "createdAt",
            sort: true
        },
        {
            title: "Status",
            field: "status",
            sort: true,
            minWidth: 90,
        },
        {
            title: "Action",
            name: "",
            sort: false
        },
    ];

    const handleChangeStatus = async (value, row) => {
        try {
            let payload = {
                _id: row?._id,
                type: row?.type,
                title: row?.title,
                content: row?.content,
                status: value
            }
            await updateNotice(payload).unwrap();
            dispatch(setSnackBar({
                open: true,
                message: `Notice ${value ? "active" : "in-active"} successfully`,
                severity: "success",
            }))
        } catch (error) {
            dispatch(setSnackBar({
                open: true,
                message: error?.data?.message || error.message,
                severity: "error",
            }))
        }
    }

    const deleteManage = async (_id) => {
        try {
            if (window.confirm("Are you sure you want to delete?")) {
                const response = await handleDelete({ _id });
                if (response?.error)
                    throw new Error(response?.error?.message);

                dispatch(setSnackBar({
                    open: true,
                    message: "Deleted successfully",
                    severity: "success",
                }))
            }
        } catch (error) {
            dispatch(setSnackBar({
                open: true,
                message: error?.data?.message || error.message,
                severity: "error",
            }))
        }

    }

    const renderTableData = !loading && data && data.length > 0 ? (
        data.map(function (row, index) {
            return (
                <TableRow
                    key={index}
                    sx={{ "td, th": { border: 0, padding: "10px" } }}
                >
                    <TableCell align="center">{(index + 1) + (pagination.pageNo * pagination.limit)}</TableCell>
                    <TableCell align="center">{row?.title}</TableCell>
                    <TableCell align="center" dangerouslySetInnerHTML={{ __html: row?.content }}></TableCell>
                    <TableCell align="center">{handleDateTimeDefault(row?.createdAt)}</TableCell>
                    <TableCell align="center">
                        <HasPermission permission={PERMISSIONS.NOTICE.UPDATE} fallback={
                            <Chip
                                size="small"
                                sx={{
                                    fontSize: "0.75rem",
                                    backgroundColor: getStatusColor(row?.status || false).background,
                                    color: getStatusColor(row?.status || false).text,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                }}
                                label={row?.status ? "Active" : "Inactive"}
                            />
                        }>
                            <FormControlLabel
                                control={<Switch checked={row?.status || false} />}
                                label="Active"
                                onChange={(e) => handleChangeStatus(e.target.checked, row)}
                            />
                        </HasPermission>
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                        <HasPermission permission={PERMISSIONS.NOTICE.UPDATE} fallback={null}>
                            <IconButtonIcons
                                title="Edit"
                                IconComponent={EditIcon}
                                color="warning"
                                onClick={() => edit(row, "Edit")}
                            />
                        </HasPermission>
                        <HasPermission permission={PERMISSIONS.NOTICE.DELETE} fallback={null}>
                            <IconButtonIcons
                                title="Delete"
                                IconComponent={DeleteIcon}
                                color="error"
                                onClick={() => deleteManage(row._id, row.converted)}
                            />
                        </HasPermission>
                    </TableCell>
                </TableRow>
            )
        })
    ) : (
        <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
            <TableCell colSpan={5} align="center">Data not found</TableCell>
        </TableRow>
    );

    return (
        <TableCommon columns={columns} tableData={renderTableData} count={count} loading={loading || fetching} pagination={pagination} handlePagination={handlePagination} />
    )
}

export default NoticeTableComponent;