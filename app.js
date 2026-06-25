// -------------------------------------------------------------
// AURA TECH - WEB STORE APPLICATION LOGIC
// -------------------------------------------------------------

// 1. PRODUCT CATALOG DATA
const PRODUCTS = [
    {
        id: 1,
        title: "Aura Sound Pro: ANC Headphones",
        category: "audio",
        price: 199.99,
        rating: 4.8,
        reviewsCount: 142,
        image: "assets/headphones.png",
        description: "Experience deep audio immersion with industry-leading hybrid active noise cancellation, high-fidelity spatial audio, and an ultra-comfortable cloud-memory foam headband. Crafted for focused work or travel.",
        specs: {
            "Battery Life": "Up to 45 hours (ANC off)",
            "Driver Size": "40mm Custom Dynamic",
            "Connectivity": "Bluetooth 5.2 & Wired (3.5mm)",
            "Active Noise Cancel": "Hybrid ANC (4 microphones)"
        }
    },
    {
        id: 2,
        title: "Aura Watch GT: Minimalist Smartwatch",
        category: "wearables",
        price: 249.99,
        rating: 4.6,
        reviewsCount: 89,
        image: "assets/smartwatch.png",
        description: "A sleek, lightweight companion for your active digital lifestyle. Features a vibrant circular AMOLED display, continuous heart-rate tracking, sleep quality analytics, and a design that blends into any outfit.",
        specs: {
            "Battery Life": "Up to 7 days normal usage",
            "Display": "1.4-inch AMOLED, 454x454px",
            "Water Resistance": "IP68 dust & water proof",
            "Sensors": "Optical Heart Rate, SpO2, Accelerometer"
        }
    },
    {
        id: 3,
        title: "Aura Pack: Rolltop Tech Backpack",
        category: "bags",
        price: 129.99,
        rating: 4.7,
        reviewsCount: 215,
        image: "assets/backpack.png",
        description: "The ultimate everyday carry designed to protect your gear. Water-resistant matte fabric, suspended protective laptop compartment, secret passport pockets, and ergonomic load-distribution shoulder straps.",
        specs: {
            "Capacity": "24 Liters (Expandable rolltop)",
            "Laptop Compartment": "Fits up to 16-inch Macbook Pro",
            "Material": "900D Matte Waterproof Nylon",
            "Dimensions": "48 x 30 x 15 cm"
        }
    },
    {
        id: 4,
        title: "Aura Key: Custom Mechanical Keyboard",
        category: "keyboards",
        price: 159.99,
        rating: 4.9,
        reviewsCount: 64,
        image: "assets/keyboard.png",
        description: "Unrivaled tactile feedback and premium aesthetics. Out of the box with hand-lubed linear switches, sound-absorbing plate foam, customizable purple RGB backlighting, and a compact 75% desk-saving layout.",
        specs: {
            "Form Factor": "Compact 75% Layout (84 keys)",
            "Switch Options": "Tactile Violet / Linear Silent",
            "Hotswap Capability": "5-Pin hot-swappable PCB",
            "Frame Material": "CNC Machined Aluminum Top Case"
        }
    },
    {
        id: 5,
        title: "Aura Move: Portable Bluetooth Speaker",
        category: "audio",
        price: 89.99,
        rating: 4.5,
        reviewsCount: 110,
        image: "assets/speaker.png",
        description: "Room-filling, 360-degree high-fidelity audio in a compact, water-resistant design. Featuring dual passive radiators for rich bass output. Ideal for your desk workspace, home patio, or outdoor adventures.",
        specs: {
            "Battery Life": "Up to 15 hours playback",
            "Power Output": "20W RMS Audio",
            "Waterproof Class": "IPX7 Waterproof",
            "Wireless Range": "Up to 30 meters / 100 feet"
        }
    }
];

// 2. STATE MANAGEMENT
let state = {
    cart: JSON.parse(localStorage.getItem('aura_cart')) || [],
    category: 'all',
    searchQuery: '',
    sortBy: 'featured'
};

// 3. UI ELEMENT REFERENCES
const productGrid = document.getElementById('product-grid');
const emptyState = document.getElementById('empty-state');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const categoriesContainer = document.getElementById('categories-container');
const sortSelect = document.getElementById('sort-select');
const inlineSearch = document.getElementById('inline-search');

