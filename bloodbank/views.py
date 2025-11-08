from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import BloodBank, BloodInventory, BloodRequest, Donation
from .serializers import (
    BloodBankSerializer, BloodInventorySerializer, 
    BloodRequestSerializer, DonationSerializer, DashboardStatsSerializer
)
from accounts.models import DonorProfile


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsDonor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'donor'


# Blood Bank Views
class BloodBankListCreateView(generics.ListCreateAPIView):
    serializer_class = BloodBankSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        queryset = BloodBank.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(city__icontains=search) |
                Q(state__icontains=search)
            )
        return queryset


class BloodBankDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BloodBank.objects.all()
    serializer_class = BloodBankSerializer
    permission_classes = [IsAdmin]


# Blood Inventory Views
class BloodInventoryListView(generics.ListAPIView):
    serializer_class = BloodInventorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        blood_bank_id = self.request.query_params.get('blood_bank', None)
        blood_group = self.request.query_params.get('blood_group', None)
        
        queryset = BloodInventory.objects.all()
        
        if blood_bank_id:
            queryset = queryset.filter(blood_bank_id=blood_bank_id)
        
        if blood_group:
            queryset = queryset.filter(blood_group=blood_group)
        
        return queryset


class BloodInventoryUpdateView(generics.UpdateAPIView):
    queryset = BloodInventory.objects.all()
    serializer_class = BloodInventorySerializer
    permission_classes = [IsAdmin]


# Blood Request Views
class BloodRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = BloodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = BloodRequest.objects.all()
        
        # Donors can only see their own requests
        if user.role == 'donor':
            queryset = queryset.filter(requester=user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by blood group
        blood_group = self.request.query_params.get('blood_group', None)
        if blood_group:
            queryset = queryset.filter(blood_group=blood_group)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)


class BloodRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BloodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return BloodRequest.objects.all()
        return BloodRequest.objects.filter(requester=user)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
