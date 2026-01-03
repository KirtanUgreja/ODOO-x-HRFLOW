# HRflow - Human Resource Management System

A comprehensive HR management system built for the Odoo Hackathon. HRflow provides a complete solution for managing employees, attendance, leave requests, payroll, and more with a modern, intuitive interface.

## � Team Members

- **Kirtan Ugreja**
- **Meet Rajanoi**

## �🚀 Features

### Core Modules

- **👤 Employee Management**
  - Complete employee profiles with personal and professional information
  - Role-based access control (Admin/Employee)
  - Employee onboarding and management
  - Password reset functionality for admins

- **📊 Dashboard & Analytics**
  - Real-time statistics and insights
  - Department-wise employee distribution
  - Attendance trends and analytics
  - Present/absent employee tracking

- **⏰ Attendance Management**
  - Digital check-in/check-out system
  - Real-time attendance tracking
  - Attendance history and reports
  - Status tracking (Present, Absent, Late)

- **🏖️ Leave Management**
  - Leave request submission
  - Leave balance tracking
  - Approval workflow
  - Multiple leave types support

- **💰 Payroll & Salary**
  - Detailed salary breakdowns
  - CTC calculations
  - Salary slip generation (PDF export)
  - Component-wise salary tracking (Basic, HRA, PF, etc.)

- **📄 Profile Management**
  - Personal information
  - Banking details (secure)
  - Skills and certifications
  - Resume uploads
  - About me section

### Technical Highlights

- **Modern Tech Stack**: Next.js 16 with App Router, React 19, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based secure authentication with bcrypt
- **UI/UX**: Beautiful, responsive design with Tailwind CSS v4 and Radix UI
- **Charts**: Data visualization with Recharts
- **PDF Generation**: Salary slip and document exports

---

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local installation OR Neon account)
- **Git** for version control

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KirtanUgreja/ODOO-x-HRFLOW.git
cd ODOO-x-HRFLOW/hrflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

You have **two options** for database setup:

#### **Option A: Neon Database (Recommended for Production/Deployment)**

