const StatusService = require('../services/StatusService');
const Status = require('../models/StatusModel');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../media/statuses');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage for status media
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Konfigurasi ukuran file yang diizinkan (dalam bytes)
const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024,    // 5MB untuk gambar
  video: 50 * 1024 * 1024    // 50MB untuk video
};

// Configure multer upload with file type filtering
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      file.fileType = 'image';
      cb(null, true);
    } else if (file.mimetype.startsWith('video/')) {
      file.fileType = 'video';
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed!'));
    }
  },
  limits: {
    fileSize: FILE_SIZE_LIMITS.video // menggunakan batas maksimum (video)
  }
}).single('media_url');

class StatusController {
  static async createStatus(req, res) {
    try {
      upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return sendErrorResponse(res, 
              'File too large! Maximum size: Images 5MB, Videos 50MB', 
              400
            );
          }
          return sendErrorResponse(res, `Upload error: ${err.message}`, 400);
        } else if (err) {
          return sendErrorResponse(res, err.message, 400);
        }

        try {
          // Validasi file type dan size
          if (req.file) {
            const fileSize = req.file.size;
            const fileType = req.file.fileType;
            const maxSize = FILE_SIZE_LIMITS[fileType];

            if (fileSize > maxSize) {
              await Status.deleteOldMedia(req.file.filename);
              return sendErrorResponse(res, 
                `File too large! Maximum ${fileType} size is ${maxSize / (1024 * 1024)}MB`, 
                400
              );
            }
          }

          const statusData = {
            user_id: req.body.user_id,
            text_caption: req.body.text_caption || null,
            expires_at: req.body.expires_at || null
          };

          const status = await StatusService.createStatus(statusData, req.file);
          sendSuccessResponse(res, { status }, 201);
        } catch (error) {
          if (req.file) {
            await Status.deleteOldMedia(req.file.filename);
          }
          console.error('Status creation error:', error);
          sendErrorResponse(res, error.message, 500);
        }
      });
    } catch (error) {
      console.error('Upload handling error:', error);
      sendErrorResponse(res, error.message, 500);
    }
  }

  static async updateStatus(req, res) {
    try {
      upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
          return sendErrorResponse(res, `Upload error: ${err.message}`, 400);
        } else if (err) {
          return sendErrorResponse(res, err.message, 400);
        }

        try {
          const statusId = req.params.id;
          const statusData = {
            text_caption: req.body.text_caption,
            expires_at: req.body.expires_at
          };

          if (req.file) {
            statusData.media_url = req.file.filename;
          }

          const updated = await StatusService.updateStatus(statusId, statusData, req.file);
          sendSuccessResponse(res, { updated });
        } catch (error) {
          sendErrorResponse(res, error.message, 500);
        }
      });
    } catch (error) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  static async getStatus(req, res) {
    try {
      const status = await StatusService.getStatus(req.params.id);
      sendSuccessResponse(res, status);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }

  static async deleteStatus(req, res) {
    try {
      await StatusService.deleteStatus(req.params.id);
      sendSuccessResponse(res, { message: 'Status deleted successfully' });
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }

  static async getUserOwnStatuses(req, res) {
    try {
      const statuses = await StatusService.getUserOwnStatuses(req.params.userId);
      sendSuccessResponse(res, { statuses });
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }

  static async getUserContactStatuses(req, res) {
    try {
      const statuses = await StatusService.getUserContactStatuses(req.params.userId);
      sendSuccessResponse(res, { statuses });
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }

  static async getAllStatusesExceptUser(req, res) {
    try {
      const userId = req.params.userId;
      const statuses = await StatusService.getAllStatusesExceptUser(userId);
      sendSuccessResponse(res, { statuses });
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }
}

module.exports = StatusController;
