/**
 * ND Chaudhary Construction - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // 1. MOBILE MENU TOGGLE
    // ======================
    const initMobileMenu = () => {
        const menuButton = document.querySelector('.mobile-menu-btn');
        const navbar = document.querySelector('.navbar');

        if (!menuButton || !navbar) return;

        menuButton.addEventListener('click', () => {
            navbar.classList.toggle('active');
            menuButton.innerHTML = navbar.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    };

    // ======================
    // 2. SMOOTH SCROLLING
    // ======================
    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');

                // Only prevent default for internal hash links
                if (targetId !== '#' && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        const headerHeight = document.querySelector('.main-header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth',
                        });

                        // Close mobile menu if open
                        const navbar = document.querySelector('.navbar');
                        if (navbar.classList.contains('active')) {
                            navbar.classList.remove('active');
                            document.querySelector('.mobile-menu-btn').innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    }
                }
            });
        });
    };

    // ======================
    // 3. STICKY HEADER
    // ======================
    const initStickyHeader = () => {
        const header = document.querySelector('.main-header');
        const logo = document.querySelector('.logo img'); // Select the logo image
        let lastScrollY = 0; // Track the last scroll position
    
        if (!header || !logo) return;
    
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
    
            // Avoid unnecessary updates
            if (currentScrollY === lastScrollY) return;
    
            if (currentScrollY > 50) {
                if (!header.classList.contains('scrolled')) {
                    header.classList.add('scrolled');
                    logo.src = 'assets/images/logo.png'; // Change to dark logo
                }
            } else {
                if (header.classList.contains('scrolled')) {
                    header.classList.remove('scrolled');
                    logo.src = 'assets/images/logo-1.png'; // Change to light logo
                }
            }
    
            lastScrollY = currentScrollY; // Update the last scroll position
        };
    
        // Debounce the scroll event
        let timeout;
        window.addEventListener('scroll', () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleScroll, 50); // Adjust debounce delay as needed
        });
    };

    // ======================
    // 4. PROJECT FILTERING
    // ======================
    const initProjectFilter = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (filterButtons.length === 0 || projectCards.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                projectCards.forEach(card => {
                    card.style.display = (filterValue === 'all' || card.getAttribute('data-category') === filterValue) 
                        ? 'block' 
                        : 'none';
                });
            });
        });
    };

    // ======================
    // 5. EQUIPMENT SLIDER
    // ======================
    const initEquipmentSlider = () => {
        const slider = document.querySelector('.equipment-slider');
        if (!slider) return;

        const slides = document.querySelectorAll('.equipment-slide');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentIndex = 0;
        let interval;

        // Create dots if container exists
        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        // Show specific slide
        const goToSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'flex' : 'none';
            });
            
            // Update dots
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentIndex = index;
        };

        // Auto-rotate
        const startSlider = () => {
            interval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
            }, 2000);
        };

        // Pause on hover
        slider.addEventListener('mouseenter', () => clearInterval(interval));
        slider.addEventListener('mouseleave', startSlider);

        // Initialize
        goToSlide(0);
        if (slides.length > 1) startSlider();
    };

    // ======================
    // 6. TESTIMONIALS SLIDER
    // ======================
    const initTestimonialsSlider = () => {
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;

        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let currentIndex = 0;
        const slides = slider.querySelectorAll('.testimonial');

        // Touch events
        slider.addEventListener('touchstart', touchStart);
        slider.addEventListener('touchend', touchEnd);
        slider.addEventListener('touchmove', touchMove);

        // Mouse events
        slider.addEventListener('mousedown', dragStart);
        slider.addEventListener('mouseup', dragEnd);
        slider.addEventListener('mouseleave', dragEnd);
        slider.addEventListener('mousemove', drag);

        function getPositionX(event) {
            return event.type.includes('mouse') 
                ? event.clientX 
                : event.touches[0].clientX;
        }

        function dragStart(e) {
            startPos = getPositionX(e);
            isDragging = true;
            slider.style.cursor = 'grabbing';
            animationID = requestAnimationFrame(animation);
        }

        function drag(e) {
            if (isDragging) {
                const currentPosition = getPositionX(e);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }

        function dragEnd() {
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex++;
            if (movedBy > 100 && currentIndex > 0) currentIndex--;

            setPositionByIndex();
            slider.style.cursor = 'grab';
        }

        function setPositionByIndex() {
            currentTranslate = currentIndex * -100;
            prevTranslate = currentTranslate;
            slider.style.transform = `translateX(${currentTranslate}%)`;
        }

        function animation() {
            slider.style.transform = `translateX(${currentTranslate}px)`;
            if (isDragging) requestAnimationFrame(animation);
        }

        // Touch handlers
        function touchStart(e) {
            startPos = getPositionX(e);
            isDragging = true;
            animationID = requestAnimationFrame(animation);
        }

        function touchMove(e) {
            if (isDragging) {
                const currentPosition = getPositionX(e);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }

        function touchEnd() {
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex++;
            if (movedBy > 100 && currentIndex > 0) currentIndex--;

            setPositionByIndex();
        }
    };

    // ======================
    // 7. FORM HANDLING
    // ======================
    const initFormHandling = () => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
        
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! We will contact you soon.');
            contactForm.reset();
        });
    };

    // ======================
    // 8. ACTIVE NAV LINK HIGHLIGHTING
    // ======================
    const initActiveNavHighlighting = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar ul li a');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    };

    // Initialize all components (Hero Slider removed)
    initMobileMenu();
    initSmoothScrolling();
    initStickyHeader();
    initProjectFilter();
    initEquipmentSlider();
    initTestimonialsSlider();
    initFormHandling();
    initActiveNavHighlighting();

    console.log('ND Chaudhary website initialized (without hero slider)');
});