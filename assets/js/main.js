/*
 * AFB Trade & Services Inc.
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // Page Transitions
    // ==========================================
    document.body.classList.add('loaded');

    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.href;
            if (
                !target || 
                target.indexOf(window.location.origin) === -1 || 
                e.ctrlKey || e.metaKey || e.shiftKey || 
                this.getAttribute('target') === '_blank' || 
                target.includes('mailto:') || 
                target.includes('#')
            ) {
                return;
            }

            e.preventDefault();
            document.body.classList.remove('loaded');
            document.body.classList.add('fade-out');
            
            setTimeout(() => {
                window.location.href = target;
            }, 400); 
        });
    });

    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            document.body.classList.remove('fade-out');
            document.body.classList.add('loaded');
        }
    });

    // Sticky Header functionality
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            
            // Toggle icon between bars and times
            const icon = mobileToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Scroll Animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.animate-on-scroll');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    
    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // Subtler Entrance Animations for Testimonials
    const entranceElements = document.querySelectorAll('.entrance-anim');
    const entranceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay for child elements
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    entranceElements.forEach(elem => entranceObserver.observe(elem));

    // ==========================================
    // Form Validation & Handling
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default submission
            
            let isValid = true;
            
            // Elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const commentsInput = document.getElementById('comments');
            const btnSubmit = document.getElementById('btnSubmit');
            const spinner = document.querySelector('.loading-spinner');
            const formFeedback = document.getElementById('formFeedback');
            
            // Error Msgs
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const commentsError = document.getElementById('commentsError');

            // Reset states
            [nameInput, emailInput, commentsInput].forEach(input => {
                input.classList.remove('is-invalid', 'is-valid');
            });
            [nameError, emailError, commentsError].forEach(msg => {
                msg.style.display = 'none';
            });
            formFeedback.className = 'form-feedback';
            formFeedback.style.display = 'none';

            // Validate Name
            if (nameInput.value.trim().length < 2) {
                nameInput.classList.add('is-invalid');
                nameError.textContent = 'Please enter a valid name (at least 2 characters).';
                nameError.style.display = 'block';
                isValid = false;
            } else {
                nameInput.classList.add('is-valid');
            }

            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.add('is-invalid');
                emailError.textContent = 'Please enter a valid email address.';
                emailError.style.display = 'block';
                isValid = false;
            } else {
                emailInput.classList.add('is-valid');
            }

            // Validate Comments
            if (commentsInput.value.trim().length < 10) {
                commentsInput.classList.add('is-invalid');
                commentsError.textContent = 'Please provide more details in your message (at least 10 characters).';
                commentsError.style.display = 'block';
                isValid = false;
            } else {
                commentsInput.classList.add('is-valid');
            }

            if (!isValid) return;

            // Success Animation 
            btnSubmit.innerHTML = 'Sending... <span class="loading-spinner" style="display:inline-block;"></span>';
            btnSubmit.disabled = true;

            // Send Data to Formspree
            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                btnSubmit.innerHTML = 'Submit Form';
                btnSubmit.disabled = false;
                
                if (response.ok) {
                    // Show Success Message
                    formFeedback.className = 'form-feedback success';
                    formFeedback.style.display = 'block';
                    formFeedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. We will get back to you shortly.';
                    
                    contactForm.reset();
                    [nameInput, emailInput, commentsInput].forEach(input => {
                        input.classList.remove('is-valid');
                    });
                } else {
                    formFeedback.className = 'form-feedback error';
                    formFeedback.style.display = 'block';
                    formFeedback.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Oops! There was a problem submitting your form.';
                }
            }).catch(error => {
                btnSubmit.innerHTML = 'Submit Form';
                btnSubmit.disabled = false;
                formFeedback.className = 'form-feedback error';
                formFeedback.style.display = 'block';
                formFeedback.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Oops! There was a network error preventing submission.';
            });
        });
    }

    // ==========================================
    // Testimonial Auto-Scroll Carousel
    // ==========================================
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let scrollTimer;

        // Auto Scroll
        const startAutoScroll = () => {
            scrollTimer = setInterval(() => {
                if (!isDown) { // Don't auto-scroll if user is dragging
                    carousel.scrollBy({ left: 1, behavior: 'auto' });
                    // Loop back to start if at end
                    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
                         // smooth resetting to the start
                         carousel.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                }
            }, 30);
        };

        // Initialize auto scroll
        startAutoScroll();

        // Pause on hover
        carousel.addEventListener('mouseenter', () => clearInterval(scrollTimer));
        carousel.addEventListener('mouseleave', startAutoScroll);

        // Allow manual drag scrolling
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.style.cursor = 'grabbing';
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast multiplier
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

});

    // ==========================================
    // Magnetic Buttons & Micro-Interactions
    // ==========================================
    const magneticElements = document.querySelectorAll('.btn, .afb-btn-login');
    
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', function(e) {
            const pos = this.getBoundingClientRect();
            const x = e.clientX - pos.left - pos.width / 2;
            const y = e.clientY - pos.top - pos.height / 2;
            
            this.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px) scale(1.02)`;
            this.style.transition = 'transform 0.1s ease-out';
        });
        
        el.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translate(0px, 0px) scale(1)';
            this.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // Springy bounce back
        });
    });

// Global function for new custom header navigation
window.toggleMobileNav = function() {
    const nav = document.getElementById('mobileNav');
    if(nav) nav.classList.toggle('open');
};
