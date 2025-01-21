const CallModel = require('../models/CallModel');
const { formatDate } = require('../helpers/data-formatter');
const CallValidation = require('../validations/CallValidation');

class CallService {
  static async createCall(callData) {
    const { error } = CallValidation.validateCreateCall(callData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return await CallModel.create(callData);
  }

  static async updateCall(callId, callData) {
    const { error } = CallValidation.validateUpdateCall(callData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return await CallModel.update(callId, callData);
  }

  static async deleteCall(callId) {
    return await CallModel.delete(callId);
  }


  static async getCallLogsByUserId(userId) {
    const callLogs = await CallModel.findCallLogsByUserId(userId);
    return callLogs;
  }
}

module.exports = CallService;
