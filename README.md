# 📚 Today I Learned — Study Tracker

A beginner-friendly full-stack web app to log and review your daily study sessions.

---

## 🗂️ Project Structure

```
project/
├── frontend/
│   ├── index.html      ← The webpage
│   ├── style.css       ← Styling
│   └── script.js       ← Frontend logic (fetch, DOM)
│
└── backend/
    ├── server.js               ← Express server (entry point)
    ├── package.json            ← Node.js project config
    ├── .env                    ← Environment variables (MongoDB URI, PORT)
    ├── models/
    │   └── Entry.js            ← Mongoose schema/model
    └── routes/
        └── entryRoutes.js      ← API route handlers
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

1. **Node.js** — https://nodejs.org (v18 or later recommended)
2. **MongoDB** — https://www.mongodb.com/try/download/community (Community Edition)
   - Or use **MongoDB Atlas** (free cloud version) — https://www.mongodb.com/cloud/atlas

---

## 🚀 Setup & Run Instructions

### Step 1: Open your terminal / command prompt

### Step 2: Navigate to the backend folder
```bash
cd project/backend
```

### Step 3: Install all dependencies
```bash
npm install
```
This reads `package.json` and installs: express, mongoose, cors, dotenv, nodemon.

### Step 4: Configure MongoDB

Open `backend/.env` and set your MongoDB URI:

**Option A — Local MongoDB (default):**
```
MONGO_URI=mongodb://localhost:27017/studytracker
PORT=5000
```
Make sure MongoDB is running locally:
- Windows: Run `mongod` in a terminal
- Mac (Homebrew): `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

**Option B — MongoDB Atlas (cloud, no installation needed):**
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the URI (looks like: `mongodb+srv://user:password@cluster.mongodb.net/studytracker`)
5. Paste it in `.env` as MONGO_URI

### Step 5: Start the backend server
```bash
npm start
```
You should see:
```
✅ Connected to MongoDB
🚀 Server running at http://localhost:5000
```

### Step 6: Open the frontend

**Option A — Just open the file:**
Double-click `frontend/index.html` to open it in your browser.

**Option B — Use Live Server (recommended for development):**
- Install VS Code extension "Live Server"
- Right-click `index.html` → "Open with Live Server"
- Opens at http://localhost:5500

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/entries | Save items for a date |
| GET | /api/entries | Get all saved dates |
| GET | /api/entries/:date | Get items for a specific date |

---

## 🛠️ Development Mode (auto-restart on file changes)

```bash
npm run dev
```
This uses `nodemon` to automatically restart the server when you edit backend files.

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to server" | Make sure you ran `npm start` in the backend folder |
| "MongoDB connection error" | Check that MongoDB is running or verify your Atlas URI |
| Items not showing | Open browser DevTools (F12) → Console tab for errors |
| Port 5000 in use | Change PORT in `.env` to 5001, and update API_BASE in `script.js` |
