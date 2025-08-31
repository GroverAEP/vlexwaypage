from frontend.infraestructure.http.session_manager import SessionManager

import requests
import os

BACKEND_API_BASE = os.environ.get("TEST_BACKEND_API_URL", "http://127.0.0.1:8000")
# session = requests.Session()
authSession= SessionManager()
session = authSession.get_session()
def get_update_data():
    try:
        # response = requests.get()
        response = session.get(f"{BACKEND_API_BASE}/api/dashboard/validate/")  # misma sesión, cookies y headers guardados
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e :
        print("Error al ejecutar get_updat_data")
        return {
            "status": e.response.status_code,
            "error":f"Error al ejecutar get_update_data {e}"}


def get_orders():
    try:
        response = requests.get(f"{BACKEND_API_BASE}/api/orders/")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print("Error al obtener órdenes:", e)
        return None

def create_order(data):
    try:
        response = requests.post(f"{BACKEND_API_BASE}/api/orders/", json=data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print("Error al crear orden:", e)
        return None