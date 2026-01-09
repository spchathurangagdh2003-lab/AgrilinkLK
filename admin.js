// Admin Dashboard JS

const token = localStorage.getItem("token");

if (!token) {
    alert("Session expired. Please login.");
    window.location.href = "login.html";
}

const btnFarmers = document.getElementById("btnFarmers");
const btnBuyers = document.getElementById("btnBuyers");
const btnOrders = document.getElementById("btnOrders");

const farmersDiv = document.getElementById("farmers");
const buyersDiv = document.getElementById("buyers");
const ordersDiv = document.getElementById("orders");

const FARMERS_API = "http://localhost:5000/api/admin/farmers";
const BUYERS_API = "http://localhost:5000/api/admin/buyers";
const ORDERS_API = "http://localhost:5000/api/admin/orders";

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

async function fetchFarmers() {
    try {
        const res = await fetch(FARMERS_API, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            logout();
            return;
        }

        const farmers = await res.json();
        displayUsers(farmersDiv, farmers);

    } catch (error) {
        console.error(error);
        farmersDiv.innerHTML = "<p>Failed to load farmers</p>";
    }
}

async function fetchBuyers() {
    try {
        const res = await fetch(BUYERS_API, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            logout();
            return;
        }

        const buyers = await res.json();
        displayUsers(buyersDiv, buyers);

    } catch (error) {
        console.error(error);
        buyersDiv.innerHTML = "<p>Failed to load buyers</p>";
    }
}

async function fetchOrders() {
    try {
        const res = await fetch(ORDERS_API, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            logout();
            return;
        }

        const orders = await res.json();
        displayOrders(orders);

    } catch (error) {
        console.error(error);
        ordersDiv.innerHTML = "<p>Failed to load orders</p>";
    }
}

function displayUsers(container, users) {
    if (!users || users.length === 0) {
        container.innerHTML = "<p>No users found.</p>";
        return;
    }

    container.innerHTML = users.map(u => `
        <div class="user-card" style="border:1px solid #000000ff; padding:30px; margin-bottom:10px;background-color: #a2a8c1ff; border-radius:5px;">
            <p><strong>Name:</strong> ${u.name}</p>
            <p><strong>Email:</strong> ${u.email}</p>
            <p><strong>Phone:</strong> ${u.phone}</p>
            <p><strong>District:</strong> ${u.district}</p>
            <p><strong>Role:</strong> ${u.role}</p>
            <p><strong>Verified:</strong> ${u.verified ? "Yes" : "No"}</p>
        </div>
    `).join("");
}

function displayOrders(orders) {
    if (!orders || orders.length === 0) {
        ordersDiv.innerHTML = "<p>No orders found</p>";
        return;
    }

    ordersDiv.innerHTML = orders.map(o => `
        <div class="order-card">
            <p><strong>Product:</strong> ${o.product?.name || "N/A"}</p>
            <p><strong>Category:</strong> ${o.product?.category || "N/A"}</p>
            <p><strong>Price:</strong> Rs.${o.product?.price || "N/A"}</p>
            <p><strong>Quantity:</strong> ${o.quantity}</p>
            <p><strong>Total Price:</strong> Rs.${o.totalPrice}</p>
            <p><strong>Buyer:</strong> ${o.buyer?.name || "N/A"}</p>
            <p><strong>Buyer Email:</strong> ${o.buyer?.email || "N/A"}</p>
            <p><strong>Buyer Phone:</strong> ${o.buyer?.phone || "N/A"}</p>
            <p><strong>Farmer:</strong> ${o.farmer?.name || "N/A"}</p>
        </div>
    `).join("");
}

btnFarmers.addEventListener("click", fetchFarmers);
btnBuyers.addEventListener("click", fetchBuyers);
btnOrders.addEventListener("click", fetchOrders);

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

