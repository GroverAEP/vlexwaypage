from frontend.services import business_service
class GetBusinessId:
    
    def __init__(self, business_id):
        self.business_id = business_id
        self.response = business_service.get_business_id(business_id=business_id)
        # print("👉 init ejecutado")
        
    def getResponse(self):
        return self.response.get("response")
    
    def setSession(self,request):
        request.session["unique_business"] = self.response.get("response")