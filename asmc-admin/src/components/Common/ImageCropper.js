import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './cropImage'

const ImageCropper = ({ getBlob, inputImg, width, height }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    /* onCropComplete() will occur each time the user modifies the cropped area, 
    which isn't ideal. A better implementation would be getting the blob 
    only when the user hits the submit button, but this works for now  */
    const onCropComplete = async (_, croppedAreaPixels) => {
        const croppedImage = await getCroppedImg(
            inputImg,
            croppedAreaPixels,
            width,
            height
        )
        getBlob(croppedImage)
    }

    return (
        <div style={{ position: 'relative', width: "300px%", height: "300px" }}>
            <Cropper
                image={inputImg}
                crop={crop}
                zoom={zoom}
                aspect={calculateAspectRatio(width, height)}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />
        </div>
    )
}

function calculateAspectRatio(width, height) {
    return width / height;
}

export default ImageCropper
