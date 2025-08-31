# core/context_processors.py
def user_session(request):
    return {
        "user": request.session.get("user", {}),
        "business": request.session.get("business", []),
        "unique_business": request.session.get("unique_business",{})
    }