const menuData = [
    { id: 1, name: "Shepherd's Salad", category: "appetizers", price: 95, image: "salata.jpg" },
    { id: 2, name: "Lentil Soup", category: "appetizers", price: 80, image: "mercimek.jpg" },
    { id: 3, name: "Grilled Meatballs", category: "mains", price: 130, image: "ızgara_köfte.jpg" },
    { id: 4, name: "Grilled Chicken", category: "mains", price: 100, image: "ızgara_tavuk.jpg" },
    { id: 5, name: "Baklava", category: "desserts", price: 120, image: "baklava.jpg" },
    { id: 6, name: "Kunefe", category: "desserts", price: 100, image: "künefe.jpg" },
    { id: 7, name: "Ayran", category: "drinks", price: 50, image: "ayran.jpg" },
    { id: 8, name: "Turnip Juice", category: "drinks", price: 55, image: "şalgam.jpg" }
];

let cart = [];

function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}

function renderMenu(filter = "all", search = "") {
    const container = document.getElementById("menuItems");
    container.innerHTML = "";
    const q = (search || "").trim().toLowerCase();
    const items = menuData.filter(i => {
        const matchCategory = filter === "all" ? true : i.category === filter;
        const matchSearch = q === "" ? true : i.name.toLowerCase().includes(q);
        return matchCategory && matchSearch;
    });
    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "menu-item";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="menu-img" onerror="this.onerror=null; this.src='https://source.unsplash.com/400x300/?food';">
            <div class="menu-info">
                <h3 class="menu-title">${item.name}</h3>
                <p class="menu-price">${formatCurrency(item.price)}</p>
                <button class="add-btn" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    if (!item) return;
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty++;
    else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCart();
}

function updateCart() {
    const list = document.getElementById("cartItems");
    const totalEl = document.getElementById("total");
    const countEl = document.getElementById("cartCount");
    list.innerHTML = "";
    let sum = 0;
    cart.forEach(c => {
        sum += c.price * c.qty;
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
            <span class="cart-name">${c.name}</span>
            <span class="cart-qty">x${c.qty}</span>
            <span class="cart-line">${formatCurrency(c.price * c.qty)}</span>
            <button class="remove-btn" onclick="removeFromCart(${c.id})" aria-label="Remove ${c.name}">Remove</button>
        `;
        list.appendChild(li);
    });
    totalEl.textContent = formatCurrency(sum);
    countEl.textContent = cart.reduce((acc, i) => acc + i.qty, 0);
}

window.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("menuSearch");
    const getActiveFilter = () => {
        const active = document.querySelector(".filter-btn.active");
        return active ? active.dataset.filter : "all";
    };

    // initial render
    renderMenu();

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.dataset.filter;
            const search = searchInput ? searchInput.value : "";
            renderMenu(filter, search);
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const filter = getActiveFilter();
            renderMenu(filter, searchInput.value);
        });

        // optional: allow Enter to focus first item (prevent accidental form submit)
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });
    }

    document.getElementById("checkoutBtn").addEventListener("click", () => {
        if (cart.length === 0) return alert("Your cart is empty.");
        alert("Order placed. Total: " + document.getElementById("total").textContent);
        cart = [];
        updateCart();
    });

    // footer year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
