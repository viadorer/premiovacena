// Cost Calculator Accordion JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize accordion functionality
    initAccordion();
    
    // Add smooth scrolling animation
    addSmoothScrolling();
});

function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (!header || !content) return;
        
        // Add click event listener to header
        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.accordion-content');
                if (otherContent) {
                    otherContent.style.maxHeight = '0';
                }
            });
            
            // If this item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                // Set max-height to scrollHeight for smooth animation
                content.style.maxHeight = content.scrollHeight + 'px';
                
                // Scroll item into view with smooth animation
                setTimeout(() => {
                    const headerTop = header.getBoundingClientRect().top + window.pageYOffset;
                    const navbarHeight = 80; // Approximate navbar height
                    const targetPosition = headerTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
        
        // Add keyboard accessibility
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
        
        // Make header focusable
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        
        // Update aria-expanded when accordion state changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = item.classList.contains('active');
                    header.setAttribute('aria-expanded', isActive.toString());
                }
            });
        });
        
        observer.observe(item, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
}

function addSmoothScrolling() {
    // Add smooth scrolling to any internal links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation helper for accordion content
function animateAccordionContent(content, isOpening) {
    if (isOpening) {
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Reset max-height after animation completes
        setTimeout(() => {
            if (content.parentElement.classList.contains('active')) {
                content.style.maxHeight = 'none';
            }
        }, 300);
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        
        // Force reflow
        content.offsetHeight;
        
        content.style.maxHeight = '0';
    }
}

// Optional: Auto-expand first accordion item on page load
function autoExpandFirstItem() {
    const firstAccordionItem = document.querySelector('.accordion-item');
    if (firstAccordionItem) {
        const header = firstAccordionItem.querySelector('.accordion-header');
        if (header) {
            // Delay to ensure styles are loaded
            setTimeout(() => {
                header.click();
            }, 500);
        }
    }
}

// Call auto-expand if desired (commented out by default)
// setTimeout(autoExpandFirstItem, 1000);
