const { pool } = require('../config/database');

exports.getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM students WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM students WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (first_name LIKE ? OR last_name LIKE ? OR enrollment_number LIKE ?)';
      countQuery += ' AND (first_name LIKE ? OR last_name LIKE ? OR enrollment_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    
    const fetchParams = [...params, Number(limit), Number(offset)];

    const [students] = await pool.query(query, fetchParams);
    const [countResult] = await pool.query(countQuery, params);

    res.json({
      success: true,
      data: students,
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

exports.getStudentById = async (req, res, next) => {
  try {
    const [students] = await pool.query('SELECT * FROM students WHERE student_id = ?', [req.params.id]);
    
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const [history] = await pool.query('SELECT * FROM educational_history WHERE student_id = ?', [req.params.id]);

    res.json({
      success: true,
      data: {
        ...students[0],
        educationalHistory: history
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const payload = req.body;
    const insertQuery = `
      INSERT INTO students (
        enrollment_number, first_name, last_name, date_of_birth, gender, email, phone, 
        address, district_id, pincode, aadhaar_number, category, is_differently_abled, 
        disability_type, father_name, mother_name, guardian_name, guardian_phone, 
        guardian_occupation, family_income, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      payload.enrollment_number, payload.first_name, payload.last_name, payload.date_of_birth, 
      payload.gender, payload.email, payload.phone, payload.address, payload.district_id, 
      payload.pincode, payload.aadhaar_number, payload.category, payload.is_differently_abled || false, 
      payload.disability_type || null, payload.father_name, payload.mother_name, payload.guardian_name, 
      payload.guardian_phone, payload.guardian_occupation, payload.family_income, payload.status || 'active'
    ];

    const [result] = await pool.query(insertQuery, values);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const payload = req.body;
    const updateQuery = `
      UPDATE students SET 
        first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, 
        email = ?, phone = ?, address = ?, district_id = ?, pincode = ?, 
        aadhaar_number = ?, category = ?, is_differently_abled = ?, 
        disability_type = ?, father_name = ?, mother_name = ?, 
        guardian_name = ?, guardian_phone = ?, guardian_occupation = ?, 
        family_income = ?, status = ?
      WHERE student_id = ?
    `;

    const values = [
      payload.first_name, payload.last_name, payload.date_of_birth, payload.gender,
      payload.email, payload.phone, payload.address, payload.district_id, payload.pincode,
      payload.aadhaar_number, payload.category, payload.is_differently_abled || false,
      payload.disability_type || null, payload.father_name, payload.mother_name,
      payload.guardian_name, payload.guardian_phone, payload.guardian_occupation,
      payload.family_income, payload.status, req.params.id
    ];

    await pool.query(updateQuery, values);
    res.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    next(error);
  }
};
