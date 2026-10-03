# TypeRushX ⚡

> A cyber-themed full-stack typing training platform designed to improve typing speed, accuracy, consistency, and keyboard awareness through gamified practice.

TypeRushX transforms a traditional typing test into an interactive training experience with **XP, levels, missions, daily challenges, personal analytics, weak-key analysis, and personalized recommendations**.

## 🚀 Overview

Traditional typing websites often focus on a single WPM score. **TypeRushX goes beyond a basic typing test** by recording typing performance, analyzing mistakes, tracking progress, rewarding improvement with XP, and providing targeted practice recommendations.

The project combines a cyber/terminal-inspired interface with a full-stack architecture using React, Node.js, Express, MongoDB, JWT authentication, and Recharts.

## ✨ Features

### 🔐 Authentication
- User signup and login
- Secure password hashing
- JWT-based authentication
- Protected application routes
- Persistent login session
- Logout functionality

### ⌨️ Typing Test
- 15, 30, and 60 second modes
- Real-time WPM calculation
- Accuracy calculation
- Error tracking
- Character tracking
- Key-level error tracking
- Automatic result saving

### 🎮 XP & Level System
- Earn XP from typing performance
- Automatic level calculation
- XP progress toward the next level
- Level updates as XP increases

### 🎯 Missions
Performance-based missions include:
- **First Rush** — Complete your first typing test
- **Speed Runner** — Reach 50+ WPM
- **Speed Demon** — Reach 70+ WPM
- **Accuracy Protocol** — Reach 95%+ accuracy
- **Zero Error** — Complete a test with zero errors

### 📅 Daily Challenge
- Daily typing passage
- Target WPM
- Target accuracy
- Fixed challenge duration
- Bonus XP reward
- Daily completion tracking
- Duplicate reward protection

### 📊 Personal Analytics
- Best WPM
- Average WPM
- Average accuracy
- Total typing runs
- Total errors
- Total characters typed
- WPM progression chart
- Accuracy trend chart

### 🔎 Weak-Key Analysis
TypeRushX tracks keyboard-level errors across typing sessions and identifies frequently mistyped keys, helping users understand specific typing weaknesses.

### 🧠 Personalized Recommendations
A rule-based recommendation engine analyzes weak keys and generates targeted practice suggestions, including practice words, priority levels, and focus areas.

### 🖥️ Cyber / Terminal UI
- Dark cyber-training aesthetic
- Terminal-inspired elements
- Training-focused dashboard
- Mission-style progression
- Responsive layouts
- Dedicated landing, login, and signup pages

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Recharts

### Backend
- Node.js
- Express.js
- JWT
- bcrypt/bcryptjs
- Mongoose

### Database
- MongoDB Atlas

### Development Tools
- VS Code
- Git
- GitHub
- npm

## 🏗️ Project Architecture

```text
TypeRushX/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── Dashboard.jsx
│       │   ├── TypingTest.jsx
│       │   ├── Missions.jsx
│       │   ├── DailyChallenge.jsx
│       │   └── Results.jsx
│       └── utils/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   └── server.js
│
├── .gitignore
└── README.md
```

## 🔄 Application Flow

```text
Landing Page
     ↓
Signup / Login
     ↓
Dashboard
     ↓
Typing Test ──────┐
     │            │
     ├── Missions │
     └── Daily Challenge
                  │
                  ▼
           Save Result
                  │
                  ▼
              MongoDB
                  │
                  ▼
        Analytics + Weak Keys
                  │
                  ▼
          Recommendations
```

## 📁 Environment Variables

Create:

```text
server/.env
```

Use `server/.env.example` as the template.

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/typerushx
JWT_SECRET=your_strong_production_secret_here
PORT=5000
```

> **Important:** Never commit `server/.env` or real database credentials to GitHub.

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Rajadhyaksha08/TypeRushX.git
cd TypeRushX
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create `server/.env` and add your MongoDB Atlas connection string and JWT secret.

## ▶️ Running the Project

### Start the backend

From `server`:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Start the frontend

From `client`:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🧪 Recommended Testing Flow

```text
Landing
   ↓
Signup
   ↓
Login
   ↓
Dashboard
   ↓
Typing Test
   ↓
Complete Test
   ↓
XP Updated
   ↓
Mission Progress
   ↓
