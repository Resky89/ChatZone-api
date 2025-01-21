const db = require('../config/db');

const checkConnection = async (req, res) => {
  try {
    const connection = await db.getConnection();
    connection.release();
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
};

module.exports = {
  checkConnection
};
