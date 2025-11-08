# 🩸 Blood Management System - How to Run

## ✅ Your Project is Now Running!

### 🌐 Open in Browser

**Main Application (React Frontend):**
👉 **http://localhost:3000**

This is where you'll use the Blood Management System application.

### 🔧 Backend API

**Django Backend API:**
- API Root: http://127.0.0.1:8000/
- Admin Panel: http://127.0.0.1:8000/admin/

---

## 📋 Current Status

✅ **Django Backend**: Running on port 8000
✅ **React Frontend**: Running on port 3000
✅ **Database**: SQLite (db.sqlite3)
✅ **Dependencies**: All installed

---

## 🚀 Quick Start (Next Time)

### Option 1: Use the Batch File (Easiest)
Double-click `start_servers.bat` in the project folder

### Option 2: Manual Start

**Terminal 1 - Django Backend:**
```bash
python manage.py runserver
```

**Terminal 2 - React Frontend:**
```bash
cd frontend
npm start
```

---

## 🛑 How to Stop the Servers

1. **Close the browser windows** that opened
2. **Close the PowerShell/Command Prompt windows** running the servers
3. Or press `Ctrl + C` in each terminal window

---

## 📝 Important URLs

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000/
- **Admin Panel**: http://127.0.0.1:8000/admin/

---

## 🔐 Admin Credentials

If you need to access the admin panel, you may need to create a superuser:
```bash
python manage.py createsuperuser
```

---

## ❓ Troubleshooting

**If port 8000 or 3000 is already in use:**
1. Close any other applications using these ports
2. Or kill the process: `netstat -ano | findstr ":8000"` then `taskkill /PID <process_id> /F`

**If React doesn't start:**
- Make sure you're in the `frontend` directory
- Run `npm install` first
- Check for errors in the terminal

---

## 🎉 Enjoy Your Blood Management System!

The application should now be open in your browser at **http://localhost:3000**

