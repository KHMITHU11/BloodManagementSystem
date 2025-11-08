"""
Script to create an admin user for the Blood Management System
Run this script after setting up the database:
python setup_admin.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blood_management.settings')
django.setup()

from accounts.models import User

def create_admin():
    print("Creating admin user...")
    username = input("Enter username: ")
    email = input("Enter email: ")
    password = input("Enter password: ")
    
    if User.objects.filter(username=username).exists():
        print(f"User '{username}' already exists!")
        return
    
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        role='admin'
    )
    
    print(f"Admin user '{username}' created successfully!")

if __name__ == '__main__':
    create_admin()

