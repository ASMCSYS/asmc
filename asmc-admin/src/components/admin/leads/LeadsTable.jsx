import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { IconButton, TableCell, TableRow, Typography } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { baseUrl } from "../../../helpers/constants";

const LeadsTable = ({ loading, count, data, edit, pagination, handlePagination, fetching = false }) => {
    let columns = [
        {
            title: "",
        },
        {
            title: "Sr. No.",
            sort: false,
        },
        {
            title: "Type",
            field: "type",
            sort: true,
            minWidth: 170,
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
            title: "Mobile",
            field: "phone_number",
            sort: true,
        },
        {
            title: "Created At",
            field: "createdAt",
            sort: true,
        },
    ];

    const ExpandableTableRow = ({ children, expandComponent, ...otherProps }) => {
        const [isExpanded, setIsExpanded] = React.useState(false);

        return (
            <>
                <TableRow {...otherProps} onClick={() => setIsExpanded(!isExpanded)}>
                    <TableCell padding="checkbox">
                        <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </TableCell>
                    {children}
                </TableRow>
                {isExpanded && (
                    <TableRow>
                        <TableCell padding="checkbox" />
                        {expandComponent}
                    </TableRow>
                )}
            </>
        );
    };

    const ExtraComponent = ({ data }) => {
        return (
            <TableCell colSpan="6">
                {data?.profile && (
                    <img
                        src={baseUrl + "/" + data?.profile}
                        alt="profile-img"
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                )}
                {data?.description && (
                    <Typography variant="body2">
                        <strong>Description</strong>: {data?.description}
                    </Typography>
                )}
                {data?.father_gotra && (
                    <Typography variant="body2">
                        <strong>Father Gotra</strong>: {data?.father_gotra}
                    </Typography>
                )}
                {data?.gender && (
                    <Typography variant="body2">
                        <strong>Gender</strong>: {data?.gender}
                    </Typography>
                )}
                {data?.qualification && (
                    <Typography variant="body2">
                        <strong>Qualification</strong>: {data?.qualification}
                    </Typography>
                )}
                {data?.marital_status && (
                    <Typography variant="body2">
                        <strong>Marital Status</strong>: {data?.marital_status}
                    </Typography>
                )}
                {data?.job_title && (
                    <Typography variant="body2">
                        <strong>Job Title</strong>: {data?.job_title}
                    </Typography>
                )}
                {data?.expected_salary && (
                    <Typography variant="body2">
                        <strong>Expected Salary</strong>: {data?.expected_salary}
                    </Typography>
                )}
                {data?.work_experience && (
                    <Typography variant="body2">
                        <strong>Work Experience</strong>: {data?.work_experience}
                    </Typography>
                )}
                {data?.work_status && (
                    <Typography variant="body2">
                        <strong>Work Status</strong>: {data?.work_status}
                    </Typography>
                )}
                {data?.business && (
                    <Typography variant="body2">
                        <strong>Business</strong>: {data?.business}
                    </Typography>
                )}
                {data?.last_experience && (
                    <Typography variant="body2">
                        <strong>Last Experience</strong>: {data?.last_experience}
                    </Typography>
                )}
                {data?.details_of_service && (
                    <Typography variant="body2">
                        <strong>Details of Service</strong>: {data?.details_of_service}
                    </Typography>
                )}
            </TableCell>
        );
    };

    const renderTableData =
        !loading && data && data.length > 0 ? (
            data.map(function (row, index) {
                return (
                    <ExpandableTableRow
                        key={row.name}
                        expandComponent={<ExtraComponent data={row} />}
                        sx={{ "td, th": { border: 0, padding: "10px", cursor: "pointer" } }}
                    >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">{row?.type}</TableCell>
                        <TableCell align="center">{row?.name}</TableCell>
                        <TableCell align="center">{row?.email}</TableCell>
                        <TableCell align="center">{row?.phone_number}</TableCell>
                        <TableCell align="center">{handleDateTimeDefault(row?.createdAt)}</TableCell>
                    </ExpandableTableRow>
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

export default LeadsTable;
