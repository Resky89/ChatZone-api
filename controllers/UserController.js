const UserService = require('../services/UserService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'media/profile_pictures');
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      sendSuccessResponse(res, users);
    } catch (error) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.userId);
      if (user) {
        sendSuccessResponse(res, user);
      } else {
        sendErrorResponse(res, 'User not found', 404);
      }
    } catch (error) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  static async createUser(req, res) {
    try {
      upload.single('profile_picture')(req, res, async (err) => {
        if (err) {
          return sendErrorResponse(res, err.message, 400);
        }

        try {
          const userData = {
            phone_number: req.body.phone_number,
            username: req.body.username,
            info: req.body.info || '',
            online_status: 'offline'
          };

          // Kirim path file jika ada upload
          if (req.file) {
            userData.profile_picture_path = req.file.filename;
          }

          const newUser = await UserService.createUser(userData);
          return sendSuccessResponse(res, newUser, 201);
        } catch (error) {
          return sendErrorResponse(res, error.message, 400);
        }
      });
    } catch (error) {
      return sendErrorResponse(res, error.message, 500);
    }
  }

  static async updateUserInfo(req, res) {
    try {
      upload.single('profile_picture')(req, res, async (err) => {
        if (err) {
          return sendErrorResponse(res, err.message, 400);
        }

        try {
          const userId = req.params.userId;
          const userData = {
            phone_number: req.body.phone_number,
            username: req.body.username,
            info: req.body.info
          };

          // Kirim path file jika ada upload
          if (req.file) {
            userData.profile_picture_path = req.file.filename;
          }

          const updatedUser = await UserService.updateUserInfo(userId, userData);
          return sendSuccessResponse(res, updatedUser);
        } catch (error) {
          return sendErrorResponse(res, error.message, 400);
        }
      });
    } catch (error) {
      return sendErrorResponse(res, error.message, 500);
    }
  }

  static async updateOnlineStatus(req, res) {
    try {
      const { userId } = req.params;
      const { online_status } = req.body;
      const updatedUser = await UserService.updateOnlineStatus(userId, online_status);
      sendSuccessResponse(res, updatedUser);
    } catch (error) {
      sendErrorResponse(res, error.message, 400);
    }
  }

  static async getUserByPhoneNumber(req, res) {
    try {
      const user = await UserService.getUserByPhoneNumber(req.params.phoneNumber);
      if (user) {
        sendSuccessResponse(res, user);
      } else {
        sendErrorResponse(res, 'User not found', 404);
      }
    } catch (error) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      await UserService.deleteUser(userId);
      sendSuccessResponse(res, { 
        message: 'User deleted successfully',
        user_id: userId 
      });
    } catch (error) {
      if (error.message === 'User not found') {
        sendErrorResponse(res, error.message, 404);
      } else {
        console.error('Delete user error:', error);
        sendErrorResponse(res, 'Failed to delete user', 500);
      }
    }
  }
}

module.exports = UserController;
