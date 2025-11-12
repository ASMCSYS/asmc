import React, { Fragment } from "react";
import EditIcon from "@mui/icons-material/Edit";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { Chip, Typography, TableCell, TableRow, FormControlLabel, Switch } from "@mui/material";
import {
    useDeleteStaffMutation,
    useStaffConvertToUserMutation,
    useUpdateStaffMutation,
} from "../../../store/staff/staffApis";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useDispatch } from "react-redux";
import HasPermission from "../../Common/HasPermission";
import { Autorenew } from "@mui/icons-material";
import { PERMISSIONS } from "../../../helpers/constants";
import { getStatusColor } from "../../../helpers/statusUtils";

const StaffTableComponent = ({
    loading = false,
    fetching = false,
    count = 0,
    data = [],
    edit,
    pagination,
    handlePagination,
}) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteStaffMutation();
    const [updateStaff] = useUpdateStaffMutation();
    const [convertToUser, { isLoading: convertUserLoading }] = useStaffConvertToUserMutation();

    const columns = [
        { title: "Sr. No.", sort: false, minWidth: 50 },
        { title: "Name", field: "name", sort: true, minWidth: 120 },
        { title: "Designation", field: "designation", sort: true, minWidth: 120 },
        { title: "Department", field: "department", sort: true, minWidth: 120 },
        { title: "Email", field: "email", sort: true, minWidth: 150 },
        { title: "Phone", field: "phone", sort: false, minWidth: 110 },
        { title: "Status", field: "status", sort: true, minWidth: 80 },
        { title: "Action", sort: false, minWidth: 120 },
    ];

    const handleChangeStatus = async (value, row) => {
        try {
            let payload = {
                _id: row?._id,
                status: value,
            };
            await updateStaff(payload).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: `Staff ${value ? "active" : "in-active"} successfully`,
                    severity: "success",
                }),
            );
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error?.data?.message || error.message,
                    severity: "error",
                }),
            );
        }
    };

    const deleteManage = async (_id) => {
        try {
            if (window.confirm("Are you sure you want to delete?")) {
                const response = await handleDelete({ _id });
                if (response?.error) throw new Error(response?.error?.message);

                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Deleted successfully",
                        severity: "success",
                    }),
                );
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error?.data?.message || error.message,
                    severity: "error",
                }),
            );
        }
    };

    const handleStaffToUserConvert = async (id) => {
        try {
            let payload = {
                _id: id,
            };
            if (window.confirm("Are you sure you want to convert this staff to user?")) {
                await convertToUser(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Staff converted successfully",
                        severity: "success",
                    }),
                );
            }
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error?.data?.message || error.message,
                    severity: "error",
                }),
            );
        }
    };

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map((row, index) => (
                <TableRow key={row._id}>
                    <TableCell align="center">
                        {index + 1 + (pagination?.pageNo || 0) * (pagination?.limit || 10)}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.designation}</TableCell>
                    <TableCell align="center">{row.department}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.phone}</TableCell>
                    <TableCell align="center">
                        <HasPermission permission={PERMISSIONS.STAFF.UPDATE} fallback={
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
                    <TableCell align="center">
                        <HasPermission permission={PERMISSIONS.STAFF.UPDATE}>
                            <IconButtonIcons
                                title="Edit"
                                IconComponent={EditIcon}
                                color="warning"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    edit(row, "Edit");
                                }}
                            />
                        </HasPermission>
                        <HasPermission permission={PERMISSIONS.STAFF.DELETE}>
                            <IconButtonIcons
                                title="Delete"
                                IconComponent={DeleteIcon}
                                color="error"
                                onClick={() => deleteManage(row._id, row.converted)}
                            />
                        </HasPermission>
                        {!row.converted && (
                            <HasPermission permission={PERMISSIONS.STAFF.UPDATE}>
                                <IconButtonIcons
                                    title="Convert to User"
                                    IconComponent={Autorenew}
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStaffToUserConvert(row._id);
                                    }}
                                />
                            </HasPermission>
                        )}
                    </TableCell>
                </TableRow>
            ))
        ) : (
            <TableRow>
                <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body2">No staff found.</Typography>
                </TableCell>
            </TableRow>
        );

    return (
        <Fragment>
            <TableCommon
                columns={columns}
                tableData={renderTableData}
                count={count}
                loading={loading || fetching}
                pagination={pagination}
                handlePagination={handlePagination}
            />
        </Fragment>
    );
};

export default StaffTableComponent;
