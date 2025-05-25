
#  Demonstration video Link => 
#  Agent Task Manager

A simple MERN-based application that allows admins to upload contact lists via CSV, assign tasks to agents with notes, and let agents view their own tasks and details.

---

##  Features

-  Secure authentication for admins and agents
-  CSV upload with automatic task assignment to agents
-  Limit of 5 tasks per agent per upload
-  Task notes and file tracking
-  Agents can view their assigned tasks with timestamps
-  Responsive and styled UI

---

##  Tech Stack

- **Frontend:** React, Axios, CSS Modules
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT-based middleware
- **CSV Parsing:** `csv-parser`
- **File Uploads:** Multer

---

##  Installation

###  Backend Setup

```bash
cd backend
npm install
```

###  Frontend Setup

```bash
cd frontend
npm install
```

---

##  Environment Setup

Create a `.env` file inside the `backend` directory and add:

```ini
MONGO_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

##  Running the App

### Start backend:

```bash
cd backend
npm run dev
```

### Start frontend:

```bash
cd frontend
npm start
```

---

##  Folder Structure

```
/frontend
  /components
    Navbar.js
  /pages
    MyTasks.js
    UploadList.js
    ViewAgents.js

/backend
  /models
    User.js
    List.js
  /routes
    listRoutes.js
    userRoutes.js
  /middleware
    auth.js
  server.js
```

---

##  API Overview

### `POST /api/lists/upload`
Upload a CSV file and assign it to agents.

### `GET /api/lists/my-tasks`
Get tasks assigned to the logged-in agent.

### `GET /api/lists/agent-details`
Get details for the logged-in agent.

### `GET /api/agents/all`
Fetch all agents (admin only).

---

##  Notes

- Ensure MongoDB is running locally.
- Only `.csv`, `.xls`, and `.xlsx` files are allowed for upload.
- A maximum of 5 tasks can be assigned to a single agent per upload.

---

