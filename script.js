// Premium Real Estate Landing Page - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initMobileNavigation();
    initCalculator();
    initForms();
    initAnimations();
    initSmoothScrolling();
    
    // Mobile Navigation Functionality
    function initMobileNavigation() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenuBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking on nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenuBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    mobileMenuBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }
    
    // Calculator Functionality
    function initCalculator() {
        const calculateBtn = document.getElementById('calculate-btn');
        const propertyType = document.getElementById('property-type');
        const propertyValue = document.getElementById('property-value');
        const resultDiv = document.getElementById('calculator-result');
        
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateLosses);
        }
        
        function calculateLosses() {
            const type = propertyType.value;
            const value = parseInt(propertyValue.value);
            
            if (!type || !value || value <= 0) {
                alert('Prosím vyplňte všechna pole správně');
                return;
            }
            
            // Calculate potential losses based on property value
            const timeLoss = calculateTimeLoss(value);
            const marketingLoss = calculateMarketingLoss(value);
            const pricingLoss = calculatePricingLoss(value, type);
            const totalLoss = timeLoss + marketingLoss + pricingLoss;
            
            // Display results
            displayResults(timeLoss, marketingLoss, pricingLoss, totalLoss);
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        function calculateTimeLoss(value) {
            // Assume 40-80 hours of work at 500 Kč/hour rate
            const hoursWorked = value > 5000000 ? 80 : value > 2000000 ? 60 : 40;
            return hoursWorked * 500;
        }
        
        function calculateMarketingLoss(value) {
            // Poor marketing leads to 10-20% longer selling time
            return Math.floor(value * 0.02); // 2% of property value
        }
        
        function calculatePricingLoss(value, type) {
            // Incorrect pricing leads to 5-15% loss
            let lossPercentage;
            switch(type) {
                case 'byt':
                    lossPercentage = 0.08;
                    break;
                case 'dum':
                    lossPercentage = 0.12;
                    break;
                case 'pozemek':
                    lossPercentage = 0.15;
                    break;
                default:
                    lossPercentage = 0.10;
            }
            return Math.floor(value * lossPercentage);
        }
        
        function displayResults(timeLoss, marketingLoss, pricingLoss, totalLoss) {
            document.getElementById('time-loss').textContent = formatCurrency(timeLoss);
            document.getElementById('marketing-loss').textContent = formatCurrency(marketingLoss);
            document.getElementById('pricing-loss').textContent = formatCurrency(pricingLoss);
            document.getElementById('total-loss').textContent = formatCurrency(totalLoss);
        }
        
        function formatCurrency(amount) {
            return new Intl.NumberFormat('cs-CZ', {
                style: 'currency',
                currency: 'CZK',
                minimumFractionDigits: 0
            }).format(amount);
        }
    }
    
    // Form Handling
    function initForms() {
        // Webinar Registration Form
        const webinarForm = document.getElementById('webinar-form');
        if (webinarForm) {
            webinarForm.addEventListener('submit', handleWebinarSubmission);
        }
        
        // Ebook Download Form
        const ebookForms = document.querySelectorAll('.ebook-form');
        ebookForms.forEach(form => {
            form.addEventListener('submit', handleEbookSubmission);
        });
        
        // Qualification Form
        const qualificationForm = document.getElementById('qualification-form');
        if (qualificationForm) {
            qualificationForm.addEventListener('submit', handleQualificationSubmission);
        }
        
        function handleWebinarSubmission(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
            const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
            
            if (!validateEmail(email) || !name.trim()) {
                showFormError(e.target, 'Prosím vyplňte všechna pole správně');
                return;
            }
            
            // Simulate form submission
            submitForm('webinar', { email, name })
                .then(() => {
                    showFormSuccess(e.target, 'Úspěšně zaregistrováno! Odkaz na webinář vám pošleme emailem.');
                    e.target.reset();
                })
                .catch(() => {
                    showFormError(e.target, 'Nastala chyba. Zkuste to prosím znovu.');
                });
        }
        
        function handleEbookSubmission(e) {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            if (!validateEmail(email)) {
                showFormError(e.target, 'Prosím zadejte platný email');
                return;
            }
            
            submitForm('ebook', { email })
                .then(() => {
                    showFormSuccess(e.target, 'E-book bude odeslán na váš email během několika minut.');
                    e.target.reset();
                })
                .catch(() => {
                    showFormError(e.target, 'Nastala chyba. Zkuste to prosím znovu.');
                });
        }
        
        function handleQualificationSubmission(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['name', 'email', 'phone', 'property-type', 'location', 'value-range', 'priority'];
            const missingFields = requiredFields.filter(field => !data[field] || !data[field].trim());
            
            if (missingFields.length > 0) {
                showFormError(e.target, 'Prosím vyplňte všechna povinná pole');
                return;
            }
            
            if (!validateEmail(data.email)) {
                showFormError(e.target, 'Prosím zadejte platný email');
                return;
            }
            
            submitForm('qualification', data)
                .then(() => {
                    showFormSuccess(e.target, 'Děkujeme! Náš specialista vás kontaktuje do 24 hodin.');
                    e.target.reset();
                })
                .catch(() => {
                    showFormError(e.target, 'Nastala chyba. Zkuste to prosím znovu.');
                });
        }
        
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function showFormError(form, message) {
            removeFormMessages(form);
            const errorMsg = createFormMessage(message, 'error');
            form.appendChild(errorMsg);
        }
        
        function showFormSuccess(form, message) {
            removeFormMessages(form);
            const successMsg = createFormMessage(message, 'success');
            form.appendChild(successMsg);
        }
        
        function createFormMessage(message, type) {
            const div = document.createElement('div');
            div.className = `form-message form-message--${type}`;
            div.textContent = message;
            div.style.cssText = `
                padding: 1rem;
                margin-top: 1rem;
                border-radius: 0.5rem;
                font-weight: 500;
                ${type === 'error' ? 
                    'background-color: #fee2e2; color: #dc2626; border: 1px solid #fecaca;' : 
                    'background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0;'
                }
            `;
            return div;
        }
        
        function removeFormMessages(form) {
            const existingMessages = form.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());
        }
        
        // Simulate API calls - replace with actual implementation
        function submitForm(type, data) {
            return new Promise((resolve, reject) => {
                // Simulate network delay
                setTimeout(() => {
                    console.log(`Form submitted - Type: ${type}`, data);
                    
                    // Simulate success rate (90% success)
                    if (Math.random() > 0.1) {
                        resolve();
                    } else {
                        reject();
                    }
                }, 1000);
            });
        }
    }
    
    // Smooth Scrolling for Anchor Links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // Account for any fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Animations and Scroll Effects
    function initAnimations() {
        // Intersection Observer for fade-in animations
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
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.pillar, .value-item, .section-header');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
        
        // Parallax effect for hero section (subtle)
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-image');
            
            parallaxElements.forEach(el => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        function requestParallax() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestParallax);
        
        // Typing effect for headline (optional enhancement)
        const headline = document.querySelector('.hero-headline');
        if (headline && window.innerWidth > 768) {
            initTypingEffect(headline);
        }
    }
    
    function initTypingEffect(element) {
        const text = element.textContent;
        const highlightText = element.querySelector('.highlight').textContent;
        const beforeHighlight = text.split(highlightText)[0];
        const afterHighlight = text.split(highlightText)[1];
        
        element.innerHTML = '';
        
        let i = 0;
        const typeSpeed = 50;
        
        function typeWriter() {
            if (i < beforeHighlight.length) {
                element.innerHTML += beforeHighlight.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            } else if (i === beforeHighlight.length) {
                element.innerHTML += `<span class="highlight">${highlightText}</span>`;
                i++;
                setTimeout(typeWriter, typeSpeed);
            } else if (i < text.length) {
                const currentAfterIndex = i - beforeHighlight.length - 1;
                if (currentAfterIndex < afterHighlight.length) {
                    element.innerHTML = beforeHighlight + `<span class="highlight">${highlightText}</span>` + afterHighlight.substring(0, currentAfterIndex + 1);
                }
                i++;
                setTimeout(typeWriter, typeSpeed);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Performance monitoring
    function trackPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            });
        }
    }
    
    trackPerformance();
    
    // Error handling for any uncaught errors
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Could send to analytics service
    });
    
    // Console message for developers
    console.log(`%c
    ██████╗ ██████╗ ███████╗███╗   ███╗██╗ ██████╗ ██╗   ██╗ █████╗ 
    ██╔══██╗██╔══██╗██╔════╝████╗ ████║██║██╔═══██╗██║   ██║██╔══██╗
    ██████╔╝██████╔╝█████╗  ██╔████╔██║██║██║   ██║██║   ██║███████║
    ██╔═══╝ ██╔══██╗██╔══╝  ██║╚██╔╝██║██║██║   ██║╚██╗ ██╔╝██╔══██║
    ██║     ██║  ██║███████╗██║ ╚═╝ ██║██║╚██████╔╝ ╚████╔╝ ██║  ██║
    ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝
    
    PRÉMIOVÁ CENA - Nastavujeme nové standardy pro prodej nemovitostí
    `, 'color: #2563eb; font-weight: bold;');
});

// Additional utility for form analytics (could be connected to actual analytics)
function trackFormInteraction(formType, action, data = {}) {
    console.log(`Form Analytics - Type: ${formType}, Action: ${action}`, data);
    
    // Example: Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'form',
            event_label: formType,
            ...data
        });
    }
}
