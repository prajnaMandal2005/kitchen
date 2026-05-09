# 🍽️ Prajna's Kitchen - Exquisite Dining Management

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)](#)
[![Node](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](#)
[![Netlify](https://img.shields.io/badge/Deployment-Netlify-00C7B7?logo=netlify&logoColor=white)](#)
[![Live Demo](https://img.shields.io/badge/Live-Demo-FF4B2B?style=for-the-badge&logo=rocket)](https://69fefbbbd22b290008dfd552--prajna-kitchen.netlify.app/)

Prajna's Kitchen is a high-end, full-stack restaurant management platform designed to bridge the gap between gourmet dining and digital efficiency. Built with the MERN stack and styled with a premium "gourmet-aesthetic," the platform provides seamless role-based workflows for customers, waitstaff, chefs, and management.

---

## 🚀 Live Demo

Experience the premium gourmet interface live:
**[Visit Prajna's Kitchen 🍽️](https://69fefbbbd22b290008dfd552--prajna-kitchen.netlify.app/)**

---

## ✨ Features

### 👤 Customer Experience
- **Secure Onboarding**: Seamless registration with email OTP verification for account security.
- **Interactive Menu**: Browse chef-curated dishes with high-quality visuals and detailed ingredients.
- **Smart Cart**: Build your dining selection and review orders before transmitting them to the kitchen.
- **Live Tracking**: Real-time order status updates from "Awaiting Chef" to "Delivered."

### 🍷 Staff Portals
- **Chef Dashboard**: Real-time ticket management with a focus on efficiency and speed.
- **Waiter Dashboard**: Manage incoming guest requests and coordinate dish service flawlessly.
- **Personnel Applications**: Secure staff registration and approval workflow for new hires.

### 🎩 Executive Management
- **Personnel Oversight**: Approve or reject new staff applications with a single click.
- **Menu Control**: Full CRUD operations for the food menu (Add, Edit, Delete dishes).
- **Guest Analytics**: View the patron registry and dining history for personalized service.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Material UI (MUI), Framer Motion (Animations), Axios.
- **Backend**: Node.js, Express.js (Serverless compatible via Netlify Functions).
- **Database**: MongoDB Atlas (Mongoose ODM).
- **Security**: JWT Authentication, Bcrypt Password Hashing, Email OTP (Nodemailer).
- **Deployment**: Netlify (Frontend + Functions).

---

## 🏗️ Project Structure

```text
├── frontend/               # React.js application (CRA/Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Buttons, Cards, etc.)
│   │   ├── pages/          # Full page views (Login, Menu, Dashboards)
│   │   └── utils/          # API services and helpers
├── functions/              # Netlify Serverless Functions (Backend logic)
├── models/                 # Mongoose schemas (User, Food, Order, OTP)
├── routes/                 # Express API route definitions
├── controllers/            # Business logic for each route
└── seed.js                 # Database initialization script
```

---

*Developed with ❤️ for the love of fine dining and clean code.*
