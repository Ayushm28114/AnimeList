# 🎌 AnimeList

> **Full-Stack Anime Catalog & Review Platform**

AnimeList is a full-stack web application that allows users to explore anime, browse detailed information, create personalized watchlists, write reviews, and manage their profile. It integrates the [Jikan API](https://jikan.moe/) (Unofficial MyAnimeList API) to fetch real-time anime data and uses a modern full-stack architecture built with **React**, **Django REST Framework**, and **PostgreSQL**.

---

## � Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [API Integration](#-api-integration-jikan-api)
- [Project Structure](#️-project-structure)
- [Database Schema](#-database-schema)
- [Installation & Setup](#️-installation--setup)
- [Goals](#-goals-of-the-project)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## �🚀 Features

### 🔍 Anime Browsing
- Search anime by name, genre, or year
- View detailed anime information (synopsis, rating, episodes, images)
- Trending & popular anime sections (via Jikan API)

### ⭐ User Accounts
- User authentication (Register / Login / Logout)
- JWT-based secure token authentication
- Profile page with user activity

### 📚 Personal Watchlist
- Add anime to watchlist
- Mark as **Watching** / **Completed** / **Dropped** / **Plan to Watch**
- Remove items anytime

### ✍️ Anime Reviews
- Write reviews for any anime
- Edit / Delete your own reviews
- View all reviews submitted by other users

### 🛠️ Admin Features
- Django admin panel for managing users & reviews
- Anime and review moderation controls

---

## 🏗️ Tech Stack

| Layer        | Technologies                                       |
|--------------|--------------------------------------------------- |
| **Frontend** | React, Vite, React Router, Axios, Tailwind CSS     |
| **Backend**  | Django REST Framework (DRF), SimpleJWT, PostgreSQL |
| **API**      | Jikan API v4                                       |
| **Security** | CORS, Rate-Limiting                                |

### Deployment Options

| Component    | Platform Options                                    |
|--------------|-----------------------------------------------      |
| Frontend     | Vercel / Netlify                                    |
| Backend      | Render / Heroku / EC2                               |
| Database     | PostgreSQL Cloud (Railway / Supabase / ElephantSQL) |

---

## 📦 API Integration (Jikan API)

The application uses the **Jikan v4 API** to fetch:

- Anime details
- Characters
- Episodes
- Rankings & seasonal data

> ✅ **No paid API keys required!**

---

## 🗂️ Project Structure

```
AnimeList/
├── animelist/                 # Django Backend
│   ├── animelist/             # Project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── api/                   # API app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── migrations/
│   ├── manage.py
│   └── requirements.txt
│
├── Frontend/                  # React Frontend
│   ├── src/
│   │   ├── Components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   ├── context/           # React Context (Auth)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── LICENSE
└── README.md
```

---

## 📘 Database Schema

### Users
| Field      | Type     |
|------------|----------|
| id         | Integer  |
| username   | String   |
| email      | String   |
| password   | String   |

### Reviews
| Field       | Type      |
|-------------|-----------|
| id          | Integer   |
| anime_id    | Integer   |
| user_id     | FK → User |
| rating      | Integer   |
| review_text | Text      |
| created_at  | DateTime  |

### Watchlist
| Field    | Type      |
|----------|-----------|
| id       | Integer   |
| user     | FK → User |
| anime_id | Integer   |
| status   | String    |

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (or SQLite for development)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ayushm28114/AnimeList.git
cd anime-list
```

### 2️⃣ Backend Setup

```bash
cd animelist
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

> Backend will run at `http://127.0.0.1:8000`

### 3️⃣ Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

> Frontend will run at `http://localhost:5173`

---

## 🎯 Goals of the Project

- ✅ Learn full-stack development with **React + Django**
- ✅ Build production-ready authentication with **JWT**
- ✅ Understand API consumption (**Jikan API**)
- ✅ Implement database relationships & **CRUD operations**
- ✅ Create a real project suitable for **final-year submission** and **internships**

---

## 🧪 Future Enhancements

- [ ] AI-based recommendation system
- [ ] User-to-user messaging
- [ ] Social feed & comments
- [ ] Dark / Light mode toggle
- [ ] Offline caching with service workers

---

## 📝 License

This project is released under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/your-username">Your Name</a>
</p>