const searchTrigger = document.getElementById('search-trigger');
const searchOverlay = document.getElementById('search-overlay');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');

const cartTrigger = document.getElementById('cart-trigger');
const cartDrawer = document.getElementById('cart-drawer');
const cartClose = document.getElementById('cart-close');
const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountBadge = document.getElementById('cart-count');
const cartItemsCount = document.getElementById('cart-items-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const cartFooter = document.getElementById('cart-footer');
const checkoutBtn = document.getElementById('checkout-btn');
const shopNowBtn = document.getElementById('shop-now-btn');

const quickviewModal = document.getElementById('quickview-modal');
const quickviewClose = document.getElementById('quickview-close');
const quickviewBody = document.getElementById('quickview-body');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutClose = document.getElementById('checkout-close');
const checkoutForm = document.getElementById('checkout-form');
const checkoutSummaryItems = document.getElementById('checkout-summary-items');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal = document.getElementById('checkout-total');
const cardNumInput = document.getElementById('card-num');
const cardExpiryInput = document.getElementById('card-expiry');
const cardCvcInput = document.getElementById('card-cvc');

const successModal = document.getElementById('success-modal');
const successCloseBtn = document.getElementById('success-close-btn');
const successOrderId = document.getElementById('success-order-id');

const toastContainer = document.getElementById('toast-container');

// 4. CORE APP INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Catalog functions
    renderProducts();
    setupCatalogListeners();

    // Modal & Overlay functions
    setupCartDrawerListeners();
    setupSearchListeners();
    setupModalListeners();
    setupCheckoutForm();
    
    // Initial UI update
    updateCartUI();
});

// Save cart to local storage helper
function saveCartToStorage() {
    localStorage.setItem('aura_cart', JSON.stringify(state.cart));
}

// 5. TOAST NOTIFICATION HELPER
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconName = type === 'success' ? 'check-circle' : 'info';
    toast.innerHTML = `
        <i data-lucide="${iconName}" class="toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    lucide.createIcons({ attrs: { class: 'toast-icon' } });

    // Slide out and remove toast
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 2800);
}

// 6. RENDER PRODUCT CATALOG
function renderProducts() {
    // A. Filter products by category
    let filtered = PRODUCTS.filter(product => {
        if (state.category !== 'all' && product.category !== state.category) {
            return false;
        }
        
        // B. Filter products by search query
        if (state.searchQuery.trim() !== '') {
            const query = state.searchQuery.toLowerCase();
            return (
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        }
        return true;
    });

    // C. Sort products
    if (state.sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    } // 'featured' retains natural array order

    // D. Update UI empty states
    if (filtered.length === 0) {
        productGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    // E. Render cards html
    productGrid.innerHTML = filtered.map(product => {
        return `
            <article class="product-card" data-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
                    <span class="product-tag">${product.category}</span>
                    <button class="product-quickview-btn" data-id="${product.id}" title="Quick View">
                        <i data-lucide="eye"></i>
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-meta-row">
                        <span class="product-category">${product.category}</span>
                        <div class="product-rating">
                            <i data-lucide="star"></i>
                            <span>${product.rating}</span>
                        </div>
                    </div>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${product.id}" title="Add to Cart">
                            <i data-lucide="shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Re-initialize dynamic icons inside cards
    lucide.createIcons();

    // Attach actions to generated buttons
    attachProductCardEvents();
}

function attachProductCardEvents() {
    // Add to cart buttons
    const addBtns = productGrid.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            addToCart(id);
        });
    });

    // Quick view buttons
    const quickviewBtns = productGrid.querySelectorAll('.product-quickview-btn');
    quickviewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            openQuickview(id);
        });
    });
}

// 7. SETUP CATALOG LISTENERS
function setupCatalogListeners() {
    // Category tabs switching
    categoriesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-tab')) {
            // Remove active classes
            categoriesContainer.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            // Add active class
            e.target.classList.add('active');
            
            // Set state and render
            state.category = e.target.getAttribute('data-category');
            renderProducts();
        }
    });

    // Sort Selection change
    sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderProducts();
    });

    // Inline Search input filter
    inlineSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderProducts();
        // Also update search input inside search modal to sync searches
        searchInput.value = e.target.value;
    });

    // Reset Filters button inside empty state
    resetFiltersBtn.addEventListener('click', () => {
        state.category = 'all';
        state.searchQuery = '';
        inlineSearch.value = '';
        searchInput.value = '';
        
        // Reset tabs UI
        categoriesContainer.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-category') === 'all') {
                tab.classList.add('active');
            }
        });
        
        renderProducts();
    });
}

