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

    // Form submission handling
    $('.contact-form').on('submit', function(e) {
        e.preventDefault();
        const modal = document.getElementById('platform-modal');
        modal.style.display = 'flex';

        // Get form data
        const formData = {
            name: $('#fullName').val(),
            email: $('#email').val(),
            countryCode: $('#country-code').val(),
            phone: $('#phone').val(),
            product: $('#product-select').val() === 'other' ? $('#other-product').val() : $('#product-select').val(),
            message: $('#message').val()
        };

        // Format the full phone number
        const fullPhone = `${formData.countryCode}${formData.phone.replace(/^0+/, '')}`;

        // Handle platform selection
        $('.platform-btn').off('click').on('click', function() {
            const platform = $(this).data('platform');

            switch(platform) {
                case 'whatsapp':
                    const whatsappMessage = encodeURIComponent(`Hi, I'm ${formData.name}!

I'm interested in: ${formData.product}

${formData.message}

My contact details:
Phone: ${fullPhone}
Email: ${formData.email}`);
                    window.open(`https://wa.me/27634298073?text=${whatsappMessage}`, '_blank');
                    break;
                case 'facebook':
                    window.open('https://www.facebook.com/simphiwe.marwede.3?mibextid=ZbWKwL', '_blank');
                    break;
                case 'instagram':
                    window.open('https://www.instagram.com/mr_junior.m/profilecard/?igsh=bDIxcnd2emNhaHls', '_blank');
                    break;
                case 'email':
                    const emailBody = `Hi, I'm ${formData.name}!

I'm interested in: ${formData.product}

${formData.message}

My contact details:
Phone: ${fullPhone}
Email: ${formData.email}`;
                    window.location.href = `mailto:thulaskoolt@gmail.com?subject=Inquiry about ${encodeURIComponent(formData.product)}&body=${encodeURIComponent(emailBody)}`;
                    break;
            }

            modal.style.display = 'none';
            e.target.reset();
            if (window.typingInterval) {
                clearInterval(window.typingInterval);
                window.typingInterval = null;
            }
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