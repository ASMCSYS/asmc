import { Grid, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import TimePickerComponent from "./TimePicker";
import IconButtonIcons from "./IconButtonIcons";

const TimeSlotAddModal = ({ timeSlotArray, setTimeSlotArray, disabled = false }) => {
    const staticSlot = {
        from: false,
        to: false,
    };

    const handleTimeSelect = (newValue, slotIndex, from_to) => {
        setTimeSlotArray((prev) => {
            const updated = [...prev];
            updated[slotIndex] = {
                ...updated[slotIndex],
                [from_to === "from-time" ? "from" : "to"]: newValue,
            };
            return updated;
        });
    };

    const deleteSlot = (slotIndex) => {
        setTimeSlotArray((prev) => {
            const updated = [...prev];
            updated.splice(slotIndex, 1);
            return updated;
        });
    };

    const handleAddSlot = () => {
        setTimeSlotArray((prev) => [...prev, staticSlot]);
    };

    return (
        <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">Add Time Slots</Typography>
            </Grid>
            {timeSlotArray.map((slot, index) => (
                <Grid container spacing={2} key={index} px={2} py={1}>
                    <Grid item xs={5}>
                        <TimePickerComponent
                            label="Start Time"
                            onChange={(e) => handleTimeSelect(e, index, "from-time")}
                            value={slot.from ? new Date(slot.from) : null}
                            name="time_id"
                            keyname="Time"
                            id={`time-select-${index}-from`}
                            sx={{ width: "100%" }}
                            size="small"
                            variant="outlined"
                            disabled={disabled}
                            ampm={false}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TimePickerComponent
                            label="End Time"
                            onChange={(e) => handleTimeSelect(e, index, "to-time")}
                            value={slot.to ? new Date(slot.to) : null}
                            name="time_id"
                            keyname="Time"
                            id={`time-select-${index}-to`}
                            sx={{ width: "100%" }}
                            size="small"
                            variant="outlined"
                            disabled={disabled}
                            ampm={false}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButtonIcons
                            disabled={disabled}
                            color="error"
                            title="Delete"
                            IconComponent={DeleteOutline}
                            onClick={() => deleteSlot(index)}
                        />
                    </Grid>
                </Grid>
            ))}
            <Grid item>
                <IconButton disabled={disabled} aria-label="add" onClick={handleAddSlot}>
                    <AddIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default TimeSlotAddModal;
