from frontend.infraestructure.http.session_manager import SessionManager

import requests
import os

BACKEND_API_BASE = os.environ.get("TEST_BACKEND_API_URL", "http://127.0.0.1:8000")
# Crear una sesión global

authSession= SessionManager()
session = authSession.get_session()

def login(username: str, password: str):
    url = f"{BACKEND_API_BASE}/api/auth/login/"
    headers = {"Authorization": f"Bearer eXJ3bGciOiJIU2I1NiIsInR4cCI6Ik1XVCJ9.ey5h"}

    payload = {"username": username, "password": password}
    print(url)
    try:
        response = session.post(url, json=payload)
   
        response.raise_for_status()  # otros errores (500, 400, etc.)
        print("sesion de coockies")
        print(session.cookies)  # ah
        print(session.cookies.get_dict())  # ah
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Error en el servidor: {str(e)}"}
    
def get_profile(token: str):
    url = f"{BACKEND_API_BASE}/api/profile/"
    headers = {"Authorization": f"Bearer {token}"}
    response = session.get(url, headers=headers)
    # if response.status_code == 200:
    
    if response.status_code == 401:
        return {"error": "usuario no registrado"}  # 👈 manejar 40
    response.raise_for_status()
    
    return response.json()

def logout():
    url = f"{BACKEND_API_BASE}/api/auth/logout/"
    # headers = {"Authorization": f"Bearer eXJ3bGciOiJIU2I1NiIsInR4cCI6Ik1XVCJ9.ey5h"}

    # payload = {"username": username, "password": password}
    print(url)
    try:
        response = session.get(url)
        response.raise_for_status()  # otros errores (500, 400, etc.)
        print("sesion de coockies")
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Error en el service logout: {str(e)}"}