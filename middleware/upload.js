const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

//cloudinary configuration
cloudinary.config({
  cloud_name: 'dny2szsok', 
  api_key: '351385723878947',       
  api_secret: 'E0_iGTFNC2sWpVPueqEc5kOAcUg', 
});

// Sanitization of filenames to prevent malicious input
const sanitizeFilename = (filename) => filename.replace(/[^a-zA-Z0-9-_\.]/g, '_');

// cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures', // Cloudinary folder name
    allowed_formats: ['jpeg', 'jpg', 'png'], // Restrict file formats
    public_id: (req, file) => `${req.session.userId}-${Date.now()}-${sanitizeFilename(file.originalname)}`,
  },
});

// Limits file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.')); // Reject other files
  }
};

// Limits file size
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Export the configured upload middleware
module.exports = upload;