import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { FormControlLabel, Switch, TableCell, TableRow, Typography, Chip } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { baseUrl, PERMISSIONS } from "../../../helpers/constants";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { useDeleteActivityMutation, useUpdateActivityMutation } from "../../../store/activity/activityApis";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import HasPermission from "../../Common/HasPermission";
import { getStatusColor } from "../../../helpers/statusUtils";

const ActivityTableComponent = ({
    loading,
    fetching = false,
    count,
    data,
    edit,
    pagination,
    handlePagination,
    handleGenerateSlot,
}) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteActivityMutation();
    const [updateActivity] = useUpdateActivityMutation();

    let columns = [
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Activity Id",
            field: "activity_id",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Thumbnail",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Activity Name",
            field: "name",
            sort: true,
            minWidth: 170,
        },
        {
            title: "Category",
            field: "category",
            sort: true,
            minWidth: 170,
        },
        {
            title: "location",
            sort: false,
            minWidth: 170,
        },
        {
            title: "Show / Hide",
            field: "show_hide",
            sort: true,
            minWidth: 90,
        },
        {
            title: "Action",
            name: "",
            sort: false,
            minWidth: 200,
        },
    ];

    const deleteManage = (_id, converted) => {
        if (window.confirm("Are you sure you want to delete?")) {
            if (converted) {
                alert("This member is converted to user, kindly delete the user first and then member.");
                return false;
            }
            handleDelete({ _id });
        }
    };

    const handleChangeStatus = async (value, row) => {
        try {
            let payload = {
                _id: row._id,
                name: row.name,
                show_hide: value,
            };

            await updateActivity(payload).unwrap();
            dispatch(
                setSnackBar({
                    open: true,
                    message: `Activity ${
                        value ? "is now displaying on website." : "is now not displaying on website."
                    }`,
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
                        <TableCell align="center">{row?.activity_id}</TableCell>
                        <TableCell align="center">
                            {row.thumbnail ? <img src={row.thumbnail} alt="Profile" width={50} /> : "-"}
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">
                            {row?.category.length > 0 ? row?.category.map((loc) => loc.label).join(", ") : "-"}
                        </TableCell>
                        <TableCell align="center">
                            {row?.location.length > 0 ? row?.location.map((loc) => loc.label).join(", ") : "-"}
                        </TableCell>
                        <TableCell align="center">
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.ACTIVITY.UPDATE} fallback={
                                <Chip
                                    size="small"
                                    sx={{
                                        fontSize: "0.75rem",
                                        backgroundColor: getStatusColor(row?.show_hide || false).background,
                                        color: getStatusColor(row?.show_hide || false).text,
                                        borderRadius: 1,
                                        fontWeight: 500,
                                    }}
                                    label={row?.show_hide ? "Show" : "Hide"}
                                />
                            }>
                                <FormControlLabel
                                    control={<Switch checked={row?.show_hide || false} />}
                                    label={row?.show_hide ? "Show" : "Hide"}
                                    onChange={(e) => handleChangeStatus(e.target.checked, row)}
                                />
                            </HasPermission>
                        </TableCell>
                        <TableCell align="center" component="th" scope="row">
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.ACTIVITY.UPDATE} fallback={null}>
                                <IconButtonIcons
                                    title="Edit"
                                    IconComponent={EditIcon}
                                    color="warning"
                                    onClick={() => edit(row, "Edit")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.ACTIVITY.READ} fallback={null}>
                                <IconButtonIcons
                                    title="View"
                                    IconComponent={EyeIcon}
                                    color="info"
                                    onClick={() => edit(row, "View")}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.ACTIVITY.DELETE} fallback={null}>
                                <IconButtonIcons
                                    title="Delete"
                                    IconComponent={DeleteIcon}
                                    color="error"
                                    onClick={() => deleteManage(row._id, row.converted)}
                                />
                            </HasPermission>
                            <HasPermission permission={PERMISSIONS.ADVANCE_MASTER.ACTIVITY.UPDATE} fallback={null}>
                                <IconButtonIcons
                                    title="Map Booking Batch"
                                    IconComponent={MoreTimeIcon}
                                    color="info"
                                    onClick={() => handleGenerateSlot(row)}
                                />
                            </HasPermission>
                        </TableCell>
                    </TableRow>
                );
            })
        ) : (
            <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
                <TableCell colSpan={7} align="center">
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

export default ActivityTableComponent;
