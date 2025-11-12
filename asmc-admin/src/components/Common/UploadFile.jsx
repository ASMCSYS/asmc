import { useHandleImageUploadMutation } from "../../store/common/commonApis";
import { setSnackBar } from "../../store/common/commonSlice";
import { useDispatch } from "react-redux";
import { FileUploader } from "react-drag-drop-files";
import { baseUrl, fileTypes } from "../../helpers/constants";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";

export const UploadFile = ({
    onChange,
    value,
    label,
    error,
    helperText,
    labelSecondary = "Upload home page about image right here",
    types = null,
}) => {
    const [uploadImage] = useHandleImageUploadMutation();
    const dispatch = useDispatch();

    const handleFileChange = async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            let result = await uploadImage(formData);
            if (result?.data?.path) onChange(result.data.path);
            else {
                dispatch(
                    setSnackBar({
                        open: true,
                        message: result?.error?.data?.message || result.message,
                        severity: "error",
                    }),
                );
            }
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

    return (
        <FormControl fullWidth error={error}>
            <InputLabel size={"small"}>{label}</InputLabel>
            <FileUploader
                classes="drop_area"
                handleChange={handleFileChange}
                name="file"
                types={types || fileTypes}
                label={labelSecondary}
            />
            {error ? <FormHelperText>{helperText}</FormHelperText> : null}
            {value && !types?.includes("pdf") ? <img width={100} alt="preview" src={value} /> : null}
            {value && types?.includes("pdf") ? (
                <a href={value} target="_blank">
                    View File
                </a>
            ) : null}
        </FormControl>
    );
};
