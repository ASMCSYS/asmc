# ASMC API

A comprehensive Node.js Express API for managing members, bookings, events, payments, and facilities with JWT authentication, MongoDB integration, and automated features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.development
# Edit .env.development with your configuration

# Start development server
npm run dev

# Visit API documentation
open http://localhost:7055/api-docs
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[📖 Complete API Documentation](docs/API_DOCUMENTATION.md)** | Comprehensive guide covering all APIs, models, and components |
| **[🔧 Function Reference](docs/FUNCTION_REFERENCE.md)** | Detailed reference for all helper functions, utilities, and middleware |
| **[⚡ Quick Start Guide](docs/QUICK_START_GUIDE.md)** | Get up and running in under 10 minutes |
| **[📋 API Docs (Live)](http://localhost:7055/api-docs)** | Interactive Swagger documentation (when running) |

## 🏗️ Architecture

```
asmc-api/
├── app/
│   ├── controller/          # Business logic controllers
│   │   ├── auth/           # Authentication endpoints
│   │   ├── members/        # Member management
│   │   ├── bookings/       # Booking system
│   │   ├── events/         # Event management
│   │   ├── payment/        # Payment processing
│   │   ├── plans/          # Membership plans
│   │   ├── reports/        # Report generation
│   │   ├── halls/          # Hall management
│   │   ├── activity/       # Activity management
│   │   ├── masters/        # Master data
│   │   └── common/         # Common utilities
│   ├── models/             # Database models
│   ├── middlewares/        # Authentication, validation, image processing
│   ├── helpers/            # Response formatters, constants, utilities
│   ├── utils/              # Email service, helper functions
│   ├── config/             # Database configuration
│   └── routes/             # Route definitions
├── cron/                   # Scheduled jobs
├── docs/                   # API documentation
└── public/                 # Static files
```

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** - Admin and member authentication
- 👥 **Member Management** - Complete member lifecycle with family support
- 📅 **Booking System** - Hall and event booking management
- 💳 **Payment Processing** - Payment verification and history
- 📧 **Email Integration** - Nodemailer and MSG91 support
- 🖼️ **Image Processing** - Sharp and ImageKit integration
- 📊 **Report Generation** - Excel and CSV export capabilities

### Technical Features
- 🛡️ **Input Validation** - Joi schema validation
- 📄 **API Documentation** - Auto-generated Swagger docs
- ⏰ **Cron Jobs** - Automated database backups
- 🗄️ **MongoDB Integration** - Mongoose ODM with pagination
- 🔄 **Environment Support** - Development, staging, production
- 📝 **Logging** - Morgan HTTP request logging

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Joi
- **Email**: Nodemailer, MSG91
- **Image Processing**: Sharp, ImageKit
- **File Processing**: ExcelJS, JSON2CSV
- **Documentation**: Swagger UI
- **Process Management**: PM2
- **Development**: Nodemon

## 🚦 API Overview

### Authentication (`/auth`)
- `POST /auth/admin-login` - Admin login
- `POST /auth/member-login` - Member login
- `GET /auth/me` - Get current user
- `PUT /auth/change-password` - Change password
- `POST /auth/send-reset-password-otp` - Send reset OTP
- `PUT /auth/reset-password` - Reset password

### Members (`/members`)
- `GET /members` - List all members (paginated)
- `POST /members` - Create new member
- `GET /members/:id` - Get member details
- `PUT /members/:id` - Update member
- `DELETE /members/:id` - Delete member
- `POST /members/multiple` - Bulk member creation

### Additional Modules
- **Plans** (`/plans`) - Membership plan management
- **Bookings** (`/bookings`) - Booking system
- **Events** (`/events`) - Event management
- **Halls** (`/halls`) - Hall management
- **Payment** (`/payment`) - Payment processing
- **Reports** (`/reports`) - Report generation
- **Activity** (`/activity`) - Activity management
- **Masters** (`/masters`) - Master data management

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Server Configuration
PORT=7055
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/asmc

# Authentication
JWT_SECRET=your-super-secret-key

# Email Configuration
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
MSG91_AUTH_KEY=your-msg91-key
```

### Available Scripts

```bash
# Development
npm run dev                 # Start with nodemon

# Production
npm start                   # Start with cross-env
npm run start:staging       # Start staging environment
npm run start:prod          # Start with PM2

# Utilities
npm test                    # Run tests (placeholder)
```

## 🔐 Authentication

The API uses JWT-based authentication with Bearer tokens:

```javascript
// Login to get token
const response = await fetch('/auth/admin-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin@example.com',
    password: 'password123'
  })
});

