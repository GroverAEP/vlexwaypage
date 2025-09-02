console.log("Escript ejecutándose");
import { dominioUrl } from "./config.js";

const businessContextElement = document.getElementById("business-context");
const unique_business = JSON.parse(businessContextElement.textContent);
const ctAx = document.getElementById("earnMonthChart").getContext("2d");  // ✅ define el canvas

const list_week = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

/* =========================
   1. 📊 STREAM DE GANANCIAS
   ========================= */
(() => {
    let eventEarnMonth = null;

    function initialEventEarnMonth() {
        eventEarnMonth = new EventSource(
            `${dominioUrl}/api/orders/metrics/stream_earn_month/${unique_business.id}/`
        );

        eventEarnMonth.onmessage = function(event) {
            const data = JSON.parse(event.data);
            const earn_month = Object.values(data);

            console.log("📊 Datos recibidos:", data);

            new Chart(ctAx, {
                type: 'bar',
                data: {
                    labels: list_week,
                    datasets: [{
                        label: 'Ganancia (USD)',
                        data: earn_month,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        };
    }

    initialEventEarnMonth();

    // 🔌 Cerrar stream al salir
    window.addEventListener("beforeunload", function() {
        if (eventEarnMonth) {
            eventEarnMonth.close();
            console.log("🔌 Stream cerrado");
        }
    });
})();

/* =========================
   2. 📂 SIDEBAR / MENÚ
   ========================= */
(() => {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menuBtn');
    const closeSidebarItems = document.querySelectorAll('.close-sidebar');
    const closeMenuOnClick = document.getElementById('closeMenuOnClick');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    closeSidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                sidebar.classList.add('-translate-x-full');
            }
        });
    });

    if (closeMenuOnClick) {
        closeMenuOnClick.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                sidebar.classList.add('-translate-x-full');
            }
        });
    }
})();

/* =========================
   3. 🔄 STREAM DE ÓRDENES
   ========================= */
(() => {
    const eventOrderStream = new EventSource(
        `${dominioUrl}/api/orders/stream/${unique_business.id}/`
    );

    eventOrderStream.onmessage = function(event) {
        const data = JSON.parse(event.data);
        const ordersCountElem = document.getElementById("orders-count");
        const earnTodayElem = document.getElementById("earn-today");

        console.log("💰 Ganancia hoy:", data.earn_today);

        if (ordersCountElem && earnTodayElem) {
            earnTodayElem.textContent = data.earn_today;
            ordersCountElem.textContent = data.status_summary.total;
        }
    };

    eventOrderStream.onerror = function() {
        console.error("❌ Error en la conexión SSE de órdenes");
    };
})();