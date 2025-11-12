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

const ContactLeadsTable = ({ loading, count, data, edit, pagination, handlePagination, fetching = false }) => {
    let columns = [
        {
            title: ""
        },
        {
            title: "Sr. No.",
            sort: false
        },
        {
            title: "Name",
            field: "name",
            sort: true
        },
        {
            title: "Email",
            field: "email",
            sort: true
        },
        {
            title: "Mobile",
            field: "phone_number",
            sort: true
        },
        {
            title: "Created At",
            field: "createdAt",
            sort: true
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
            <TableCell colSpan="5" >
                {data?.subject && <Typography variant="body2"><strong>Subject</strong>: {data?.subject}</Typography>}
                {data?.message && <Typography variant="body2"><strong>Message</strong>: {data?.message}</Typography>}
            </TableCell>
        )
    }


    const renderTableData = !loading && data && data.length > 0 ? (
        data.map(function (row, index) {
            return (
                <ExpandableTableRow
                    key={row.name}
                    expandComponent={<ExtraComponent data={row} />}
                    sx={{ "td, th": { border: 0, padding: "10px", cursor: 'pointer' } }}
                >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{row?.name}</TableCell>
                    <TableCell align="center">{row?.email}</TableCell>
                    <TableCell align="center">{row?.phone_number}</TableCell>
                    <TableCell align="center">{handleDateTimeDefault(row?.createdAt)}</TableCell>
                </ExpandableTableRow>
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

export default ContactLeadsTable;