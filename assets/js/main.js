// Cart State
let cartItems = [];
let cartTotal = 0;

// Menu Items Data
const menuItems = {
  burger1: {
    name: "Classic Burger",
    price: 149,
    image: "assets/images/burger1.jpg",
  },
  combo1: {
    name: "Mega Combo",
    price: 299,
    image: "assets/images/combo1.jpg",
  },
  // Add more items as needed
};

// Load all sections
document.addEventListener("DOMContentLoaded", () => {
  loadSections();
  setupEventListeners();
});

function loadSections() {
  const sections = ["header", "hero", "menu", "about", "contact", "footer"];

  sections.forEach((section) => {
    fetch(`sections/${section}.html`)
      .then((response) => response.text())
      .then((html) => {
        document.getElementById(section).innerHTML = html;
        if (section === "menu") {
          setupMenuListeners();
        }
      })
      .catch((error) => console.error(`Error loading ${section}:`, error));
  });
}

function setupEventListeners() {
  // Cart Modal Toggle
  const cartBtn = document.querySelector(".cart-btn");
  const cartModal = document.getElementById("cartModal");

  if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", () => {
      cartModal.classList.toggle("show");
    });

    // Close cart when clicking outside
    document.addEventListener("click", (e) => {
      if (!cartBtn.contains(e.target) && !cartModal.contains(e.target)) {
        cartModal.classList.remove("show");
      }
    });
  }

  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const icon = themeToggle.querySelector("i");
      if (document.body.classList.contains("dark-theme")) {
        icon.classList.replace("fa-moon", "fa-sun");
      } else {
        icon.classList.replace("fa-sun", "fa-moon");
      }
    });
  }
}

function setupMenuListeners() {
  // Category Filter
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.dataset.category;
      filterMenuItems(category);
    });
  });

  // Add to Cart Buttons
  const addToCartBtns = document.querySelectorAll(".add-to-cart");
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemId = btn.dataset.item;
      addToCart(itemId);
    });
  });
}

function filterMenuItems(category) {
  const foodCards = document.querySelectorAll(".food-card");
  foodCards.forEach((card) => {
    const cardCategory = card.dataset.category;
    if (category === "all" || cardCategory === category) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

function addToCart(itemId) {
  const item = menuItems[itemId];
  if (item) {
    cartItems.push(item);
    updateCart();

    // Show notification
    showNotification(`Added ${item.name} to cart!`);
  }
}

function updateCart() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartCount = document.querySelector(".cart-count");
  const cartTotalElement = document.getElementById("cartTotal");

  // Update cart count
  cartCount.textContent = cartItems.length;

  // Calculate total
  cartTotal = cartItems.reduce((total, item) => total + item.price, 0);
  cartTotalElement.textContent = `₹${cartTotal}`;

  // Update cart items display
  cartItemsContainer.innerHTML = cartItems
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `
    )
    .join("");
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2000);
  }, 100);
}

// Smooth scroll for navigation
document.addEventListener("click", (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const id = e.target.getAttribute("href").slice(1);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  }
});
