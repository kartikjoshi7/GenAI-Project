// src/routes/api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Controllers
const AIController = require('../controllers/aiController');
const documentController = require('../controllers/documentController'); // already an instance

// Instantiate AI controller (still a class, so we create new)
const aiController = new AIController();

// ---------------- Multer setup for file upload ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
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
  }
});

// ---------------- AI Routes ----------------

// Simplify text
router.post('/simplify', (req, res) => aiController.simplifyText(req, res));

// Analyze risks
router.post('/analyze', (req, res) => aiController.analyzeRisks(req, res));

// Ask a question about a document
router.post('/ask', (req, res) => aiController.askQuestion(req, res));

// Translate text
router.post('/translate', (req, res) => aiController.translateText(req, res));

// ---------------- Document Routes ----------------

// Upload + process PDF document with error handling
router.post(
  '/process-document',
  upload.single('document'),
  (req, res) => documentController.processDocument(req, res),
  (error, req, res, next) => {
    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File too large',
          message: 'File size must be less than 10MB'
        });
      }
    }
    
    // Handle file filter errors
    if (error.message === 'Only PDF, DOC, DOCX, and TXT files are allowed') {
      return res.status(400).json({
        error: 'Invalid file type',
        message: error.message
      });
    }
    
    // Other errors
    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
);

// Process pasted text
router.post('/process-text', (req, res) => documentController.processText(req, res));

module.exports = router;