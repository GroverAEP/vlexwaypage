from frontend.services import client_service

def get_update_data():    
    response = client_service.get_update_data()
    return response