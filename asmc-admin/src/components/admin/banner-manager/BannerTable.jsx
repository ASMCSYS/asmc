import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { TableCell, TableRow } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import TableCommon from "../../Common/Table";
import { setSnackBar } from "../../../store/common/commonSlice";
import { useDispatch } from "react-redux";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { useDeleteGalleryMutation } from "../../../store/masters/mastersApis";
import { PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../Common/HasPermission";

const BannerTableComponent = ({ loading, count, data, edit, pagination, handlePagination, fetching = false }) => {
    const dispatch = useDispatch();
    const [handleDelete] = useDeleteGalleryMutation();

    let columns = [
        {
            title: "Sr. No.",
            sort: false
        },
        {
            title: "Type",
            field: "type",
            sort: true
        },
        {
            title: "Image",
            field: "image",
            sort: false
        },
        {
            title: "Created At",
            field: "createdAt",
            sort: true
        },
        {
            title: "Action",
            name: "",
            sort: false
        },
    ];

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
                    <TableCell align="center">{row?.type || "-"}</TableCell>
                    <TableCell align="center">
                        <img src={ ((row.url) || "public/no-image.png")} alt="Profile" width={50} />
                    </TableCell>
                    <TableCell align="center">{handleDateTimeDefault(row?.createdAt)}</TableCell>
                    <TableCell align="center" component="th" scope="row">
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.BANNER.UPDATE} fallback={null}>
                            <IconButtonIcons
                                title="Edit"
                                IconComponent={EditIcon}
                                color="info"
                                onClick={() => edit(row, "Edit")}
                            />
                        </HasPermission>
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.BANNER.READ} fallback={null}>
                            <IconButtonIcons
                                title="View"
                                IconComponent={EyeIcon}
                                color="info"
                                onClick={() => edit(row, "View")}
                            />
                        </HasPermission>
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.BANNER.DELETE} fallback={null}>
                            <IconButtonIcons
                                title="Delete"
                                IconComponent={DeleteIcon}
                                color="info"
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

export default BannerTableComponent;