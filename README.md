# 📱 Stack Overflow Clone

A full-stack web application inspired by Stack Overflow, with additional social features where users can create posts with images/videos, interact with content, and manage multilanguage securely with OTP verification. For french email OTP and for hindi, english, spanish, chinese, portuguese phone OTP. Built with **Next.js + Express + MongoDB**, have a responsive UI.

---

## 🚀 Features

### 🧠 Core Stack Overflow Features
- 📝 Ask Questions
- 💬 Answer Questions
- 👍 Vote on Questions & Answers
- 🗑️ Delete Questions/Answers

### 🌟 Additional Features (Custom)
- 📝 Create posts with text + media (image/video upload)
- 📷 Media preview before posting
- ❤️ Like, 💬 Comment, 🔁 Share functionality
- 🔐 Authentication with OTP (Firebase SMS + Email)
- 🌐 Multi‑language support (i18next)
- 📊 User points system with transfer functionality
- 📱 Responsive design (mobile + desktop)
- 📂 Organized layout with sidebar navigation

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (React framework)
- Tailwind CSS (styling)
- Axios (API calls)
- i18next (translations)

**Backend**
- Node.js + Express.js
- MongoDB (Mongoose ODM)
- Multer (file uploads)

**Other**
- Firebase (OTP authentication)
- JWT (secure sessions)

---

## 📁 Project Structure

```
stack/        → Frontend (Next.js)
server/        → Backend (Express)
uploads/       → Stored media files
```

---


## 🔑 Environment Variables

Create `.env` files in both frontend and backend.

**Backend `.env`**
```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
```

**Frontend `.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## ▶️ Run Project

**Start backend**
```bash
cd server
npm run dev
```

**Start frontend**
```bash
cd client
npm run dev
```
---
## ⚠️ OTP (Testing Mode)

Phone authentication is currently running in Firebase test mode.

To test login:

- Phone Numbers: +919876543210 
                 +917303864683 
                 +919303897617 
- OTP: 123456  

Note: Real OTP functionality requires Firebase billing to be enabled.

---

## 🌍 Deployment

### Frontend (Vercel)

* Import project
* Set env variables
* Deploy

### Backend (Render / Railway)

* Create Web Service
* Set root directory = server
* Add env variables
* Deploy

---

## 📌 Key Highlights

* Combines Q&A platform with social media features
* Scalable backend architecture
* Clean responsive UI

---
