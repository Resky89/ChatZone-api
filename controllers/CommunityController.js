const CommunityService = require('../services/CommunityService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const CommunityController = {
  create(req, res) {
    upload.single('community_image_url')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return sendErrorResponse(res, 'File upload error', 400);
      }

      try {
        const data = {
          community_name: req.body.community_name,
          community_description: req.body.community_description,
          created_by: req.user.id,
          community_image_url: null
        };

        const community = await CommunityService.createCommunity(data, req.file);
        sendSuccessResponse(res, community, 201);
      } catch (err) {
        console.error('Error in create community:', err);
        sendErrorResponse(res, err.message, 400);
      }
    });
  },

  async getById(req, res) {
    try {
      const community = await CommunityService.getCommunityById(req.params.id);
      if (!community) return sendErrorResponse(res, 'Community not found', 404);
      
      sendSuccessResponse(res, community);
    } catch (err) {
      sendErrorResponse(res, err.message);
    }
  },

  async getAll(req, res) {
    try {
      const communities = await CommunityService.getAllCommunities();
      sendSuccessResponse(res, communities);
    } catch (err) {
      sendErrorResponse(res, err.message);
    }
  },

  async getUserCommunities(req, res) {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        return sendErrorResponse(res, 'User ID is required', 400);
      }

      const communities = await CommunityService.getUserCommunities(userId);
      
      return sendSuccessResponse(res, {
        message: "User communities retrieved successfully",
        data: communities
      });

    } catch (error) {
      console.error('Error getting user communities:', error);
      return sendErrorResponse(res, error.message);
    }
  },

  update(req, res) {
    upload.single('community_image_url')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return sendErrorResponse(res, 'File upload error', 400);
      }

      try {
        const data = {
          community_name: req.body.community_name,
          community_description: req.body.community_description,
          community_image_url: req.body.community_image_url
        };

        const community = await CommunityService.updateCommunity(req.params.id, data, req.file);
        if (!community) return sendErrorResponse(res, 'Community not found', 404);
        
        sendSuccessResponse(res, community);
      } catch (err) {
        sendErrorResponse(res, err.message, 400);
      }
    });
  },

  async delete(req, res) {
    try {
      await CommunityService.deleteCommunity(req.params.id);
      sendSuccessResponse(res, null, 204);
    } catch (err) {
      sendErrorResponse(res, err.message);
    }
  }
};

module.exports = CommunityController;