// Use token in subsequent requests
const token = response.result.token;
fetch('/members', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 📊 Data Models

### Member Model
- Auto-generated member IDs (00001, 00002, etc.)
- Family member support
- Payment and fee tracking
- Profile image management
- Status and verification tracking

### Other Models
- **Plans**: Membership plan configurations
- **Bookings**: Hall and event reservations
- **Events**: Event management with bookings
- **Payments**: Payment history and verification
- **Users**: Admin user management

## 🔄 Background Jobs

### Database Backup
- **Schedule**: Daily at 1:00 AM IST
- **Function**: Automated MongoDB backup
- **Location**: `/backups` directory

### Bulk Email (Optional)
- **Purpose**: Mass email sending
- **Status**: Currently disabled (can be enabled)

## 🏃‍♂️ Development Workflow

1. **Setup**: Follow the [Quick Start Guide](docs/QUICK_START_GUIDE.md)
2. **Development**: Use `npm run dev` for auto-restart
3. **Testing**: Use Swagger UI at `/api-docs` or cURL/Postman
4. **Documentation**: Update docs when adding new features

### Adding New Features

1. **Create Model** (if needed): `app/models/your-model.js`
2. **Create Controller**: `app/controller/your-module/`
3. **Add Routes**: Update `app/routes/index.js`
4. **Add Validation**: Create validator schemas
5. **Update Documentation**: Add to Swagger and markdown docs

## 🚀 Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 7055
CMD ["npm", "start"]
```

### PM2 (Production)
```bash
npm install -g pm2
npm run start:prod
```

## 📈 Monitoring & Health

- **Health Check**: `GET /health`
- **API Documentation**: `GET /api-docs`
- **Static Files**: `/public` and `/backups`
- **Logs**: Console output with Morgan HTTP logging

## 🤝 Contributing

1. Read the [Function Reference](docs/FUNCTION_REFERENCE.md) to understand the codebase
2. Follow existing patterns for controllers, models, and routes
3. Add validation for all input data
4. Update documentation for new features
5. Test with the Swagger UI

## 📋 API Response Format

All API endpoints follow a consistent response format:

```json
{
  "success": true,
  "message": "Operation successful",
  "result": {
    // Response data here
  }
}
```

## 🛡️ Security Features

- JWT token authentication
- Input validation with Joi
- CORS configuration
- Environment-based secrets
- File upload validation
- SQL injection prevention (MongoDB)

## 📞 Support

- **Documentation**: Check the `docs/` directory
- **API Testing**: Use Swagger UI at `/api-docs`
- **Health Status**: Monitor `/health` endpoint
- **Issues**: Review error messages and logs

## 📝 License

ISC License

---

**🎯 Quick Links**
- [📖 Full Documentation](docs/API_DOCUMENTATION.md)
- [🔧 Function Reference](docs/FUNCTION_REFERENCE.md)
- [⚡ Quick Start](docs/QUICK_START_GUIDE.md)
- [📋 Live API Docs](http://localhost:7055/api-docs)
Server will start running on deployment server

## Generating Documentation

This project now ships with an **automatic documentation generator** that crawls through all Express routers and exported functions to produce human-readable markdown files.

Run the command below to (re)generate the docs at any time:

```bash
npm run generate-docs
```

The command will create / overwrite the following files inside the `docs` folder:

* `API_GENERATED.md` – Documentation for **all public REST endpoints** with example *cURL* snippets.
* `FUNCTIONS_GENERATED.md` – Index of **all exported functions & components** across the `app` directory.

Feel free to commit these generated files or host them using any static-site solution (e.g. GitHub Pages) to share the docs with your team.