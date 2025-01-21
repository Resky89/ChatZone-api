const Status = require('../models/StatusModel');
const { validateStatusData, validateStatusIdData } = require('../validations/StatusValidation');
const { formatDate } = require('../helpers/data-formatter');

class StatusService {
  static async createStatus(statusData, file) {
    const { error } = validateStatusData(statusData);
    if (error) {
      console.error('Validation error details:', error.details);
      throw new Error('Validation error: ' + error.message);
    }

    try {
      const statusId = await Status.create(statusData, file);
      const status = await Status.getById(statusId);
      return {
        ...status,
        "Created At": formatDate(status["Created At"]),
        "Expires At": formatDate(status["Expires At"])
      };
    } catch (error) {
      if (file) {
        await Status.deleteOldMedia(file.filename);
      }
      throw error;
    }
  }

  static async getStatus(statusId) {
    const { error } = validateStatusIdData({ id: statusId });
    if (error) {
      throw new Error('Validation error: ' + error.message);
    }

    const isExpired = await Status.isStatusExpired(statusId);
    if (isExpired) {
      await Status.delete(statusId);
      throw new Error('Status has expired');
    }

    const status = await Status.getById(statusId);
    if (!status) {
      throw new Error('Status not found');
    }
    
    return {
      ...status,
      "Created At": formatDate(status["Created At"]),
      "Expires At": formatDate(status["Expires At"])
    };
  }

  static async getUserOwnStatuses(userId) {
    const { error } = validateStatusData({ user_id: userId });
    if (error) {
      throw new Error('Validation error: ' + error.message);
    }

    await Status.deleteExpiredStatuses();

    const statuses = await Status.getUserOwnStatuses(userId);
    return statuses.map(status => ({
      status_id: status.status_id,
      user_id: status.user_id,
      Username: status.Username,
      "Profile Picture": status["Profile Picture"],
      "Media URL": status["Media URL"],
      Caption: status.Caption,
      "Created At": formatDate(status["Created At"]),
      "Expires At": formatDate(status["Expires At"])
    }));
  }

  static async getUserContactStatuses(userId) {
    const { error } = validateStatusData({ user_id: userId });
    if (error) {
      throw new Error('Validation error: ' + error.message);
    }

    await Status.deleteExpiredStatuses();

    const statuses = await Status.getUserContactStatuses(userId);
    return statuses.map(status => ({
      status_id: status.status_id,
      user_id: status.user_id,
      Username: status.Username,
      "Profile Picture": status["Profile Picture"],
      "Media URL": status["Media URL"],
      Caption: status.Caption,
      "Created At": formatDate(status["Created At"]),
      "Expires At": formatDate(status["Expires At"])
    }));
  }

  static async updateStatus(statusId, statusData, file) {
    const isExpired = await Status.isStatusExpired(statusId);
    if (isExpired) {
      if (file) {
        await Status.deleteOldMedia(file.filename);
      }
      throw new Error('Cannot update expired status');
    }

    const updated = await Status.update(statusId, statusData, file);
    if (updated === 0) {
      if (file) {
        await Status.deleteOldMedia(file.filename);
      }
      throw new Error('Status not found or no changes made');
    }
    
    const status = await Status.getById(statusId);
    return {
      ...status,
      "Created At": formatDate(status["Created At"]),
      "Expires At": formatDate(status["Expires At"])
    };
  }

  static async deleteStatus(statusId) {
    const deleted = await Status.delete(statusId);
    if (deleted === 0) {
      throw new Error('Status not found');
    }
    return deleted;
  }

  static async getAllStatusesExceptUser(userId) {
    const statuses = await Status.getAllExceptUser(userId);
    return statuses.map(status => ({
      status_id: status.status_id,
      user_id: status.user_id,
      Username: status.Username,
      "Profile Picture": status["Profile Picture"],
      "Media URL": status["Media URL"],
      Caption: status.Caption,
      "Created At": formatDate(status["Created At"]),
      "Expires At": formatDate(status["Expires At"])
    }));
  }
}

module.exports = StatusService;
