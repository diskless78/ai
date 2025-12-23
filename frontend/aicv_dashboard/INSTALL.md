# Installation Guide

Complete installation and setup guide for AICV Dashboard.

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Installation Steps](#-installation-steps)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Available Scripts](#-available-scripts)
- [Multi-Environment Setup](#-multi-environment-setup)
- [Verification Checklist](#-verification-checklist)
- [Next Steps](#-next-steps)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

| Tool        | Version   | Required | Download                                 |
| ----------- | --------- | -------- | ---------------------------------------- |
| **Node.js** | `23.x`    | ✅ Yes   | [Download](https://nodejs.org/)          |
| **Yarn**    | `1.22.22` | ✅ Yes   | [Download](https://classic.yarnpkg.com/) |
| **Git**     | Latest    | ✅ Yes   | [Download](https://git-scm.com/)         |

### Verify Installation

After installing the prerequisites, verify they are correctly installed:

```bash
# Check Node.js version
node --version
# Expected output: v23.x.x

# Check Yarn version
yarn --version
# Expected output: 1.22.22

# Check Git version
git --version
```

---

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/sanglee1702/cxview-dashboard.git
cd cxview-dashboard
```

### Step 2: Install Dependencies

Install all required packages using Yarn:

```bash
yarn install
```

This command will:

- Read `package.json` and install all dependencies
- Create a `node_modules` folder
- Generate or update `yarn.lock` file

> ⏱️ **Note**: Installation may take 2-5 minutes depending on your internet connection.

---

## 🔐 Environment Configuration

### Step 1: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Open the `.env` file and update the values according to your environment:

```env
# Application Environment
VITE_ENVIRONMENT=development

# API Endpoints
VITE_API_CXVIEW_ENDPOINT=https://api.cxview.ai:8081/prod/api/v1/

# Server Configuration
VITE_PORT=3039
```

### Environment Variables Reference

#### Required Variables

| Variable           | Type     | Description                            | Example                                |
| ------------------ | -------- | -------------------------------------- | -------------------------------------- |
| `VITE_ENVIRONMENT` | `string` | Application environment identifier     | `development`, `staging`, `production` |
| `VITE_PORT`        | `number` | Port number for the development server | `3039`                                 |

#### API Endpoints

| Variable                   | Type     | Description                 | Example                         |
| -------------------------- | -------- | --------------------------- | ------------------------------- |
| `VITE_API_CXVIEW_ENDPOINT` | `string` | CXView service API endpoint | `http://localhost:8081/api/v1/` |

> ⚠️ **Security Warning**:
>
> - Never commit `.env` files to version control
> - Keep your API endpoints and credentials secure
> - Use `.env.example` as a template only

> 💡 **Vite Environment Variables**: All environment variables in Vite must be prefixed with `VITE_` to be exposed to the client-side code.

---

## 🏃 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
yarn dev
```

The application will be available at:

- **URL**: `http://localhost:3039` (or the port specified in your `.env` file)
- **Hot Reload**: Enabled - Changes will automatically refresh the browser

### Production Build

Build the application for production:

```bash
yarn build
```

This will:

1. Run TypeScript compiler (`tsc`)
2. Build optimized production bundle with Vite
3. Generate output in the `dist` folder

### Preview Production Build

Preview the production build locally:

```bash
yarn preview
```

Or use the `start` command:

```bash
yarn start
```

---

## 📜 Available Scripts

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `yarn dev`           | Start development server with hot-reload         |
| `yarn dev:staging`   | Start development server for staging environment |
| `yarn build`         | Build the application for production             |
| `yarn build:staging` | Build the application for staging environment    |
| `yarn start`         | Start production preview server                  |
| `yarn start:staging` | Start staging preview server                     |
| `yarn preview`       | Preview the production build locally             |
| `yarn lint`          | Run ESLint to check code quality                 |
| `yarn lint:fix`      | Run ESLint and automatically fix issues          |

---

## 🌍 Multi-Environment Setup

For projects requiring multiple environments (development, staging, production), follow these steps:

### Step 1: Create Environment-Specific Files

Create separate environment files for each environment:

```bash
.env.development    # Development environment
.env.staging        # Staging environment
.env.production     # Production environment
```

### Step 2: Install dotenv-cli

Install the `dotenv-cli` package as a dev dependency:

```bash
yarn add -D dotenv-cli
```

### Step 3: Configure Environment Files

#### Development (`.env.development`)

```env
VITE_ENVIRONMENT=development
VITE_API_CXVIEW_ENDPOINT=http://localhost:8081/api/v1/
VITE_PORT=3039
```

#### Staging (`.env.staging`)

```env
VITE_ENVIRONMENT=staging
VITE_API_CXVIEW_ENDPOINT=https://api.cxview.ai:8081/prod/api/v1
VITE_PORT=3039
```

#### Production (`.env.production`)

```env
VITE_ENVIRONMENT=production
VITE_API_CXVIEW_ENDPOINT=https://api.cxview.ai:8081/prod/api/v1
VITE_PORT=8080
```

### Step 4: Update package.json Scripts

Update your `package.json` with environment-specific scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:staging": "dotenv -e .env.staging vite --mode staging --port $VITE_PORT",
    "dev:production": "dotenv -e .env.production vite --mode production --port $VITE_PORT",

    "build": "tsc && vite build",
    "build:staging": "dotenv -e .env.staging vite build --mode staging",
    "build:production": "dotenv -e .env.production vite build --mode production",

    "start": "vite preview",
    "start:staging": "dotenv -e .env.staging vite preview --port $VITE_PORT",
    "start:production": "dotenv -e .env.production vite preview --port $VITE_PORT",

    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint --fix \"src/**/*.{js,jsx,ts,tsx}\""
  }
}
```

### Step 5: Usage

Run the application in different environments:

```bash
# Development (default)
yarn dev

# Staging
yarn dev:staging
yarn build:staging
yarn start:staging

# Production
yarn dev:production
yarn build:production
yarn start:production
```

---

## ✅ Verification Checklist

After installation, verify everything is working:

- [ ] Node.js version is 23.x
- [ ] Yarn version is 1.22.22
- [ ] Dependencies installed successfully
- [ ] `.env` file created and configured
- [ ] Development server starts without errors
- [ ] Application loads in browser at `http://localhost:3039`
- [ ] Hot reload works when editing files
- [ ] Production build completes successfully
- [ ] ESLint runs without errors

---

## 🔄 Next Steps

After successful installation:

1. Read the [README.md](./README.md) for project overview
2. Review the [Project Structure](./README.md#-project-structure)
3. Start developing! 🚀

---

**Need help?** Contact the CXView team at support@cxview.ai
