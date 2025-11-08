from django.urls import path
from .views import (
    BloodBankListCreateView, BloodBankDetailView,
    BloodInventoryListView, BloodInventoryUpdateView,
    BloodRequestListCreateView, BloodRequestDetailView, approve_reject_blood_request,
    DonationListCreateView, DonationDetailView, approve_reject_donation,
    search_donors, admin_dashboard, donor_dashboard,
)

urlpatterns = [
    # Blood Banks
    path('blood-banks/', BloodBankListCreateView.as_view(), name='blood_bank_list_create'),
    path('blood-banks/<int:pk>/', BloodBankDetailView.as_view(), name='blood_bank_detail'),
    
    # Blood Inventory
    path('blood-inventory/', BloodInventoryListView.as_view(), name='blood_inventory_list'),
    path('blood-inventory/<int:pk>/', BloodInventoryUpdateView.as_view(), name='blood_inventory_update'),
    
    # Blood Requests
    path('blood-requests/', BloodRequestListCreateView.as_view(), name='blood_request_list_create'),
    path('blood-requests/<int:pk>/', BloodRequestDetailView.as_view(), name='blood_request_detail'),
    path('blood-requests/<int:pk>/approve-reject/', approve_reject_blood_request, name='approve_reject_blood_request'),
    
    # Donations
    path('donations/', DonationListCreateView.as_view(), name='donation_list_create'),
    path('donations/<int:pk>/', DonationDetailView.as_view(), name='donation_detail'),
    path('donations/<int:pk>/approve-reject/', approve_reject_donation, name='approve_reject_donation'),
    
    # Search
    path('search-donors/', search_donors, name='search_donors'),
    
    # Dashboards
    path('dashboard/admin/', admin_dashboard, name='admin_dashboard'),
    path('dashboard/donor/', donor_dashboard, name='donor_dashboard'),
]