// 8. CART FUNCTIONS
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItem = state.cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`Added "${product.title}" to cart.`);
}

function changeQuantity(productId, delta) {
    const cartItem = state.cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.quantity += delta;
    
    // If quantity is 0 or less, remove item
    if (cartItem.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCartToStorage();
    updateCartUI();
}

function removeFromCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    state.cart = state.cart.filter(item => item.id !== productId);
    
    saveCartToStorage();
    updateCartUI();
    
    if (product) {
        showToast(`Removed "${product.title}" from cart.`, 'info');
    }
}

function updateCartUI() {
    // 1. Calculate count & subtotals
    let count = 0;
    let subtotal = 0;

    state.cart.forEach(item => {
        const prod = PRODUCTS.find(p => p.id === item.id);
        if (prod) {
            count += item.quantity;
            subtotal += prod.price * item.quantity;
        }
    });

    // Update navigation badge
    cartCountBadge.textContent = count;
    cartItemsCount.textContent = count;
    
    // Animation trigger on cart button
    cartTrigger.classList.add('pulse');
    setTimeout(() => cartTrigger.classList.remove('pulse'), 400);

    // 2. Render Cart Items list
    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty-message">
                <i data-lucide="shopping-bag" class="empty-cart-icon"></i>
                <p>Your bag is currently empty</p>
                <a href="#shop" class="btn btn-primary btn-sm" id="shop-now-btn">Start Shopping</a>
            </div>
        `;
        cartFooter.classList.add('hidden');
        
        // Re-attach listener to dynamic shop now button
        document.getElementById('shop-now-btn').addEventListener('click', () => {
            closeDrawer();
        });
    } else {
        cartFooter.classList.remove('hidden');
        cartItemsContainer.innerHTML = state.cart.map(item => {
            const prod = PRODUCTS.find(p => p.id === item.id);
            if (!prod) return '';
            
            return `
                <div class="cart-item">
                    <div class="cart-item-img-box">
                        <img src="${prod.image}" alt="${prod.title}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${prod.title}</h4>
                        <span class="cart-item-price">$${prod.price.toFixed(2)}</span>
                        <div class="cart-qty-wrapper">
                            <button class="qty-btn" onclick="changeQuantity(${prod.id}, -1)">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn" onclick="changeQuantity(${prod.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${prod.id})" aria-label="Remove item">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    // Set totals text
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartTotal.textContent = `$${subtotal.toFixed(2)}`;

    lucide.createIcons();
}

// 9. CART DRAWER TOGGLE LOGIC
function openDrawer() {
    cartDrawer.classList.add('active');
    cartDrawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeDrawer() {
    cartDrawer.classList.remove('active');
    cartDrawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function setupCartDrawerListeners() {
    cartTrigger.addEventListener('click', openDrawer);
    cartClose.addEventListener('click', closeDrawer);
    cartDrawerOverlay.addEventListener('click', closeDrawer);
    
    // Checkout Button
    checkoutBtn.addEventListener('click', () => {
        closeDrawer();
        openCheckout();
    });
}

// 10. SEARCH OVERLAY TOGGLE
function openSearch() {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 150);
}

function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function setupSearchListeners() {
    searchTrigger.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);
    
    // Close overlay on clicking backdrop outside content wrapper
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });

    // Realtime filter synchronizer
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        inlineSearch.value = e.target.value; // Sync with inline storefront input
        renderProducts();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
            closeDrawer();
            closeModal(quickviewModal);
            closeModal(checkoutModal);
            closeModal(successModal);
        }
    });
}

// 11. MODAL HANDLING & QUICKVIEW LOGIC
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function setupModalListeners() {
    // Quickview close
    quickviewClose.addEventListener('click', () => closeModal(quickviewModal));
    quickviewModal.addEventListener('click', (e) => {
        if (e.target === quickviewModal) closeModal(quickviewModal);
    });

    // Checkout close
    checkoutClose.addEventListener('click', () => closeModal(checkoutModal));
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeModal(checkoutModal);
    });

    // Success Close
    successCloseBtn.addEventListener('click', () => closeModal(successModal));
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) closeModal(successModal);
    });
}

