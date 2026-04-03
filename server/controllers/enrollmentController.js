const { pool } = require('../config/database');

exports.getEnrollments = async (req, res, next) => {
  try {
    const [enrollments] = await pool.query('SELECT * FROM enrollments');
    res.json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
};

exports.createEnrollment = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { dropoutId, pathwayId, feePaid = 0 } = req.body;
    
    await connection.beginTransaction();

    const [result] = await connection.query(`
      INSERT INTO enrollments (dropout_id, pathway_id, enrollment_date, status, fee_paid)
      VALUES (?, ?, CURDATE(), 'enrolled', ?)
    `, [dropoutId, pathwayId, feePaid]);

    await connection.query(`
      UPDATE dropouts SET status = 'enrolled' WHERE dropout_id = ?
    `, [dropoutId]);

    await connection.query(`
      UPDATE pathways SET current_enrollment = current_enrollment + 1 WHERE pathway_id = ?
    `, [pathwayId]);

    await connection.commit();
    res.status(201).json({ 
      success: true, 
      message: 'Enrollment successful', 
      data: { enrollment_id: result.insertId } 
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};
