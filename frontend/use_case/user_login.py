from frontend.services import auth_service
import requests

def user_login(username: str, password: str):

    auth_data = auth_service.login(username, password)
    token = auth_data.get("token")
    # profile = auth_service.get_profile(token)

    # localStorage.setItem
    
    return {
        "token": token,
        "auth": auth_data,
        # "user": profile
    }