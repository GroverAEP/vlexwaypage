from frontend.services import auth_service
import requests

def user_logout():

    auth_data = auth_service.logout()
    # token = auth_data.get("token")
    # profile = auth_service.get_profile(token)

    # localStorage.setItem
    
    return auth_data