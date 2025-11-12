import { Formik } from "formik";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    InputLabel,
    Radio,
    Typography,
} from "@mui/material";
import Input from "../../Common/Input";
import BasicSelect from "../../Common/Select";
import Button from "../../Common/Button";
import DatePickerComponent from "../../Common/DatePicker";
import { formatISO, parseISO } from "date-fns";
import { CategoryValidation } from "./EventsValidation";
import RichTextEditor from "../../Common/editor/RichTextEditor";

export const CategoryAdd = ({ categoryInitalval, submit, eventType }) => {
    return (
        <Formik
            initialValues={categoryInitalval}
            onSubmit={(values) => submit(values)}
            validationSchema={CategoryValidation}
            enableReinitialize
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
                <Grid sx={{ display: "flex" }} container direction={"column"} width={"100%"} height={"100%"}>
                    <Grid flex={1} px={2} py={2} overflow={"auto"}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Input
                                    id="category_name"
                                    name="category_name"
                                    label="Category Name *"
                                    onChange={handleChange("category_name")}
                                    value={values?.category_name || ""}
                                    error={Boolean(errors.category_name)}
                                    helperText={errors.category_name}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <FormControl component="fieldset" fullWidth>
                                    <FormLabel component="legend">Eligibility Options</FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12}>
                                            <Typography variant="subtitle1">Age Eligibility</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Input
                                                        // type="number"
                                                        id="start_age"
                                                        name="start_age"
                                                        label="Start Age"
                                                        onChange={(e) => {
                                                            if (!parseInt(e.target.value)) e.target.value = 0;
                                                            setFieldValue("start_age", parseInt(e.target.value));
                                                        }}
                                                        value={values?.start_age || ""}
                                                        error={Boolean(errors?.start_age)}
                                                        helperText={errors?.start_age}
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Input
                                                        // type="number"
                                                        id="end_age"
                                                        name="end_age"
                                                        label="End Age"
                                                        onChange={(e) => {
                                                            if (!parseInt(e.target.value)) e.target.value = 0;
                                                            setFieldValue("end_age", parseInt(e.target.value));
                                                        }}
                                                        value={values?.end_age || ""}
                                                        error={Boolean(errors?.end_age)}
                                                        helperText={errors?.end_age}
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Typography variant="subtitle1">Gender Eligibility</Typography>
                                            <FormGroup row>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={values?.gender?.includes("Male")}
                                                            onChange={(e) => {
                                                                const selected = values?.gender || [];
                                                                setFieldValue(
                                                                    "gender",
                                                                    e.target.checked
                                                                        ? [...selected, "Male"]
                                                                        : selected.filter((g) => g !== "Male"),
                                                                );
                                                            }}
                                                        />
                                                    }
                                                    label="Male"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={values?.gender?.includes("Female")}
                                                            onChange={(e) => {
                                                                const selected = values?.gender || [];
                                                                setFieldValue(
                                                                    "gender",
                                                                    e.target.checked
                                                                        ? [...selected, "Female"]
                                                                        : selected.filter((g) => g !== "Female"),
                                                                );
                                                            }}
                                                        />
                                                    }
                                                    label="Female"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={values?.gender?.includes("Kids")}
                                                            onChange={(e) => {
                                                                const selected = values?.gender || [];
                                                                setFieldValue(
                                                                    "gender",
                                                                    e.target.checked
                                                                        ? [...selected, "Kids"]
                                                                        : selected.filter((g) => g !== "Kids"),
                                                                );
                                                            }}
                                                        />
                                                    }
                                                    label="Kids"
                                                />
                                            </FormGroup>
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Typography variant="subtitle1">Distance & Belts</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Input
                                                        id="distance"
                                                        name="distance"
                                                        label="Distance in Meters"
                                                        onChange={(e) => {
                                                            if (!parseInt(e.target.value)) e.target.value = 0;
                                                            setFieldValue("distance", parseInt(e.target.value));
                                                        }}
                                                        value={values?.distance || ""}
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Input
                                                        id="belts"
                                                        name="belts"
                                                        label="Belts"
                                                        onChange={(e) => {
                                                            if (parseInt(e.target.value) || e.target.value < 0)
                                                                e.target.value = 0;
                                                            setFieldValue("belts", parseInt(e.target.value));
                                                        }}
                                                        value={values?.belts || ""}
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {eventType !== "Team" && (
                                            <Grid item xs={12} md={12}>
                                                <Typography variant="subtitle1">Fees *</Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Input
                                                            id="members_fees"
                                                            name="members_fees"
                                                            label="Members Fees *"
                                                            onChange={(e) => {
                                                                if (!parseInt(e.target.value)) e.target.value = 0;
                                                                setFieldValue("members_fees", parseInt(e.target.value));
                                                            }}
                                                            value={values?.members_fees || ""}
                                                            error={Boolean(errors?.members_fees)}
                                                            helperText={errors?.members_fees}
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Input
                                                            id="non_members_fees"
                                                            name="non_members_fees"
                                                            label="Non Members Fees *"
                                                            onChange={(e) => {
                                                                if (!parseInt(e.target.value)) e.target.value = 0;
                                                                setFieldValue(
                                                                    "non_members_fees",
                                                                    parseInt(e.target.value),
                                                                );
                                                            }}
                                                            value={values?.non_members_fees || ""}
                                                            error={Boolean(errors?.non_members_fees)}
                                                            helperText={errors?.non_members_fees}
                                                            fullWidth
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        )}

                                        <Grid item xs={12} md={12}>
                                            <FormControl fullWidth error={Boolean(errors.category_description)}>
                                                <InputLabel size={"small"}>Description</InputLabel>
                                                <br />
                                                <br />
                                                <RichTextEditor
                                                    placeholder="Event Contents"
                                                    class="h-20"
                                                    setValue={(d) => setFieldValue("category_description", d)}
                                                    defaultValue={values?.category_description}
                                                />
                                                {Boolean(errors.category_description) ? (
                                                    <FormHelperText>{errors.category_description}</FormHelperText>
                                                ) : null}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                                <Button
                                    size="large"
                                    type="submit"
                                    fullWidth={false}
                                    loading={false}
                                    onClick={() => handleSubmit()}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Formik>
    );
};
