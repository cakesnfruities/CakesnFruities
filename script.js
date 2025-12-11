// Global JavaScript for Cakes'n'Fruities
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeFormHandlers();
    initializeChatBot();
    initializeCart();
});
// Animation initialization
function initializeAnimations() {
    // Add fade-in animation to elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Form handling
function initializeFormHandlers() {
    const orderForms = document.querySelectorAll('form[data-order-form]');
    
    orderForms.forEach(form => {
        form.addEventListener('submit', handleOrderSubmission);
    });
}

// Order form submission handler
async function handleOrderSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="loading-spinner mx-auto"></div>';
    
    try {
        const formData = new FormData(form);
        const orderData = Object.fromEntries(formData);
        
        // Send order to email (using EmailJS or similar service)
        await sendOrderEmail(orderData);
        
        // Show success message
        showSuccessMessage('Thank you for your order! We\'ll confirm your details shortly.');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Order submission error:', error);
        showErrorMessage('Sorry, there was an error submitting your order. Please try again or contact us directly.');
    } finally {
        // Restore button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

// Send order email (placeholder - integrate with EmailJS or similar)
async function sendOrderEmail(orderData) {
    // This would integrate with a service like EmailJS
    // For now, we'll simulate the API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Order submitted:', orderData);
            resolve();
        }, 2000);
    });
}
// Chat bot functionality
function initializeChatBot() {
    // This is handled by the custom chatbot component
}

// Enhanced chatbot interactions
function setupChatbotListeners() {
    const chatbot = document.querySelector('custom-chatbot');
    if (chatbot) {
        // Additional chatbot setup if needed
    }
}

// Initialize chatbot on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeChatBot();
});
// Show success message
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

// Product filtering for menu page
function filterProducts(category) {
    const products = document.querySelectorAll('[data-product]');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.classList.remove('bg-brand-brown', 'text-white');
        button.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const activeButton = document.querySelector(`[data-filter="${category}"]`);
    if (activeButton) {
        activeButton.classList.remove('bg-gray-200', 'text-gray-700');
        activeButton.classList.add('bg-brand-brown', 'text-white');
    }
}
// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart functionality
// Add to cart functionality (with image support)
function addToCart(productId, productName, price, imageSrc) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1,
            image: imageSrc // ✅ store the image
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showSuccessMessage(`${productName} added to your order!`);
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryChargeElement = document.getElementById('delivery-charge');
    const grandTotalElement = document.getElementById('grand-total');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartContent = document.querySelector('section.py-16');

    // If cart is empty
    if (cart.length === 0) {
        if (cartContent) cartContent.classList.add('hidden');
        if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
        return;
    }

    // If cart has items
    if (cartContent) cartContent.classList.remove('hidden');
    if (emptyCartMessage) emptyCartMessage.classList.add('hidden');

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const imageSrc = item.image ? item.image : 'http://static.photos/food/200x200/${index + 6}'; // ✅ Use stored image

            const cartItemHTML = `
                <div class="flex items-center justify-between border-b border-gray-200 pb-6">
                    <div class="flex items-center space-x-4">
                        <img src="${imageSrc}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                        <div>
                            <h4 class="font-bold text-gray-800">${item.name}</h4>
                            <p class="text-gray-600">₦${item.price.toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                            <button onclick="updateQuantity(${index}, -1)" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition duration-300">
                                <i data-feather="minus" class="w-3 h-3"></i>
                            </button>
                            <span class="font-bold text-gray-800">${item.quantity}</span>
                            <button onclick="updateQuantity(${index}, 1)" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition duration-300">
                                <i data-feather="plus" class="w-3 h-3"></i>
                            </button>
                        </div>
                        <div class="text-right">
                            <p class="text-xl font-bold text-brand-brown">₦${itemTotal.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            `;

            cartItemsContainer.innerHTML += cartItemHTML;
        });

        // Calculate delivery charge
        const deliveryLocation = document.getElementById('delivery-location');
        const deliveryCharge = deliveryLocation ? getDeliveryCharge(deliveryLocation.value) : 10000;

        const grandTotal = subtotal + deliveryCharge;

        // Update totals
        if (subtotalElement) subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
        if (deliveryChargeElement) deliveryChargeElement.textContent = `₦${deliveryCharge.toLocaleString()}`;
        if (grandTotalElement) grandTotalElement.textContent = `₦${grandTotal.toLocaleString()}`;

        // Refresh icons
        feather.replace();
    }
}

