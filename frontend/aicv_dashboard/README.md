# AICV DASHBOARD

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://gitlab.cxview.local/core/aicv_dashboard)
[![Node](https://img.shields.io/badge/node-23.x-green.svg)](https://nodejs.org/)
[![Yarn](https://img.shields.io/badge/yarn-1.22.22-blue.svg)](https://yarnpkg.com/)
[![React](https://img.shields.io/badge/react-19.1.0-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-3178C6.svg)](https://www.typescriptlang.org/)

A modern, professional dashboard application for CXView Retail built with React, TypeScript, and Material-UI.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)
- [Environment Variables](#-environment-variables)
- [Support](#-support)
- [License](#-license)

---

## ✨ Features

- 🎨 **Modern UI** - Built with Material-UI (MUI) v7
- 🔐 **Authentication** - Secure user authentication & authorization
- 📊 **Data Visualization** - Advanced charts with ApexCharts and Plotly.js
- 🌐 **Internationalization** - Multi-language support with i18next
- 🔄 **State Management** - Redux Toolkit + Redux Saga + Redux Persist
- 📡 **API Integration** - Axios + React Query for efficient data fetching
- 🎭 **Smooth Animations** - Framer Motion for delightful user experience
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎯 **Form Validation** - React Hook Form + Yup for robust form handling
- 🚀 **Fast Development** - Vite for lightning-fast HMR and builds

---

## 🛠 Tech Stack

### Core Technologies

- **React** 19.1.0 - UI Library
- **TypeScript** 5.8.3 - Type Safety
- **Vite** 7.0.3 - Build Tool & Dev Server
- **Material-UI (MUI)** 7.2.0 - Component Library

### State & Data Management

- **Redux Toolkit** 2.8.2 - State Container
- **Redux Saga** 1.3.0 - Side Effects Management
- **React Query** 5.90.10 - Server State Management
- **Axios** 1.11.0 - HTTP Client

### UI & Styling

- **Emotion** - CSS-in-JS
- **Framer Motion** 12.23.24 - Animation Library
- **ApexCharts** 5.3.6 - Interactive Charts
- **Plotly.js** 3.1.1 - Scientific Charts

### Forms & Validation

- **React Hook Form** 7.60.0 - Form Management
- **Yup** 1.6.1 - Schema Validation

### Routing & i18n

- **React Router DOM** 7.6.3 - Client-side Routing
- **i18next** 25.3.2 - Internationalization

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 23.x
- **Yarn** 1.22.22
- **Git** (latest)

### Installation

```bash
# Clone the repository
git clone https://gitlab.cxview.local/core/aicv_dashboard.git
cd aicv_dashboard

# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Start development server
yarn dev
```

The application will be available at `http://localhost:3039`

> 📖 For detailed installation instructions, see [INSTALL.md](./INSTALL.md)

---

## 📚 Documentation

- **[Installation Guide](./INSTALL.md)** - Complete setup and configuration instructions
- **[Changelog](#-changelog)** - Version history and release notes

---

## 📁 Project Structure

```
aicv_dashboard/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   ├── routes/         # Route definitions
│   ├── store/          # Redux store configuration
│   ├── services/       # API services
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── locales/        # i18n translation files
│   ├── theme/          # MUI theme configuration
│   ├── App.tsx         # Root component
│   └── main.tsx        # Application entry point
├── .env.example        # Environment variables template
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── INSTALL.md          # Installation guide
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md           # This file
```

---

## 📜 Scripts

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

> 📖 For multi-environment setup, see [INSTALL.md](./INSTALL.md#-multi-environment-setup)

---

---

## 🔐 Environment Variables

The application uses the following environment variables:

| Variable                   | Description                            | Required |
| -------------------------- | -------------------------------------- | -------- |
| `VITE_ENVIRONMENT`         | Application environment identifier     | ✅       |
| `VITE_PORT`                | Port number for the development server | ✅       |
| `VITE_API_CXVIEW_ENDPOINT` | CXView service API endpoint            | ✅       |

> 📖 For detailed configuration, see [INSTALL.md](./INSTALL.md#-environment-configuration)

---

## 📞 Support

For support, please contact:

- **Email**: support@cxview.ai
- **Website**: [https://cxview.ai](https://cxview.ai)
- **Issues**: [GitLab Issues](https://gitlab.cxview.local/core/aicv_dashboard/issues)

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

---

## 📝 Changelog

### Version 0.1.0 - 2025-11-21

#### ✨ Added

- Initial release of CXView Frontend
- Complete dashboard interface with Material-UI
- Multi-language support (i18n)
- Real-time data visualization with ApexCharts and Plotly.js
- User authentication and authorization system
- Responsive design for all devices
- Redux state management with persistence
- API integration with React Query
- Form validation with React Hook Form and Yup

#### 🔄 Changed

- N/A

#### 🐛 Fixed

- N/A

#### 🗑️ Removed

- N/A

---

## 🙏 Acknowledgments

Built with ❤️ by the CXView Team

### Key Technologies

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Material-UI](https://mui.com/) - React components for faster and easier web development
- [Redux Toolkit](https://redux-toolkit.js.org/) - The official, opinionated, batteries-included toolset for efficient Redux development

---

## 🗺️ Roadmap

- [ ] Add comprehensive test coverage
- [ ] Implement CI/CD pipeline
- [ ] Add more data visualization options
- [ ] Enhance mobile experience
- [ ] Add dark mode support
- [ ] Implement real-time notifications
- [ ] Add export functionality for reports
- [ ] Integrate more third-party services

---

**Made with ❤️ by the CXView Team**
