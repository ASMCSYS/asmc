import React, { Fragment, useEffect } from "react";
import { Box, Card, CardContent, CardHeader, Grid, Paper, Stack, Typography } from "@mui/material";
import DatePickerComponent from "../../../components/Common/DatePicker";
import BasicSelect from "../../../components/Common/Select";
import Button from "../../../components/Common/Button";
import { useDispatch } from "react-redux";
import { setSnackBar } from "../../../store/common/commonSlice";
import { axios } from "../../../helpers/axios";
import { format } from "date-fns";
import { capitalizeFirstLetter } from "../../../helpers/utils";
import { useGetBatchDropdownQuery } from "../../../store/masters/mastersApis";
import AutoCompleteSelect from "../../../components/Common/AutoCompleteSelect";
import RenewalReport from "../../../components/admin/report-manager/RenewalReport";
import { useGetActivityDropdownQuery } from "../../../store/activity/activityApis";
import { useGetEventDropdownQuery } from "../../../store/events/eventsApis";
import { useGetHallDropdownQuery } from "../../../store/halls/hallsApis";
import BatchReportTable from "../../../components/admin/report-manager/BatchReportTable";
import PaymentSummaryReport from "../../../components/admin/report-manager/PaymentSummaryReport";
import { PERMISSIONS } from "../../../helpers/constants";
import HasPermission from "../../../components/Common/HasPermission";

