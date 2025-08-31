from frontend.infraestructure.http.session_manager import SessionManager

import requests
import os

BACKEND_API_BASE = os.environ.get("TEST_BACKEND_API_URL", "http://127.0.0.1:8000")
# session = requests.Session()
authSession= SessionManager()
session = authSession.get_session()
def get_stream_earn_month(business_id:str):
    try:
        # response = requests.get()
        response = session.get(f"{BACKEND_API_BASE}/api/orders/metrics/stream_earn_month/{str(business_id)}/")  # misma sesión, cookies y headers guardados
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e :
        print("Error al ejecutar stream_earn_month")
        return {
            "status": e.response.status_code,
            "error":f"Error al ejecutar get_update_data {e}"}
        
def get_stream_orders(business_id:str):
    try:
        # response = requests.get()
        response = session.get(f"{BACKEND_API_BASE}/api/orders/stream/{business_id}/")  # misma sesión, cookies y headers guardados
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e :
        print("Error al ejecutar stream_earn_month")
        return {
            "status": e.response.status_code,
            "error":f"Error al ejecutar get_update_data {e}"}
        

