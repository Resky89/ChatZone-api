const CommunityMemberService = require('../services/CommunityMemberService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');

const CommunityMemberController = {
  async create(req, res) {
    try {
      const member = await CommunityMemberService.create(req.body);
      sendSuccessResponse(res, member, 201);
    } catch (error) {
      sendErrorResponse(res, error.message, 400);
    }
  },

  async getById(req, res) {
    try {
      const member = await CommunityMemberService.getById(req.params.id);
      if (!member) return sendErrorResponse(res, 'Member not found', 404);
      sendSuccessResponse(res, member);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  },

  async update(req, res) {
    try {
      const member = await CommunityMemberService.update(req.params.id, req.body);
      sendSuccessResponse(res, member);
    } catch (error) {
      sendErrorResponse(res, error.message, 400);
    }
  },

  async delete(req, res) {
    try {
      await CommunityMemberService.delete(req.params.id);
      sendSuccessResponse(res, null, 204);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  },

  async getByCommunityId(req, res) {
    try {
      const members = await CommunityMemberService.getByCommunityId(req.params.communityId);
      sendSuccessResponse(res, members);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }
};

module.exports = CommunityMemberController; 
