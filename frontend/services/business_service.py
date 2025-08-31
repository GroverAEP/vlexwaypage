from frontend.infraestructure.http.session_manager import SessionManager

import requests
import os

BACKEND_API_BASE = os.environ.get("TEST_BACKEND_API_URL", "http://127.0.0.1:8000")
# Crear una sesión global

authSession= SessionManager()
session = authSession.get_session()

def get_business_id(business_id:str):
    url = f"{BACKEND_API_BASE}/api/get_info_client/"
    headers = {"Authorization": f"Bearer eXJ3bGciOiJIU2I1NiIsInR4cCI6Ik1XVCJ9.ey5h"}
    print(business_id)
    payload = {"idBusiness": business_id}
    print(url)
    try:
        response = session.post(url, json=payload)
   
        response.raise_for_status()  # otros errores (500, 400, etc.)
        print("sesion de coockies")
        print(session.cookies)  # ah
        print(session.cookies.get_dict())  # ah
        print(response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Error en el servidor: {str(e)}"}