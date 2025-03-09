import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const uploadBookCover = async (imagePath, publicId, folder = 'book_covers') => {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder,
            public_id: publicId,
            overwrite: true,
        });
        return result.secure_url;
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }
};

export const getCoverUrl = (publicId) => {
    return cloudinary.url(publicId, { secure: true });
};

export const deleteBookCover = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error(`Deletion failed: ${error.message}`);
    }
};