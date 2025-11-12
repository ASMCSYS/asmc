import React, { useCallback, useEffect, useRef } from "react";

import LightgalleryProvider from 'lightgallery/react';

import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-thumbnail.css';

export const ImageLightBox = ({ images, show, setShow, index = 0 }) => {
    const lightGallery = useRef(null);

    useEffect(() => {
        if (show) {
            lightGallery.current.openGallery()
        }
    }, [show])

    const onInit = useCallback((detail) => {
        if (detail) {
            lightGallery.current = detail.instance;
        }
    }, []);

    return (
        <LightgalleryProvider
            onInit={onInit}
            plugins={[lgZoom, lgVideo]}
            onAfterClose={() => setShow(false)}
            index={index}
        >
            {images.map((image, index) => (
                <a key={index} href={image.url} style={{ display: "none" }}>
                    <img src={image.url} alt={`Image ${index + 1}`} />
                </a>
            ))}
        </LightgalleryProvider>
    )
}