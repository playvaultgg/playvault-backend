# 🛡️ PLAYVAULT.GG | Elite Game Vault
### *The Ultimate Full-Stack Digital Gaming Terminal*

PlayVault is a high-performance, production-ready E-Commerce platform for digital game keys. Engineered with a "Dark Luxury" aesthetic, it utilizes the **MERN Stack** (MongoDB, Express, React, Node.js) to deliver a seamless, high-speed shopping experience for elite gamers.

🌐 **Live Production Terminal:** [playvault-backend-production.up.railway.app](https://playvault-backend-production.up.railway.app/)

---

## 🚀 System Architecture & Tech Highlights

### 🎨 Frontend Performance
- **React.js 18**: Dynamic, component-driven UI with optimized rendering.
- **Vite & Tailwind CSS**: Next-gen styling and lightning-fast builds using a custom Black & Gold design system.
- **Framer Motion**: Premium micro-animations for high-end user engagement.
- **Lucide React**: Cyberpunk-style iconography.
- **Safe Area Support**: Full viewport optimization for iOS (Notch support) and Android devices.

### ⚙️ Backend & Security
- **Node.js & Express**: Asynchronous server logic for low-latency API responses.
- **MongoDB & Mongoose**: Flexible NoSQL schema for variable game specifications and cross-referenced orders.
- **JWT (JSON Web Tokens)**: Encrypted session management for users and administrative privileges.
- **Bcrypt.js**: Military-grade password hashing to protect sensitive user data.
- **Cloudinary Integration**: Dynamic image processing and hosting for game assets.

---

## 🌐 Deployment & Hosting
This application is professionally hosted and managed on **Railway**, ensuring:
- **Auto-deployment**: Continuous integration from the GitHub repository.
- **Scalability**: High-availability database clusters (MongoDB) for global access.
- **Secure SSL**: Automated HTTPS encryption for all transactions.

---

## 🛠️ Infrastructure & Setup

### 1. Database Configuration
Ensure your `MONGO_URI` is correctly pointed to your production cluster or local instance.

### 2. Environment Variables (`/backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Local Execution
**Backend Command:**
```bash
cd GameStore/backend
npm install
npm start
```

**Frontend Command:**
```bash
cd GameStore/frontend
npm install
npm run dev
```

---

## 👑 Administrative Control
The **Vault Admin Panel** allows for real-time management of the gaming ecosystem:
- **Inventory Control**: Inject/Edit game protocols and assets.
- **Order Monitoring**: Track encrypted transactions and payment status.
- **User Management**: Oversee registered agents and security roles.
- **Communication**: Manage incoming support and contact logs.

---

## 📜 Development & Ownership
This platform was architected and developed for **PlayVault.GG**. 
- **Developer:** [The PlayVault Team]
- **Host:** Railway Cloud Infrastructure
- **Version:** 1.2.0 (Stable Production Rebuild)

---
© 2026 PLAYVAULT.GG. All rights reserved.
