# 🍳 CookbookMM

[![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev/)
[![Status](https://img.shields.io/badge/Status-In_Development-orange.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A MERN stack community platform built for beginners learning to cook and passionate foodies sharing global recipes freely.

---

## 📖 Project Overview

**CookbookMM** is a full-stack milestone project built using the **MERN** stack (MongoDB, Express.js, React, Node.js). 

The platform is designed to make cooking simple and approachable for beginners who don't know where to start, while providing home chefs a free space to share step-by-step global recipes. From quick snacks to international dinners, recipes are categorized for effortless discovery.

---

## ✨ Features

- 👤 **User Authentication:** Guest users can browse recipes. Authentication is required to interact with posts.
- 📝 **Full CRUD Operations:** Authenticated users can **Create**, **Read**, **Update**, and **Delete** their own recipes.
- 🗂️ **Recipe Categorization:** Browse recipes sorted by meal types, cuisines, or difficulty.
- ❤️ **Reactions & Likes:** Authenticated users can like/react to recipes.
- 💬 **Community Comments:** Registered users can engage with recipe authors through comment sections.
- 🔖 **Bookmark / Save Recipe:** *(Work in Progress 🚧)* Save favorite recipes to a personal collection.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, HTML5, CSS3/Tailwind
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose ORM)
- **Authentication:** JWT (JSON Web Tokens)

---

## 📂 Project Structure

The project is structured as a monorepo with distinct frontend (`client`) and backend (`server`) environments:

```text
cookbookMM/
├── client/                 # Frontend React Application
│   ├── public/             # Static public assets
│   ├── src/                # React components, pages, context, and styles
│   ├── package.json        # Frontend dependencies
│   └── .env                # Client environment variables
│
├── server/                 # Backend Node/Express API
│   ├── config/             # DB connection settings
│   ├── controllers/        # Request handlers & logic
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & validation middlewares
│   ├── package.json        # Backend dependencies
│   └── .env                # Server environment variables
│
└── README.md               # Project documentation
```
## Author
*Wai Yan Naing - who is looking for internship opportunity! DM me for work.@waiyandev (Telegram)*
