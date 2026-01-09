const API_BASE = "http://localhost:5000/api/orders";

/**
 * PLACE ORDER (Called from products.js)
 */
async function placeOrder(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);

    if (!quantity || quantity <= 0) {
        alert("Invalid quantity");
        return;
    }

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ productId, quantity })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Order failed");
            return;
        }

        alert("Order placed successfully");
        qtyInput.value = 1;

    } catch (error) {
        alert("Server error while placing order");
    }
}

/**
 * LOAD BUYER ORDERS
 * Used in order-history.html
 */
async function loadMyOrders() {
    try {
        const res = await fetch(`${API_BASE}/my`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        const orders = await res.json();
        displayOrders(orders);

    } catch (error) {
        document.getElementById("orders").innerHTML =
            "<p>Failed to load orders</p>";
    }
}

/**
 * DISPLAY ORDERS
 */
function displayOrders(orders) {
    const ordersDiv = document.getElementById("orders");

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

            ${
                order.status !== "Cancelled"
                ? `<button onclick="cancelOrder('${order._id}')">Cancel</button>`
                : ""
            }
        </div>
    `).join("");
}

/**
 * CANCEL ORDER (Buyer only)
 */
async function cancelOrder(orderId) {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
        const res = await fetch(`${API_BASE}/${orderId}/cancel`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Cancel failed");
            return;
        }

        alert("Order cancelled");
        loadMyOrders();

    } catch (error) {
        alert("Server error while cancelling order");
    }
}
