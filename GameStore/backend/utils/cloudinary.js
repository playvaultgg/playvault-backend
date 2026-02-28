const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'game_images',
        format: async (req, file) => {
            const extension = file.mimetype.split('/')[1];
            if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
                return extension;
            }
            return 'jpg';
        },
        public_id: (req, file) => {
            const fileName = file.originalname.split('.')[0];
            return `${Date.now()}-${fileName}`;
        },
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: fileFilter,
});

module.exports = { cloudinary, upload };
