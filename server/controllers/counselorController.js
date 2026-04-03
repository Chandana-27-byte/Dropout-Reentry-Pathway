const { pool } = require('../config/database');

exports.getCounselors = async (req, res, next) => {
  try {
    const [counselors] = await pool.query('SELECT * FROM counselors');
    res.json({ success: true, data: counselors });
  } catch (error) {
    next(error);
  }
};

exports.getCounselorById = async (req, res, next) => {
  try {
    const [counselors] = await pool.query('SELECT * FROM counselors WHERE counselor_id = ?', [req.params.id]);
    if (counselors.length === 0) {
      return res.status(404).json({ success: false, message: 'Counselor not found' });
    }
    res.json({ success: true, data: counselors[0] });
  } catch (error) {
    next(error);
  }
};
