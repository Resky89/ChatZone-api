const GroupModel = require('../models/GroupModel');
const { formatDate } = require('../helpers/data-formatter');
const path = require('path');
const fs = require('fs').promises;

const GroupService = {
  async createGroup(data, groupImage) {
    try {
      if (groupImage) {
        const uploadDir = path.join(__dirname, '../media/group_images');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const fileName = `${Date.now()}-${groupImage.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        
        await fs.writeFile(filePath, groupImage.buffer);
        data.group_image_url = fileName;
      }

      const groupId = await GroupModel.create(data);
      return this.getGroupById(groupId);
    } catch (error) {
      console.error('Error in createGroup service:', error);
      throw error;
    }
  },

  async getGroupById(groupId) {
    const group = await GroupModel.findById(groupId);
    if (group) {
      group.created_at = formatDate(group.created_at);
    }
    return group;
  },

  async getAllGroups() {
    const groups = await GroupModel.findAll();
    return groups.map(group => ({
      ...group,
      created_at: formatDate(group.created_at)
    }));
  },

  async updateGroup(groupId, data, groupImage) {
    try {
      if (groupImage) {
        const uploadDir = path.join(__dirname, '../media/group_images');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const fileName = `${Date.now()}-${groupImage.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        
        await fs.writeFile(filePath, groupImage.buffer);
        
        // Delete old image if exists
        if (data.group_image_url) {
          const oldFilePath = path.join(__dirname, '../media/group_images', data.group_image_url);
          try {
            await fs.unlink(oldFilePath);
          } catch (err) {
            console.error('Error deleting old file:', err);
          }
        }
        
        data.group_image_url = fileName;
      }

      await GroupModel.update(groupId, data);
      return this.getGroupById(groupId);
    } catch (error) {
      console.error('Error in updateGroup service:', error);
      throw error;
    }
  },

  async deleteGroup(groupId) {
    const group = await this.getGroupById(groupId);
    if (group && group.group_image_url) {
      const filePath = path.join(__dirname, '../media/group_images', group.group_image_url);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    await GroupModel.delete(groupId);
  }
};

module.exports = GroupService;
