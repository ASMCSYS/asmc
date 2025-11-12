import React, { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { uploadSingleImage } from "@/apis/common.api";
import { toast_popup } from "@/utils/toast";

const ImageCropUpload = ({
    onCropComplete,
    onUploadComplete,
    aspectRatio = 1, // 1 for square, 16/9 for landscape, etc.
    minWidth = 200,
    minHeight = 200,
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8,
    showPreview = true,
    className = "",
    disabled = false,
    accept = "image/*",
    maxSize = 5 * 1024 * 1024, // 5MB default
}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [crop, setCrop] = useState({
        unit: "%",
        width: 90,
        height: 90,
        x: 5,
        y: 5,
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const imageRef = useRef(null);
    const fileInputRef = useRef(null);

    const onSelectFile = useCallback(
        (e) => {
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];

                // Validate file size
                if (file.size > maxSize) {
                    setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
                    return;
                }

                // Validate file type
                if (!file.type.startsWith("image/")) {
                    setError("Please select a valid image file");
                    return;
                }

                setError("");
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    setSelectedImage(reader.result);
                    setPreviewUrl("");
                    setCompletedCrop(null);
                });
                reader.readAsDataURL(file);
            }
        },
        [maxSize]
    );

    const onImageLoad = useCallback(
        (e) => {
            const { width, height } = e.currentTarget;

            // Calculate initial crop to fit aspect ratio
            let cropWidth, cropHeight;
            if (width > height) {
                cropHeight = height * 0.8;
                cropWidth = cropHeight * aspectRatio;
            } else {
                cropWidth = width * 0.8;
                cropHeight = cropWidth / aspectRatio;
            }

            // Ensure crop fits within image bounds
            if (cropWidth > width) {
                cropWidth = width * 0.9;
                cropHeight = cropWidth / aspectRatio;
            }
            if (cropHeight > height) {
                cropHeight = height * 0.9;
                cropWidth = cropHeight / aspectRatio;
            }

            const x = (width - cropWidth) / 2;
            const y = (height - cropHeight) / 2;

            setCrop({
                unit: "px",
                width: cropWidth,
                height: cropHeight,
                x,
                y,
            });
        },
        [aspectRatio]
    );

    const getCroppedImg = useCallback(
        async (image, crop, fileName) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("No 2d context");
            }

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = crop.width;
            canvas.height = crop.height;

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

            return new Promise((resolve) => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            console.error("Canvas is empty");
                            return;
                        }

                        // Create file from blob
                        const file = new File([blob], fileName, { type: "image/jpeg" });

                        // Create preview URL
                        const previewUrl = URL.createObjectURL(blob);

                        resolve({ file, previewUrl });
                    },
                    "image/jpeg",
                    quality
                );
            });
        },
        [quality]
    );

    const uploadCroppedImage = async (croppedFile) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", croppedFile);
            const response = await uploadSingleImage(formData);

            if (response?.success) {
                toast_popup(response?.message, "success");
                // Call the onUploadComplete callback with the server response
                if (onUploadComplete) {
                    onUploadComplete(response?.result?.path, croppedFile);
                }

                // Automatically reset the interface after successful upload
                handleReset();

                return response?.result?.path;
            } else {
                toast_popup(response?.message, "error");
                throw new Error(response?.message || "Upload failed");
            }
        } catch (error) {
            toast_popup(error.message, "error");
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const handleCropComplete = useCallback(async () => {
        if (!completedCrop || !imageRef.current) return;

        setIsCropping(true);
        try {
            const { file, previewUrl } = await getCroppedImg(imageRef.current, completedCrop, "cropped-image.jpg");

            setPreviewUrl(previewUrl);

            // Call the onCropComplete callback with the cropped file and preview URL
            if (onCropComplete) {
                onCropComplete(file, previewUrl);
            }

            // Automatically upload the cropped image to server
            await uploadCroppedImage(file);
        } catch (error) {
            console.error("Error processing image:", error);
            setError("Error processing image. Please try again.");
        } finally {
            setIsCropping(false);
        }
    }, [completedCrop, onCropComplete, getCroppedImg]);

    const handleReset = () => {
        setSelectedImage(null);
        setPreviewUrl("");
        setCompletedCrop(null);
        setCrop({
            unit: "%",
            width: 90,
            height: 90,
            x: 5,
            y: 5,
        });
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileDrop = useCallback(
        (e) => {
            e.preventDefault();
            if (disabled) return;

            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        setSelectedImage(reader.result);
                        setPreviewUrl("");
                        setCompletedCrop(null);
                    });
                    reader.readAsDataURL(file);
                }
            }
        },
        [disabled]
    );

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    return (
        <div className={`image-crop-upload ${className}`}>
            {!selectedImage ? (
                <div
                    className="upload-area"
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={onSelectFile}
                        style={{ display: "none" }}
                        disabled={disabled}
                    />
                    <div className="upload-content">
                        <svg className="upload-icon" viewBox="0 0 24 24">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        <p className="upload-text">{disabled ? "Upload disabled" : "Click to upload or drag & drop"}</p>
                        <p className="upload-hint">
                            Supports: JPG, PNG, GIF • Max: {Math.round(maxSize / (1024 * 1024))}MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="crop-container">
                    <div className="crop-header">
                        <h4>Crop Image</h4>
                        <div className="crop-actions">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={handleReset}
                                disabled={isCropping || isUploading}
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={handleCropComplete}
                                disabled={!completedCrop || isCropping || isUploading}
                            >
                                {isCropping ? "Cropping..." : isUploading ? "Uploading..." : "Crop & Upload"}
                            </button>
                        </div>
                    </div>

                    <div className="crop-area">
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                            minWidth={minWidth}
                            minHeight={minHeight}
                            maxWidth={maxWidth}
                            maxHeight={maxHeight}
                        >
                            <img
                                ref={imageRef}
                                alt="Crop preview"
                                src={selectedImage}
                                onLoad={onImageLoad}
                                style={{ maxWidth: "100%", maxHeight: "400px" }}
                            />
                        </ReactCrop>
                    </div>

                    {showPreview && previewUrl && (
                        <div className="preview-container">
                            <h5>Cropped Preview:</h5>
                            <img src={previewUrl} alt="Cropped preview" className="preview-image" />
                        </div>
                    )}
                </div>
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default ImageCropUpload;
