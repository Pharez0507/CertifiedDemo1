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
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    // Inquiry button handling
    $('.inquire-btn').click(function() {
        alert('Thank you for your interest! Please use the contact form below to inquire about this product.');
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
});