// Open Quickview Detail Model
function openQuickview(productId) {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;

    // Spec lines mapping
    const specRows = Object.entries(prod.specs).map(([label, val]) => {
        return `
            <div class="spec-item">
                <span class="spec-label">${label}</span>
                <span class="spec-value">${val}</span>
            </div>
        `;
    }).join('');

    // Inject content
    quickviewBody.innerHTML = `
        <div class="quickview-layout">
            <div class="quickview-gallery">
                <img src="${prod.image}" alt="${prod.title}">
            </div>
            
            <div class="quickview-info">
                <span class="quickview-category">${prod.category}</span>
                <h2 class="quickview-title">${prod.title}</h2>
                
                <div class="quickview-rating-row">
                    <div class="product-rating">
                        <i data-lucide="star"></i>
                        <span>${prod.rating}</span>
                    </div>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">(${prod.reviewsCount} verified reviews)</span>
                </div>

                <div class="quickview-price">$${prod.price.toFixed(2)}</div>
                
                <p class="quickview-description">${prod.description}</p>
                
                <div class="quickview-specs">
                    ${specRows}
                </div>

                <button class="btn btn-primary w-full mt-4" id="modal-add-to-cart-btn">
                    <i data-lucide="shopping-cart"></i>
                    <span>Add to Shopping Cart</span>
                </button>
            </div>
        </div>
    `;

    lucide.createIcons();
    openModal(quickviewModal);

    // Modal add-to-cart event
    document.getElementById('modal-add-to-cart-btn').addEventListener('click', () => {
        addToCart(prod.id);
        closeModal(quickviewModal);
    });
}

// 12. CHECKOUT OPERATIONS
function openCheckout() {
    if (state.cart.length === 0) {
        showToast("Your cart is empty!", "info");
        return;
    }

    // 1. Render items list in summary section
    let totalVal = 0;
    checkoutSummaryItems.innerHTML = state.cart.map(item => {
        const prod = PRODUCTS.find(p => p.id === item.id);
        if (!prod) return '';
        
        totalVal += prod.price * item.quantity;
        return `
            <div class="checkout-item">
                <div class="checkout-item-thumb">
                    <img src="${prod.image}" alt="${prod.title}">
                </div>
                <div class="checkout-item-info">
                    <h4 class="checkout-item-title">${prod.title}</h4>
                    <span class="checkout-item-qty">Qty: ${item.quantity}</span>
                </div>
                <span class="checkout-item-price">$${(prod.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    }).join('');

    checkoutSubtotal.textContent = `$${totalVal.toFixed(2)}`;
    checkoutTotal.textContent = `$${totalVal.toFixed(2)}`;

    // Reset checkout form fields
    checkoutForm.reset();

    openModal(checkoutModal);
}

function setupCheckoutForm() {
    // Realtime card input formatting
    cardNumInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        e.target.value = formatted;
    });

    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (value.length > 2) {
            e.target.value = value.slice(0, 2) + '/' + value.slice(2, 4);
        } else {
            e.target.value = value;
        }
    });

    cardCvcInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/gi, '');
    });

    // Form submission simulation
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading simulation on checkout button
        const submitBtn = document.getElementById('submit-order-btn');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span style="display:inline-flex; align-items:center; gap:0.5rem;">
                <svg width="20" height="20" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff" style="animation: spin 1s linear infinite;">
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)" stroke-width="2">
                            <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                            <path d="M36 18c0-9.94-8.06-18-18-18"/>
                        </g>
                    </g>
                </svg>
                Processing Payment...
            </span>
        `;

        // CSS spinner keyframe injection dynamically if not exist
        if (!document.getElementById('spin-keyframe-style')) {
            const style = document.createElement('style');
            style.id = 'spin-keyframe-style';
            style.innerHTML = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;

            // Generate order ID
            const randId = Math.floor(100000 + Math.random() * 900000);
            successOrderId.textContent = `#ATH-${randId}`;

            // Reset cart state
            state.cart = [];
            saveCartToStorage();
            updateCartUI();

            // Modal swaps
            closeModal(checkoutModal);
            openModal(successModal);
            
            showToast("Order placed successfully!", "success");
        }, 1800);
    });
}
