import React, { Fragment, useState } from "react";
import { Grid } from "@mui/material";
import { formatISO, parseISO, isBefore } from "date-fns";
import DatePickerComponent from "./DatePicker";
import TimePickerComponent from "./TimePicker";
import { capitalizeFirstLetter } from "../../helpers/utils";

const DateTimePickerComponent = ({
    values,
    setFieldValue,
    handleBlur,
    disabled,
    errors: formError = {},
    fieldNames = {
        startDate: "start_date",
        endDate: "end_date",
        startTime: "start_time",
        endTime: "end_time",
    },
    showTime = true,
}) => {
    const [errors, setErrors] = useState(formError || {});

    const validateDates = (startDate, endDate) => {
        const errors = {};
        // minus one day
        const currentDate = new Date() - 24 * 60 * 60 * 1000;
        if (startDate && isBefore(startDate, currentDate)) {
            errors[fieldNames?.startDate] = "Start date cannot be in the past.";
        }
        if (startDate && endDate && isBefore(endDate, startDate)) {
            errors[fieldNames?.endDate] = "End date must be after the start date.";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleStartDateChange = (val) => {
        const newStartDate = formatISO(val);
        validateDates(val, values?.[fieldNames?.endDate] ? parseISO(values[fieldNames?.endDate]) : null);
        setFieldValue(fieldNames?.startDate, newStartDate);
    };

    const handleEndDateChange = (val) => {
        const newEndDate = formatISO(val);
        validateDates(values?.[fieldNames?.startDate] ? parseISO(values[fieldNames?.startDate]) : null, val);
        setFieldValue(fieldNames?.endDate, newEndDate);
    };

    return (
        <Fragment>
            <Grid item xs={12} md={6}>
                <DatePickerComponent
                    id={fieldNames?.startDate}
                    name={fieldNames?.startDate}
                    label={capitalizeFirstLetter(fieldNames?.startDate?.replace("_", " ")) + " *"}
                    onChange={handleStartDateChange}
                    value={values?.[fieldNames?.startDate] ? new Date(parseISO(values[fieldNames?.startDate])) : null}
                    fullWidth
                    onBlur={handleBlur}
                    variant="outlined"
                    disabled={disabled}
                    error={!!errors[fieldNames?.startDate]}
                    helperText={errors[fieldNames?.startDate]}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <DatePickerComponent
                    id={fieldNames?.endDate}
                    name={fieldNames?.endDate}
                    label={capitalizeFirstLetter(fieldNames?.endDate?.replace("_", " ")) + " *"}
                    onChange={handleEndDateChange}
                    value={values?.[fieldNames?.endDate] ? new Date(parseISO(values[fieldNames?.endDate])) : null}
                    fullWidth
                    onBlur={handleBlur}
                    variant="outlined"
                    disabled={disabled}
                    error={!!errors[fieldNames?.endDate]}
                    helperText={errors[fieldNames?.endDate]}
                />
            </Grid>
            {showTime && (
                <Fragment>
                    <Grid item xs={6} md={6}>
                        <TimePickerComponent
                            label={capitalizeFirstLetter(fieldNames?.startTime?.replace("_", " ")) + " *"}
                            onChange={(e) => setFieldValue(fieldNames?.startTime, formatISO(e))}
                            value={
                                values?.[fieldNames?.startTime]
                                    ? new Date(parseISO(values[fieldNames?.startTime]))
                                    : null
                            }
                            name={fieldNames?.startTime}
                            id={`time-select-${fieldNames?.startTime}`}
                            sx={{ width: "100%" }}
                            size="small"
                            variant="outlined"
                            disabled={disabled}
                            error={!!errors[fieldNames?.startTime]}
                            helperText={errors[fieldNames?.startTime]}
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <TimePickerComponent
                            label={capitalizeFirstLetter(fieldNames?.endTime?.replace("_", " ")) + " *"}
                            onChange={(e) => setFieldValue(fieldNames?.endTime, formatISO(e))}
                            value={
                                values?.[fieldNames?.endTime] ? new Date(parseISO(values[fieldNames?.endTime])) : null
                            }
                            name={fieldNames?.endTime}
                            id={`time-select-${fieldNames?.endTime}`}
                            sx={{ width: "100%" }}
                            size="small"
                            variant="outlined"
                            disabled={disabled}
                            error={!!errors[fieldNames?.endTime]}
                            helperText={errors[fieldNames?.endTime]}
                        />
                    </Grid>
                </Fragment>
            )}
        </Fragment>
    );
};

export default DateTimePickerComponent;
