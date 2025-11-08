from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def api_root(request):
    """
    API Root endpoint that provides information about available endpoints
    """
    api_info = {
        "message": "Blood Management System API",
        "version": "1.0",
        "endpoints": {
            "admin": "/admin/",
            "authentication": {
                "register": "/api/auth/register/",
                "login": "/api/auth/login/",
                "logout": "/api/auth/logout/",
                "current_user": "/api/auth/me/",
                "donor_profile": "/api/auth/donor-profile/",
                "token_refresh": "/api/auth/token/refresh/",
            },
            "blood_banks": {
                "list_create": "/api/blood-banks/",
                "detail": "/api/blood-banks/{id}/",
            },
            "blood_inventory": {
                "list": "/api/blood-inventory/",
                "update": "/api/blood-inventory/{id}/",
            },
            "blood_requests": {
                "list_create": "/api/blood-requests/",
                "detail": "/api/blood-requests/{id}/",
                "approve_reject": "/api/blood-requests/{id}/approve-reject/",
            },
            "donations": {
                "list_create": "/api/donations/",
                "detail": "/api/donations/{id}/",
                "approve_reject": "/api/donations/{id}/approve-reject/",
            },
            "search": {
                "donors": "/api/search-donors/",
            },
            "dashboards": {
                "admin": "/api/dashboard/admin/",
                "donor": "/api/dashboard/donor/",
            }
        },
        "frontend": "http://localhost:3000",
        "documentation": "API requires authentication. Use JWT tokens for authenticated requests."
    }
    return JsonResponse(api_info, json_dumps_params={'indent': 2})

