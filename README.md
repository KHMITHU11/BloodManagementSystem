# Blood Management System

A full-stack Blood Management System built with Django REST Framework (DRF) and React. This system allows administrators to manage blood banks, donors, blood requests, and donations, while donors can register, update their profiles, make blood requests, and track their donation history.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Admin and Donor)

### Admin Features
- Manage blood banks (Create, Read, Update, Delete)
- View all donors
- Manage blood requests (Approve/Reject)
- Manage donations (Approve/Reject)
- Search and filter donors by blood group, city, and availability
- Dashboard with statistics:
  - Total donors
  - Total blood requests
  - Pending requests
  - Total donations
  - Blood availability by group
  - Recent requests and donations

### Donor Features
- Register as a donor with profile information
- Update donor profile (blood group, address, availability, etc.)
- Make blood donation requests
- Request to donate blood
- View donation history
- View blood request history
- Dashboard showing:
  - Blood availability by group
  - Personal profile information
  - My requests and donations

### Additional Features
- Search/Filter functionality for donors
- Validation on both frontend and backend
- Responsive design
- Real-time status updates
- Blood inventory management

## Technology Stack

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- Django REST Framework Simple JWT 5.3.0
- Django CORS Headers 4.3.1
- Pillow 10.1.0 (for image handling)

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- React Toastify 9.1.3

## Project Structure

```
blood-management/
├── blood_management/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── accounts/                  # User authentication app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── bloodbank/                 # Blood management app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── frontend/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Admin/
│   │   │   ├── Donor/
│   │   │   └── Layout/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
├── manage.py
├── requirements.txt
└── README.md
```

## Installation and Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. **Clone the repository** (or navigate to the project directory)

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run database migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a superuser (admin)**:
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin user. Make sure to set the role as 'admin' when prompted, or you can do it later through the Django admin panel.

7. **Run the Django development server**:
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## Usage

### Creating an Admin User

1. Access Django admin panel at `http://localhost:8000/admin`
2. Login with your superuser credentials
3. Navigate to Users section
4. Edit a user and set the role to 'admin'

Alternatively, you can create an admin user through the Django shell:
```bash
python manage.py shell
```
```python
from accounts.models import User
user = User.objects.create_user(username='admin', email='admin@example.com', password='admin123', role='admin')
```

### Creating a Donor

1. Go to `http://localhost:3000/register`
2. Fill in the registration form
3. Select a blood group
4. Complete the registration

### Admin Dashboard

1. Login as an admin user
2. Access the admin dashboard
3. You can:
   - Manage blood banks
   - View all donors
   - Approve/Reject blood requests
   - Approve/Reject donations
   - Search donors by various criteria
   - View statistics and analytics

### Donor Dashboard

1. Login as a donor
2. Access the donor dashboard
3. You can:
   - Update your profile
   - Make blood requests
   - Request to donate blood
   - View your request and donation history
   - Check blood availability

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Get current user
- `GET /api/auth/donor-profile/` - Get donor profile
- `PATCH /api/auth/donor-profile/` - Update donor profile

### Blood Banks
- `GET /api/blood-banks/` - List all blood banks (Admin only)
- `POST /api/blood-banks/` - Create blood bank (Admin only)
- `GET /api/blood-banks/{id}/` - Get blood bank details
- `PUT /api/blood-banks/{id}/` - Update blood bank (Admin only)
- `DELETE /api/blood-banks/{id}/` - Delete blood bank (Admin only)

### Blood Inventory
- `GET /api/blood-inventory/` - List blood inventory
- `PATCH /api/blood-inventory/{id}/` - Update inventory (Admin only)

### Blood Requests
- `GET /api/blood-requests/` - List blood requests
- `POST /api/blood-requests/` - Create blood request
- `GET /api/blood-requests/{id}/` - Get request details
- `PATCH /api/blood-requests/{id}/approve-reject/` - Approve/Reject request (Admin only)

### Donations
- `GET /api/donations/` - List donations
- `POST /api/donations/` - Create donation request
- `GET /api/donations/{id}/` - Get donation details
- `PATCH /api/donations/{id}/approve-reject/` - Approve/Reject donation (Admin only)

### Search
- `GET /api/search-donors/` - Search donors (with query parameters: blood_group, city, is_available)

### Dashboards
- `GET /api/dashboard/admin/` - Admin dashboard statistics
- `GET /api/dashboard/donor/` - Donor dashboard data

## Database Models

### User
- Custom user model extending AbstractUser
- Fields: username, email, role (admin/donor), phone

### DonorProfile
- One-to-one relationship with User
- Fields: blood_group, date_of_birth, address, city, state, zip_code, is_available, last_donation_date, profile_photo

### BloodBank
- Fields: name, address, city, state, phone, email, is_active

### BloodInventory
- Foreign key to BloodBank
- Fields: blood_group, units_available

### BloodRequest
- Foreign key to User (requester)
- Fields: blood_group, units_required, reason, urgency, status, blood_bank, admin_notes

### Donation
- Foreign key to User (donor)
- Fields: blood_group, units_donated, donation_date, blood_bank, status, admin_notes

## Validation

### Backend Validation
- Password validation (minimum length, complexity)
- Blood group validation (must be valid blood group)
- Email validation
- Phone number validation
- Duplicate prevention (unique constraints)

### Frontend Validation
- Form field validation
- Password match validation
- Required field validation
- Email format validation
- Date validation

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

CSS Grid and Flexbox are used for responsive layouts.

## Deployment

### Backend Deployment

1. Set `DEBUG = False` in `settings.py`
2. Set proper `ALLOWED_HOSTS`
3. Set up a production database (PostgreSQL recommended)
4. Configure static files serving
5. Set up environment variables for sensitive data
6. Deploy to platforms like:
   - Railway
   - Render
   - PythonAnywhere
   - Heroku

### Frontend Deployment

1. Build the React app:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Or serve with Django static files

## Screenshots

(Add screenshots of your application here showing:
- Login page
- Registration page
- Admin dashboard
- Donor dashboard
- Blood request form
- Donation form
- Search functionality)

## Future Enhancements

- Email notifications for donors
- Blood request tracking with status updates
- Hospital role for direct blood requests
- Analytics with charts and graphs
- Multi-language support
- Profile photo upload
- Location-based search with maps
- SMS notifications
- Blood expiry tracking
- Donor eligibility checks

## Contributing

This is a final assignment project. Contributions and improvements are welcome!

## License

This project is created for educational purposes.

## Author

Created as a final assignment for Django, DRF, and React course.

## Support

For issues or questions, please contact the course instructor or refer to the course materials.

---

**Note**: Remember to change the `SECRET_KEY` in `settings.py` before deploying to production!

#   b l o o d - m a n a g e m e n t - s y s t e m  
 