def approve_reject_blood_request(request, pk):
    try:
        blood_request = BloodRequest.objects.get(pk=pk)
        action = request.data.get('action')  # 'approve' or 'reject'
        admin_notes = request.data.get('admin_notes', '')
        blood_bank_id = request.data.get('blood_bank_id', None)
        
        if action == 'approve':
            blood_request.status = 'approved'
            if blood_bank_id:
                blood_request.blood_bank_id = blood_bank_id
                
                # Reduce blood inventory when request is approved
                try:
                    inventory = BloodInventory.objects.get(
                        blood_bank_id=blood_bank_id,
                        blood_group=blood_request.blood_group
                    )
                    if inventory.units_available >= blood_request.units_required:
                        inventory.units_available -= blood_request.units_required
                        inventory.save()
                    else:
                        return Response({
                            'error': f'Insufficient blood units. Available: {inventory.units_available}, Required: {blood_request.units_required}'
                        }, status=status.HTTP_400_BAD_REQUEST)
                except BloodInventory.DoesNotExist:
                    return Response({
                        'error': f'No inventory found for {blood_request.blood_group} in selected blood bank'
                    }, status=status.HTTP_400_BAD_REQUEST)
        elif action == 'reject':
            blood_request.status = 'rejected'
        else:
            return Response({'error': 'Invalid action. Use "approve" or "reject"'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if admin_notes:
            blood_request.admin_notes = admin_notes
        
        blood_request.save()
        serializer = BloodRequestSerializer(blood_request)
        return Response(serializer.data)
    
    except BloodRequest.DoesNotExist:
        return Response({'error': 'Blood request not found'}, status=status.HTTP_404_NOT_FOUND)


# Donation Views
class DonationListCreateView(generics.ListCreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Donation.objects.all()
        
        # Donors can only see their own donations
        if user.role == 'donor':
            queryset = queryset.filter(donor=user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by blood group
        blood_group = self.request.query_params.get('blood_group', None)
        if blood_group:
            queryset = queryset.filter(blood_group=blood_group)
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        user = request.user
        # Get blood group from donor profile
        if hasattr(user, 'donor_profile') and user.donor_profile.blood_group:
            blood_group = user.donor_profile.blood_group
        else:
            blood_group = request.data.get('blood_group')
            if not blood_group:
                return Response({
                    'blood_group': ['Blood group is required. Please update your profile with your blood group first.']
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Add blood_group to request data if not present
        data = request.data.copy()
        if 'blood_group' not in data:
            data['blood_group'] = blood_group
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(donor=user, blood_group=blood_group)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class DonationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Donation.objects.all()
        return Donation.objects.filter(donor=user)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
def approve_reject_donation(request, pk):
    try:
        donation = Donation.objects.get(pk=pk)
        action = request.data.get('action')  # 'approve' or 'reject'
        admin_notes = request.data.get('admin_notes', '')
        blood_bank_id = request.data.get('blood_bank_id', None)
        donation_date = request.data.get('donation_date', None)
        
        if action == 'approve':
            donation.status = 'approved'
            if blood_bank_id:
                donation.blood_bank_id = blood_bank_id
            if donation_date:
                donation.donation_date = donation_date
        elif action == 'reject':
            donation.status = 'rejected'
        else:
            return Response({'error': 'Invalid action. Use "approve" or "reject"'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if admin_notes:
            donation.admin_notes = admin_notes
        
        donation.save()
        
        # If approved and completed, update inventory and donor profile
        if action == 'approve' and donation_date:
            donation.status = 'completed'
            donation.save()
            
            # Update blood inventory
            if blood_bank_id:
                inventory, created = BloodInventory.objects.get_or_create(
                    blood_bank_id=blood_bank_id,
                    blood_group=donation.blood_group,
                    defaults={'units_available': 0}
                )
                inventory.units_available += donation.units_donated
                inventory.save()
            
            # Update donor's last donation date
            if hasattr(donation.donor, 'donor_profile'):
                donation.donor.donor_profile.last_donation_date = donation_date
                donation.donor.donor_profile.save()
        
        serializer = DonationSerializer(donation)
        return Response(serializer.data)
    
    except Donation.DoesNotExist:
        return Response({'error': 'Donation not found'}, status=status.HTTP_404_NOT_FOUND)


# Search Donors
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_donors(request):
    blood_group = request.query_params.get('blood_group', None)
    city = request.query_params.get('city', None)
    is_available = request.query_params.get('is_available', None)
    
    queryset = DonorProfile.objects.filter(user__role='donor', user__is_active=True)
    
    if blood_group:
        queryset = queryset.filter(blood_group=blood_group)
    
    if city:
        queryset = queryset.filter(city__icontains=city)
    
    if is_available is not None:
        is_available_bool = is_available.lower() == 'true'
        queryset = queryset.filter(is_available=is_available_bool)
    
    from accounts.serializers import DonorProfileSerializer
    serializer = DonorProfileSerializer(queryset, many=True)
    return Response(serializer.data)


# Dashboard Views
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_dashboard(request):
    # Total donors
    total_donors = DonorProfile.objects.count()
    
    # Total blood requests
    total_blood_requests = BloodRequest.objects.count()
    pending_requests = BloodRequest.objects.filter(status='pending').count()
    
    # Total donations
    total_donations = Donation.objects.count()
    
    # Blood availability by group
    blood_availability = {}
    for blood_group in ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']:
        total_units = BloodInventory.objects.filter(blood_group=blood_group).aggregate(
            total=Sum('units_available')
        )['total'] or 0
        blood_availability[blood_group] = total_units
    
    # Recent requests
    recent_requests = BloodRequest.objects.all().order_by('-created_at')[:5]
    
    # Recent donations
    recent_donations = Donation.objects.all().order_by('-created_at')[:5]
    
    data = {
        'total_donors': total_donors,
        'total_blood_requests': total_blood_requests,
        'pending_requests': pending_requests,
        'total_donations': total_donations,
        'blood_availability': blood_availability,
        'recent_requests': BloodRequestSerializer(recent_requests, many=True).data,
        'recent_donations': DonationSerializer(recent_donations, many=True).data,
    }
    
    return Response(data)


@api_view(['GET'])
@permission_classes([IsDonor])
def donor_dashboard(request):
    user = request.user
    
    # Get donor profile
    donor_profile = None
    if hasattr(user, 'donor_profile'):
        from accounts.serializers import DonorProfileSerializer
        donor_profile = DonorProfileSerializer(user.donor_profile).data
    
    # Blood availability by group
    blood_availability = {}
    for blood_group in ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']:
        total_units = BloodInventory.objects.filter(blood_group=blood_group).aggregate(
            total=Sum('units_available')
        )['total'] or 0
        blood_availability[blood_group] = total_units
    
    # Donor's requests
    my_requests = BloodRequest.objects.filter(requester=user).order_by('-created_at')
    
    # Donor's donations
    my_donations = Donation.objects.filter(donor=user).order_by('-created_at')
    
    data = {
        'donor_profile': donor_profile,
        'blood_availability': blood_availability,
        'my_requests': BloodRequestSerializer(my_requests, many=True).data,
        'my_donations': DonationSerializer(my_donations, many=True).data,
    }
    
    return Response(data)

