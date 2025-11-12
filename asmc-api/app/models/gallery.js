import mongoose from 'mongoose';

var gallerySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            default: 'image',
        },
        url: String,
        title: String,
        video_thumbnail: String,
    },
    { versionKey: false, timestamps: true },
);

const Gallery = mongoose.model('gallery', gallerySchema);

export default Gallery;
