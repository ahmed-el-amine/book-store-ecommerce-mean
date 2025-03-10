import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
export const uploadBookCover = async (buffer, mimetype) => {
    try {
        const result = await cloudinary.uploader.upload(
            `data:${mimetype};base64,${buffer.toString('base64')}`,
            {
                folder: 'book_covers',
                public_id: `book_${Date.now()}`,
                overwrite: true,
            }
        );
        return {
            coverPublicUrl: result.secure_url,
            coverPublicId: result.public_id
        };
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