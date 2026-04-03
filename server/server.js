require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { checkConnection } = require('./config/database');
const errorHandler = require('./middleware/error');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const dropoutRoutes = require('./routes/dropoutRoutes');
const pathwayRoutes = require('./routes/pathwayRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

checkConnection();

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/dropouts', dropoutRoutes);
app.use('/api/pathways', pathwayRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => res.json({ message: 'Dropout Re-entry Pathway API is running.' }));
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'API route not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