const ReportsManagerContainer = ({ type: reportType }) => {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [exporting, setExporting] = React.useState(false);
    const [batchData, setBatchData] = React.useState([]);
    const [selectedBatch, setSelectedBatch] = React.useState(null);
    const [selectedActivity, setSelectedActivity] = React.useState(null);
    const [responseData, setResponseData] = React.useState(null);
    const [batchWiseReport, setBatchWiseReport] = React.useState(null);
    const [batchWiseReportLoading, setBatchWiseReportLoading] = React.useState(false);

    const [paymentReportType, setPaymentReportType] = React.useState([]);
    const [paymentMode, setPaymentMode] = React.useState([]);
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = React.useState(null);
    const [selectedHall, setSelectedHall] = React.useState(null);

    const {
        isLoading,
        data: batch,
        isFetching,
        refetch,
    } = useGetBatchDropdownQuery({ activity_id: selectedActivity || "" }, { skip: reportType !== "batch-wise" });

    const { data: activityData } = useGetActivityDropdownQuery({}, { skip: !(reportType === "batch-wise") });

    const { data: eventData } = useGetEventDropdownQuery({}, { skip: reportType !== "event-bookings" });
    const { data: hallData } = useGetHallDropdownQuery({}, { skip: reportType !== "hall-bookings" });

    useEffect(() => {
        async function fetchData() {
            setBatchWiseReportLoading(true);
            let hitUrl = `/reports/${reportType}?download=true`;
            if (selectedActivity) {
                hitUrl += `&activity_id=${selectedActivity}`;
            }
            if (selectedBatch) {
                hitUrl += `&batch_id=${selectedBatch.map((item) => item.value).join(",")}`;
            }
            let res = await axios.get(hitUrl);
            setBatchWiseReport(res.result);
            setBatchWiseReportLoading(false);
        }
        if (selectedActivity || selectedBatch) fetchData();
    }, [selectedActivity, selectedBatch]);

    useEffect(() => {
        if (batch) {
            let arr = batch?.map((item) => ({ label: item.label, value: item.value }));
            setBatchData(arr);
        }
    }, [batch]);

    const fetchResponseData = async () => {
        try {
            let hitUrl = `/reports/${reportType}`;
            if (reportType === "payment-summary") {
                if (startDate && endDate) {
                    hitUrl += `?start_date=${format(startDate, "yyyy-MM-dd")}&end_date=${format(
                        endDate,
                        "yyyy-MM-dd",
                    )}`;
                }

                if (paymentReportType.length > 0)
                    hitUrl += `${startDate && endDate ? "&" : "?"}payment_type=${paymentReportType
                        .map((item) => item.value)
                        .join(",")}`;

                if (paymentMode.length > 0)
                    hitUrl += `${
                        startDate || endDate || paymentReportType.length > 0 ? "&" : "?"
                    }payment_mode=${paymentMode.map((item) => item.value).join(",")}`;
            }

            let response = await axios.get(hitUrl);
            setResponseData(response?.result);
        } catch (e) {
            return [];
        }
    };

    useEffect(() => {
        if (reportType === "renewal" || reportType === "payment-summary") {
            fetchResponseData();
        }
    }, [reportType]);

    const handleExport = async () => {
        try {
            if (
                reportType !== "renewal" &&
                reportType !== "batch-wise" &&
                reportType !== "event-bookings" &&
                reportType !== "hall-bookings" &&
                (!startDate || !endDate)
            ) {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Please select report type and date range",
                        severity: "error",
                    }),
                );
                return;
            }
            setExporting(true);

            let hitUrl = `/reports/${reportType}`;

            if (startDate && endDate) {
                hitUrl += `?start_date=${format(startDate, "yyyy-MM-dd")}&end_date=${format(endDate, "yyyy-MM-dd")}`;
            }

            if (selectedBatch) {
                hitUrl += `${startDate && endDate ? "&" : "?"}batch_id=${selectedBatch
                    .map((item) => item.value)
                    .join(",")}`;
            }

            if (reportType === "payment-summary") {
                hitUrl += `&payment_type=${paymentReportType.map((item) => item.value).join(",")}`;
            }

            if (paymentMode.length > 0)
                hitUrl += `${startDate || endDate || paymentReportType.length > 0 ? "&" : "?"}payment_mode=${paymentMode
                    .map((item) => item.value)
                    .join(",")}`;

            // Add event-specific filters
            if (reportType === "event-bookings") {
                if (selectedEvent) {
                    hitUrl += `${startDate && endDate ? "&" : "?"}event_id=${selectedEvent}`;
                }
                if (selectedPaymentStatus) {
                    hitUrl += `${
                        (startDate && endDate) || selectedEvent ? "&" : "?"
                    }payment_status=${selectedPaymentStatus}`;
                }
            }
            if (reportType === "hall-bookings") {
                if (selectedHall) {
                    hitUrl += `${startDate && endDate ? "&" : "?"}hall_id=${selectedHall}`;
                }
                if (selectedPaymentStatus) {
                    hitUrl += `${
                        (startDate && endDate) || selectedHall ? "&" : "?"
                    }payment_status=${selectedPaymentStatus}`;
                }
            }

            let response = "";

            if (reportType === "renewal" || reportType === "payment-summary") {
                response = responseData.csv;
            } else {
                response = await axios.get(hitUrl, { responseType: "blob" });
            }

            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement("a");
            link.href = url;
            if (startDate && endDate) {
                link.setAttribute(
                    "download",
                    `${reportType}_${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}.csv`,
                ); // Filename
            } else {
                link.setAttribute("download", `${reportType}.csv`); // Filename
            }
            document.body.appendChild(link);
            link.click();

            setExporting(false);
        } catch (e) {
            setExporting(false);
        }
    };

    return (
        <Stack spacing={1}>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container justifyContent="space-between">
                    <Grid item xs={6} sx={{ alignSelf: "center" }}>
                        <Typography variant="h6">{capitalizeFirstLetter(reportType)} Reports</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{ marginBottom: "24px", padding: 1.5 }}>
                <Grid container gap={2}>
                    {reportType === "payment-summary" && (
                        <Fragment>
                            <Grid item xs={12} md={3}>
                                <AutoCompleteSelect
                                    multiple={true}
                                    id="batch-autocomplete"
                                    options={
                                        [
                                            {
                                                value: "enrollment",
                                                label: "Enrollment",
                                            },
                                            {
                                                value: "membership",
                                                label: "Membership",
                                            },
                                            {
                                                value: "booking",
                                                label: "Bookings",
                                            },
                                        ] || []
                                    }
                                    label="Select Payment Type"
                                    onChange={(e, val) => setPaymentReportType(val)}
                                    value={paymentReportType}
                                    isOptionEqualToValue={(option, value) => option.label === value.label}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <AutoCompleteSelect
                                    multiple={true}
                                    id="paymentmode-autocomplete"
                                    options={
                                        [
                                            {
                                                value: "Online",
                                                label: "Online",
                                            },
                                            { label: "Cheque", value: "Cheque" },
                                            { label: "Netbanking", value: "Netbanking" },
                                            { label: "UPI", value: "UPI" },
                                            { label: "G-Pay", value: "G-Pay" },
                                            { label: "Phone-Pe", value: "Phone-Pe" },
                                            { label: "Others", value: "Others" },
                                        ] || []
                                    }
                                    label="Select Payment Mode"
                                    onChange={(e, val) => setPaymentMode(val)}
                                    value={paymentMode}
                                    isOptionEqualToValue={(option, value) => option.label === value.label}
                                />
                            </Grid>
                        </Fragment>
                    )}
                    {reportType === "batch-wise" && (
                        <Fragment>
                            <Grid item xs={12} md={3}>
                                <BasicSelect
                                    size="small"
                                    value={selectedActivity}
                                    onChange={(e) => setSelectedActivity(e.target.value)}
                                    displayEmpty
                                    label="Selet Activity"
                                    name="activity_name"
                                    id="activity_name"
                                    items={[
                                        {
                                            value: "",
                                            label: "Select Activity",
                                        },
                                        ...(activityData ? activityData : []),
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <AutoCompleteSelect
                                    multiple={true}
                                    id="batch-autocomplete"
                                    options={batchData || []}
                                    label="Select Batches"
                                    onChange={(e, val) => setSelectedBatch(val)}
                                    value={selectedBatch || []}
                                    isOptionEqualToValue={(option, value) => option.label === value.label}
                                />
                            </Grid>
                        </Fragment>
                    )}
                    {reportType === "event-bookings" && (
                        <Fragment>
                            <Grid item xs={12} md={3}>
                                <BasicSelect
                                    size="small"
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    displayEmpty
                                    label="Select Event"
                                    name="event_id"
                                    id="event_id"
                                    items={[
                                        {
                                            value: "",
                                            label: "All Events",
                                        },
                                        ...(eventData ? eventData : []),
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <BasicSelect
                                    size="small"
                                    value={selectedPaymentStatus}
                                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                    displayEmpty
                                    label="Payment Status"
                                    name="payment_status"
                                    id="payment_status"
                                    items={[
                                        {
                                            value: "",
                                            label: "All Status",
                                        },
                                        {
                                            value: "Success",
                                            label: "Success",
                                        },
                                        {
                                            value: "Pending",
                                            label: "Pending",
                                        },
                                        {
                                            value: "Failed",
                                            label: "Failed",
                                        },
                                    ]}
                                />
                            </Grid>
                        </Fragment>
                    )}
                    {reportType !== "renewal" &&
                        reportType !== "batch-wise" &&
                        reportType !== "event-bookings" &&
                        reportType !== "hall-bookings" && (
                            <Fragment>
                                <Grid item xs={12} md={3}>
                                    <DatePickerComponent
                                        id={"start_date"}
                                        name={"start_date"}
                                        label="Start Date"
                                        onChange={(val) => setStartDate(val)}
                                        value={startDate}
                                        fullWidth
                                        minDate={null}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <DatePickerComponent
                                        id={"end_date"}
                                        name={"end_date"}
                                        label="End Date"
                                        onChange={(val) => setEndDate(val)}
                                        value={endDate}
                                        fullWidth
                                        minDate={null}
                                    />
                                </Grid>
                            </Fragment>
                        )}
                    {reportType === "event-bookings" && (
                        <Fragment>
                            <Grid item xs={12} md={3}>
                                <DatePickerComponent
                                    id={"start_date"}
                                    name={"start_date"}
                                    label="Start Date"
                                    onChange={(val) => setStartDate(val)}
                                    value={startDate}
                                    fullWidth
                                    minDate={null}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DatePickerComponent
                                    id={"end_date"}
                                    name={"end_date"}
                                    label="End Date"
                                    onChange={(val) => setEndDate(val)}
                                    value={endDate}
                                    fullWidth
                                    minDate={null}
                                />
                            </Grid>
                        </Fragment>
                    )}
                    {reportType === "hall-bookings" && (
                        <Fragment>
                            <Grid item xs={12} md={3}>
                                <BasicSelect
                                    size="small"
                                    value={selectedHall}
                                    onChange={(e) => setSelectedHall(e.target.value)}
                                    displayEmpty
                                    label="Select Hall"
                                    name="hall_id"
                                    id="hall_id"
                                    items={[
                                        {
                                            value: "",
                                            label: "All Halls",
                                        },
                                        ...(hallData &&
                                        hallData?.result?.result &&
                                        Array.isArray(hallData?.result?.result)
                                            ? hallData?.result?.result.map((hall) => ({
                                                  value: hall._id,
                                                  label: hall.name,
                                              }))
                                            : []),
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <BasicSelect
                                    size="small"
                                    value={selectedPaymentStatus}
                                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                    displayEmpty
                                    label="Payment Status"
                                    name="payment_status"
                                    id="payment_status"
                                    items={[
                                        {
                                            value: "",
                                            label: "All Status",
                                        },
                                        {
                                            value: "Success",
                                            label: "Success",
                                        },
                                        {
                                            value: "Pending",
                                            label: "Pending",
                                        },
                                        {
                                            value: "Failed",
                                            label: "Failed",
                                        },
                                    ]}
                                />
                            </Grid>
                        </Fragment>
                    )}
                    {reportType === "hall-bookings" && (
                        <Fragment>
                            <Grid item xs={12} md={3}>
                                <DatePickerComponent
                                    id={"start_date"}
                                    name={"start_date"}
                                    label="Start Date"
                                    onChange={(val) => setStartDate(val)}
                                    value={startDate}
                                    fullWidth
                                    minDate={null}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DatePickerComponent
                                    id={"end_date"}
                                    name={"end_date"}
                                    label="End Date"
                                    onChange={(val) => setEndDate(val)}
                                    value={endDate}
                                    fullWidth
                                    minDate={null}
                                />
                            </Grid>
                        </Fragment>
                    )}

                    {reportType === "renewal" && (
                        <RenewalReport data={responseData?.filteredData || []} loading={responseData ? false : true} />
                    )}
                </Grid>
                <Grid container pt={2} justifyContent="flex-end" gap={2}>
                    <HasPermission
                        permission={
                            reportType === "event-bookings"
                                ? PERMISSIONS.REPORTS.EVENT.EXPORT_DATA
                                : reportType === "hall-bookings"
                                ? PERMISSIONS.REPORTS.HALL.EXPORT_DATA
                                : PERMISSIONS.REPORTS.MEMBERS.EXPORT_DATA
                        }
                        fallback={null}
                    >
                        <Button
                            size="large"
                            type="submit"
                            fullWidth={false}
                            loading={exporting}
                            onClick={() => handleExport()}
                        >
                            Export & Download
                        </Button>
                    </HasPermission>
                </Grid>
            </Paper>

            {reportType === "batch-wise" && batchWiseReport && batchWiseReport.length > 0 && (
                <Paper sx={{ width: "100%" }}>
                    <BatchReportTable data={batchWiseReport || []} loading={batchWiseReportLoading} />
                </Paper>
            )}

            {reportType === "payment-summary" && (
                <PaymentSummaryReport data={responseData?.filteredData || []} loading={responseData ? false : true} />
            )}
        </Stack>
    );
};

export default ReportsManagerContainer;
