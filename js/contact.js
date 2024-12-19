function typeMessage(element, message, speed = 50) {
    // Clear any existing intervals to prevent multiple typing
    if (window.typingInterval) {
        clearInterval(window.typingInterval);
    }
    
    let i = 0;
    // Clear the textarea
    element.value = '';
    
    // Store the interval ID globally so we can clear it if needed
    window.typingInterval = setInterval(() => {
        if (i < message.length) {
            element.value = message.substring(0, i + 1);
            i++;
        } else {
            clearInterval(window.typingInterval);
            window.typingInterval = null;
        }
    }, speed);
}

function handleInquiry(productName) {
    // Scroll to contact section
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    
    // Select the product in dropdown
    const productSelect = document.querySelector('#product-select');
    productSelect.value = productName;
    
    // Hide other product field if it's not "other"
    const otherProduct = document.querySelector('#other-product');
    if (productName === 'other') {
        otherProduct.classList.add('show');
        otherProduct.classList.remove('hide');
        otherProduct.required = true;
    } else {
        otherProduct.classList.add('hide');
        otherProduct.classList.remove('show');
        otherProduct.required = false;
    }
    
    // Generate and type the template message
    const messageTemplate = `Hi, I'm interested in the ${productName === 'other' ? 'following product' : productName}. Could you please provide more information about its availability and pricing? I would appreciate any additional details about this product.`;
    const messageArea = document.querySelector('#message');
    
    // Start typing effect after a small delay to ensure smooth scrolling
    setTimeout(() => {
        typeMessage(messageArea, messageTemplate);
    }, 1000);
}

function clearForm() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.value = '';
    });
    
    // Hide other product field
    const otherProduct = document.querySelector('#other-product');
    otherProduct.classList.add('hide');
    otherProduct.classList.remove('show');
    otherProduct.required = false;
    
    // Clear any ongoing typing animation
    if (window.typingInterval) {
        clearInterval(window.typingInterval);
        window.typingInterval = null;
    }
}

// Initialize all event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inquiry buttons
    const inquiryButtons = document.querySelectorAll('.inquiry-btn');
    inquiryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = button.getAttribute('data-product');
            handleInquiry(productName);
        });
    });
    
    // Product select change handler
    const productSelect = document.querySelector('#product-select');
    productSelect.addEventListener('change', (e) => {
        const otherProduct = document.querySelector('#other-product');
        if (e.target.value === 'other') {
            otherProduct.classList.add('show');
            otherProduct.classList.remove('hide');
            otherProduct.required = true;
        } else {
            otherProduct.classList.add('hide');
            otherProduct.classList.remove('show');
            otherProduct.required = false;
        }
    });
    
    // Clear form button
    const clearButton = document.querySelector('.clear-btn');
    clearButton.addEventListener('click', clearForm);
    
    // Form submission
    const form = document.querySelector('.contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const otherProduct = document.querySelector('#other-product');
        if (productSelect.value === 'other' && !otherProduct.value.trim()) {
            alert('Please specify the product name');
            return;
        }
        alert('Thank you for your message! We will get back to you soon.');
        clearForm();
    });
}); 