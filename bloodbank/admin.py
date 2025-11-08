from django.contrib import admin
from .models import BloodBank, BloodInventory, BloodRequest, Donation


@admin.register(BloodBank)
class BloodBankAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'state', 'phone', 'is_active', 'created_at')
    list_filter = ('is_active', 'city', 'state')
    search_fields = ('name', 'city', 'phone', 'email')


@admin.register(BloodInventory)
class BloodInventoryAdmin(admin.ModelAdmin):
    list_display = ('blood_bank', 'blood_group', 'units_available', 'last_updated')
    list_filter = ('blood_group', 'blood_bank')
    search_fields = ('blood_bank__name', 'blood_group')


@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('requester', 'blood_group', 'units_required', 'urgency', 'status', 'created_at')
    list_filter = ('status', 'urgency', 'blood_group', 'created_at')
    search_fields = ('requester__username', 'blood_group', 'reason')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('donor', 'blood_group', 'units_donated', 'status', 'donation_date', 'created_at')
    list_filter = ('status', 'blood_group', 'donation_date')
    search_fields = ('donor__username', 'blood_group')
    readonly_fields = ('created_at', 'updated_at')

