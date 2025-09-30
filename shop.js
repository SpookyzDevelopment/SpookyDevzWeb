const formatCurrency = (value, currency = "USD") => {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: value % 1 === 0 ? 0 : 2
        }).format(value);
    } catch {
        return `$${value.toFixed(2)}`;
    }
};

const renderProducts = (products, container) => {
    if (!products.length) {
        container.innerHTML = "<p class=\"empty-state\">Store items are coming soon. Check back after our next update!</p>";
        return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        const price = typeof product.amount === "number" ? formatCurrency(product.amount, product.currency || "USD") : "";

        card.innerHTML = `
            <div class="product-card__header">
                <h3>${product.name ?? "Unnamed product"}</h3>
                ${price ? `<span class="product-card__price">${price}</span>` : ""}
            </div>
            <p class="product-card__description">${product.description ?? "Support Spooky Devz and unlock exclusive perks."}</p>
            ${Array.isArray(product.benefits) ? `<ul class="product-card__benefits">${product.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}</ul>` : ""}
            ${Array.isArray(product.commands) ? `<details class="product-card__details"><summary>In-game delivery</summary><ul>${product.commands.map((command) => `<li><code>${command}</code></li>`).join("")}</ul></details>` : ""}
            <div class="product-card__actions">
                <button type="button" class="btn btn-primary" data-product-id="${product.id ?? ""}">${product.ctaLabel ?? "Buy now"}</button>
                ${product.secondaryCta ? `<button type="button" class="btn btn-secondary">${product.secondaryCta}</button>` : ""}
            </div>
        `;

        fragment.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(fragment);
};

const initializeStorefront = () => {
    const container = document.querySelector("[data-products]");
    if (!container) return;

    fetch("products.json", { cache: "no-store" })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load products: ${response.status}`);
            }
            return response.json();
        })
        .then((products) => {
            if (!Array.isArray(products)) {
                throw new Error("Invalid product data");
            }
            renderProducts(products, container);
        })
        .catch((error) => {
            console.error(error);
            container.innerHTML = "<p class=\"error-state\">We couldn't load the store right now. Please refresh or try again shortly.</p>";
        });
};

document.addEventListener("DOMContentLoaded", initializeStorefront);
