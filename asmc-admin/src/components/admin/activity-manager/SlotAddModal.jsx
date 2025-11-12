import { feesAddValidation } from "./ActivityValidation";
import { Box, FormControlLabel, Grid } from "@mui/material";
import Button from "../../Common/Button";
import IconButtonIcons from "../../Common/IconButtonIcons";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { DeleteOutline } from "@mui/icons-material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Fragment, useState } from "react";
import { Typography, Checkbox, Popover } from "@mui/material";
import TimePickerComponent from "../../Common/TimePicker";
import Input from "../../Common/Input";

const SlotAddModal = ({ timeSlotArray, setTimeSlotArray, disabled = false }) => {
    const [dayCopy, setDayCopy] = useState([
        { Mon: false },
        { Tue: false },
        { Wed: false },
        { Thu: false },
        { Fri: false },
        { Sat: false },
        { Sun: false },
    ]);

    const staticSlot = {
        from: false,
        to: false,
        price: 0,
        non_price: 0,
    };

    function handleTimeSelect(newValue, dayIndex, slotIndex, from_to) {
        if (from_to === "from-time") {
            setTimeSlotArray((prevtimeSlotArray) => {
                const updatedtimeSlotArray = [...prevtimeSlotArray];
                const updatedSlots = [...updatedtimeSlotArray[dayIndex].time_slots];
                updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], from: newValue };
                updatedtimeSlotArray[dayIndex] = { ...updatedtimeSlotArray[dayIndex], time_slots: updatedSlots };
                return updatedtimeSlotArray;
            });
        } else if (from_to === "to-time") {
            setTimeSlotArray((prevtimeSlotArray) => {
                const updatedtimeSlotArray = [...prevtimeSlotArray];
                const updatedSlots = [...updatedtimeSlotArray[dayIndex].time_slots];
                updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], to: newValue };
                updatedtimeSlotArray[dayIndex] = { ...updatedtimeSlotArray[dayIndex], time_slots: updatedSlots };
                return updatedtimeSlotArray;
            });
        } else if (from_to === "price") {
            setTimeSlotArray((prevtimeSlotArray) => {
                const updatedtimeSlotArray = [...prevtimeSlotArray];
                const updatedSlots = [...updatedtimeSlotArray[dayIndex].time_slots];
                updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], price: newValue };
                updatedtimeSlotArray[dayIndex] = { ...updatedtimeSlotArray[dayIndex], time_slots: updatedSlots };
                return updatedtimeSlotArray;
            });
        } else if (from_to === "non_price") {
            setTimeSlotArray((prevtimeSlotArray) => {
                const updatedtimeSlotArray = [...prevtimeSlotArray];
                const updatedSlots = [...updatedtimeSlotArray[dayIndex].time_slots];
                updatedSlots[slotIndex] = { ...updatedSlots[slotIndex], non_price: newValue };
                updatedtimeSlotArray[dayIndex] = { ...updatedtimeSlotArray[dayIndex], time_slots: updatedSlots };
                return updatedtimeSlotArray;
            });
        }
    }

    function deleteSlot(dayIndex, slotIndex) {
        if (dayIndex >= 0 && dayIndex < timeSlotArray.length) {
            const updatedtimeSlotArray = JSON.parse(JSON.stringify(timeSlotArray));
            if (slotIndex >= 0 && slotIndex < updatedtimeSlotArray[dayIndex].time_slots.length) {
                updatedtimeSlotArray[dayIndex].time_slots.splice(slotIndex, 1);
                setTimeSlotArray(updatedtimeSlotArray);
            }
        }
    }

    function handleAddDropdown(dayIndex) {
        if (dayIndex >= 0 && dayIndex < timeSlotArray.length) {
            const updatedtimeSlotArray = JSON.parse(JSON.stringify(timeSlotArray));
            updatedtimeSlotArray[dayIndex].time_slots.push(staticSlot);
            setTimeSlotArray(updatedtimeSlotArray);
        }
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(null);

    const handleClick = (event, day) => {
        setAnchorEl(event.currentTarget);
        setOpen(day);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(null);
    };

    const handleChkChange = (day, dayindex) => {
        setDayCopy((prevDayCopy) => {
            const updatedDayCopy = [...prevDayCopy];

            updatedDayCopy[dayindex][day] = !prevDayCopy[dayindex][day];

            return updatedDayCopy;
        });
    };

    const handleCopy = (dayindex) => {
        const MainSlot = timeSlotArray[dayindex].time_slots;
        const updatedtimeSlotArray = timeSlotArray.map((day, index) => {
            if (dayCopy[index][day.day]) {
                return { ...day, time_slots: [...MainSlot] };
            } else {
                return day;
            }
        });

        setTimeSlotArray(updatedtimeSlotArray);
        handleClose();
    };

    return (
        <Grid container direction="column" width="100%" height="100%" sx={{ display: "flex" }}>
            {timeSlotArray.map((day, dayindex) => (
                <Grid
                    key={day.day}
                    item
                    px={2}
                    py={2}
                    sx={{
                        overflowY: "auto",
                        ...(day.time_slots.length > 0 ? { flex: 1 } : { flex: "none" }), // Apply flex only when needed
                        minHeight: "auto", // prevent unwanted height stretch
                        borderBottom: "1px solid #eee",
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={1}>
                            <Typography variant="h6">{day.day}</Typography>
                        </Grid>

                        {/* Render slots if available */}
                        <Grid item xs={12} md={10}>
                            {day.time_slots.length > 0 ? (
                                day.time_slots.map((slot, index) => (
                                    <Grid key={`${day.day}-${index}`} container spacing={2} alignItems="center" mb={1}>
                                        <Grid item xs={6} md={3}>
                                            <TimePickerComponent
                                                label="Start Time"
                                                onChange={(e) => handleTimeSelect(e, dayindex, index, "from-time")}
                                                value={slot.from ? new Date(slot.from) : null}
                                                id={`start-time-${day.day}-${index}`}
                                                disabled={disabled}
                                                sx={{ width: "100%" }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <TimePickerComponent
                                                label="End Time"
                                                onChange={(e) => handleTimeSelect(e, dayindex, index, "to-time")}
                                                value={slot.to ? new Date(slot.to) : null}
                                                id={`end-time-${day.day}-${index}`}
                                                disabled={disabled}
                                                sx={{ width: "100%" }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={2}>
                                            <Input
                                                label="Member Price *"
                                                type="number"
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value, 10);
                                                    handleTimeSelect(
                                                        isNaN(value) || value < 0 ? null : value,
                                                        dayindex,
                                                        index,
                                                        "price",
                                                    );
                                                }}
                                                value={slot.price ?? ""}
                                                disabled={disabled}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={2}>
                                            <Input
                                                label="Non-Member Price *"
                                                type="number"
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value, 10);
                                                    handleTimeSelect(
                                                        isNaN(value) || value < 0 ? null : value,
                                                        dayindex,
                                                        index,
                                                        "non_price",
                                                    );
                                                }}
                                                value={slot.non_price ?? ""}
                                                disabled={disabled}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={1}>
                                            <IconButtonIcons
                                                disabled={disabled}
                                                color="error"
                                                title="Delete"
                                                IconComponent={DeleteOutline}
                                                onClick={() => deleteSlot(dayindex, index)}
                                            />
                                        </Grid>
                                    </Grid>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No time slots added yet.
                                </Typography>
                            )}
                        </Grid>

                        {/* Add/Copy Buttons */}
                        <Grid item xs={12} md={1}>
                            <IconButton
                                disabled={disabled}
                                aria-label="add"
                                onClick={() => handleAddDropdown(dayindex)}
                            >
                                <AddIcon />
                            </IconButton>
                            <IconButton disabled={disabled} aria-label="copy" onClick={(e) => handleClick(e, day)}>
                                <FileCopyIcon />
                            </IconButton>
                            <Popover
                                className="testing-popover"
                                id={`popover-${day.day}`}
                                open={open === day}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: "center", horizontal: "right" }}
                                transformOrigin={{ vertical: "top", horizontal: "left" }}
                            >
                                <Box p={2}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Select days to copy:
                                    </Typography>
                                    {timeSlotArray.map((otherDay, otherIndex) =>
                                        otherIndex === dayindex ? null : (
                                            <FormControlLabel
                                                key={otherDay.day}
                                                control={
                                                    <Checkbox
                                                        disabled={disabled}
                                                        onChange={() => handleChkChange(otherDay.day, otherIndex)}
                                                    />
                                                }
                                                label={otherDay.day}
                                            />
                                        ),
                                    )}
                                    <Button
                                        disabled={disabled}
                                        onClick={() => handleCopy(dayindex)}
                                        sx={{ mt: 1 }}
                                        variant="contained"
                                    >
                                        Copy
                                    </Button>
                                </Box>
                            </Popover>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};

export default SlotAddModal;
