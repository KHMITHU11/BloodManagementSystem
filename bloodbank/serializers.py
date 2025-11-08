from rest_framework import serializers
from .models import BloodBank, BloodInventory, BloodRequest, Donation
from accounts.serializers import UserSerializer


class BloodBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodBank
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class BloodInventorySerializer(serializers.ModelSerializer):
    blood_bank_name = serializers.CharField(source='blood_bank.name', read_only=True)
    
    class Meta:
        model = BloodInventory
        fields = '__all__'
        read_only_fields = ('last_updated',)


class BloodRequestSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.username', read_only=True)
    requester_email = serializers.EmailField(source='requester.email', read_only=True)
    blood_bank_name = serializers.CharField(source='blood_bank.name', read_only=True, allow_null=True)
    
    class Meta:
        model = BloodRequest
        fields = '__all__'
        read_only_fields = ('requester', 'created_at', 'updated_at')


class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.username', read_only=True)
    donor_email = serializers.EmailField(source='donor.email', read_only=True)
    blood_bank_name = serializers.CharField(source='blood_bank.name', read_only=True, allow_null=True)
    blood_group = serializers.CharField(required=False)  # Set from donor profile in view
    
    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ('donor', 'created_at', 'updated_at')


class DashboardStatsSerializer(serializers.Serializer):
    total_donors = serializers.IntegerField()
    total_blood_requests = serializers.IntegerField()
    pending_requests = serializers.IntegerField()
    total_donations = serializers.IntegerField()
    blood_availability = serializers.DictField()
    recent_requests = BloodRequestSerializer(many=True)
    recent_donations = DonationSerializer(many=True)

