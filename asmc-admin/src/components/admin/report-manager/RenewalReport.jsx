import React, { Fragment, useEffect, useState } from "react";
import { FormControlLabel, Grid, Switch, TableCell, TableRow, TextField, Typography } from "@mui/material";
import TableCommon from "../../Common/Table";
import { axios } from "../../../helpers/axios";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";

const RenewalReport = ({ loading, data }) => {
    const dispatch = useDispatch();
    const [pagination, setPagination] = useState({
        pageNo: 0,
        limit: 10,
        total: 0,
        totalPage: 0,
    });
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // generate pages and total page from all data
        if (data) {
            setPagination({
                ...pagination,
                total: data.length,
                totalPage: Math.ceil(data.length / pagination.limit),
            });
            setFilteredData(data);
        }
    }, [data]);

    const handleSearch = (value) => {
        // filter value in all data
        const filterData = data.filter((item) => {
            return (
                item?.name.toString()?.toLowerCase().includes(value) ||
                item?.email.toString()?.toLowerCase().includes(value) ||
                item?.mobile.toString()?.toLowerCase().includes(value) ||
                item?.batch_name.toString()?.toLowerCase().includes(value) ||
                item?.batch_code.toString()?.toLowerCase().includes(value) ||
                item?.enrollment_id.toString()?.toLowerCase().includes(value) ||
                item?.activity_name.toString()?.toLowerCase().includes(value) ||
                item?.plan_name.toString()?.toLowerCase().includes(value) ||
                item?.plan_start_date.toString()?.toLowerCase().includes(value) ||
                item?.plan_end_date.toString()?.toLowerCase().includes(value)
            );
        });
        setFilteredData(filterData);
        setPagination({
            ...pagination,
            total: filterData.length,
            totalPage: Math.ceil(filterData.length / pagination.limit),
        })
    }

    const handlePagination = (setting) => {
        setPagination({
            ...pagination,
            ...setting,
        });
    }

    let columns = [
        {
            title: "Sr. No.",
            sort: false
        },
        {
            title: "Member Detail",
            sort: false
        },
        {
            title: "Batch Name",
            field: "batch_name",
            sort: true
        },
        {
            title: "Batch Code",
            field: "batch_code",
            sort: true
        },
        {
            title: "Enrollment Id",
            field: "enrollment_id",
            sort: true
        },
        {
            title: "Activity Name",
            field: "activity_name",
            sort: true
        },
        {
            title: "Plan Name",
            field: "plan_name",
            sort: true
        },
        {
            title: "Start Date",
            field: "plan_start_date",
            sort: true
        },
        {
            title: "Expiry Date",
            field: "plan_end_date",
            sort: true
        },
        {
            title: "Renew Button",
            sort: false
        },
    ];

    const handleOnOffStatus = async (event, row) => {
        try {
            let data = {
                booking_id: row?.enrollment_id,
                show_renew_button: event
            }

            const response = await axios.put("/bookings/renew-button", data);

            if (response?.success) {
                setFilteredData(filteredData.map((item) => {
                    if (item?.enrollment_id === row?.enrollment_id) {
                        return {
                            ...item,
                            show_renew_button: event
                        }
                    } else {
                        return item
                    }
                }))
            }

        } catch (error) {
            console.log(error, "error");
        }
    }

    const renderTableData = !loading && filteredData && filteredData.length > 0 ? (
        filteredData.slice(pagination.pageNo * pagination.limit, (pagination.pageNo + 1) * pagination.limit).map(function (row, index) {
            return (
                <TableRow
                    key={index}
                    sx={{ "td, th": { border: 0, padding: "10px" } }}
                >
                    <TableCell align="center">{(index + 1) + pagination.pageNo * pagination.limit}</TableCell>
                    <TableCell align="center">
                        <Typography>{row?.name}</Typography>
                        <Typography>{row?.email}</Typography>
                        <Typography>{row?.mobile}</Typography>
                    </TableCell>
                    <TableCell align="center">{row?.batch_name}</TableCell>
                    <TableCell align="center">{row?.batch_code}</TableCell>
                    <TableCell align="center">{row?.enrollment_id}</TableCell>
                    <TableCell align="center">{row?.activity_name}</TableCell>
                    <TableCell align="center">{row?.plan_name}</TableCell>
                    <TableCell align="center">{row?.plan_start_date}</TableCell>
                    <TableCell align="center">{row?.plan_end_date}</TableCell>
                    <TableCell align="center">
                        <FormControlLabel
                            control={<Switch checked={row?.show_renew_button || false} />}
                            label={row?.show_renew_button ? "On" : "Off"}
                            onChange={(e) => handleOnOffStatus(e.target.checked, row)}
                        />
                    </TableCell>
                </TableRow>
            )
        })
    ) : (
        <TableRow sx={{ "td, th": { border: 0, padding: "10px" } }}>
            <TableCell colSpan={9} align="center">Data not found</TableCell>
        </TableRow>
    );

    return (
        <Fragment>
            <Grid item textAlign={"right"}>
                <TextField
                    size="small"
                    id="outlined-search"
                    label="Search here..."
                    type="search"
                    style={{ minWidth: 300 }}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </Grid>
            <TableCommon columns={columns} tableData={renderTableData} count={data.length} loading={loading} pagination={pagination} handlePagination={handlePagination} />
        </Fragment>
    )
}

export default RenewalReport;