const multer = require('multer');
const path = require('path');

// Configure multer for file uploads (disk storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // save files to "uploads" folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Get the file extension
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Check if the extension is allowed
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const isExtensionValid = allowedExtensions.includes(ext);
  
  // Check if the MIME type is allowed
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
  
  if (isExtensionValid && isMimeTypeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

module.exports = upload;