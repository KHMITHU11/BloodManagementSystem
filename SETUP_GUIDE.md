# Quick Setup Guide

## Step 1: Backend Setup

1. **Create and activate virtual environment**:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create admin user**:
   ```bash
   python setup_admin.py
   ```
   Or use Django admin:
   ```bash
   python manage.py createsuperuser
   ```
   Then edit the user in Django admin and set role to 'admin'

5. **Start Django server**:
   ```bash
   python manage.py runserver
   ```
   Backend will run on `http://localhost:8000`

## Step 2: Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start React development server**:
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## Step 3: Access the Application

1. Open browser and go to `http://localhost:3000`
2. Register as a donor or login as admin
3. Start using the application!

## Default Admin Access

After creating an admin user, you can:
- Login at `http://localhost:3000/login`
- Access admin dashboard
- Manage blood banks, donors, requests, and donations

## Testing the Application

### As Admin:
1. Login with admin credentials
2. Go to Admin Dashboard
3. Create a blood bank
4. View all donors
5. Approve/Reject blood requests
6. Approve/Reject donations
7. Search donors by various criteria

### As Donor:
1. Register a new account (or login if already registered)
2. Go to Donor Dashboard
3. Update your profile
4. Make a blood request
5. Request to donate blood
6. View your request and donation history

## Troubleshooting

### Backend Issues:
- Make sure all migrations are applied: `python manage.py migrate`
- Check if port 8000 is available
- Verify all dependencies are installed: `pip list`

### Frontend Issues:
- Make sure backend is running on port 8000
- Clear browser cache
- Check browser console for errors
- Verify all npm packages are installed: `npm list`

### Database Issues:
- Delete `db.sqlite3` and run migrations again
- Make sure SQLite is available

## Production Deployment

Before deploying:
1. Set `DEBUG = False` in `settings.py`
2. Set proper `ALLOWED_HOSTS`
3. Change `SECRET_KEY`
4. Use a production database (PostgreSQL recommended)
5. Configure static files serving
6. Set up environment variables

## Notes

- The application uses SQLite by default (for development)
- JWT tokens are stored in localStorage
- CORS is configured for localhost:3000
- All API endpoints require authentication except register/login

