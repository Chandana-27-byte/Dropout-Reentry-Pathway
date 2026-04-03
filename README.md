# Dropout Re-entry Pathway System

A comprehensive full-stack web application for managing dropout students and facilitating their re-entry into education through various pathways.

## 🚀 Features

- **Student Management**: Complete CRUD operations for student records
- **Dropout Recording**: Document and track dropout cases with detailed reasons
- **Re-entry Pathways**: Create and manage educational pathways (academic, vocational, skill-based)
- **Counselor Management**: Assign counselors and track counseling sessions
- **Enrollment System**: Enroll dropouts in suitable pathways
- **Progress Tracking**: Monitor student progress through modules
- **Reports & Analytics**: Comprehensive dashboards and reports
- **Role-based Access**: Admin, Counselor, Institution, and Student roles

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Recharts (Charts)
- React Hook Form
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Bcrypt
- Multer (File uploads)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Database Setup

1. Create the database:
```sql
CREATE DATABASE dropout_reentry_db;
```

2. Run the schema:
```bash
mysql -u root -p dropout_reentry_db < database/schema.sql
```

3. Seed the data:
```bash
mysql -u root -p dropout_reentry_db < database/seed.sql
```

4. Create procedures and triggers:
```bash
mysql -u root -p dropout_reentry_db < database/procedures.sql
mysql -u root -p dropout_reentry_db < database/triggers.sql
mysql -u root -p dropout_reentry_db < database/views.sql
```

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dropout_reentry_db
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the application:
```bash
npm run dev
```

## 📁 Project Structure

```text
dropout-reentry-pathway/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS styles
├── server/                 # Node.js Backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
└── database/               # SQL files
```

## 🔐 Default Credentials

```text
Email: admin@dropout-reentry.com
Password: admin123
```
