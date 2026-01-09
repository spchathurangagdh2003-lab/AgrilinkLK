const api = "http://localhost:5000/api/products";
const farmerId = 1; 
async function addProduct() {
    const data = {
        FarmerID: farmerId,
        ProductName: pname.value,
        Category: category.value,
        Price: price.value,
        Quantity: qty.value,
        Unit: unit.value,
        Description: desc.value
    };

    try {
        const res = await fetch(api + "/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Failed to add product");

        alert("Product Added");

        // Clear fields
        pname.value = "";
        category.value = "";
        price.value = "";
        qty.value = "";
        unit.value = "";
        desc.value = "";

        loadProducts();
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}


async function loadProducts() {
    try {
        const res = await fetch(api);
        const products = await res.json();

        productList.innerHTML = products
            .filter(p => p.FarmerID === farmerId)
            .map(p => `
                <div style="border:1px solid #000000ff; padding:10px; margin-bottom:10px;background-color: #97a0c3ff; border-radius:5px;">
                    <strong style ="font-size:17px; text-transform: uppercase;">${p.name}</strong><br><br>
                    <strong>Category:</strong> ${p.category}<br>
                    <strong>Price:</strong> Rs.${p.price}<br>
                    <strong>Quantity:</strong> ${p.quantity} ${p.unit}<br><br>
                    ${p.description}<br><br>

                    <button onclick="location.href='edit-product.html?id=${p._id}'"  style="background-color: #334db6ff; width:90px; border-radius:5px;">Edit</button>
                    <button onclick="deleteProduct('${p._id}')" style="background-color: #b63333ff; width:90px; border-radius:5px;">Delete</button>
                </div>
            `)
            .join("");
    } catch (err) {
        console.error(err);
        productList.innerHTML = "<p>Failed to load products</p>";
    }
}


async function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        const res = await fetch(`${api}/${productId}`, { method: "DELETE" });

        if (!res.ok) throw new Error("Failed to delete product");

        alert("Product deleted successfully");
        loadProducts();
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}


loadProducts();

