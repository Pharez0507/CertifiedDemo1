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

    // Form submission handling
    $('.contact-form').on('submit', function(e) {
        e.preventDefault();

        // Get form data and trim whitespace
        const formData = {
            name: $('#fullName').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            product: $('#product-select').val(),
            message: $('#message').val().trim()
        };

        // If "other" is selected, use the other-product value
        if (formData.product === 'other') {
            formData.product = $('#other-product').val().trim();
        }

        // Check if any field is empty
        if (!formData.name || !formData.email || !formData.phone || !formData.product || !formData.message) {
            alert('Please fill in all fields');
            return;
        }

        // Format phone number (remove any non-digits)
        let phoneNumber = formData.phone.replace(/[^\d]/g, '');
        if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.substring(1);
        }
        // Add South African code
        const fullPhone = '+27' + phoneNumber;

        const modal = document.getElementById('platform-modal');
        modal.style.display = 'flex';

        // Handle platform selection
        $('.platform-btn').off('click').on('click', function() {
            const platform = $(this).data('platform');
            let messageTemplate = '';

            // For WhatsApp, use %0A for line breaks
            if (platform === 'whatsapp') {
                messageTemplate = encodeURIComponent(`Hi, I'm ${formData.name}!

I'm interested in: ${formData.product}

${formData.message}

My contact details:
Phone: ${fullPhone}
Email: ${formData.email}`);
            } else {
                messageTemplate = `Hi, I'm ${formData.name}!\n\n`;
                messageTemplate += `I'm interested in: ${formData.product}\n\n`;
                messageTemplate += `${formData.message}\n\n`;
                messageTemplate += `My contact details:\n`;
                messageTemplate += `Phone: ${fullPhone}\n`;
                messageTemplate += `Email: ${formData.email}`;
            }

            switch(platform) {
                case 'whatsapp':
                    window.open(`https://wa.me/27634298073?text=${messageTemplate}`, '_blank');
                    break;
                case 'facebook':
                    window.open('https://www.facebook.com/simphiwe.marwede.3?mibextid=ZbWKwL', '_blank');
                    break;
                case 'instagram':
                    window.open('https://www.instagram.com/mr_junior.m/profilecard/?igsh=bDIxcnd2emNhaHls', '_blank');
                    break;
                case 'email':
                    window.location.href = `mailto:thulaskoolt@gmail.com?subject=Inquiry about ${encodeURIComponent(formData.product)}&body=${encodeURIComponent(messageTemplate)}`;
                    break;
            }

            modal.style.display = 'none';
            e.target.reset();
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
        const contactForm = $('.contact-form');
        
        // Set the selected product in the dropdown
        $('#product-select').val(productName);
        
        // Scroll to contact section
        $('html, body').animate({
            scrollTop: $('#contact').offset().top
        }, 500, 'linear');
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
});