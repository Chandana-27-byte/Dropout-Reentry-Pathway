const { pool } = require('../config/database');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [studentsResult] = await pool.query('SELECT COUNT(*) as total FROM students');
    const [dropoutsResult] = await pool.query('SELECT COUNT(*) as total FROM dropouts');
    const [enrolledResult] = await pool.query("SELECT COUNT(*) as total FROM dropouts WHERE status = 'enrolled'");
    const [reentryResult] = await pool.query("SELECT COUNT(*) as total FROM dropouts WHERE status = 'reentry_completed'");
    
    res.json({
      success: true,
      data: {
        total_students: studentsResult[0].total,
        total_dropouts: dropoutsResult[0].total,
        enrolled_in_pathway: enrolledResult[0].total,
        completed_pathways: reentryResult[0].total,
        success_rate: dropoutsResult[0].total > 0 ? ((reentryResult[0].total / dropoutsResult[0].total) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getDropoutReport = async (req, res, next) => {
  try {
    const { groupBy } = req.query;
    if (groupBy === 'reason') {
      const [rows] = await pool.query(`
        SELECT primary_reason as reason_name, COUNT(*) as count 
        FROM vw_dropout_details 
        GROUP BY primary_reason
        ORDER BY count DESC
      `);
      return res.json({ success: true, data: rows });
    }
    const [rows] = await pool.query('SELECT * FROM vw_dropout_details ORDER BY dropout_date DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

exports.getEnrollmentReport = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_enrollment_progress ORDER BY enrollment_date DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

exports.getSuccessRateReport = async (req, res, next) => {
  try {
    const [stats] = await pool.query('SELECT * FROM vw_pathway_stats');
    
    const overall = stats.reduce((acc, s) => {
      acc.total_enrolled += (s.current_enrollment || 0);
      acc.total_completed += (s.completed_count || 0);
      return acc;
    }, { total_enrolled: 0, total_completed: 0 });

    const formattedStats = stats.map(s => ({
      ...s,
      total: s.current_enrollment,
      completed: s.completed_count
    }));

    res.json({ 
      success: true, 
      data: { 
        overall: {
          enrollment_rate: overall.total_enrolled > 0 ? (overall.total_enrolled / 100).toFixed(1) : 0, 
          completion_rate: overall.total_enrolled > 0 ? ((overall.total_completed / overall.total_enrolled) * 100).toFixed(1) : 0,
          completed: overall.total_completed
        },
        byPathwayType: formattedStats 
      } 
    });
  } catch (error) {
    next(error);
  }
};

exports.getDistrictWiseReport = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vw_district_dropout_summary');
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyTrendReport = async (req, res, next) => {
  try {
    const [dropouts] = await pool.query(`
      SELECT DATE_FORMAT(dropout_date, '%b %Y') as month, COUNT(*) as dropouts 
      FROM dropouts 
      GROUP BY month 
      ORDER BY MIN(dropout_date) ASC
    `);

    const [enrollments] = await pool.query(`
      SELECT DATE_FORMAT(enrollment_date, '%b %Y') as month, COUNT(*) as enrollments 
      FROM enrollments 
      GROUP BY month 
      ORDER BY MIN(enrollment_date) ASC
    `);

    const [completions] = await pool.query(`
      SELECT DATE_FORMAT(expected_completion_date, '%b %Y') as month, COUNT(*) as completions 
      FROM enrollments 
      WHERE status = 'completed'
      GROUP BY month 
      ORDER BY MIN(expected_completion_date) ASC
    `);

    res.json({ success: true, data: { dropouts, enrollments, completions } });
  } catch (error) {
    next(error);
  }
};
