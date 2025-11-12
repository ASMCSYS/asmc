import React from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import IconButtonIcons from "../../Common/IconButtonIcons";
import TableCommon from "../../Common/Table";
import { handleDateTimeDefault } from "../../../helpers/utils";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { baseUrl } from "../../../helpers/constants";

const BatchReportTable = ({ loading, data }) => {
    let columns = [
        {
            title: ""
        },
        {
            title: "Batch Name",
            sort: false,
            align: "left",
        },
    ];

    console.log(data, "datadatadata");


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
                <TableContainer sx={{ maxHeight: "60vh" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Sr. No.</TableCell>
                                <TableCell align="left">Enrollment Id</TableCell>
                                <TableCell align="left">User Details</TableCell>
                                <TableCell align="left">Plan</TableCell>
                                <TableCell align="left">Payment Amount</TableCell>
                                <TableCell align="left">Plan Expire Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data?.map((item, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell align="left">{item?.enrollment_id}</TableCell>
                                            <TableCell align="left">
                                                <Typography variant="body2"><strong>Name</strong>: {item?.name}</Typography>
                                                <Typography variant="body2"><strong>Email</strong>: {item?.email}</Typography>
                                                <Typography variant="body2"><strong>Mobile</strong>: {item?.mobile}</Typography>
                                            </TableCell>
                                            <TableCell align="left">{item?.plan_name}</TableCell>
                                            <TableCell align="left">{item?.total_amount}</TableCell>
                                            <TableCell align="left">{item?.plan_end_date}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </TableCell>
        )
    }


    const renderTableData = !loading && data && data.length > 0 ? (
        data.map(function (row, index) {
            return (
                <ExpandableTableRow
                    key={row.batch_name}
                    expandComponent={<ExtraComponent data={row.data} />}
                    sx={{ "td, th": { border: 0, padding: "10px", cursor: 'pointer' } }}
                >
                    <TableCell align="left">{row?.batch_name} <strong>({row?.data?.length})</strong></TableCell>
                </ExpandableTableRow>
            )
        })
    ) : (
        <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
            <TableCell colSpan={1} align="center">Data not found</TableCell>
        </TableRow>
    );

    return (
        <TableCommon columns={columns} tableData={renderTableData} count={data.length || 0} loading={loading} maxHeight="100vh" />
    )
}

export default BatchReportTable;