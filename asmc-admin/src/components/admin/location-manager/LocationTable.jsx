import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { TableCell, TableRow } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { baseUrl, PERMISSIONS } from "../../../helpers/constants";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { useDeleteLocationMutation } from "../../../store/masters/mastersApis";
import HasPermission from "../../Common/HasPermission";

const LocationTableComponent = ({ loading, fetching = false, count, data, edit, pagination, handlePagination }) => {
    const [handleDelete] = useDeleteLocationMutation();
    let columns = [
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Parent Location",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Location",
            field: "title",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Status",
            field: "status",
            sort: true,
            minWidth: 170,
        },
        {
            title: "Created At",
            field: "createdAt",
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
                alert("This member is converted to user, kindly delete the user first and then member.")
                return false;
            }
            handleDelete({ _id });
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
                    <TableCell align="center">
                        {row?.parent_data && row?.parent_data.length > 0 ? row?.parent_data[0]?.title : "None"}
                    </TableCell>
                    <TableCell align="center">
                        {row?.title}
                    </TableCell>
                    <TableCell align="center">
                        {row?.status ? "Active" : "In-active"}
                    </TableCell>
                    <TableCell align="center">{handleDateTimeDefault(row?.createdAt)}</TableCell>
                    <TableCell align="center" component="th" scope="row">
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.LOCATION.UPDATE} fallback={null}>
                            <IconButtonIcons
                                title="Edit"
                                IconComponent={EditIcon}
                                color="warning"
                                onClick={() => edit(row, "Edit")}
                            />
                        </HasPermission>
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.LOCATION.READ} fallback={null}>
                            <IconButtonIcons
                                title="View"
                                IconComponent={EyeIcon}
                                color="info"
                                onClick={() => edit(row, "View")}
                            />
                        </HasPermission>
                        <HasPermission permission={PERMISSIONS.COMMON_MASTER.LOCATION.DELETE} fallback={null}>
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
            <TableCell colSpan={6} align="center">Data not found</TableCell>
        </TableRow>
    );

    return (
        <TableCommon columns={columns} tableData={renderTableData} count={count} loading={loading || fetching} pagination={pagination} handlePagination={handlePagination} />
    )
}

export default LocationTableComponent;