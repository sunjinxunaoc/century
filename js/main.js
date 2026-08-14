(function() {
    'use strict';

    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');

    function closeNavDropdowns() {
        nav.querySelectorAll('.has-dropdown.open').forEach(function(item) {
            item.classList.remove('open');
        });
    }

    if (navToggle && nav) {
        navToggle.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                closeNavDropdowns();
            }
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });

        document.querySelectorAll('.nav-list a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    const parent = this.parentElement;
                    if (parent.classList.contains('has-dropdown') && this === parent.querySelector(':scope > a')) {
                        return;
                    }
                }
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        document.querySelectorAll('.has-dropdown > a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    const item = this.parentElement;
                    const wasOpen = item.classList.contains('open');
                    const siblings = item.parentElement.querySelectorAll(':scope > .has-dropdown');
                    siblings.forEach(function(sib) {
                        if (sib !== item) {
                            sib.classList.remove('open');
                        }
                    });
                    item.classList.toggle('open', !wasOpen);
                    e.preventDefault();
                }
            });
        });
    }

    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
        lastScrollY = window.scrollY;
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn && submitBtn.dataset.sending === 'true') {
                e.preventDefault();
                return;
            }
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .feature-card, .value-card, .category-card').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const carousel = document.querySelector('.about-carousel');
    if (carousel) {
        const dots = carousel.querySelectorAll('.carousel-dot');
        const slides = carousel.querySelectorAll('.carousel-slide');
        let currentSlide = 0;
        let slideInterval;

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                goToSlide(index);
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 4000);
            });
        });

        slideInterval = setInterval(nextSlide, 4000);
    }
})();