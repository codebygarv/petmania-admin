# 🐾 Petmania Admin Dashboard

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux)](https://redux-toolkit.js.org/)

A professional, high-performance administrative dashboard for the **Petmania** ecosystem. Built with a focus on speed, scalability, and premium user experience to manage pets, users, and platform analytics efficiently.

---

## ✨ Features

- 📊 **Advanced Analytics Dashboard**: Real-time overview of platform growth, active users, and pet listings using **Recharts**.
- 👥 **User Management**: Comprehensive control over user profiles, status, and activity history.
- 🐶 **Pet Catalog Control**: Detailed management of pet listings including health records, adoption status, and media.
- 🔐 **Secure Authentication**: Robust login system with protected routing and session management.
- 🎨 **Modern Design System**: Sleek, responsive UI powered by **Tailwind CSS v4** and **Lucide Icons**.
- ⚡ **Optimized State Management**: Seamless data fetching and caching with **React Query** and **Redux Toolkit**.

---

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React Query](https://tanstack.com/query/latest)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/codebygarv/petmania-admin.git
   cd petmania-admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your backend API URL:
   ```env
   VITE_API_URL=your_backend_api_url
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
src/
├── api/          # API services and axios configuration
├── components/   # Reusable UI components and Layout
├── pages/        # Main route views (Dashboard, Users, Pets, etc.)
├── redux/        # Redux slices and store configuration
├── shared/       # Shared utilities and constants
└── store/        # React Query hooks and global state
```

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by [Garv](https://github.com/codebygarv)
