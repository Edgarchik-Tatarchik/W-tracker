🌐 Live Demo
https://w-trackerfrontend-production.up.railway.app/

Hosted on Railway (free tier). May take 30–60 seconds to wake up if inactive.


# 💪 Workout Tracker

A full-stack fitness web application for logging workouts, tracking exercise progression, and visualizing training statistics.


---

## 🎯 Purpose

Most fitness apps are either too complex or too simple. Workout Tracker fills the gap — it gives you a clean interface to log what you did, see what you should do next, and understand how you're progressing over time.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Recharts |
| Backend | Java 21, Spring Boot 3, Spring Security |
| Auth | JWT (HttpOnly cookies) |
| Database | PostgreSQL 15 |
| Containerization | Docker, Docker Compose |

---

## ✨ Features

- 🔐 **Authentication** — Register, login, logout, forgot/reset password via email
- 🏋️ **Workout Logging** — Create, edit, delete workouts with exercises (sets, reps, weight)
- 📋 **Exercise Details** — View previous session data inline while training
- 📈 **Statistics** — Weight, sets, reps, and volume charts per exercise with period filters
- 🤖 **Auto Progression** — App recommends weight increases or decreases based on last 3 sessions
- 🔍 **Search & Sort** — Filter workouts by name, length, or date


  ## 🧠 Engineering Highlights

- Stateless authentication using JWT stored in HttpOnly cookies
- Backend-driven workout progression logic based on last 3 sessions
- Modular REST API design with clear separation of concerns
- Dockerized full-stack setup for reproducible environment

---

## 📸 Screenshots

### Dashboard — overview of workouts and quick actions
![Workouts](screenshots/dashboard.png)

### Exercise statistics — weight and volume progression
![Statistics 1](screenshots/stats.png)
![Statistics 2](screenshots/recs.png)
![Workout details 1](screenshots/details.png)


## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed

### Setup

```bash
# Clone the repository
git clone https://github.com/Edgarchik-Tatarchik/workout-tracker.git
cd workout-tracker

# Create environment file
cp .env.example .env
# Fill in your values in .env

# Build and run
docker-compose up --build
```

App will be available at `http://localhost`

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```
POSTGRES_PASSWORD=your_db_password
JWT_SECRET=your_256bit_secret_key
SPRING_MAIL_USERNAME=your@gmail.com
SPRING_MAIL_PASSWORD=your_gmail_app_password
```

> **Note:** Gmail requires an [App Password](https://myaccount.google.com/apppasswords), not your regular password.

---

## 📁 Project Structure

```
workout-tracker/
├── workout-tracker/          # Spring Boot backend
│   ├── src/
│   └── Dockerfile
├── workout-tracker-frontend/ # React frontend
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## 🔮 Future Improvements

- [ ] Calorie tracking
- [ ] Workout templates
- [ ] Mobile app (React Native)
- [ ] Social features — share workouts

---

## 👤 Author

**Edgar** — [@Edgarchik-Tatarchik](https://github.com/Edgarchik-Tatarchik)



⚠️ Disclaimer
This project is a personal portfolio application built for learning and demonstration purposes. It is not intended for production use.

No guarantees are made regarding uptime, data persistence, or security
Do not store sensitive personal information
The application may be taken down or reset at any time without notice
Use at your own risk
