$(document).ready(function() {
    // Create overlay element
    const overlay = $('<div class="menu-overlay"></div>');
    $('body').append(overlay);

    // Menu toggle functionality
    $('#menu').click(function() {
        $(this).toggleClass('fa-times');
        $('header').toggleClass('toggle');
        $('.menu-overlay').toggleClass('active');
    });

    // Close menu when clicking overlay
    $('.menu-overlay').click(function() {
        $('#menu').removeClass('fa-times');
        $('header').removeClass('toggle');
        $(this).removeClass('active');
    });

    // Close menu when clicking a nav link
    $('.navbar a').click(function() {
        $('#menu').removeClass('fa-times');
        $('header').removeClass('toggle');
        $('.menu-overlay').removeClass('active');
    });

    // Close menu on scroll
    $(window).on('scroll', function() {
        $('#menu').removeClass('fa-times');
        $('header').removeClass('toggle');
        $('.menu-overlay').removeClass('active');
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 500, 'linear');
    });

    // Phone number input handling
    $('#phone').on('input', function() {
        const input = $(this);
        let value = input.val().trim();

        // Remove any existing tips
        $('.phone-tip').remove();

        // If user starts with 0, show tip
        if (value.startsWith('0')) {
            const tip = $('<div class="phone-tip">Tip: No need to add 0 at the start when using country code</div>');
            input.parent().append(tip);
            setTimeout(() => tip.fadeOut('slow', function() { $(this).remove(); }), 5000);
        }
    });

    // Message input handling
    $('#message').on('input', function() {
        // Remove any existing copy tips
        $('.copy-tip').remove();
        
        if ($(this).val().trim().length > 0) {
            const tip = $('<div class="copy-tip">Tip: Copy your message before sending</div>');
            $(this).after(tip);
        }
    });

    // Handle "Inquire Now" button clicks
    $('.inquiry-btn').on('click', function() {
        const selectedProduct = $(this).data('product');
        
        // Disable form fields and make them read-only
        const fields = $('#fullName, #email, #phone');
        fields.prop('disabled', true);
        fields.prop('readonly', true);
        fields.css('background-color', '#f0f0f0');
        
        // Set the product in the select
        $('#product-select').val(selectedProduct);
        
        // Set template message
        $('#message').val(`Hi Bazzar Collection!

I'm interested in the ${selectedProduct} and would like to know more about its:
- Current availability
- Pricing details
- Payment options
- Delivery information

Looking forward to hearing from you!`);
        
        // Show custom notification
        swal({
            title: "Bazzar_Collection says",
            text: "Please complete your message and choose how you would like to contact us.",
            icon: "info",
        });
        
        // Scroll to contact form
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    });

    // Handle "Make an Inquiry" button click
    $('a[href="#contact"].btn').on('click', function() {
        // Disable form fields and make them read-only
        const fields = $('#fullName, #email, #phone');
        fields.prop('disabled', true);
        fields.prop('readonly', true);
        fields.css('background-color', '#f0f0f0');
        
        // Set template message
        $('#message').val(`Hi Bazzar Collection!

I would like to inquire about your products. Could you please provide information about:
- Available products and models
- Price ranges
- Payment options
- Delivery services

Thank you for your assistance!`);
        
        // Show custom notification
        swal({
            title: "Bazzar_Collection says",
            text: "Please select a product and complete your message, then choose how you would like to contact us.",
            icon: "info",
        });
    });

    // Function to simulate typing effect
    function typeMessage(message, element, speed = 50) {
        let i = 0;
        element.val(''); // Clear the textarea
        const typeInterval = setInterval(() => {
            if (i < message.length) {
                element.val(element.val() + message.charAt(i));
                element.scrollTop(element[0].scrollHeight); // Auto scroll to bottom
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    // Make Inquiry button click handler
    $('.make-inquiry-btn').click(function() {
        const defaultMessage = `Hi Bazzar Collection!

I would like to inquire about your products. Could you please provide information about:
- Available products and models
- Price ranges
- Payment options
- Delivery services

Thank you for your assistance!`;

        // Scroll to the contact form
        $('html, body').animate({
            scrollTop: $('.contact-form').offset().top - 100
        }, 1000);

        // Start typing effect after scrolling
        setTimeout(() => {
            typeMessage(defaultMessage, $('#message'));
        }, 1000);
    });

    // Form submission handling
    $('.contact-form').on('submit', function(e) {
        e.preventDefault();

        // Add console.log statements to debug form values
        console.log('Form submitted');
        console.log('Name:', $('#fullName').val());
        console.log('Email:', $('#email').val());
        console.log('Phone:', $('#phone').val());
        console.log('Product:', $('#product-select').val());
        console.log('Message:', $('#message').val());

        // Get form data and validate each field before using the default value
        const formData = {
            name: $('#fullName').val() ? $('#fullName').val().trim() : '(input your name)',
            email: $('#email').val() ? $('#email').val().toLowerCase().trim() : '(provide your email)',
            phone: $('#phone').val() ? $('#phone').val().trim() : '(enter phone number)',
            product: $('#product-select').val() ? $('#product-select').val().trim() : '(Tell us of the product you are interested in)',
            message: $('#message').val() ? $('#message').val().trim() : 'No message provided'
        };

        // If "other" is selected, use the other-product value
        if (formData.product === 'other' && $('#other-product').val()) {
            formData.product = $('#other-product').val().trim();
        }

        // Format phone number (remove any non-digits)
        let phoneNumber = formData.phone.replace(/[^\d]/g, '');
        if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.substring(1);
        }
        // Add South African code only if phone number is provided
        const fullPhone = phoneNumber ? '+27' + phoneNumber : '(enter phone number)';

        // Format the message for WhatsApp
        const whatsappMessage = encodeURIComponent(`Hi! I'm interested in ${formData.product}.
Please provide details about pricing and availability.

Contact me at:
Phone: ${fullPhone}
Email: ${formData.email}

Thank you!`);

        // WhatsApp link
        const whatsappLink = `https://wa.me/27662669329?text=${whatsappMessage}`;
        
        // Email link
        const emailSubject = encodeURIComponent(`Product Inquiry: ${formData.product}`);
        const emailBody = encodeURIComponent(`Hi Bazzar Collection!

I'm interested in: ${formData.product}
Please provide information about pricing and availability.

Contact Details:
Phone: ${fullPhone}
Email: ${formData.email}

Thank you!`);
        const emailLink = `mailto:bazzarcollection@gmail.com?subject=${emailSubject}&body=${emailBody}`;

        // Show contact options
        swal({
            title: "Choose Contact Method",
            html: true,
            text: `
                <div class="contact-options">
                    <a href="${whatsappLink}" class="btn whatsapp-btn" target="_blank">Send via WhatsApp</a>
                    <a href="${emailLink}" class="btn email-btn">Send via Email</a>
                </div>
            `,
            buttons: false
        });
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('platform-modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Clear form button handling
    $('.clear-btn').click(function() {
        $('.contact-form')[0].reset();
    });

    // Inquiry button handling
    $('.inquiry-btn').click(function() {
        const productName = $(this).data('product');
        
        // Set the selected product in the dropdown
        $('#product-select').val(productName);
        
        // Show the copy tip immediately
        $('.copy-tip').remove(); // Remove any existing tips
        const tip = $('<div class="copy-tip">Tip: Copy your message before sending</div>');
        $('#message').parent().append(tip);

        // Scroll to contact section
        $('html, body').animate({
            scrollTop: $('#contact').offset().top
        }, 500, 'linear', function() {
            // Focus on the message textarea
            $('#message').focus();
        });
    });

    // Scroll buttons functionality
    $('.scroll-right').click(function() {
        const container = $(this).siblings('.product-grid');
        container.animate({
            scrollLeft: '+=300'
        }, 300);
    });

    $('.scroll-left').click(function() {
        const container = $(this).siblings('.product-grid');
        container.animate({
            scrollLeft: '-=300'
        }, 300);
    });

    // Show/hide scroll buttons based on scroll position
    $('.product-grid').each(function() {
        const container = $(this);
        const leftBtn = container.siblings('.scroll-left');
        const rightBtn = container.siblings('.scroll-right');

        function updateScrollButtons() {
            const scrollLeft = container.scrollLeft();
            const maxScroll = container[0].scrollWidth - container.width();

            leftBtn.toggle(scrollLeft > 0);
            rightBtn.toggle(scrollLeft < maxScroll);
        }

        container.on('scroll', updateScrollButtons);
        updateScrollButtons();
    });

    // Lazy loading for testimonial images
    const testimonialImages = document.querySelectorAll('.testimonial-card img, .client-info img');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px 50px 0px"
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    testimonialImages.forEach(img => imageObserver.observe(img));

    // Audio player customization
    const audioPlayers = document.querySelectorAll('audio');
    audioPlayers.forEach(player => {
        player.addEventListener('play', () => {
            audioPlayers.forEach(p => {
                if (p !== player) p.pause();
            });
        });
    });

    // Country code search functionality
    $('#country-code').on('keydown', function(e) {
        const select = this;
        const searchText = e.key.toLowerCase();
        
        if (searchText.length === 1) { // Only handle single character keys
            for (let i = 0; i < select.options.length; i++) {
                const option = select.options[i];
                if (option.text.toLowerCase().startsWith(searchText)) {
                    select.selectedIndex = i;
                    return;
                }
            }
        }
    });

    // Set default country code to South Africa
    $('#country-code').val('+27');

    // Show the copy tip by default when the page loads
    const tip = $('<div class="copy-tip">Tip: Copy your message before sending</div>');
    $('.message').after(tip);

    // Keep the tip visible when the message field is focused
    $('#message').on('focus', function() {
        if ($('.copy-tip').length === 0) {
            const tip = $('<div class="copy-tip">Tip: Copy your message before sending</div>');
            $('.message').after(tip);
        }
    });
});