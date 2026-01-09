// Buyer Dashboard JS

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
}

if (role !== "buyer") {
    alert("Access denied. Only buyers can access this page.");
    window.location.href = "login.html";
}

const productsDiv = document.getElementById("products");
const categorySelect = document.getElementById("categoryFilter");
const filterBtn = document.getElementById("filterBtn");
const ordersDiv = document.getElementById("orders");

const API_PRODUCTS = "http://localhost:5000/api/products";
const API_ORDERS = "http://localhost:5000/api/orders";

async function fetchProducts() {
    try {
        let url = API_PRODUCTS;
        const category = categorySelect.value;
        if (category) url += `?category=${encodeURIComponent(category)}`;

        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const products = await res.json();
        displayProducts(products);

    } catch (error) {
        console.error(error);
        productsDiv.innerHTML = "<p>Failed to load products</p>";
    }
}

function displayProducts(products) {
    if (!products.length) {
        productsDiv.innerHTML = "<p>No products found</p>";
        return;
    }

    productsDiv.innerHTML = products.map(p => `
        <div class="product-card">
            <h4>${p.name}</h4>
            <p><strong>Category:</strong> ${p.category}</p>
            <p><strong>Price:</strong> Rs.${p.price}</p>
            <p><strong>Available:</strong> ${p.quantity} ${p.unit}</p>
            <p>${p.description || ""}</p>

            <input type="number" min="1" max="${p.quantity}" value="1" id="qty-${p._id}">
            <button onclick="placeOrder('${p._id}')">Order</button>
        </div>
    `).join("");
}

filterBtn.addEventListener("click", fetchProducts);

async function placeOrder(productId) {
    if (role !== "buyer") {
        alert("Only buyers can place orders.");
        return;
    }

    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);

    if (!quantity || quantity <= 0) {
        alert("Invalid quantity");
        return;
    }

    try {
        const res = await fetch(API_ORDERS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Order placed successfully");
            qtyInput.value = 1;
            loadOrders();
        } else {
            alert(data.message || "Order failed");
        }
    } catch (error) {
        console.error(error);
        alert("Server error while placing order");
    }
}


async function loadOrders() {
    try {
        const res = await fetch(`${API_ORDERS}/my`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to load orders");

        const orders = await res.json();
        displayOrders(orders);

    } catch (error) {
        console.error(error);
        ordersDiv.innerHTML = "<p>Failed to load orders</p>";
    }
}

function displayOrders(orders) {
    if (!orders || orders.length === 0) {
        ordersDiv.innerHTML = "<p>No orders found</p>";
        return;
    }

    ordersDiv.innerHTML = orders.map(order => `
        <div class="order-card">
            <p><strong>Product:</strong> ${order.product?.name}</p>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <p><strong>Total:</strong> Rs.${order.totalPrice}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Farmer:</strong> ${order.farmer?.name}</p>
            ${order.status !== "Cancelled"
                ? `<button onclick="cancelOrder('${order._id}')">Cancel</button>`
                : ""}
        </div>
    `).join("");
}

async function cancelOrder(orderId) {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
        const res = await fetch(`${API_ORDERS}/${orderId}/cancel`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
            alert("Order cancelled");
            loadOrders();
            fetchProducts();
        } else {
            const data = await res.json();
            alert(data.message || "Cancel failed");
        }
    } catch (error) {
        console.error(error);
        alert("Server error while cancelling order");
    }
}

// --- INITIAL LOAD ---
fetchProducts();
loadOrders();

