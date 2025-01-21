const UserModel = require('../models/UserModel');
const { validateCreateUser, validateUpdateUserInfo, validateUpdateOnlineStatus } = require('../validations/UserValidation');
const path = require('path');
const fs = require('fs');

class UserService {
  static async getAllUsers() {
    return await UserModel.findAll();
  }

  static async getUserById(userId) {
    return await UserModel.findById(userId);
  }

  static async getUserByPhoneNumber(phoneNumber) {
    return await UserModel.findByPhoneNumber(phoneNumber);
  }

  static async createUser(userData) {
    try {
      const { error } = validateCreateUser(userData);
      if (error) {
        throw new Error('Validation error: ' + error.message);
      }
      
      const newUserId = await UserModel.create(userData);
      return await UserModel.findById(newUserId);
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  static async updateUserInfo(id, userData = {}) {
    const updateData = {};
    const allowedFields = ['phone_number', 'username', 'info', 'profile_picture_path'];
    
    for (const field of allowedFields) {
      if (field in userData && userData[field] !== '' && userData[field] !== undefined) {
        updateData[field] = userData[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      const currentUser = await UserModel.findById(id);
      if (!currentUser) {
        throw new Error('User not found');
      }
      return currentUser;
    }

    try {
      await UserModel.updateInfo(id, updateData);
      return await UserModel.findById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Phone number already in use');
      }
      throw error;
    }
  }

  static async updateOnlineStatus(id, onlineStatus) {
    const { error } = validateUpdateOnlineStatus({ online_status: onlineStatus });
    if (error) {
      throw new Error('Validation error: ' + error.message);
    }

    await UserModel.updateOnlineStatus(id, onlineStatus);
    return await UserModel.findById(id);
  }

  static async deleteUser(userId) {
    try {
      const profilePicture = await UserModel.delete(userId);
      
      // Hapus file profile picture jika ada
      if (profilePicture) {
        const filePath = path.join(__dirname, '../media/profile_pictures', profilePicture);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
}

module.exports = UserService;
