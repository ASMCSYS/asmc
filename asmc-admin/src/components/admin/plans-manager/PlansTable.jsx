import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { FormControlLabel, Switch, TableCell, TableRow, Typography, Chip } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import TableCommon from "../../Common/Table";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useDispatch } from "react-redux";
import { getMonthNameByNumber, handleDateTimeDefault } from "../../../helpers/utils";
import { useDeletePlansMutation, useUpdatePlansMutation } from "../../../store/masters/mastersApis";
import { PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../Common/HasPermission";
import { getStatusColor } from "../../../helpers/statusUtils";

const BannerTableComponent = ({ loading, count, data, edit, pagination, handlePagination, fetching = false }) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeletePlansMutation();
    const [updatePlans] = useUpdatePlansMutation();

    let columns = [
        {
            title: "Sr. No.",
            sort: false,
        },
        {
            title: "Plan Type",
            field: "plan_type",
            sort: true,
        },
        {
            title: "Plan Name",
            field: "plan_name",
            sort: true,
        },
        {
            title: "Validity in Months",
            sort: false,
        },
        {
            title: "Created At",
            field: "createdAt",
            sort: true,
        },
        {
            title: "Active",
            field: "status",
            sort: true,
            minWidth: 90,
        },
        {
            title: "Action",
            name: "",
            sort: false,
        },
    ];

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

    const handleChangeStatus = async (value, row) => {
        try {
            let payload = {
                ...row,
                status: value,
            };
            delete payload.createdAt;
            delete payload.updatedAt;
            await updatePlans(payload).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: `Plan ${value ? "active" : "in-active"} successfully`,
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

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map(function (row, index) {
                return (
                    <TableRow
                        key={index}
                        sx={{ "td, th": { borderBottom: 1, borderBottomColor: "divider", padding: "10px" } }}
                    >
                        <TableCell align="center">{index + 1 + pagination.pageNo * pagination.limit}</TableCell>
                        <TableCell align="center">{row?.plan_type || "-"}</TableCell>
                        <TableCell align="center">{row?.plan_name || "-"}</TableCell>
                        <TableCell align="center">
                            <Typography variant="subtitle2">
                                Start Month: {getMonthNameByNumber(row?.start_month)}
                            </Typography>
                            <Typography variant="subtitle2">
                                End Start: {getMonthNameByNumber(row?.end_month)}
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                            {row?.createdAt ? handleDateTimeDefault(row?.createdAt) : "-"}
                        </TableCell>
                        <TableCell align="center">
                            <HasPermission permission={PERMISSIONS.COMMON_MASTER.PLANS.UPDATE} fallback={
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
                            <HasPermission permission={PERMISSIONS.COMMON_MASTER.PLANS.UPDATE} fallback={null}>
                                <IconButtonIcons
                                    title="Edit"
                                    IconComponent={EditIcon}
                                    color="warning"
                                    onClick={() => edit(row, "Edit")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.COMMON_MASTER.PLANS.READ} fallback={null}>
                                <IconButtonIcons
                                    title="View"
                                    IconComponent={EyeIcon}
                                    color="info"
                                    onClick={() => edit(row, "View")}
                                />
                            </HasPermission>
                            {/* <IconButtonIcons
                                title="Delete"
                                IconComponent={DeleteIcon}
                                color="error"
                                onClick={() => deleteManage(row._id, row.converted)}
                            /> */}
                        </TableCell>
                    </TableRow>
                );
            })
        ) : (
            <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
                <TableCell colSpan={5} align="center">
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

export default BannerTableComponent;
