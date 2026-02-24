# PLAYVAULT.GG - Full-Stack Game E-Commerce Platform

A comprehensive, production-ready full-stack gaming e-commerce website with a dark luxury theme. Built using a modern and scalable MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Tech Stack Highlights

### Frontend
- **React.js**: Enables dynamic, component-driven UI ensuring smooth page transitions and exceptional user experience without reloading.
- **Tailwind CSS (v4)**: Selected for its utility-first approach to quickly iterate on the luxurious black and gold (#111111 / #d4af37) gaming UI aesthetics.
- **React Router (v7)**: Manages client-side routing to support the Single Page Application (SPA) feel.
- **Axios**: Handles promises effectively, providing a robust interface for HTTP requests between the client and server.
- **Lucide Icons**: Scalable vector icons perfectly fitted for gaming and e-commerce themes.

### Backend
- **Node.js & Express.js**: A fast, asynchronous backend server capable of handling RESTful API requests quickly, maintaining the high-speed demand of a modern gaming application.
- **MongoDB (via Mongoose)**: A NoSQL document database chosen to seamlessly store diverse shapes of data—such as variable game specs and varying user order sizes.

### Authentication & Security
- **JWT (JSON Web Tokens)**: Secures client-server communication. Protects user dashboard, cart checkouts, and admin panel privileges.
- **Bcrypt**: Hashes passwords to ensure sensitive user information is never stored or exposed in plain text.
- **Secure Middleware**: Express routing checks user tokens on protected routes (like order history).

## 🗂️ Project Structure

The project has been architected tightly into two separate components located the `GameStore` directory:
- `/frontend`: Holds the React/Vite source code.
- `/backend`: Holds the Express server, Mongoose models, and API routing.

## 🛠️ How Client and Server Communicate

The architecture is fully decoupled. The robust REST API backend exclusively handles database interactions and business logic (like verifying passwords, hashing secrets, or tallying order totals), sending lightweight JSON responses back. The frontend receives these JSON payloads and uses React states `useState` and effects `useEffect` to instantly paint the user interface. They communicate over `HTTP` requests (`http://localhost:5000/api/...`) via Axios using protected Bearer Tokens.

## 📥 Installation Steps

It is recommended to run the frontend and backend in two separate terminal windows. 

### 1. Database Setup
Make sure MongoDB is installed globally or adjust the `.env` connection string to point to a MongoDB Atlas remote cluster.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd c:\Users\gunde\OneDrive\Desktop\H1\GameStore\backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Set up the Environment Variables:
   Inside `/backend/.env`, you will find configurations:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gamevault
   JWT_SECRET=super_secret_jwt_key
   ```
4. Start the backend DEV server:
   ```bash
   npm run dev
   # (or 'npm start' for node)
   ```
   *You should see "MongoDB connected" and "Server running on port 5000."*

### 3. Frontend Setup
1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd c:\Users\gunde\OneDrive\Desktop\H1\GameStore\frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React server:
   ```bash
   npm run dev
   ```
   *You can now visit http://localhost:5173 to view the Game Store.*

### Extra Functionality Built
- **Admin Setup**: Built into the Mongoose schema `User.js`, roles are designated (`user` | `admin`). Creating an admin just requires altering the role entry in MongoDB or using an admin registration script.
- **Order Handling**: Orders correctly bind to a User's Object ID in MongoDB (`models/Order.js`).
- **Dynamic Routing**: Clicking "View Details" on the Browse UI passes parameters to `GameDetails.jsx` which simultaneously pulls matching database configurations from the `/api/games/:id` endpoint.
