/**
 * Pryysm Landing Page — Interactions & Animations
 * Optimized for performance, accessibility, and SEO
 */

(function() {
    'use strict';
    
    // Debounce utility
    function debounce(fn, wait) {
        let t;
        return function() {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, arguments), wait);
        };
    }
    
    // Throttle utility
    function throttle(fn, limit) {
        let inThrottle;
        return function() {
            if (!inThrottle) {
                fn.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // DOM Ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    ready(function() {
        // ===== NAVIGATION =====
        const nav = document.getElementById('nav');
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        
        // Scroll behavior for nav
        let lastScroll = 0;
        
        function onScroll() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }
        
        window.addEventListener('scroll', throttle(onScroll, 100), { passive: true });
        onScroll();
        
        // Mobile menu toggle
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                navMenu.classList.toggle('active');
                document.body.style.overflow = !expanded ? 'hidden' : '';
            });
            
            // Close menu on link click
            navMenu.querySelectorAll('.nav-link').forEach(function(link) {
                link.addEventListener('click', function() {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
        
        // ===== SCROLL ANIMATIONS =====
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -60px 0px',
                threshold: 0.1
            };
            
            const animationObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
                        
                        setTimeout(function() {
                            el.classList.add('animate-in');
                        }, delay);
                        
                        animationObserver.unobserve(el);
                    }
                });
            }, observerOptions);
            
            animatedElements.forEach(function(el) {
                animationObserver.observe(el);
            });
        } else {
            // Fallback for older browsers
            animatedElements.forEach(function(el) {
                el.classList.add('animate-in');
            });
        }
        
        // ===== STAT COUNTER ANIMATION =====
        const statNumbers = document.querySelectorAll('[data-count]');
        
        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 2000;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quart
                const ease = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(ease * target);
                
                el.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            }
            
            requestAnimationFrame(update);
        }
        
        if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
            const statObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        statObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statNumbers.forEach(function(el) {
                statObserver.observe(el);
            });
        }
        
        // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = nav ? nav.offsetHeight : 0;
                    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
                    
                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
        
        // ===== FAQ ACCORDION =====
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(function(item) {
            const summary = item.querySelector('.faq-question');
            
            summary.addEventListener('click', function() {
                const isOpen = item.hasAttribute('open');
                
                // Close others (optional accordion behavior)
                // faqItems.forEach(function(other) {
                //     if (other !== item && other.hasAttribute('open')) {
                //         other.removeAttribute('open');
                //     }
                // });
            });
        });
        
        // ===== PARALLAX ORBS (subtle) =====
        const orbs = document.querySelectorAll('.ambient-orb');
        let ticking = false;
        
        function updateOrbs() {
            const scrollY = window.pageYOffset;
            orbs.forEach(function(orb, i) {
                const speed = 0.02 + (i * 0.01);
                const y = scrollY * speed;
                orb.style.transform = 'translateY(' + (-y) + 'px)';
            });
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateOrbs);
                ticking = true;
            }
        }, { passive: true });
        
        // ===== PERFORMANCE: Preconnect hints on hover =====
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(function(link) {
            link.addEventListener('mouseenter', function() {
                const url = new URL(this.href);
                let dns = document.querySelector('link[rel="dns-prefetch"][href="//' + url.host + '"]');
                if (!dns) {
                    dns = document.createElement('link');
                    dns.rel = 'dns-prefetch';
                    dns.href = '//' + url.host;
                    document.head.appendChild(dns);
                }
            }, { once: true });
        });
        
        // ===== KEYBOARD NAVIGATION ENHANCEMENTS =====
        document.addEventListener('keydown', function(e) {
            // Escape closes mobile menu
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                mobileToggle.focus();
            }
        });
        
        // ===== ACTIVE NAV LINK ON SCROLL =====
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        function setActiveNav() {
            const scrollPos = window.pageYOffset + (nav ? nav.offsetHeight + 50 : 100);
            
            sections.forEach(function(section) {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');
                
                if (scrollPos >= top && scrollPos < bottom) {
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', throttle(setActiveNav, 150), { passive: true });
        setActiveNav();
    });
})();
