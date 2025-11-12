import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { FormControlLabel, Switch, TableCell, TableRow, Typography } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { useDeleteActivityMutation, useUpdateActivityMutation } from "../../../store/activity/activityApis";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { format } from "date-fns";
import { DownloadDoneRounded, DownloadOutlined } from "@mui/icons-material";

const BackupTableComponent = ({ loading, fetching = false, count, data, pagination, handlePagination }) => {
    const dispatch = useDispatch();

    console.log(data, "datadata");

    let columns = [
        {
            title: "Sr. No.",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Backup On",
            field: "createdAt",
            sort: false,
            minWidth: 50,
        },
        {
            title: "Size",
            field: "size",
            sort: true,
            minWidth: 50,
        },
        {
            title: "Action",
            name: "",
            sort: false,
            minWidth: 200,
        },
    ];

    const deleteManage = (_id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            // handleDelete({ _id });
        }
    };

    const handleDownload = (url) => {
        window.open(url, "_blank");
    };

    const renderTableData =
        !loading && data && data?.length > 0 ? (
            data.map(function (row, index) {
                return (
                    <TableRow
                        key={index}
                        sx={{ "td, th": { borderBottom: 1, borderBottomColor: "divider", padding: "10px" } }}
                    >
                        <TableCell align="center">{index + 1 + pagination.pageNo * pagination.limit}</TableCell>
                        <TableCell align="center">{format(new Date(row?.createdAt), "dd-MM-yyyy hh:mm:ss")}</TableCell>
                        <TableCell align="center">{row.size}</TableCell>
                        <TableCell align="center" component="th" scope="row">
                            <IconButtonIcons
                                title="Download"
                                IconComponent={DownloadOutlined}
                                color="success"
                                onClick={() => handleDownload(row.url)}
                            />
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

export default BackupTableComponent;
