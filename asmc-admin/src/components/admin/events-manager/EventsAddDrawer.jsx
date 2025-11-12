import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { EventsValidation } from "./EventsValidation";
import {
    Box,
    Card,
    CardContent,
    Drawer,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import IconButtonIcons from "../../Common/IconButtonIcons";
import Button from "../../Common/Button";
import { useDispatch } from "react-redux";

import { setSnackBar } from "../../../store/common/commonSlice";
import Input from "../../Common/Input";
import RichTextEditor from "../../Common/editor/RichTextEditor";
import StyledTextarea from "../../Common/StyledTextarea";
import { useGetParentLocationListQuery } from "../../../store/masters/mastersApis";
import BasicSelect from "../../Common/Select";
import DateTimePickerComponent from "../../Common/DateTimePickerComponent";
import { useAddNewEventMutation, useUpdateEventMutation } from "../../../store/events/eventsApis";
import { MultipleFileUploadToServer } from "../../Common/MultipleFileUploadToServer";
import { eventSampleContent } from "../../../helpers/constants";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { CategoryAdd } from "./CategoryAdd";
import CommonModal from "../../Common/CommonModal";

const initialCategoryData = {
    category_name: "",
    start_age: "",
    end_age: "",
    gender: [],
    distance: "",
    belts: "",
    members_fees: 0,
    non_members_fees: 0,
    category_description: "",
};

export const EventsAddDrawer = ({ initialValues, show, close, formType, getActiveLocationList }) => {
    const dispatch = useDispatch();
    const disabled = formType === "View" ? true : false;
    const [subLocation, setSubLocation] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [categoryInitalval, setCategoryInitalval] = useState(initialCategoryData);
    const [categoryEditKey, setCategoryEditKey] = useState(false);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        setCategoryData(initialValues?.category_data || []);
    }, [initialValues?.category_data]);

    const [addNewEvents, { isLoading: addEventsLoading }] = useAddNewEventMutation();
    const [updateEvents, { isLoading: updateEventsLoading }] = useUpdateEventMutation();

    const { data: locationData } = useGetParentLocationListQuery({}, { skip: !show });

    const fetchSubLocation = async (val) => {
        const res = await getActiveLocationList({
            parent_id: val,
            active: true,
            limit: 1000000,
        });
        const filterData =
            (res?.data &&
                res?.data.map((item) => ({
                    value: item._id,
                    label: item.title,
                }))) ||
            [];
        setSubLocation(filterData || []);
    };

    useEffect(() => {
        if (initialValues?.location_data) {
            fetchSubLocation(initialValues?.location_data?._id);
        }
    }, [initialValues]);

    const onFormSubmit = async (values) => {
        try {
            let payload = {
                ...values,
            };

            payload.category_data = categoryData;

            if (formType === "Edit") {
                payload._id = initialValues._id;
                delete payload.location_data;
                delete payload.sublocation_data;
                await updateEvents(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Events updated successfully",
                        severity: "success",
                    }),
                );
            } else {
                await addNewEvents(payload).unwrap();
                dispatch(
                    setSnackBar({
                        open: true,
                        message: "Events created successfully",
                        severity: "success",
                    }),
                );
            }
            close();
        } catch (error) {
            dispatch(
                setSnackBar({
                    open: true,
                    message: error?.data?.message || error.message,
                    severity: "error",
                }),
            );
        }
    };

    const handleAddCategoryVariation = () => {
        setShowModal(true);
        setCategoryInitalval(initialCategoryData);
        setCategoryEditKey(false);
    };

    const handleDeleteCategory = (data, key) => {
        let oldData = JSON.parse(JSON.stringify(categoryData));
        oldData.splice(key, 1);
        setCategoryData(oldData);
    };

    const handleEditCategory = (data, key) => {
        setCategoryEditKey(key);
        setCategoryInitalval(data);
        setShowModal(true);
    };

    const CategoryComponent = ({ eventType }) => {
        const onCategorySubmit = (val) => {
            let oldData = JSON.parse(JSON.stringify(categoryData));

            console.log(val, "valvalval");

            if (categoryEditKey !== false) {
                oldData[categoryEditKey] = val;
            } else {
                oldData.push(val);
            }
            setCategoryData(oldData);
            setCategoryInitalval(initialCategoryData);
            setCategoryEditKey(false);
            setShowModal(false);
        };

        return <CategoryAdd categoryInitalval={categoryInitalval} submit={onCategorySubmit} eventType={eventType} />;
    };

    return (
        <Drawer
            anchor={"right"}
            open={show}
            PaperProps={{
                sx: { width: { xs: "100%", md: "70%", sm: "70%", lg: "70%" } },
            }}
            onClose={() => close()}
        >
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => onFormSubmit(values)}
                validationSchema={EventsValidation}
                enableReinitialize
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                    <Grid container sx={{ display: "flex" }} direction={"column"} width={"100%"} height={"100%"}>
                        <Grid container flex={0} px={1} py={1} borderBottom={1} borderColor={"rgba(5, 5, 5, 0.06)"}>
                            <Grid item alignSelf={"center"}>
                                <IconButtonIcons
                                    color="default"
                                    title="Close"
                                    IconComponent={CloseIcon}
                                    onClick={() => close()}
                                />
                            </Grid>
                            <Grid item alignSelf={"center"}>
                                <Typography variant="h6">{formType} Events</Typography>
                            </Grid>
                        </Grid>
                        <Grid flex={1} px={2} py={5} overflow={"auto"}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <MultipleFileUploadToServer
                                        name="images"
                                        onChange={(val) => setFieldValue("images", val)}
                                        value={values?.images || []}
                                        label="Event Banners (400 X 250 in pixels)"
                                        error={Boolean(errors.images)}
                                        helperText={errors.images}
                                        disabled={disabled}
                                        multiple={true}
                                        width={800}
                                        height={800}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Input
                                        id="event_name"
                                        name="event_name"
                                        label="Event Name *"
                                        onChange={handleChange("event_name")}
                                        value={values?.event_name || ""}
                                        error={Boolean(errors.event_name)}
                                        helperText={errors.event_name}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.location_id || ""}
                                        onChange={(e) => [
                                            setFieldValue("location_id", e.target.value),
                                            fetchSubLocation(e.target.value),
                                        ]}
                                        displayEmpty
                                        label="Select Location*"
                                        name="location_id"
                                        id="location_id"
                                        items={locationData || []}
                                        disabled={disabled}
                                        error={Boolean(errors?.location_id)}
                                        helperText={errors?.location_id}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.sublocation_id || ""}
                                        onChange={(e) => [setFieldValue("sublocation_id", e.target.value)]}
                                        displayEmpty
                                        label="Select Sub Location"
                                        name="sublocation_id"
                                        id="sublocation_id"
                                        items={subLocation || []}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.court || "Any"}
                                        onChange={handleChange("court")}
                                        displayEmpty
                                        label="Select Court"
                                        name="court"
                                        id="court"
                                        items={[
                                            {
                                                value: "Any",
                                                label: "Any",
                                            },
                                            {
                                                value: "Court A",
                                                label: "Court A",
                                            },
                                            {
                                                value: "Court B",
                                                label: "Court B",
                                            },
                                            {
                                                value: "Court C",
                                                label: "Court C",
                                            },
                                            {
                                                value: "Court A & B",
                                                label: "Court A & B",
                                            },
                                        ]}
                                        disabled={disabled}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <StyledTextarea
                                        id="description"
                                        name="description"
                                        label="Description *"
                                        onChange={handleChange("description")}
                                        value={values?.description || ""}
                                        error={Boolean(errors.description)}
                                        helperText={errors.description}
                                        fullWidth
                                        disabled={disabled}
                                        minRows={2}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Registration Start & End Date *</Typography>
                                    <Grid container spacing={2}>
                                        <DateTimePickerComponent
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            disabled={disabled}
                                            errors={errors}
                                            fieldNames={{
                                                startDate: "registration_start_date",
                                                endDate: "registration_end_date",
                                                startTime: "registration_start_time",
                                                endTime: "registration_end_time",
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Broadcast Start & End Date *</Typography>
                                    <Grid container spacing={2}>
                                        <DateTimePickerComponent
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            disabled={disabled}
                                            errors={errors}
                                            fieldNames={{
                                                startDate: "broadcast_start_date",
                                                endDate: "broadcast_end_date",
                                            }}
                                            showTime={false}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Event Start & End Date *</Typography>
                                    <Grid container spacing={2}>
                                        <DateTimePickerComponent
                                            values={values}
                                            setFieldValue={setFieldValue}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            disabled={disabled}
                                            errors={errors}
                                            fieldNames={{
                                                startDate: "event_start_date",
                                                endDate: "event_end_date",
                                                startTime: "event_start_time",
                                                endTime: "event_end_time",
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.event_type || ""}
                                        onChange={handleChange("event_type")}
                                        displayEmpty
                                        label="Event Type *"
                                        name="event_type"
                                        id="event_type"
                                        items={[
                                            {
                                                value: "Single",
                                                label: "Single",
                                            },
                                            {
                                                value: "Double",
                                                label: "Double",
                                            },
                                            {
                                                value: "Team",
                                                label: "Team",
                                            },
                                        ]}
                                        disabled={disabled}
                                        error={Boolean(errors.event_type)}
                                        helperText={errors.event_type}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        size="small"
                                        value={values?.members_type || ""}
                                        onChange={handleChange("members_type")}
                                        displayEmpty
                                        label="Members Type *"
                                        name="members_type"
                                        id="members_type"
                                        items={[
                                            {
                                                value: "Both",
                                                label: "Both",
                                            },
                                            {
                                                value: "Members Only",
                                                label: "Members Only",
                                            },
                                            {
                                                value: "Non Members Only",
                                                label: "Non Members Only",
                                            },
                                        ]}
                                        disabled={disabled}
                                        error={Boolean(errors.members_type)}
                                        helperText={errors.members_type}
                                    />
                                </Grid>
                                {values?.event_type === "Team" && (
                                    <Fragment>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="players_limit"
                                                name="players_limit"
                                                label="Player Limit *"
                                                onChange={(e) => {
                                                    if (e.target.value < 0) {
                                                        e.target.value = 0;
                                                    }
                                                    setFieldValue("players_limit", e.target.value);
                                                }}
                                                value={values?.players_limit || 0}
                                                error={Boolean(errors.players_limit)}
                                                helperText={errors.players_limit}
                                                fullWidth
                                                disabled={disabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="min_players_limit"
                                                name="min_players_limit"
                                                label="Minimum Player Limit *"
                                                onChange={(e) => {
                                                    if (e.target.value < 0) {
                                                        e.target.value = 0;
                                                    }
                                                    setFieldValue("min_players_limit", e.target.value);
                                                }}
                                                value={values?.min_players_limit || 0}
                                                error={Boolean(errors.min_players_limit)}
                                                helperText={errors.min_players_limit}
                                                fullWidth
                                                disabled={disabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="member_team_event_price"
                                                name="member_team_event_price"
                                                label="Enter Member Team Event Price *"
                                                type="number" // ensures number keyboard on mobile and blocks letters
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const numericValue = parseInt(value, 10);

                                                    if (numericValue < 0) {
                                                        setFieldValue("member_team_event_price", 0);
                                                    } else if (!isNaN(numericValue) && numericValue >= 0) {
                                                        setFieldValue("member_team_event_price", numericValue);
                                                    } else {
                                                        setFieldValue("member_team_event_price", null);
                                                    }
                                                }}
                                                value={values?.member_team_event_price}
                                                error={Boolean(errors.member_team_event_price)}
                                                helperText={errors.member_team_event_price}
                                                fullWidth
                                                disabled={disabled}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Input
                                                id="non_member_team_event_price"
                                                name="non_member_team_event_price"
                                                label="Enter Non Member Team Event Price *"
                                                type="number" // ensures number keyboard on mobile and blocks letters
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const numericValue = parseInt(value, 10);

                                                    if (numericValue < 0) {
                                                        setFieldValue("member_team_event_price", 0);
                                                    } else if (!isNaN(numericValue) && numericValue >= 0) {
                                                        setFieldValue("non_member_team_event_price", numericValue);
                                                    } else {
                                                        setFieldValue("non_member_team_event_price", null);
                                                    }
                                                }}
                                                value={values?.non_member_team_event_price}
                                                error={Boolean(errors.non_member_team_event_price)}
                                                helperText={errors.non_member_team_event_price}
                                                fullWidth
                                                disabled={disabled}
                                            />
                                        </Grid>
                                    </Fragment>
                                )}

                                <Grid item xs={12} md={12}>
                                    <Grid
                                        item
                                        xs={12}
                                        md={12}
                                        display={"flex"}
                                        gap={2}
                                        flexDirection={"row"}
                                        alignItems={"center"}
                                    >
                                        <Typography variant="h6">Categories Variation</Typography>
                                        <IconButtonIcons
                                            disabled={disabled}
                                            size="small"
                                            color="info"
                                            onClick={() => handleAddCategoryVariation()}
                                            IconComponent={Add}
                                        />
                                    </Grid>

                                    {categoryData && categoryData.length > 0 ? (
                                        <Fragment>
                                            <Grid item xs={12} md={12}>
                                                <Grid container spacing={2}>
                                                    {categoryData.map((obj, key) => {
                                                        return (
                                                            <Grid item xs={3} key={key}>
                                                                <Card
                                                                    variant="outlined"
                                                                    sx={{
                                                                        position: "relative",
                                                                    }}
                                                                >
                                                                    <CardContent>
                                                                        <Typography variant="h5" component="div">
                                                                            {obj.category_name}
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            Age: {obj.start_age} - {obj.end_age}
                                                                        </Typography>
                                                                        {values?.event_type !== "Team" && (
                                                                            <Fragment>
                                                                                <Typography variant="body2">
                                                                                    Member Fees: {obj.members_fees} Rs
                                                                                </Typography>
                                                                                <Typography variant="body2">
                                                                                    Non Member Fees:{" "}
                                                                                    {obj.non_members_fees} Rs
                                                                                </Typography>
                                                                            </Fragment>
                                                                        )}
                                                                        <Box
                                                                            sx={{
                                                                                position: "absolute",
                                                                                right: 0,
                                                                                top: 0,
                                                                            }}
                                                                        >
                                                                            <IconButtonIcons
                                                                                disabled={disabled}
                                                                                color="info"
                                                                                title="Edit"
                                                                                IconComponent={EditOutlined}
                                                                                onClick={() =>
                                                                                    handleEditCategory(obj, key)
                                                                                }
                                                                            />
                                                                            <IconButtonIcons
                                                                                disabled={disabled}
                                                                                color="error"
                                                                                title="Delete"
                                                                                IconComponent={DeleteOutline}
                                                                                onClick={() =>
                                                                                    handleDeleteCategory(obj, key)
                                                                                }
                                                                            />
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            </Grid>
                                        </Fragment>
                                    ) : null}
                                </Grid>

                                <CommonModal
                                    show={showModal}
                                    close={() => setShowModal(false)}
                                    title="Add Category"
                                    child_component={<CategoryComponent eventType={values?.event_type} />}
                                    maxWidth="md"
                                />

                                {/* <Grid item xs={12} md={6}>
                                    <Input
                                        id="non_members_player_limit"
                                        name="non_members_player_limit"
                                        label="Player Limit of Non Member *"
                                        onChange={(e) => {
                                            if (e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            setFieldValue(
                                                'non_members_player_limit',
                                                e.target.value,
                                            );
                                        }}
                                        value={values?.non_members_player_limit || ''}
                                        error={Boolean(errors.non_members_player_limit)}
                                        helperText={errors.non_members_player_limit}
                                        fullWidth
                                        disabled={disabled}
                                    />
                                </Grid> */}
                                {/* <Grid item xs={12} md={12}>
                                    <FormControl component="fieldset" fullWidth>
                                        <FormLabel component="legend">Eligibility Options</FormLabel>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle1">Age Eligibility</Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Input
                                                            // type="number"
                                                            id="start_age"
                                                            name="eligibility.start_age"
                                                            label="Start Age"
                                                            onChange={(e) => {
                                                                if (e.target.value < 0) e.target.value = 0;
                                                                setFieldValue("eligibility.start_age", e.target.value);
                                                            }}
                                                            value={values?.eligibility?.start_age || ""}
                                                            error={Boolean(errors?.eligibility?.start_age)}
                                                            helperText={errors?.eligibility?.start_age}
                                                            fullWidth
                                                            disabled={disabled}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Input
                                                            // type="number"
                                                            id="end_age"
                                                            name="eligibility.end_age"
                                                            label="End Age"
                                                            onChange={(e) => {
                                                                if (e.target.value < 0) e.target.value = 0;
                                                                setFieldValue("eligibility.end_age", e.target.value);
                                                            }}
                                                            value={values?.eligibility?.end_age || ""}
                                                            error={Boolean(errors?.eligibility?.end_age)}
                                                            helperText={errors?.eligibility?.end_age}
                                                            fullWidth
                                                            disabled={disabled}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle1">Gender Eligibility</Typography>
                                                <FormGroup row>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={values?.eligibility?.gender?.includes("Male")}
                                                                onChange={(e) => {
                                                                    const selected = values?.eligibility?.gender || [];
                                                                    setFieldValue(
                                                                        "eligibility.gender",
                                                                        e.target.checked
                                                                            ? [...selected, "Male"]
                                                                            : selected.filter((g) => g !== "Male")
                                                                    );
                                                                }}
                                                                disabled={disabled}
                                                            />
                                                        }
                                                        label="Male"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={values?.eligibility?.gender?.includes("Female")}
                                                                onChange={(e) => {
                                                                    const selected = values?.eligibility?.gender || [];
                                                                    setFieldValue(
                                                                        "eligibility.gender",
                                                                        e.target.checked
                                                                            ? [...selected, "Female"]
                                                                            : selected.filter((g) => g !== "Female")
                                                                    );
                                                                }}
                                                                disabled={disabled}
                                                            />
                                                        }
                                                        label="Female"
                                                    />
                                                </FormGroup>
                                            </Grid>

                                            <Grid item xs={12} md={3}>
                                                <Typography variant="subtitle1">CHSS Eligibility</Typography>
                                                <FormGroup row>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={values?.eligibility?.membership?.includes("chss")}
                                                                onChange={(e) => {
                                                                    const selected = values?.eligibility?.membership || [];
                                                                    setFieldValue(
                                                                        "eligibility.membership",
                                                                        e.target.checked
                                                                            ? [...selected, "chss"]
                                                                            : selected.filter((m) => m !== "chss")
                                                                    );
                                                                }}
                                                                disabled={disabled}
                                                            />
                                                        }
                                                        label="CHSS"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={values?.eligibility?.membership?.includes("non_chss")}
                                                                onChange={(e) => {
                                                                    const selected = values?.eligibility?.membership || [];
                                                                    setFieldValue(
                                                                        "eligibility.membership",
                                                                        e.target.checked
                                                                            ? [...selected, "non_chss"]
                                                                            : selected.filter((m) => m !== "non_chss")
                                                                    );
                                                                }}
                                                                disabled={disabled}
                                                            />
                                                        }
                                                        label="Non CHSS"
                                                    />
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                    </FormControl>
                                </Grid> */}

                                <Grid item xs={12} md={12}>
                                    <FormControl fullWidth error={Boolean(errors.text_content)}>
                                        <InputLabel size={"small"}>Content</InputLabel>
                                        <br />
                                        <br />
                                        <RichTextEditor
                                            placeholder="Event Contents"
                                            class="h-20"
                                            setValue={(d) => setFieldValue("text_content", d)}
                                            defaultValue={values?.text_content || eventSampleContent}
                                        />
                                        {Boolean(errors.text_content) ? (
                                            <FormHelperText>{errors.text_content}</FormHelperText>
                                        ) : null}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        {formType !== "View" ? (
                            <Grid
                                flexShrink={0}
                                borderTop={1}
                                borderColor={"rgba(152, 188, 252, 0.16)"}
                                sx={{ padding: "8px 16px" }}
                            >
                                <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Grid
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Button size="large" color="warning" type="button" onClick={() => close()}>
                                            Cancel
                                        </Button>
                                        <Button
                                            size="large"
                                            type="submit"
                                            loading={addEventsLoading || updateEventsLoading}
                                            onClick={() => handleSubmit()}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : null}
                    </Grid>
                )}
            </Formik>
        </Drawer>
    );
};
