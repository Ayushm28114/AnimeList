🎌 AnimeList – Full-Stack Anime Catalog & Review Platform
AnimeList is a full-stack web application that allows users to explore anime, browse detailed information, create personalized watchlists, write reviews, and manage their profile.
It integrates the Jikan API (Unofficial MyAnimeList API) to fetch real-time anime data and uses a modern full-stack architecture built with React, Django REST Framework, and PostgreSQL.

🚀 Features
🔍 Anime Browsing
Search anime by name/genre/year

View detailed anime information (synopsis, rating, episodes, images)

Trending & popular anime sections (via Jikan API)

⭐ User Accounts
User authentication (Register/Login/Logout)

JWT-based secure token authentication

Profile page with user activity

📚 Personal Watchlist
Add anime to watchlist

Mark as Watching / Completed / Dropped / Plan to Watch

Remove items anytime

✍️ Anime Reviews
Write reviews for any anime

Edit/Delete your own reviews

View all reviews submitted by other users

🛠️ Admin Features
Django admin panel for managing users & reviews

Anime and review moderation controls

🏗️ Tech Stack
Frontend
React + Vite

React Router

Axios

Tailwind CSS / CSS Modules

Backend
Django REST Framework (DRF)

JWT Authentication (SimpleJWT)

PostgreSQL

Jikan API integration

CORS & Rate-Limiting

Deployment
Frontend → Vercel/Netlify

Backend → Render/Heroku/EC2

Database → PostgreSQL Cloud (Railway / Supabase / ElephantSQL)

📦 API Integration (Jikan API)
The application uses the Jikan v4 API to fetch:

Anime details

Characters

Episodes

Rankings & seasonal data

No paid API keys required.

🗂️ Project Structure
/frontend
  /src
    /components
    /pages
    /hooks
    api.js
    main.jsx

/backend
  /core
  /users
  /reviews
  /anime
  settings.py
  urls.py

README.md
📘 Database Schema (Simplified)
Users
id

username

email

password

Reviews
id

anime_id

user_id

rating

review_text

created_at

Watchlist
id

user

anime_id

status

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/anime-list.git
cd anime-list
2️⃣ Backend Setup
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🎯 Goals of the Project
Learn full-stack development with React + Django

Build production-ready authentication with JWT

Understand API consumption (Jikan API)

Implement database relationships & CRUD operations

Create a real project suitable for final-year submission and internships

🧪 Future Enhancements
AI-based recommendation system

User-to-user messaging

Social feed & comments

Dark/Light mode toggle

Offline caching with service workers

📝 License
This project is released under the MIT License.
