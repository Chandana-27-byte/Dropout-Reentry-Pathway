const { pool } = require('../config/database');

exports.getPathways = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;
    const [pathways] = await pool.query('SELECT * FROM pathways ORDER BY created_at DESC LIMIT ? OFFSET ?', [Number(limit), Number(offset)]);
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM pathways');
    res.json({ success: true, data: pathways, pagination: { page: Number(page), limit: Number(limit), total: countResult[0].total, totalPages: Math.ceil(countResult[0].total / limit) } });
  } catch (error) { next(error); }
};

exports.getPathwayById = async (req, res, next) => {
  try {
    const [pathways] = await pool.query('SELECT * FROM pathways WHERE pathway_id = ?', [req.params.id]);
    if (pathways.length === 0) return res.status(404).json({ success: false, message: 'Pathway not found' });
    const [modules] = await pool.query('SELECT * FROM pathway_modules WHERE pathway_id = ? ORDER BY sequence_order', [req.params.id]);
    res.json({ success: true, data: { ...pathways[0], modules } });
  } catch (error) { next(error); }
};

exports.createPathway = async (req, res, next) => {
  try {
    const { pathway_name, pathway_code, pathway_type, description, duration_months, mode, total_modules, max_enrollment, fee_amount, target_education_level, prerequisite_level } = req.body;
    const code = pathway_code || `PW-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const [result] = await pool.query(
      `INSERT INTO pathways (pathway_name, pathway_code, pathway_type, description, duration_months, mode, total_modules, max_enrollment, fee_amount, target_education_level, prerequisite_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [pathway_name, code, pathway_type, description, duration_months, mode, total_modules, max_enrollment, fee_amount || 0, target_education_level, prerequisite_level]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, pathway_id: result.insertId } });
  } catch (error) { next(error); }
};

exports.getRecommendations = async (req, res, next) => {
  try {
    const [pathways] = await pool.query('SELECT * FROM pathways LIMIT 5');
    res.json({ success: true, data: pathways });
  } catch (error) { next(error); }
};
