from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages



from django.middleware.csrf import get_token

from django.http import JsonResponse,HttpResponse

from django.contrib.auth import logout
from django.contrib.auth.models import User

# from django.shortcuts import render
# Create your views here.
from django.views.decorators.csrf import csrf_protect
# from app.content.admin import AdminContent

from frontend.use_case.user_login import user_login    # 👈 Importar la función
from frontend.use_case.user_logout import user_logout     # 👈 Importar la función
from frontend.use_case.get_business_id import GetBusinessId
from frontend.use_case.get_update_data import get_update_data

from frontend.use_case.stream.get_stream_orders import GetStreamOrders
from frontend.use_case.stream.get_stream_earn_month import GetStreamEarnMonth


import json


route_auth = "auth/"
route_account = "account/"
route_options = "options/"
route_business= "business/"

#test

def incrementar_contador(request):
    if request.method == "POST":
        contador = request.session.get("contador", 0) + 1
        request.session["contador"] = contador
        return JsonResponse({"contador": contador})
    return JsonResponse({"error": "Método no permitido"}, status=405)


#registro

def accountAuth(request):
    
    return render(request, f"{route_account}auth.html")



@csrf_protect
def accountLogin(request):
    if request.method == "POST":
        # form = UserCreationForm(request.POST)
        # print(form)
        username = request.POST.get("username")
        password = request.POST.get("password")

        result = user_login(username=username,password=password)
        print(result)
        if result.get('token'):
            return redirect("account-dashboard")
        # if result:
            
    return render(request,f"{route_auth}login.html")


#Desccartar el registro de esta manera // No es necesario aun.
#Por que solamente crea el usuario , No crea los datos en la bd
# def accountRegister(request):
#     if request.method == "POST":
#         form = UserCreationForm(request.POST)
#         print(form)
#         if form.is_valid():
#             user = form.save()
#             login(request,user)
#             get_token(request)            
#             messages.success(request,"Registro exitoso, Bienvenido")
#             AuthContent.reg_user_admin()
#             return redirect("account-dashboard")
#         else:
#             messages.error(request, "Porfavor, verifica los errores")
#             # return render(request,f"{route_auth}auth.html")
#     elif request.method != "GET":
#         return render("<div>No ventana no existinte</div>")
#     else:

#             form = UserCreationForm()
#             response = AuthContent.vef_auth_session(user=request.user)
        
#             print(response)
#             if response:
#                 return response
            
        
            
#     return render(request, f"{route_auth}register.html", {"form": form})
#     # return render(request,f"{route_account}auth.html")
    




# Visual


from django.contrib.auth.models import AnonymousUser



# @login_required
def accountDashboard(request):
    if request.method != "GET":
        return JsonResponse({"error": "metodo no permitido"},)
   
#    
    # if request.method == "POST":
        # form = UserCreationForm(request.POST)
        # print(form)
    
    response = get_update_data()
    print(response)
    # print(response.get("error"))
    print("hola")
        # if result:
    if response.get("status") == 401:
        return redirect("login")
    
    # if request.user Ano:
    #     print(request.user)
    #     return JsonResponse({"error": "usuario no logueado"})

    # print(request.user.profile.id_profile)
    # print(request.session.get('user'))
    # print(request.session.get)
    # if request.session.get('user') is None:
    #     response = AdminContent.get_user_id(id=request.user.profile.id_profile)
    #     request.session['user'] = response
        # data = json.loads(request.body)
    
    request.session["user"] = response.get("user")
    
    request.session["business"] = response.get("business")
    
    return render(request, f"{route_account}dashboard.html")


def accountBusiness(request):
    if request.method == "GET":
        # data = json.loads(request.body)
    
        return render(request, f"{route_account}business.html")


def options(request):
    if request.method == "GET":
        
        return render(request,f"{route_business}options.html")

def optionPassword_reset(request):
    return render(request,f"{route_options}password_reset.html")

def optionLogout(request):
    
    logout= user_logout() 
    if logout.get("tag") == "close":
        return redirect('login')  # Cambia 'login' por el nombre de tu URL para el login
        
    return redirect("login")






#Business
# def selectedBusiness(request):
#     list_business = request.session["user"]["business"]
    
#     for business in list_business:
#         request.session["business"] = business
#     redirect()


def accountBusinessDashboard(request):
    if request.method not in ["POST", "GET"]:
        return JsonResponse({
            "error": "Método no permitido",
        }, status=405)
     
    if request.method =="POST":    
        business_id = request.POST.get("business_id")
        getBusinessId= GetBusinessId(business_id=business_id)
        response = getBusinessId.getResponse()

        getBusinessId.setSession(request=request)

        if response is None:
            return JsonResponse({"response":response})

        print(response)
        if response.get("status") == 404:    
            return redirect("account-business")
        return render(request, f"{route_business}dashboard.html")
    
    if request.method == "GET":
        return render(request, f"{route_business}dashboard.html")
    
    # return JsonResponse({"ERROR":"metodo invalido" + request.method})
    
    
    
    

def accountBusinessPreorders(request):
    # request.session.business
    
    
    return render(request,f"{route_business}pre_orders.html")




def streamEventMonthEarn(request, business_id):   # 👈 Django te pasa el id aquí
    if request.method != "GET":  # ⚠️ SSE (Server Sent Events) trabajan con GET, no con POST
        return JsonResponse({
            "error": "Método no permitido"
        }, status=405)

    getStreamEarnMonth = GetStreamEarnMonth(business_id=business_id)
    response = getStreamEarnMonth.getResponse()
    
    print("infer")
    
    print(response)
 

    return response

def streamEventOrders(request,business_id):
    if request.method != "GET":
        return JsonResponse({
            "error": "metodo no permitido",
        })

    getStreamOrders = GetStreamOrders(business_id=business_id)
    response = getStreamOrders.getResponse()
    
    print("sofar")
    
    print(response)
    
    return response
