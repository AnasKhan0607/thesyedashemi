/**
 * The Syed Ashemi - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // =========================================
    // Mobile Menu Toggle
    // =========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // =========================================
    // Before/After Image Sliders
    // =========================================
    const sliders = document.querySelectorAll('.transformation-slider');
    
    sliders.forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const afterOverlay = slider.querySelector('.slider-after');
        const handle = slider.querySelector('.slider-handle');
        
        if (!container || !afterOverlay || !handle) return;
        
        let isDragging = false;
        
        const updateSlider = (x) => {
            const rect = container.getBoundingClientRect();
            let percentage = ((x - rect.left) / rect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            
            afterOverlay.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            handle.style.left = `${percentage}%`;
        };
        
        const startDrag = (e) => {
            isDragging = true;
            e.preventDefault();
            e.stopPropagation();
        };

        const doDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            e.stopPropagation();

            const x = e.type.includes('touch')
                ? e.touches[0].clientX
                : e.clientX;

            updateSlider(x);
        };

        const stopDrag = () => {
            isDragging = false;
        };

        // Mouse events on handle
        handle.addEventListener('mousedown', startDrag);
        // Mouse events on container for click-to-position
        container.addEventListener('mousedown', (e) => {
            if (e.target === handle || handle.contains(e.target)) return;
            isDragging = true;
            updateSlider(e.clientX);
            e.stopPropagation();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            updateSlider(e.clientX);
        });
        document.addEventListener('mouseup', stopDrag);

        // Touch events on handle
        handle.addEventListener('touchstart', startDrag, { passive: false });
        container.addEventListener('touchstart', (e) => {
            if (e.target === handle || handle.contains(e.target)) return;
            isDragging = true;
            updateSlider(e.touches[0].clientX);
            e.stopPropagation();
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            updateSlider(e.touches[0].clientX);
        }, { passive: false });
        document.addEventListener('touchend', stopDrag);
    });

    // =========================================
    // Application Form Submission
    // =========================================
    const form = document.getElementById('application-form');
    const successMessage = document.getElementById('success-message');
    const submitBtn = form?.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    
    // Google Sheets Web App URL - Replace with your deployment URL
    const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable button and show spinner
            submitBtn.disabled = true;
            submitText.textContent = 'SUBMITTING...';
            submitSpinner.classList.remove('hidden');
            
            // Collect form data
            const formData = new FormData(form);
            const data = {
                timestamp: new Date().toISOString(),
                name: formData.get('name'),
                email: formData.get('email'),
                instagram: formData.get('instagram'),
                phone: formData.get('phone'),
                fitness_level: formData.get('fitness_level'),
                goal: formData.get('goal'),
                message: formData.get('message') || ''
            };
            
            try {
                // Check if Google Sheets URL is configured
                if (GOOGLE_SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
                    // Demo mode - just show success
                    console.log('Form data (demo mode):', data);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    // Send to Google Sheets
                    await fetch(GOOGLE_SHEETS_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                }
                
                // Show success message
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error submitting your application. Please try again or DM me on Instagram.');
                
                // Reset button
                submitBtn.disabled = false;
                submitText.textContent = 'SUBMIT APPLICATION';
                submitSpinner.classList.add('hidden');
            }
        });
    }

    // =========================================
    // Smooth Scroll for Anchor Links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =========================================
    // Navbar Background on Scroll
    // =========================================
    const navbar = document.querySelector('nav');
    
    if (navbar) {
        const updateNavbar = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-matte-black/98');
                navbar.classList.remove('bg-matte-black/95');
            } else {
                navbar.classList.add('bg-matte-black/95');
                navbar.classList.remove('bg-matte-black/98');
            }
        };
        
        window.addEventListener('scroll', updateNavbar);
        updateNavbar();
    }

    // =========================================
    // Intersection Observer for Animations
    // =========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all service cards and transformation cards
    document.querySelectorAll('#services > div > div > div, #transformations > div > div > div').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
});
