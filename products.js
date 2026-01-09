const productsDiv = document.getElementById("products");
const searchInput = document.getElementById("searchName");
const categorySelect = document.getElementById("categoryFilter");
const filterBtn = document.getElementById("filterBtn");

const token = localStorage.getItem("token");

// Fetch products from backend (Buyer route)
async function fetchProducts() {
    let url = "http://localhost:5000/api/buyer/products";

    const name = searchInput.value.trim();
    const category = categorySelect.value;

    const params = [];
    if (name) params.push(`name=${encodeURIComponent(name)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);

    if (params.length > 0) {
        url += "?" + params.join("&");
    }

    try {
        const res = await fetch(url);
        const products = await res.json();
        displayProducts(products);
    } catch (error) {
        productsDiv.innerHTML = "<p>Failed to load products</p>";
    }
}

// Display products with full details & order option
function displayProducts(products) {
    if (!products || products.length === 0) {
        productsDiv.innerHTML = "<p>No products found</p>";
        return;
    }

    productsDiv.innerHTML = products.map(product => `
        <div class="product-card" style="border:1px solid #000000ff; padding:30px; margin-bottom:10px;background-color: #97a0c3ff; border-radius:5px;">
            <h4 style="text-transform: uppercase;">${product.name}</h4>

            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> Rs. ${product.price}</p>
            <p><strong>Available:</strong> ${product.quantity} ${product.unit}</p>
            <p><strong>Farmer:</strong> ${product.farmer?.name || "N/A"}</p>
            <p><strong>District:</strong> ${product.farmer?.district || "N/A"}</p>
            <p>${product.description || ""}</p>

            <input
                type="number"
                min="1"
                max="${product.quantity}"
                value="1"
                id="qty-${product._id}"
                style="width:200px;"
            >

            <button onclick="placeOrder('${product._id}')" style="padding:10px 30px; border-radius:5px;">
                Order
            </button>
        </div>
    `).join("");
}

// Place order (called from Order button)
async function placeOrder(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = Number(qtyInput.value);

    if (!quantity || quantity <= 0) {
        alert("Invalid quantity");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/buyer/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Order failed");
            return;
        }

        alert("Order placed successfully");

        // Reload products & orders after successful order
        fetchProducts();
        if (typeof fetchOrders === "function") {
            fetchOrders();
        }

    } catch (error) {
        alert("Error placing order");
    }
}

// Filter button click
filterBtn.addEventListener("click", fetchProducts);

// Load products on page load
fetchProducts();
