const GroupService = require('../services/GroupService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');
const { groupSchema } = require('../validations/GroupValidation');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const GroupController = {
  create(req, res) {
    // Ubah 'group_image' menjadi 'group_image_url' untuk mencocokkan dengan field yang dikirim
    upload.single('group_image_url')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return sendErrorResponse(res, 'File upload error', 400);
      }

      try {
        const data = {
          group_name: req.body.group_name,
          created_by: req.body.created_by,
          group_image_url: null // Will be set in service if file exists
        };

        const { error } = groupSchema.validate(data);
        if (error) return sendErrorResponse(res, error.details[0].message, 400);

        const group = await GroupService.createGroup(data, req.file);
        sendSuccessResponse(res, group, 201);
      } catch (err) {
        console.error('Error in create group:', err);
        sendErrorResponse(res, 'Failed to create group', 500, err);
      }
    });
  },

  async getById(req, res) {
    try {
      const group = await GroupService.getGroupById(req.params.id);
      if (!group) return sendErrorResponse(res, 'Group not found', 404);

      sendSuccessResponse(res, group);
    } catch (err) {
      sendErrorResponse(res, 'Failed to retrieve group', 500, err);
    }
  },

  async getAll(req, res) {
    try {
      const groups = await GroupService.getAllGroups();
      sendSuccessResponse(res, groups);
    } catch (err) {
      sendErrorResponse(res, 'Failed to retrieve groups', 500, err);
    }
  },

  update(req, res) {
    // Ubah 'group_image' menjadi 'group_image_url' untuk konsistensi
    upload.single('group_image_url')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return sendErrorResponse(res, 'File upload error', 400);
      }

      try {
        const data = {
          group_name: req.body.group_name,
          created_by: req.body.created_by,
          group_image_url: req.body.group_image_url // Existing URL if no new file
        };

        const { error } = groupSchema.validate(data);
        if (error) return sendErrorResponse(res, error.details[0].message, 400);

        const group = await GroupService.updateGroup(req.params.id, data, req.file);
        if (!group) return sendErrorResponse(res, 'Group not found', 404);

        sendSuccessResponse(res, group);
      } catch (err) {
        sendErrorResponse(res, 'Failed to update group', 500, err);
      }
    });
  },

  async delete(req, res) {
    try {
      await GroupService.deleteGroup(req.params.id);
      sendSuccessResponse(res, null, 204);
    } catch (err) {
      sendErrorResponse(res, 'Failed to delete group', 500, err);
    }
  }
};

module.exports = GroupController;
