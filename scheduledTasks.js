const cron = require('node-cron');
const Status = require('./models/StatusModel');

// Run every minute to check expired statuses
cron.schedule('* * * * *', async () => {
  const timestamp = new Date().toISOString();
  try {
    const deletedCount = await Status.deleteExpiredStatuses();
    if (deletedCount > 0) {
      console.log(`[${timestamp}] Successfully deleted ${deletedCount} expired status(es) and their associated media files`);
    }
  } catch (error) {
    console.error(`[${timestamp}] Error in scheduled task:`, error);
  }
});
