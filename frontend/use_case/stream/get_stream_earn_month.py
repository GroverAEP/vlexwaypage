from frontend.services import stream_service

class GetStreamEarnMonth:
    
    def __init__(self, business_id):
        self.business_id = business_id
        self.response = stream_service.get_stream_earn_month(business_id=business_id)
        # print("👉 init ejecutado")
        
    def getResponse(self):
        return self.response
    
    def setSession(self,request):
        request.session["unique_business"] = self.response.get("response")