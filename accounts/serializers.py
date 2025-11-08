from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, DonorProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone')
        read_only_fields = ('id', 'role')


class DonorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DonorProfile
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    blood_group = serializers.CharField(write_only=True, required=False)
    date_of_birth = serializers.DateField(write_only=True, required=False)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True)
    city = serializers.CharField(write_only=True, required=False, allow_blank=True)
    state = serializers.CharField(write_only=True, required=False, allow_blank=True)
    zip_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 
                  'phone', 'blood_group', 'date_of_birth', 'address', 'city', 'state', 'zip_code')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        blood_group = validated_data.pop('blood_group', None)
        date_of_birth = validated_data.pop('date_of_birth', None)
        address = validated_data.pop('address', '')
        city = validated_data.pop('city', '')
        state = validated_data.pop('state', '')
        zip_code = validated_data.pop('zip_code', '')
        
        password = validated_data.pop('password')
        user = User.objects.create_user(
            role='donor',
            password=password,
            **validated_data
        )
        
        if blood_group:
            DonorProfile.objects.create(
                user=user,
                blood_group=blood_group,
                date_of_birth=date_of_birth,
                address=address,
                city=city,
                state=state,
                zip_code=zip_code
            )
        
        return user


class DonorProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorProfile
        fields = ('blood_group', 'date_of_birth', 'address', 'city', 'state', 
                  'zip_code', 'is_available', 'profile_photo')
        read_only_fields = ('user', 'created_at', 'updated_at')

