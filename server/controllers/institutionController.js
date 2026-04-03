const { pool } = require('../config/database');

exports.getInstitutions = async (req, res, next) => {
  try {
    const [institutions] = await pool.query('SELECT * FROM institutions');
    res.json({ success: true, data: institutions });
  } catch (error) {
    next(error);
  }
};
