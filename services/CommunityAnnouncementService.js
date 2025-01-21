const CommunityAnnouncementModel = require('../models/CommunityAnnouncementModel');
const { communityAnnouncementSchema } = require('../validations/CommunityAnnouncementValidation');
const { formatDate } = require('../helpers/data-formatter');

const CommunityAnnouncementService = {
  async create(data) {
    const { error } = communityAnnouncementSchema.validate(data);
    if (error) throw new Error(error.details[0].message);
    const id = await CommunityAnnouncementModel.create(data);
    return await CommunityAnnouncementModel.findById(id);
  },

  async getById(id) {
    const announcement = await CommunityAnnouncementModel.findById(id);
    if (announcement) {
      announcement.timestamp = formatDate(announcement.timestamp);
    }
    return announcement;
  },

  async update(id, data) {
    const { error } = communityAnnouncementSchema.validate(data);
    if (error) throw new Error(error.details[0].message);
    await CommunityAnnouncementModel.update(id, data);
    return await CommunityAnnouncementModel.findById(id);
  },

  async delete(id) {
    await CommunityAnnouncementModel.delete(id);
  },

  async getAll() {
    const announcements = await CommunityAnnouncementModel.findAll();
    return announcements.map(announcement => ({
      ...announcement,
      timestamp: formatDate(announcement.timestamp)
    }));
  }
};

module.exports = CommunityAnnouncementService; 
