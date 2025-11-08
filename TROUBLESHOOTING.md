# Troubleshooting Guide

## React Server Not Opening

If `http://localhost:3000` is not opening, follow these steps:

### Step 1: Check if Servers are Running

1. **Check Django Server (Port 8000)**:
   - Open a new terminal
   - Run: `netstat -ano | findstr ":8000"`
   - If you see output, Django is running
   - If not, start it: `python manage.py runserver`

2. **Check React Server (Port 3000)**:
   - Open a new terminal
   - Run: `netstat -ano | findstr ":3000"`
   - If you see output, React is running
   - If not, start it: `cd frontend && npm start`

### Step 2: Start Servers Manually

**Option 1: Use the Batch File**
- Double-click `START_SERVERS.bat`
- Two command windows will open
- Wait 10-30 seconds for React to compile

**Option 2: Start Manually**

**Terminal 1 - Django:**
```bash
cd "D:\OSTAD web devlopment\FINAL EXAM"
python manage.py runserver
```

**Terminal 2 - React:**
```bash
cd "D:\OSTAD web devlopment\FINAL EXAM\frontend"
npm start
```

### Step 3: Check for Errors

**In the React Server Window, look for:**
- ✅ "Compiled successfully!" - Server is ready
- ❌ "Failed to compile" - Check the error message
- ❌ "Port 3000 is already in use" - Close other apps using port 3000

**Common Errors:**

1. **Port 3000 already in use:**
   - Solution: Close other applications using port 3000
   - Or change port: `set PORT=3001 && npm start`

2. **Module not found:**
   - Solution: Run `npm install` in the frontend folder

3. **Compilation errors:**
   - Check the error message in the React server window
   - Fix the syntax errors mentioned

### Step 4: Access the Application

Once you see "Compiled successfully!" in the React server window:

1. Open your browser
2. Go to: `http://localhost:3000`
3. If it doesn't open automatically, manually navigate to the URL

### Step 5: Verify Backend Connection

1. Open: `http://localhost:8000/admin`
2. Login with admin credentials
3. If this works, Django is running correctly

### Step 6: Check Browser Console

1. Open `http://localhost:3000` in your browser
2. Press F12 to open Developer Tools
3. Check the Console tab for errors
4. Check the Network tab to see if API calls are failing

### Common Issues and Solutions

**Issue: "Cannot GET /"**
- Solution: Make sure React server is running on port 3000

**Issue: "Network Error" or "CORS Error"**
- Solution: Make sure Django server is running on port 8000
- Check that `proxy` in `frontend/package.json` is set to `http://localhost:8000`

**Issue: "404 Not Found" for API calls**
- Solution: Verify Django server is running
- Check that API endpoints are correct in the code

**Issue: React page is blank**
- Solution: Check browser console for JavaScript errors
- Verify all components are imported correctly

### Still Not Working?

1. **Kill all Node processes:**
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Kill all Python processes:**
   ```bash
   taskkill /F /IM python.exe
   ```

3. **Restart both servers:**
   - Start Django first
   - Wait 5 seconds
   - Start React

4. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies
   - Try again

5. **Check firewall:**
   - Make sure Windows Firewall isn't blocking ports 3000 and 8000

### Manual Server Start Commands

**Django:**
```bash
cd "D:\OSTAD web devlopment\FINAL EXAM"
python manage.py runserver
```

**React:**
```bash
cd "D:\OSTAD web devlopment\FINAL EXAM\frontend"
npm start
```

### Expected Output

**Django Server:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**React Server:**
```
Compiled successfully!

You can now view blood-management-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

If you see these messages, the servers are running correctly!