// Get delivery charge based on location
function getDeliveryCharge(location) {
    const charges = {
        'gwarimpa': 4000,
        'wuse': 4000,
        'asokoro': 3000,
        'maitama': 5000,
        'garki': 3000,
        'old karu': 2500,
        'city college': 2500,
        'kubwa': 5000,
        'lugbe': 5000,
        'Mararaba': 3000,
        'nyanya': 2000,
        'abacha road': 2000,
        'lokongoma': 5000,
        'dutse': 5000,
        'gwagwalada': 6000,
        'orozo': 2000,
        'bwari': 6500,
        'apo': 4000,
        'ushafa': 6000,
        'masaka': 5000,
    };
    
    return charges[location] || 5000;
}

// Update item quantity
function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        cart.splice(index, 1);
    } else {
        item.quantity = newQuantity;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Initialize cart on page load
function initializeCart() {
    updateCartDisplay();
    
    // Set up form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmission);
    }
    
    // Set up delivery location change handler
    const deliveryLocation = document.getElementById('delivery-location');
    if (deliveryLocation) {
        deliveryLocation.addEventListener('change', function() {
        updateCartDisplay();
        });
    }
}

// Enhanced order form submission
async function handleOrderSubmission(event) {
    event.preventDefault();
    
    if (cart.length === 0) {
        showErrorMessage('Your cart is empty. Please add items before submitting.');
    return;
    }
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="loading-spinner mx-auto"></div>';
    
    try {
        const formData = new FormData(form);
        const orderData = {
            name: formData.get('full-name'),
            phone: formData.get('phone'),
            deliveryDate: formData.get('delivery-date'),
            deliveryAddress: formData.get('delivery-address'),
            extras: formData.get('extras'),
            location: formData.get('delivery-location'),
            cart: cart,
            subtotal: calculateSubtotal(),
            deliveryCharge: getDeliveryCharge(formData.get('delivery-location'))
        };
        
        await sendOrderToWhatsApp(orderData);
        
        // Clear cart after successful submission
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        showSuccessMessage('Order submitted successfully! We will contact you shortly.');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Order submission error:', error);
        showErrorMessage('Sorry, there was an error submitting your order. Please try again or contact us directly.');
    } finally {
        // Restore button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

// Calculate subtotal
function calculateSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Send order to WhatsApp
async function sendOrderToWhatsApp(orderData) {
    const phoneNumber = '+2348072531784';
    
    // Format order details for WhatsApp message
    let message = `NEW ORDER FROM CAKES'N'FRUITIES WEBSITE\n\n`;
    message += `Customer Information:\n`;
    message += `Name: ${orderData.name}\n`;
    message += `Phone: ${orderData.phone}\n`;
    message += `Delivery Date: ${orderData.deliveryDate}\n`;
    message += `Delivery Address: ${orderData.deliveryAddress}\n`;
    message += `Location: ${orderData.location}\n`;
    message += `Extras: ${orderData.extras || 'None'}\n\n`;
    
    message += `Order Details:\n`;
    orderData.cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.quantity} × ₦${item.price.toLocaleString()} = ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\nPrice Summary:\n`;
    message += `Subtotal: ₦${orderData.subtotal.toLocaleString()}\n`;
    message += `Delivery Charge: ₦${orderData.deliveryCharge.toLocaleString()}\n`;
    message += `TOTAL: ₦${(orderData.subtotal + orderData.deliveryCharge).toLocaleString()}\n\n`;
    message += `Thank you!`;
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
// WhatsApp integration
function openWhatsApp(orderDetails) {
    const phoneNumber = '+2348072531784';
    const message = `Hello! I'd like to place an order:\n\n${orderDetails}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

}

