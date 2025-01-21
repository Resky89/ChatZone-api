const CommunityModel = require('../models/CommunityModel');
const { communitySchema, updateCommunitySchema } = require('../validations/CommunityValidation');
const { formatDate } = require('../helpers/data-formatter');
const path = require('path');
const fs = require('fs').promises;

const CommunityService = {
  async createCommunity(data, communityImage) {
    const { error } = communitySchema.validate(data);
    if (error) throw new Error(error.details[0].message);

    if (communityImage) {
      const uploadDir = path.join(__dirname, '../media/community_images');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const fileName = `${Date.now()}-${communityImage.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.writeFile(filePath, communityImage.buffer);
      data.community_image_url = fileName;
    }

    const communityId = await CommunityModel.create(data);
    return this.getCommunityById(communityId);
  },

  async getCommunityById(communityId) {
    const community = await CommunityModel.findById(communityId);
    if (community) {
      community.created_at = formatDate(community.created_at);
    }
    return community;
  },

  async getAllCommunities() {
    const communities = await CommunityModel.findAll();
    return communities.map(community => ({
      ...community,
      created_at: formatDate(community.created_at)
    }));
  },

  async getUserCommunities(userId) {
    const communities = await CommunityModel.getCommunityDetailsByUserId(userId);
    return communities.map(community => ({
      ...community,
      created_at: formatDate(community.created_at),
      member_joined_at: formatDate(community.member_joined_at)
    }));
  },

  async updateCommunity(communityId, data, communityImage) {
    const { error } = updateCommunitySchema.validate(data);
    if (error) throw new Error(error.details[0].message);

    if (communityImage) {
      const uploadDir = path.join(__dirname, '../media/community_images');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const fileName = `${Date.now()}-${communityImage.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.writeFile(filePath, communityImage.buffer);
      
      if (data.community_image_url) {
        const oldFilePath = path.join(uploadDir, data.community_image_url);
        try {
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.error('Error deleting old file:', err);
        }
      }
      
      data.community_image_url = fileName;
    }

    await CommunityModel.update(communityId, data);
    return this.getCommunityById(communityId);
  },

  async deleteCommunity(communityId) {
    const community = await this.getCommunityById(communityId);
    if (!community) throw new Error('Community not found');

    if (community.community_image_url) {
      const filePath = path.join(__dirname, '../media/community_images', community.community_image_url);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await CommunityModel.delete(communityId);
    return community;
  }
};

module.exports = CommunityService;