Results & Analytics
   ↓
Daily Challenge
   ↓
Logout
```

## 📈 Performance Tracking

After every completed typing test, TypeRushX stores:

```text
WPM
Accuracy
Errors
Score
Duration
Total Characters
Key Errors
```

This information powers the user's personal performance history and recommendations.

## 🧠 Recommendation System

```text
Typing Result
      ↓
Analyze Key Errors
      ↓
Identify Frequently Mistyped Keys
      ↓
Assign Priority
      ↓
Generate Practice Suggestions
```

## 🔒 Security

The project includes:
- JWT authentication
- Password hashing
- Protected routes
- Environment variable configuration
- `.gitignore` protection for secrets
- MongoDB Atlas through environment variables

Sensitive credentials should always remain outside the repository.

## 🔮 Future Features

The following features were intentionally kept optional for the current version and can be added in future releases.

### 🏆 Global Leaderboard
- Highest WPM
- Best accuracy
- XP and level rankings
- Weekly/monthly rankings
- Friends leaderboard
- Seasonal competitions

### 💻 Code Typing Mode
A developer-focused typing mode for:
- Java
- JavaScript
- Python
- C/C++
- SQL
- HTML/CSS

Possible metrics:
- Code typing speed
- Syntax accuracy
- Character-level mistakes
- Language-specific challenges

### 👥 Multiplayer / Real-Time Typing Battles
```text
Create Room
     ↓
Invite Player
     ↓
Countdown
     ↓
Both Players Type
     ↓
Live Progress
     ↓
Results
```

### 🔥 Streak System
- Daily typing streak
- Streak milestones
- Streak-based XP bonuses
- Activity tracking

### 🎖️ Achievement & Badge System
Possible achievements:
- First 50 WPM
- 70 WPM Master
- 100 WPM
- 99% Accuracy
- 10 Perfect Tests
- 7-Day Streak
- 100 Completed Tests

### 📚 More Training Modes
- Word mode
- Quote mode
- Paragraph mode
- Custom text mode
- Difficulty levels
- Beginner/intermediate/advanced training

### 🤖 AI-Powered Typing Coach
A future AI system could analyze long-term performance and create adaptive training plans:

```text
Historical Results
       ↓
Performance Analysis
       ↓
Weakness Detection
       ↓
Personalized Training Plan
       ↓
Adaptive Practice
```

### 📱 Mobile Application
A mobile version could be developed using Flutter or React Native.

### 🌐 Social Features
Potential features:
- User profiles
- Friends
- Challenges
- Shared achievements
- Activity feed
- Friend-to-friend competitions

## 🎯 Current Project Status

| Feature | Status |
|---|---|
| Authentication | ✅ Complete |
| Typing Test | ✅ Complete |
| WPM Calculation | ✅ Complete |
| Accuracy Tracking | ✅ Complete |
| Error Tracking | ✅ Complete |
| MongoDB Result Storage | ✅ Complete |
| XP System | ✅ Complete |
| Level System | ✅ Complete |
| Missions | ✅ Complete |
| Daily Challenge | ✅ Complete |
| Personal Analytics | ✅ Complete |
| Weak-Key Analysis | ✅ Complete |
| Recommendations | ✅ Complete |
| Cyber UI | ✅ Complete |
| Responsive UI | ✅ Complete |
| GitHub Repository | ✅ Complete |

### Future / Optional

| Feature | Status |
|---|---|
| Global Leaderboard | 🔮 Planned |
| Code Typing Mode | 🔮 Planned |
| Multiplayer Typing Battles | 🔮 Planned |
| Streak System | 🔮 Planned |
| Achievement Badges | 🔮 Planned |
| AI Typing Coach | 🔮 Planned |
| Mobile Application | 🔮 Planned |
| Social Features | 🔮 Planned |

## 🎓 Project Purpose

TypeRushX demonstrates practical implementation of:
- Frontend development
- Backend API development
- Database integration
- Authentication
- REST APIs
- Data analysis
- Gamification
- Responsive UI design
- Performance tracking
- Rule-based recommendation systems

## 👨‍💻 Author

**Mandar Rajadhyaksha**

Built with:

```text
React + Node.js + Express + MongoDB
```

## 📄 License

This project is intended for educational and portfolio purposes.
