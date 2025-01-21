const GroupMemberService = require('../services/GroupMemberService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');

const GroupMemberController = {
  async create(req, res) {
    try {
      const member = await GroupMemberService.createMember(req.body);
      sendSuccessResponse(res, member, 201);
    } catch (err) {
      sendErrorResponse(res, err.message, 400);
    }
  },

  async getById(req, res) {
    try {
      const member = await GroupMemberService.getMemberById(req.params.id);
      if (!member) return sendErrorResponse(res, 'Member not found', 404);
      
      sendSuccessResponse(res, member);
    } catch (err) {
      sendErrorResponse(res, err.message);
    }
  },

  async getAll(req, res) {
    try {
      const members = await GroupMemberService.getAllMembers();
      sendSuccessResponse(res, members);
    } catch (err) {
      sendErrorResponse(res, err.message);
    }
  },

  async getGroupMembers(req, res) {
    try {
      const members = await GroupMemberService.getGroupMembers(req.params.groupId);
      sendSuccessResponse(res, members);
    } catch (err) {
      sendErrorResponse(res, err.message);
    }
  },

  async update(req, res) {
    try {
      const member = await GroupMemberService.updateMember(req.params.id, req.body);
      if (!member) return sendErrorResponse(res, 'Member not found', 404);
      
      sendSuccessResponse(res, member);
    } catch (err) {
      sendErrorResponse(res, err.message, 400);
    }
  },

  async delete(req, res) {
    try {
      await GroupMemberService.deleteMember(req.params.id);
      sendSuccessResponse(res, null, 204);
    } catch (err) {
      sendErrorResponse(res, err.message);
    }
  }
};

module.exports = GroupMemberController;
