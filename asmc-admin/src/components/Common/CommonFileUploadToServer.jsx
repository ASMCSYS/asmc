import { useHandleImageUploadMutation } from "../../store/common/commonApis";
import { setSnackBar } from "../../store/common/commonSlice";
import { useDispatch } from "react-redux";
import { FormControl, FormHelperText, InputLabel } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useMemo, useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import Button from "./Button";

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "rgb(6, 88, 194)",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

export const CommonFileUploadToServer = ({
    onChange,
    value,
    label,
    error,
    helperText,
    disabled = false,
    width = null,
    height = null,
}) => {
    const [uploadImage] = useHandleImageUploadMutation();
    const [isUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch();
    const [previewSrc, setPreviewSrc] = useState(false);
    const [croppedImage, setCroppedImage] = useState(false);
    const [blob, setBlob] = useState(null);
    const [imageUploaded, setImageUploaded] = useState(false);

    const handleUpload = async () => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("image", blob, "image.png");
            let result = await uploadImage(formData);
            onChange(result.data.path);
            setImageUploaded(true);
            setIsUploading(false);
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

    const onDrop = async (file) => {
        setImageUploaded(false);
        setPreviewSrc(URL.createObjectURL(file[0]));
    };

    const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
        accept: { "image/*": [] },
        onDrop,
        multiple: false,
        disabled: disabled,
    });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragAccept, isDragReject],
    );

    const getBlob = async (cropData) => {
        const blob = await fetch(cropData.basestring).then((res) => res.blob());
        setBlob(blob);
        setCroppedImage(URL.createObjectURL(cropData.blob));
    };

    return (
        <FormControl fullWidth error={error}>
            <InputLabel size={"small"}>{label}</InputLabel>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <div style={{ display: "flex", alignItems: "center", paddingTop: 25, width: "100%" }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5.33317 6.66667H22.6665V16H25.3332V6.66667C25.3332 5.196 24.1372 4 22.6665 4H5.33317C3.8625 4 2.6665 5.196 2.6665 6.66667V22.6667C2.6665 24.1373 3.8625 25.3333 5.33317 25.3333H15.9998V22.6667H5.33317V6.66667Z"
                            fill="#0658C2"
                        ></path>
                        <path
                            d="M10.6665 14.6667L6.6665 20H21.3332L15.9998 12L11.9998 17.3333L10.6665 14.6667Z"
                            fill="#0658C2"
                        ></path>
                        <path
                            d="M25.3332 18.6667H22.6665V22.6667H18.6665V25.3333H22.6665V29.3333H25.3332V25.3333H29.3332V22.6667H25.3332V18.6667Z"
                            fill="#0658C2"
                        ></path>
                    </svg>
                    <div style={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "rgb(102, 102, 102)" }}>Upload image here</span>
                        <span
                            title="types: jpeg,jpg,png,gif"
                            style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                maxWidth: "100px",
                                fontSize: 12,
                                color: "rgb(102, 102, 102)",
                            }}
                        >
                            jpeg,jpg,png,gif
                        </span>
                    </div>
                </div>
            </div>

            {previewSrc && !imageUploaded && width && height && (
                <ImageCropper getBlob={getBlob} inputImg={previewSrc} width={width} height={height} />
            )}
            {value || croppedImage ? (
                <img width={100} alt="preview" className="preview-img" src={croppedImage || value} />
            ) : null}
            {!imageUploaded && croppedImage ? (
                <Button
                    size="small"
                    color="info"
                    fullWidth={false}
                    style={{ width: 100, marginTop: 5 }}
                    type="submit"
                    loading={isUploading}
                    onClick={() => handleUpload()}
                >
                    Crop
                </Button>
            ) : null}
            {error ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
    );
};
