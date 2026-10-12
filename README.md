# 🍳 CookbookMM

[![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev/)
[![Status](https://img.shields.io/badge/Status-Live-success.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A full-stack MERN community platform built for beginners learning to cook and passionate foodies sharing global recipes freely.

🌐 **Live Demo:** [View CookbookMM Live]([https://your-frontend-url.vercel.app](https://cookbook-mm.vercel.app/))

---

## 📖 Project Overview

**CookbookMM** is a production-ready full-stack milestone project built using the **MERN** stack (MongoDB, Express.js, React, Node.js). 

The platform is designed to make cooking simple and approachable for beginners who don't know where to start, while providing home chefs a free space to share step-by-step global recipes. From quick snacks to international dinners, recipes are categorized for effortless discovery.

---

## ✨ Features

- 👤 **User Authentication:** Guest users can browse recipes. Authentication is required to interact with posts.
- 📝 **Full CRUD Operations:** Authenticated users can **Create**, **Read**, **Update**, and **Delete** their own recipes.
- 🖼️ **Cloud Image Uploads:** Seamless media handling powered by **Supabase Storage**.
- ⚡ **Backend Caching:** Optimized API response performance utilizing **Upstash Redis**.
- 🗂️ **Recipe Categorization:** Browse recipes sorted by meal types, cuisines, or custom categories.
- ❤️ **Reactions & Likes:** Authenticated users can like/react to recipes.
- 💬 **Community Comments:** Registered users can engage with recipe authors through comment sections.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React.js (Vite), Tailwind CSS, deployed on **Vercel**
- **Backend:** Node.js, Express.js (RESTful APIs), deployed on **Render**
- **Database:** MongoDB Atlas (via Mongoose ORM)
- **Caching:** Redis (via Upstash)
- **Storage:** Supabase Storage (for images)
- **Authentication:** JWT (JSON Web Tokens) & Bcryptjs

---

## 📂 Project Structure

The project is structured as a monorepo with distinct frontend (`client`) and backend (`server`) environments:

```text
cookbookMM/
├── client/                 # Frontend React Application (Vercel)
│   ├── public/             # Static public assets
│   ├── src/                # React components, pages, context, and styles
│   ├── package.json        # Frontend dependencies
│   └── .env                # Client environment variables (VITE_API_BASE_URL)
│
├── server/                 # Backend Node/Express API (Render)
│   ├── config/             # DB & Supabase connection settings
│   ├── controllers/        # Request handlers & logic
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & validation middlewares
│   ├── package.json        # Backend dependencies
│   └── .env                # Server environment variables (MongoDB, Redis, JWT)
│
└── README.md               # Project documentation
```
## 🚀 Deployment
-**Backend API:** Hosted on Render
-**Frontend Client:** Hosted on Vercel
## Author
-*Wai Yan Naing - Computer Science Student who is looking for internship opportunity!*
-**📬 Telegram:** @waiyandev
