function startCounter(element, target, duration = 2000) {
    let start = 0;
    element.textContent = '0';
    const increment = target / (duration / 16);
    const isDecimal = target % 1 !== 0;
    const suffix = element.nextSibling.textContent.trim();
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = (isDecimal ? target.toFixed(2) : Math.floor(target)) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = (isDecimal ? start.toFixed(2) : Math.floor(start)) + suffix;
        }
    }, 16);
}

function initializeCounters() {
    let hasStarted = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                const counterElements = document.querySelectorAll('.counter-number');
                counterElements.forEach(element => {
                    const target = parseFloat(element.getAttribute('data-target'));
                    startCounter(element, target);
                });
            } else if (!entry.isIntersecting) {
                hasStarted = false;
                const counterElements = document.querySelectorAll('.counter-number');
                counterElements.forEach(element => {
                    element.textContent = '0' + element.nextSibling.textContent.trim();
                });
            }
        });
    }, {
        threshold: 0.5
    });
    
    observer.observe(document.querySelector('#about'));
} 