[Neon](https://neon.tech) is a serverless PostgreSQL platform that's perfect for production deployments.

**Steps to get Neon Connection String:**

1. **Create a Neon Account**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create a New Project**
   - Click "New Project" in the Neon console
   - Choose a region (preferably closest to your users)
   - Set a project name (e.g., "hrflow-production")

3. **Get Connection String**
   - Once the project is created, go to the "Connection Details" section
   - Copy the **pooled connection string** (recommended for serverless environments)
   - It will look like:
     ```
     postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
     ```

4. **Connection String Format:**
   ```
   postgresql://[username]:[password]@[host]/[database]?sslmode=require
   ```

**Example Neon Connection String:**
```
DATABASE_URL="postgresql://hrflow_owner:AbCd1234XyZ@ep-cool-grass-a5m9m8n3-pooler.us-east-1.aws.neon.tech/hrflow_db?sslmode=require"
```

#### **Option B: Local PostgreSQL (For Development)**

If you prefer to use a local PostgreSQL database during development:

1. **Install PostgreSQL** on your machine
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Start PostgreSQL Service**
   ```bash
   # macOS
   brew services start postgresql
   
   # Ubuntu
   sudo service postgresql start
   ```

3. **Create Database**
   ```bash
   # Access PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE hrflow_db;
   
   # Create user (optional)
   CREATE USER hrflow_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE hrflow_db TO hrflow_user;
   ```

4. **Local Connection String Format:**
   ```
   DATABASE_URL="postgresql://[username]:[password]@localhost:5432/[database]"
   ```

**Example Local Connection String:**
```
DATABASE_URL="postgresql://hrflow_user:mypassword@localhost:5432/hrflow_db"
```

> **💡 Pro Tip:** Use local PostgreSQL for development and Neon for staging/production deployments. This gives you faster local development while maintaining production-grade infrastructure for deployed environments.

### 4. Environment Configuration

Create a `.env.local` file in the `hrflow` directory:

```bash
cd hrflow
touch .env.local
```

Add the following environment variables:

```env
# Database Configuration
# Use Neon connection string for production/deployment
# Use local PostgreSQL for development
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# JWT Secret (generate a strong random string)
# You can generate one using: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Optional: Node Environment
NODE_ENV="development"
```

**Example `.env.local` for Development (Local PostgreSQL):**
```env
DATABASE_URL="postgresql://hrflow_user:mypassword@localhost:5432/hrflow_db"
JWT_SECRET="MyS3cr3tK3y!@#$%^&*()"
NODE_ENV="development"
```

**Example `.env.local` for Production (Neon):**
```env
DATABASE_URL="postgresql://hrflow_owner:AbCd1234XyZ@ep-cool-grass-a5m9m8n3-pooler.us-east-1.aws.neon.tech/hrflow_db?sslmode=require"
JWT_SECRET="Pr0duct1on$ecr3tK3y!@#$Random567890"
NODE_ENV="production"
```

### 5. Database Schema Setup

Run the database schema migrations:

```bash
# Push schema to database
npm run db:push
```

This will create all necessary tables in your PostgreSQL database:
- `profiles` - Employee profiles
- `personal_info` - Personal details
- `banking_info` - Banking information (encrypted)
- `skills` - Employee skills
- `certifications` - Professional certifications
- `salary_info` - Payroll information
- `attendance` - Attendance records
- `leave_requests` - Leave management

### 6. Seed Initial Data (Optional)

To populate the database with sample data for testing:

```bash
npm run seed
```

This creates sample employees, attendance records, and leave requests.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Login Credentials

After seeding the database, you can use these credentials:

**Admin Account:**
- Email: `admin@hrflow.com`
- Password: `admin123`

**Employee Account:**
- Email: `employee@hrflow.com`
- Password: `employee123`

> ⚠️ **Security Warning:** Change these credentials immediately in production!

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on `localhost:3000` |
| `npm run build` | Build production-ready application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run db:push` | Push database schema changes to PostgreSQL |
| `npm run db:studio` | Open Drizzle Studio for database management |
| `npm run seed` | Seed database with sample data |

---

## 🏗️ Project Structure

```
hrflow/
├── src/
│   ├── actions/          # Server actions
│   │   ├── admin.ts      # Admin management actions
│   │   ├── admin-stats.ts # Dashboard statistics
│   │   ├── attendance.ts  # Attendance actions
│   │   ├── auth.ts        # Authentication actions
│   │   ├── leave.ts       # Leave management
│   │   ├── payroll.ts     # Payroll actions
│   │   └── profile.ts     # Profile management
│   ├── app/              # Next.js app router
│   │   ├── (auth)/       # Auth pages (login, signup)
│   │   ├── (dashboard)/  # Dashboard pages
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── layout/       # Layout components
│   │   ├── profile/      # Profile components
│   │   └── ui/           # Reusable UI components
│   ├── db/
│   │   └── schema.ts     # Drizzle ORM schema
│   ├── lib/              # Utility libraries
│   │   ├── auth.ts       # Auth utilities
│   │   ├── db.ts         # Database connection
│   │   ├── validators.ts # Zod validators
│   │   ├── utils.ts      # General utilities
│   │   └── pdf-generator.ts # PDF generation
│   ├── scripts/          # Utility scripts
│   │   ├── seed-db.ts    # Database seeding
│   │   └── check-db.ts   # Database verification
│   └── middleware.ts     # Route protection
├── database/             # SQL schemas
│   ├── schema.sql        # Main database schema
│   └── migration_*.sql   # Migration files
├── public/               # Static assets
├── .env.local            # Environment variables (create this)
├── drizzle.config.ts     # Drizzle configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add your production environment variables:
     - `DATABASE_URL` - Use your **Neon connection string**
     - `JWT_SECRET` - Use a strong random secret
     - `NODE_ENV` - Set to `production`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Every push to `main` branch triggers a new deployment

### Other Deployment Options

- **Netlify**: Similar to Vercel, supports Next.js
- **Railway**: Easy deployment with built-in PostgreSQL
- **AWS Amplify**: Full AWS integration
- **Docker**: Containerize the application

> 🔥 **Production Tip:** Always use **Neon (or managed PostgreSQL)** for production deployments. Local PostgreSQL is only suitable for development.

---

## 🗄️ Database Management

### Using Drizzle Studio

Drizzle Studio provides a visual interface to manage your database:

```bash
npm run db:studio
```

This opens a web interface at `https://local.drizzle.studio` where you can:
- View all tables and data
- Edit records directly
- Run queries
- Manage relationships

### Direct PostgreSQL Access

**For Local PostgreSQL:**
```bash
psql -d hrflow_db -U hrflow_user
```

**For Neon:**
- Use the Neon web console
- Connect via any PostgreSQL client using your connection string

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's gitignored by default
2. **Use strong JWT secrets** - Generate using `openssl rand -base64 32`
3. **Change default passwords** immediately after setup
4. **Enable SSL** for database connections in production (`sslmode=require`)
5. **Use environment variables** for all sensitive data
6. **Implement rate limiting** for authentication endpoints (production)
7. **Regular security audits** - Run `npm audit` regularly

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error: "Connection refused"**
- Ensure PostgreSQL is running (`brew services list` or `sudo service postgresql status`)
- Verify connection string format
- Check firewall settings

**Error: "SSL required"**
- Add `?sslmode=require` to Neon connection strings
- For local dev, you can use `?sslmode=disable`

### Build Errors

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
npm run lint
npx tsc --noEmit
```

### Environment Variables Not Loading

- Restart development server after changing `.env.local`
- Ensure file is named exactly `.env.local` (not `.env`)
- Check file is in the `hrflow` directory (not root)

---

## 📚 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Radix UI |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Drizzle ORM |
| **Authentication** | JWT + bcryptjs |
| **Validation** | Zod |
| **Charts** | Recharts |
| **PDF** | jsPDF + html2canvas |
| **Icons** | Lucide React |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project was created for the Odoo Hackathon.

---

## 👥 Support

For questions or issues:
- Create an issue on GitHub
- Contact the development team

---

## 🎉 Acknowledgments

- Built for **Odoo Hackathon**
- Powered by **Next.js**, **Neon**, and modern web technologies
- Inspired by enterprise HR management systems

---

## 🎬 Demo Video

Watch our demo video to see HRflow in action:

**[🎥 View Demo Video](https://drive.google.com/drive/folders/1iX0eC6DzwQ_aKW-w9SerIUk5dPh_dbNx)**

> 📹 *Replace the link above with your actual demo video URL (YouTube, Loom, etc.)*

---

**Happy HR Managing! 🚀**
