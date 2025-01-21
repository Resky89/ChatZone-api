const CommunityGroupService = require('../services/CommunityGroupService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');
const CommunityGroupModel = require('../models/CommunityGroupModel');

const CommunityGroupController = {
  async create(req, res) {
    try {
      const group = await CommunityGroupService.create(req.body);
      sendSuccessResponse(res, group, 201);
    } catch (error) {
      sendErrorResponse(res, error.message, 400);
    }
  },

  async getById(req, res) {
    try {
      const group = await CommunityGroupService.getById(req.params.id);
      if (!group) return sendErrorResponse(res, 'Group not found', 404);
      sendSuccessResponse(res, group);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  },

  async update(req, res) {
    try {
      const group = await CommunityGroupService.update(req.params.id, req.body);
      sendSuccessResponse(res, group);
    } catch (error) {
      sendErrorResponse(res, error.message, 400);
    }
  },

  async delete(req, res) {
    try {
      await CommunityGroupService.delete(req.params.id);
      sendSuccessResponse(res, null, 204);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  },

  async getByCommunityId(req, res) {
    try {
      const communityId = req.params.communityId;
      const groups = await CommunityGroupModel.findByCommunityId(communityId);
      sendSuccessResponse(res, groups);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }
};

module.exports = CommunityGroupController; 
