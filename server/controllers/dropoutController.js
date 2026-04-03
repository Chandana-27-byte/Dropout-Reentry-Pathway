const { pool } = require('../config/database');

exports.getDropouts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [dropouts] = await pool.query(`
      SELECT * FROM vw_dropout_details 
      ORDER BY recorded_date DESC LIMIT ? OFFSET ?
    `, [Number(limit), Number(offset)]);
    
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM dropouts');

    res.json({
      success: true,
      data: dropouts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getDropoutById = async (req, res, next) => {
  try {
    const [dropouts] = await pool.query(`
      SELECT d.*, s.first_name, s.last_name, s.email, s.phone 
      FROM dropouts d 
      JOIN students s ON d.student_id = s.student_id 
      WHERE d.dropout_id = ?
    `, [req.params.id]);

    if(dropouts.length === 0) {
      return res.status(404).json({ success: false, message: 'Dropout record not found' });
    }
    
    res.json({ success: true, data: dropouts[0] });
  } catch(error) {
    next(error);
  }
};

exports.recordDropout = async (req, res, next) => {
  try {
    const { studentId, dropoutDate, reasonId, detailedReason } = req.body;

    const [result] = await pool.query(`
      INSERT INTO dropouts (student_id, dropout_date, primary_reason_id, detailed_reason, status)
      VALUES (?, ?, ?, ?, 'recorded')
    `, [studentId, dropoutDate, reasonId, detailedReason]);

    await pool.query('UPDATE students SET status = ? WHERE student_id = ?', ['dropout', studentId]);

    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch(error) {
    next(error);
  }
};

exports.verifyDropout = async (req, res, next) => {
  try {
    await pool.query(`
      UPDATE dropouts SET status = 'verified', verified_by = ?, verification_date = NOW() WHERE dropout_id = ?
    `, [req.user.user_id, req.params.id]);
    
    res.json({ success: true, message: 'Dropout verified successfully' });
  } catch(error) {
    next(error);
  }
};

exports.getDropoutStats = async (req, res, next) => {
  try {
    const [overview] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status IN ('pathway_assigned', 'enrolled') THEN 1 END) as enrolled,
        COUNT(CASE WHEN status = 'reentry_completed' THEN 1 END) as completed,
        COUNT(CASE WHEN willing_to_return = 1 THEN 1 END) as willing_to_return
      FROM dropouts
    `);
    
    res.json({ success: true, data: { overview: overview[0] } });
  } catch(error) {
    next(error);
  }
};

exports.getDropoutReasons = async (req, res, next) => {
  try {
    const [reasons] = await pool.query('SELECT * FROM dropout_reasons_master');
    const grouped = reasons.reduce((acc, r) => {
      if(!acc[r.reason_category]) acc[r.reason_category] = [];
      acc[r.reason_category].push(r);
      return acc;
    }, {});
    
    res.json({ success: true, data: grouped });
  } catch(error) {
    next(error);
  }
};

exports.getDropoutAnalysis = async (req, res, next) => {
  try {
    const [byReason] = await pool.query(`
      SELECT m.reason_name, COUNT(*) as count 
      FROM dropouts d 
      JOIN dropout_reasons_master m ON d.primary_reason_id = m.reason_id 
      GROUP BY m.reason_name 
      ORDER BY count DESC
    `);

    const [monthlyTrend] = await pool.query(`
      SELECT DATE_FORMAT(dropout_date, '%Y-%m') as month, COUNT(*) as count 
      FROM dropouts 
      GROUP BY month 
      ORDER BY month ASC 
      LIMIT 12
    `);

    res.json({ 
      success: true, 
      data: { 
        byReason,
        monthlyTrend,
        byGender: [],
        byEducationLevel: []
      } 
    });
  } catch(error) {
    next(error);
  }
};
