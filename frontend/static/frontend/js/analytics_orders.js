import { dominioUrl } from "./config.js";

console.log("ejecutando script.....")


const businessContextElement = document.getElementById("business-context");
const unique_business = JSON.parse(businessContextElement.textContent);
let eventSourceStatusCount = null;
// ✅ Creo la variable como lo quieres
  // const unique_business = businessData.id;
// const ContainerBodyListPeding = document.getElementById("body-peding-orders");

// Insertamos título y UL
// ContainerBodyListPeding.innerHTML = `
//   <h1 class="text-3xl font-bold relative inline-block mb-4">Hoy</h1>
//   <ul id="today-pending-orders-list" class="space-y-4"></ul>
// `;
  function initStream() {
     

    
    // SSE: escuchar cambios
    const eventOrderStream = new EventSource(`${dominioUrl}/api/orders/stream/${ unique_business.id }/`)
    
    
    eventOrderStream.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log("script -  metricas funcionando ")
      console.log(data)
    
    
    
    
    
    
    
      // Actualizar contadores si existen
      const ordersTotalCountElem = document.getElementById("orders-total-count");
      const ordersTodayCountElem = document.getElementById("orders-today-count");
      const ordersPendingCountElem = document.getElementById("orders-pending-count");
      const ordersCancelledCountElem = document.getElementById("orders-cancelled-count");
      const ordersCompletedCountElem = document.getElementById("orders-completed-count");
      const earnTodayElem = document.getElementById("earn-today");
    
    
      if (ordersTotalCountElem) ordersTotalCountElem.textContent = data.status_summary.total;
      if (ordersTodayCountElem) ordersTodayCountElem.textContent = data.status_summary.today;
      if (ordersPendingCountElem) ordersPendingCountElem.textContent = data.status_summary.pending;
      if (ordersCancelledCountElem) ordersCancelledCountElem.textContent = data.status_summary.cancelled;
      if (ordersCompletedCountElem) ordersCompletedCountElem.textContent = data.status_summary.completed;
      if (earnTodayElem) earnTodayElem.textContent = data.earn_today;
    
    };
    
    // Manejo de errores SSE
    eventOrderStream.onerror = function(event) {
      if (eventOrderStream.readyState === EventSource.CLOSED) {
        console.error("Conexión SSE cerrada por el servidor.");
      } else {
        console.error("Error de conexión SSE:", event);
      }
    };
    }



    // Inicia el stream solo en esta página
    initStream();

    // ✅ Cuando cambias de página o cierras la pestaña
    window.addEventListener("beforeunload", function() {
        if (eventOrderStream) {
            eventOrderStream.close();
            console.log("🔌 Stream cerrado");
        }
    });











      const csrfToken = "{{ csrf_token }}";
    const nextUrl  = "{{ request.get_full_path }}"
    



    const infoPending ={}
  const ContainerBodyListPedingSafe = document.getElementById("body-safe-peding-orders");


  function initSafePendingStream() {
      






    
    
    // SSE
    eventSafePedingSource = new EventSource(`${dominioUrl}/api/orders/stream_pending_safe/${unique_business.id}/`);
 
    eventSafePedingSource.onopen = function () {
      console.log("Conexión establecida con : order-pending-safe");
    };
    
    
    // Siempre insertamos el título + la UL vacía de inicio
    ContainerBodyListPedingSafe.innerHTML = `
      <h1 class="text-3xl font-bold relative inline-block mb-4">
        Pendientes
      </h1>
      <ul id="safe-pending-orders-list" class="space-y-4"></ul>
    `;
    
    const ContainerListPendingSafe = document.getElementById("safe-pending-orders-list");
    
    eventSafePedingSource.onmessage = function (event) {
      ContainerListPendingSafe.innerHTML = "";
    
      const data = JSON.parse(event.data);
      console.log("DATA:", data);
    
      // Vaciamos la lista siempre
      ContainerListPendingSafe.innerHTML = "";
    
      // Si no hay data, dejamos solo el título y salimos
      if (!data || data.length === 0) {
        return;
      }
    
      // Si hay data, generamos las tarjetas
      data.forEach(order => {
        const card = document.createElement("div");
        card.className = "bg-white shadow rounded-lg p-4 border";
        card.innerHTML = `
          <h3 class="font-bold text-lg">Pre-order #${order.id}</h3>
          <div class="mt-2">
            <p><span class="font-semibold">Cliente:</span></p>
            <div class="ml-4 mt-1">
              <p>- ${order.data.first_name}</p>
              <p>- ${order.data.email}</p>
              <p>- ${order.data.phone}</p>
            </div>
            
            <p class="mt-2"><span class="font-semibold">Carrito:</span></p>
            <div class="ml-4 mt-1">
              ${order.carts.items.map(item => `
                <p>- ${item.name} (x${item.quantity}) - S/.${item.price}</p>

                ${item.description && item.description.trim() !== "" 
                        ? `<h1>- ${description}</h1>` 
                        : `<h1>"no existe"</h1>` }
              `).join("")}
            </div>
    
            <p class="mt-2"><span class="font-semibold">Estado:</span> ${order.status}</p>
            <p><span class="font-semibold">Total:</span> S/.${order.total_amount}</p>
            <p><span class="font-semibold">Creado:</span> ${new Date(order.date).toLocaleString()}</p>
          
    
    
    
                  <div class="mt-4 flex gap-2">
                      <button id="validatedBtn" 
                        class="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg" 
                        data-order='${JSON.stringify(order)}'> Validar Orden </button>
        
                        <button id="cancelledBtn"
                          type="button" 
                          id="cancelledBtn"
                          data-order='${JSON.stringify(order)}'> Orden pagada </button>

                          class="cancel-btn w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg">
                          Cancelar Orden
                        </button>
    
                   
                        </div>
                        </div>
                        `;
                        ContainerListPendingSafe.appendChild(card);
                      });
                    };
    }




    // const ContainerListPendingSafe = document.getElementById("safe-pending-orders-list");










    // ✅ Cuando cambias de página o cierras la pestaña
    window.addEventListener("beforeunload", function() {
        if (eventSafePedingSource) {
            eventSafePedingSource.close();
            console.log("🔌 Stream cerrado");
        }
    });



  
    let EventSourceTodayOrders = null;



  function initEventSourceTodayOrdersStream() {
        







    
    
    
      
      // Función para generar HTML de tarjeta
      function generateCardHTML(order) {
        return `
        <h3 class="font-bold text-lg">Pre-order #${order.id}</h3>
        <div class="mt-2">
          <p><span class="font-semibold">Cliente:</span>
            <div class="ml-4 mt-1">
              <p>- ${order.data.first_name}</p>
              <p>- ${order.data.email}</p>
              <p>- ${order.data.phone}</p>
              </div>
          </p>
          <p><span class="font-semibold">Carrito:</span>
            <div class="ml-4 mt-1">
              ${order.carts.items.map(item => `
              <p>- ${item.name} (x${item.quantity}) -  S/.${item.price}</p>

            ${item.description && item.description.trim() !== "" 
              ? `<p class="ml-6 text-sm text-gray-500">↳ ${item.description}</p>` 
              : ""}
              `).join("")}
            </div>
            
            <div>
            <p><span class="font-semibold">Estado:</span> ${order.status}</p>
            <p><span class="font-semibold">Total:</span> S/.${order.total_amount}</p>
            <p><span class="font-semibold">Creado:</span> ${new Date(order.date).toLocaleString()}</p>
            
            </div>
            <div class="mt-4 flex gap-2">
              <button id="validatedBtn" 
              class="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg" 
              data-order='${JSON.stringify(order)}'> Validar Orden </button>
          
              <button id="cancelledBtn" 
              class = "cancel-btn w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
              data-order='${JSON.stringify(order)}'> Cancelar Orden
              </button>
              
              

            </div>  

            </div>  
                      `;  
                    }  
                    
                    
                    // const ordersCompletedCountElem = document.getElementById("orders-completed-count");
                    
 
        const ContainerTodayOrder = document.getElementById("today-pending-orders-list");
        // SSE: escuchar cambios
         EventSourceTodayOrders = new EventSource(`${dominioUrl}/api/orders/stream_pending_today/${unique_business.id}/`);
        EventSourceTodayOrders.onmessage = function(event) {
        const data = JSON.parse(event.data);
        ContainerTodayOrder.innerHTML = "";
        
        console.log("orden-pedgin-today")
        console.log("ejecutando")
        console.log(data)
        console.log(data.today_orders)
    
        data.today_orders.forEach(order => {
        console.log(order)  
    
        const card = document.createElement("div");
        card.dataset.orderId = order.id; // para identificar la tarjeta
        card.innerHTML = generateCardHTML(order);
        ContainerTodayOrder.appendChild(card);
        });
    
    };  

    }




    initEventSourceTodayOrdersStream()

    // Inicia el stream solo en esta página

    // ✅ Cuando cambias de página o cierras la pestaña
    window.addEventListener("beforeunload", function() {
        if (EventSourceTodayOrders) {
            EventSourceTodayOrders.close();
            console.log("🔌 Stream cerrado");
        }
    });









































































  function sendValidatedOrder(order, nextUrl) {
    // const ContainerTodayOrder = document.getElementById("today-pending-orders-list");

    // const ContainerListPendingSafe = document.getElementById("safe-pending-orders-list");
        const validatedPaymentURL =  `${dominioUrl}/api/validated/`;

    // delegación de eventos
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  
      const payload = {
          next: nextUrl,
          order: order
      };
  
      // Usamos FormData en vez de JSON
      const formData = new FormData();
      formData.append("order", JSON.stringify(order));
      formData.append("next", nextUrl);
  
      fetch(validatedPaymentURL, {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken  // 👈 importante, no poner Content-Type aquí
        },
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log("✅ Respuesta del servidor:", data);
        })
        .catch(error => {
          console.error("❌ Error en fetch:", error);
        });
  }
  // función reutilizable
  document.addEventListener("click", function (event) {
    if (event.target && event.target.id === "validatedBtn"){

      const order = JSON.parse(event.target.dataset.order);
      console.log(event.target.dataset)

      sendValidatedOrder(order,nextUrl);
    }
  })

  // document.addEventListener("click", function (event) {
  //     if (event.target && event.target.id === "validatedBtn") {
  //       // Recuperar la orden del atributo data-order
  //       const order = JSON.parse(event.target.dataset.order);
  //       console.log(event.target.dataset)  
  //       // Llamar a la función con la orden específica
  //       sendValidatedOrder(order, nextUrl);
  //     }

  //   });
  function sendCancelledOrder(order, nextUrl, reason) {
    
    const CancelledPaymentURL = `${dominioUrl}/api/cancelled/`;
    

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const formData = new FormData();
    formData.append("order", JSON.stringify(order));
    formData.append("reason", reason);
    formData.append("next", nextUrl);

    fetch(CancelledPaymentURL, {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log("✅ Respuesta del servidor:", data);
      })
      .catch(error => {
        console.error("❌ Error en fetch:", error);
      });
  }

  // función reutilizable
  function handleCancelClick(event) {
    if (event.target && event.target.id === "cancelledBtn") {
      const order = JSON.parse(event.target.dataset.order);

      // Mostrar prompt para ingresar razón
      const reason = prompt("Ingrese la razón de cancelación:");

      console.log(reason)

      if (reason && reason.trim() !== "") {
        sendCancelledOrder(order, nextUrl, reason.trim());
      } else {
        alert("Debe ingresar una razón para cancelar la orden.");
      }
    }
  }

  document.addEventListener("click", handleCancelClick);
  // document.addEventListener("click", handleCancelClick);
