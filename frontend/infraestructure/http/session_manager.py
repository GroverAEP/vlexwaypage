import requests

class SessionManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        # Singleton: siempre devuelve la misma instancia
        if not cls._instance:
            cls._instance = super(SessionManager, cls).__new__(cls)
            cls._instance.session = requests.Session()  # Sesión única
        return cls._instance

    # Método para acceder a la sesión directamente
    def get_session(self):
        return self.session

    # Método para acceder a cookies si lo necesitas
    def get_cookies(self):
        return {c.name: c.value for c in self.session.cookies}