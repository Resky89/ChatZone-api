const CommunityAnnouncementService = require('../services/CommunityAnnouncementService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');

const CommunityAnnouncementController = {
  async create(req, res) {
    try {
      const announcement = await CommunityAnnouncementService.create(req.body);
      sendSuccessResponse(res, announcement, 201);
    } catch (error) {
      sendErrorResponse(res, error.message, 400);
    }
  },

  async getById(req, res) {
    try {
      const announcement = await CommunityAnnouncementService.getById(req.params.id);
      if (!announcement) return sendErrorResponse(res, 'Announcement not found', 404);
      sendSuccessResponse(res, announcement);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  },

  async update(req, res) {
    try {
      const announcement = await CommunityAnnouncementService.update(req.params.id, req.body);
      sendSuccessResponse(res, announcement);
    } catch (error) {
      sendErrorResponse(res, error.message, 400);
    }
  },

  async delete(req, res) {
    try {
      await CommunityAnnouncementService.delete(req.params.id);
      sendSuccessResponse(res, null, 204);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  },

  async getAll(req, res) {
    try {
      const announcements = await CommunityAnnouncementService.getAll();
      sendSuccessResponse(res, announcements);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }
};

module.exports = CommunityAnnouncementController; 
