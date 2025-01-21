const CallService = require('../services/CallService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');

class CallController {
  static async createCall(req, res) {
    try {
      console.log('Request Body:', req.body); // Add this line
      const callId = await CallService.createCall(req.body);
      sendSuccessResponse(res, { callId });
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }

  static async getCallLogsByUserId(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const callLogs = await CallService.getCallLogsByUserId(userId);
      sendSuccessResponse(res, callLogs);
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }

  static async updateCall(req, res) {
    try {
      const success = await CallService.updateCall(req.params.callId, req.body);
      if (success) {
        sendSuccessResponse(res, { message: 'Call updated successfully' });
      } else {
        sendErrorResponse(res, 'Call not found', 404);
      }
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }

  static async deleteCall(req, res) {
    try {
      const success = await CallService.deleteCall(req.params.callId);
      if (success) {
        sendSuccessResponse(res, { message: 'Call deleted successfully' });
      } else {
        sendErrorResponse(res, 'Call not found', 404);
      }
    } catch (error) {
      sendErrorResponse(res, error.message);
    }
  }
  
}

module.exports = CallController;
