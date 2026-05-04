# JenQ ERP - Enterprise Resource Planning System

A modern, full-featured ERP system built with React and Node.js. JenQ ERP helps businesses manage their operations efficiently with modules for Dashboard, CRM, Inventory, Accounting, HR, Projects, Documents, and Customer Onboarding.

![JenQ ERP](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Module Overview](#module-overview)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Modules
- **Dashboard** - Real-time analytics and overview
- **CRM** - Customer relationship management with leads, deals, and contacts
- **Inventory** - Stock management, categories, and warehouse tracking
- **Accounting** - Invoices, payments, expenses, and financial reports
- **HR** - Employee management, payroll, and attendance
- **Projects** - Project planning, tasks, and team collaboration
- **Documents** - File management with upload, folder creation, e-sign capabilities
- **Customer Onboarding** - Complete onboarding workflow with pipeline stages, templates, and automation

### Key Features
- Dark/Light theme support
- Responsive design
- Role-based access
- Real-time notifications
- File drag-and-drop
- E-signature integration
- Automated workflows
- Email notifications
- Multi-company support

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite (better-sqlite3)** - Database
- **JSON Web Token (JWT)** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File uploads

### Development
- **ES Modules** - JavaScript modules
- **Concurrently** - Run multiple processes

---

## 📁 Project Structure

```
jenq-erp/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/             # API services
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── store/            # Context providers
│   │   └── services/         # Core services
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                    # Node.js backend
│   ├── routes/              # API routes
│   ├── middleware/          # Middleware functions
│   ├── models/              # Database models
│   ├── utils/               # Utility functions
│   ├── index.js             # Server entry point
│   ├── package.json
│   └── Dockerfile
│
├── package.json              # Root package.json
├── render.yaml               # Render deployment config
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 or higher
- **npm** v9 or higher
- **Git**

### Clone the Repository

```bash
git clone https://github.com/your-username/jenq-erp.git
cd jenq-erp
```

### Install Dependencies

Install all dependencies for the entire project:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install
```

Or use the convenience script:

```bash
npm run install:all
```

---

## ⚙️ Environment Setup

### Development Environment

The application runs with default settings:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3003

### Production Environment Variables

Create environment files as needed:

**Server (.env)**
```env
PORT=3003
NODE_ENV=production
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend-url.onrender.com
```

**Client (.env)**
```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_APP_URL=https://your-frontend-url.onrender.com
```

---

## 🏃 Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or separately:

```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend  
cd client && npm run dev
```

### Production Build

Build the frontend for production:

```bash
cd client && npm run build
```

Start the production server:

```bash
npm start
```

---

## 📦 Module Overview

### 1. Dashboard
- Overview statistics
- Recent activities
- Quick actions
- Charts and graphs

### 2. CRM (Customer Relationship Management)
- Leads management
- Contact database
- Deal pipeline
- Sales tracking
- Communication history

### 3. Inventory
- Product catalog
- Stock levels
- Categories management
- Warehouse tracking
- Low stock alerts

### 4. Accounting
- Invoice creation
- Payment tracking
- Expense management
- Financial reports
- Tax calculations

### 5. HR (Human Resources)
- Employee database
- Attendance tracking
- Leave management
- Payroll processing
- Performance reviews

### 6. Projects
- Project creation
- Task management
- Team collaboration
- Timeline tracking
- Resource allocation

### 7. Documents
- File upload (drag & drop)
- Folder management
- E-signature support
- Templates
- Version control
- Star/Share files

### 8. Customer Onboarding
- **Pipeline Stages**:
  - Lead Converted
  - Client Invited
  - Onboarding In Progress
  - Pending Approval
  - Completed
  - Project Activated

- **Features**:
  - Onboarding templates (SaaS, Enterprise, Local Business)
  - Smart intake forms
  - Document collection & verification
  - Contract signing (E-sign)
  - Task checklists
  - Centralized communication
  - Meeting scheduling
  - Automation rules
  - Progress tracking
  - Team management view

---

## 📚 API Documentation

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
GET  /api/auth/me       - Get current user
```

### Dashboard
```
GET /api/dashboard/stats - Get dashboard statistics
GET /api/dashboard/activity - Get recent activities
```

### CRM
```
GET    /api/crm/leads      - List leads
POST   /api/crm/leads      - Create lead
PUT    /api/crm/leads/:id  - Update lead
DELETE /api/crm/leads/:id  - Delete lead
```

### Inventory
```
GET    /api/inventory/products     - List products
POST   /api/inventory/products     - Create product
PUT    /api/inventory/products/:id - Update product
DELETE /api/inventory/products/:id - Delete product
```

### Accounting
```
GET    /api/accounting/invoices      - List invoices
POST   /api/accounting/invoices      - Create invoice
PUT    /api/accounting/invoices/:id - Update invoice
POST   /api/accounting/payments      - Record payment
```

### HR
```
GET    /api/hr/employees    - List employees
POST   /api/hr/employees    - Add employee
PUT    /api/hr/employees/:id - Update employee
GET    /api/hr/attendance  - Get attendance
```

### Projects
```
GET    /api/projects         - List projects
POST   /api/projects         - Create project
PUT    /api/projects/:id     - Update project
GET    /api/projects/:id/tasks - Get project tasks
```

### Documents
```
GET    /api/documents            - List documents
POST   /api/documents/folder     - Create folder
POST   /api/documents/upload     - Upload file
PUT    /api/documents/:id/star   - Star file
PUT    /api/documents/:id/share  - Share file
DELETE /api/documents/:id        - Delete file
GET    /api/documents/trash      - Get trash
```

### Onboarding
```
GET    /api/onboarding                           - List clients
POST   /api/onboarding/clients                   - Create client
POST   /api/onboarding/clients/:id/invite        - Invite client
POST   /api/onboarding/clients/:id/forms         - Submit form
POST   /api/onboarding/clients/:id/documents/:docId/sign - E-sign
PUT    /api/onboarding/clients/:id/tasks/:taskId - Update task
POST   /api/onboarding/clients/:id/complete      - Complete onboarding
GET    /api/onboarding/templates                 - List templates
POST   /api/onboarding/templates                - Create template
```

---

## 🚢 Deployment

### Deploy to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Create Backend Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Create new Web Service
   - Connect GitHub repository
   - Settings:
     - Build Command: `cd server && npm install`
     - Start Command: `cd server && npm start`
   - Add Environment Variable: `PORT=3003`

3. **Create Frontend Service**
   - Create new Static Site
   - Connect GitHub repository
   - Settings:
     - Build Command: `cd client && npm install && npm run build`
     - Publish Directory: `client/dist`

4. **Update CORS**
   - Set `FRONTEND_URL` in backend to your frontend URL

### Docker Deployment

```bash
# Build Docker image
docker build -t jenq-erp-server -f server/Dockerfile .

# Run container
docker run -p 3003:3003 jenq-erp-server
```

### Using render.yaml

Simply push the `render.yaml` file to create both services automatically.

---

## 🔧 Troubleshooting

### Common Issues

**1. Port already in use**
```bash
# Find process using port
netstat -ano | findstr :3003

# Kill process
taskkill /F /PID <PID>
```

**2. Module not found**
```bash
# Reinstall dependencies
cd server && rm -rf node_modules && npm install
cd client && rm -rf node_modules && npm install
```

**3. CORS errors**
- Ensure `FRONTEND_URL` is set correctly in server
- Check that frontend URL matches exactly

**4. Database errors**
- Check that `models/database.js` exists
- Ensure proper permissions on database file

**5. Build errors**
```bash
# Clear cache and rebuild
cd client
rm -rf dist node_modules .vite
npm install
npm run build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://react.dev)
- [Node.js](https://nodejs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Vite](https://vitejs.dev)
- [Express.js](https://expressjs.com)

---

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/your-username/jenq-erp/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

---

**Built with ❤️ using React and Node.js**

Copyright © 2024 JenQ ERP. All rights reserved.