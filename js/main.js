// ===== Main JavaScript for Portfolio =====

document.addEventListener('DOMContentLoaded', () => {
  // Add animation for skill progress bars when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
          // Sửa lỗi: Thêm xử lý để đảm bảo lấy giá trị phần trăm đúng
          const percentText = bar.parentElement.parentElement.querySelector('.skill-name span:last-child').textContent;
          // Đảm bảo chuyển đổi thành phần trăm hợp lệ
          bar.style.width = percentText;
        });
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.skill-category').forEach(category => {
    observer.observe(category);
  });
  
  // Activate fade-in elements
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  fadeElements.forEach(element => {
    fadeObserver.observe(element);
  });
  
  // Add scroll class to header
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a nav link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });
  
  // Active navigation based on scroll position
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul li a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 200) {
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
  
  // Form validation
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple form validation
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');
      
      let isValid = true;
      
      if (!name.value.trim()) {
        isValid = false;
        highlightInvalidField(name);
      } else {
        removeInvalidHighlight(name);
      }
      
      if (!email.value.trim() || !isValidEmail(email.value)) {
        isValid = false;
        highlightInvalidField(email);
      } else {
        removeInvalidHighlight(email);
      }
      
      if (!subject.value.trim()) {
        isValid = false;
        highlightInvalidField(subject);
      } else {
        removeInvalidHighlight(subject);
      }
      
      if (!message.value.trim()) {
        isValid = false;
        highlightInvalidField(message);
      } else {
        removeInvalidHighlight(message);
      }
      
      if (isValid) {
        // If the form is valid, you would typically send data to a server
        // For demo purposes, we'll simulate a successful submission
        
        // Disable submit button and show sending state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate server delay
        setTimeout(() => {
          // Reset form and show success message
          contactForm.reset();
          
          // Create success message
          const successMsg = document.createElement('div');
          successMsg.className = 'success-message';
          successMsg.textContent = 'Message sent successfully! I\'ll get back to you soon.';
          successMsg.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
          successMsg.style.color = '#4CAF50';
          successMsg.style.padding = '10px 15px';
          successMsg.style.marginTop = '15px';
          successMsg.style.borderRadius = '4px';
          successMsg.style.border = '1px solid #4CAF50';
          
          // Insert after form
          contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
          
          // Reset button
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          
          // Remove success message after 5 seconds
          setTimeout(() => {
            successMsg.style.opacity = '0';
            successMsg.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
              successMsg.remove();
            }, 500);
          }, 5000);
        }, 1500);
      }
    });
  }
  
  // Helper functions for form validation
  function highlightInvalidField(field) {
    field.style.borderColor = '#ff4d4d';
    field.style.boxShadow = '0 0 0 3px rgba(255, 77, 77, 0.2)';
    
    // Add or update error message
    let errorMessage = field.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
      errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.style.color = '#ff4d4d';
      errorMessage.style.fontSize = '0.8rem';
      errorMessage.style.marginTop = '5px';
      field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
    
    // Set appropriate error message
    if (field.id === 'email' && field.value.trim() && !isValidEmail(field.value)) {
      errorMessage.textContent = 'Please enter a valid email address';
    } else {
      errorMessage.textContent = `${field.previousElementSibling.textContent} is required`;
    }
  }
  
  function removeInvalidHighlight(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    // Remove error message if it exists
    const errorMessage = field.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains('error-message')) {
      errorMessage.remove();
    }
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Add fade-in class for initial animations
  document.querySelectorAll('.fade-in').forEach(element => {
    element.classList.add('active');
  });

  // === GALLERY FUNCTIONALITY - Đã SỬA ===
  initGallery();
  
  // === TESTIMONIALS FUNCTIONALITY - Đã SỬA ===
  initTestimonials();
});

// Gallery initialization function - Fixed
function initGallery() {
  // Get all gallery items and filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (!galleryItems.length) {
    console.log("No gallery items found");
    return; // Exit if no gallery items found
  }
  
  console.log("Gallery Items:", galleryItems.length);
  console.log("Filter Buttons:", filterBtns.length);
  
  // Manually set initial styles for gallery items
  galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
  });
  
  // Show all items initially with staggered animation
  setTimeout(() => {
    galleryItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.classList.add('show');
      }, 100 * index);
    });
  }, 500);
  
  // Add click event to filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      console.log("Filter clicked:", this.getAttribute('data-filter'));
      
      // Remove active class from all buttons
      filterBtns.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filterValue = this.getAttribute('data-filter');
      
      // Filter gallery items
      galleryItems.forEach(item => {
        // Hide first
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.classList.remove('show');
        
        // Check if item should be shown
        const shouldShow = 
          filterValue === 'all' || 
          item.getAttribute('data-category') === filterValue;
        
        // Show items that match the filter
        if (shouldShow) {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.classList.add('show');
          }, 300);
        }
      });
    });
  });
  
  // Add lightbox functionality
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      const title = item.querySelector('h3').textContent;
      const description = item.querySelector('p').textContent;
      
      // Create lightbox elements
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.style.position = 'fixed';
      lightbox.style.top = '0';
      lightbox.style.left = '0';
      lightbox.style.width = '100%';
      lightbox.style.height = '100%';
      lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      lightbox.style.display = 'flex';
      lightbox.style.alignItems = 'center';
      lightbox.style.justifyContent = 'center';
      lightbox.style.zIndex = '9999';
      lightbox.style.opacity = '0';
      lightbox.style.transition = 'opacity 0.3s ease';
      
      lightbox.innerHTML = `
        <div class="lightbox-content" style="max-width: 80%; max-height: 80%; position: relative;">
          <span class="lightbox-close" style="position: absolute; top: -40px; right: 0; font-size: 30px; color: white; cursor: pointer;">&times;</span>
          <img src="${imgSrc}" alt="${title}" style="max-width: 100%; max-height: 80vh; border-radius: 5px; box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);">
          <div class="lightbox-caption" style="color: white; text-align: center; margin-top: 15px;">
            <h3>${title}</h3>
            <p>${description}</p>
          </div>
        </div>
      `;
      
      // Add lightbox to body
      document.body.appendChild(lightbox);
      
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';
      
      // Animation for lightbox appearance
      setTimeout(() => {
        lightbox.style.opacity = '1';
      }, 10);
      
      // Close lightbox on click
      lightbox.addEventListener('click', e => {
        if (e.target === lightbox || e.target.className === 'lightbox-close') {
          lightbox.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
          }, 300);
        }
      });
    });
  });
}

// Testimonials initialization function - Fixed
function initTestimonials() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.prev-testimonial');
  const nextBtn = document.querySelector('.next-testimonial');
  
  if (!testimonialCards.length) {
    console.log("No testimonial cards found");
    return; // Exit if no testimonial cards found
  }
  
  console.log("Found testimonial cards:", testimonialCards.length);
  
  let currentIndex = 0;
  let isAnimating = false;
  let autoplayInterval;
  
  // Function to show testimonial by index
  function showTestimonial(index) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Reset all cards and indicators
    testimonialCards.forEach(card => {
      card.classList.remove('active');
      card.style.opacity = '0';
      card.style.visibility = 'hidden';
      card.style.transform = 'translateX(50px)';
      card.classList.add('previous');
    });
    
    indicators.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show current card and indicator
    const currentCard = testimonialCards[index];
    currentCard.classList.add('active');
    currentCard.style.opacity = '1';
    currentCard.style.visibility = 'visible';
    currentCard.style.transform = 'translateX(0)';
    
    indicators[index].classList.add('active');
    
    // Reset animation state after transition
    setTimeout(() => {
      isAnimating = false;
    }, 600);
  }
  
  // Function to go to next testimonial
  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonialCards.length;
    showTestimonial(currentIndex);
  }
  
  // Function to go to previous testimonial
  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentIndex);
  }
  
  // Add event listeners to navigation buttons
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      prevTestimonial();
      resetAutoplay();
    });
    
    nextBtn.addEventListener('click', () => {
      nextTestimonial();
      resetAutoplay();
    });
  }
  
  // Add event listeners to indicators
  indicators.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (currentIndex !== index) {
        currentIndex = index;
        showTestimonial(currentIndex);
        resetAutoplay();
      }
    });
  });
  
  // Initialize autoplay
  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextTestimonial, 5000);
  }
  
  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }
  
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }
  
  // Start autoplay initially
  startAutoplay();
  
  // Stop autoplay on hover
  const testimonialContainer = document.querySelector('.testimonials-container');
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', stopAutoplay);
    testimonialContainer.addEventListener('mouseleave', startAutoplay);
  }
  
  // Handle touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (testimonialContainer) {
    testimonialContainer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });
    
    testimonialContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next slide
      nextTestimonial();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous slide
      prevTestimonial();
    }
  }
  
  // Show first testimonial on load
  showTestimonial(0);
  
  // Create floating particles effect
  createParticlesEffect();
}

// Create floating particles effect
function createParticlesEffect() {
  const section = document.querySelector('#testimonials');
  if (!section) return;
  
  // Create particles container
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'testimonial-particles';
  section.appendChild(particlesContainer);
  
  // Create particles
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random styling
    const size = Math.random() * 5 + 2;
    const opacity = Math.random() * 0.5 + 0.1;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(100,181,246,1) 0%, rgba(100,181,246,0) 70%);
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      opacity: ${opacity};
      transform: scale(0);
      animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    
    particlesContainer.appendChild(particle);
  }
  
  // Add keyframes animation for particles
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes floatParticle {
      0% {
        transform: translate(0, 0) scale(0);
        opacity: 0;
      }
      25% {
        transform: translate(-50px, -30px) scale(1);
        opacity: ${opacity || 0.3};
      }
      50% {
        transform: translate(-100px, 30px) scale(0.8);
        opacity: ${opacity || 0.3};
      }
      75% {
        transform: translate(-50px, 60px) scale(0.6);
        opacity: ${opacity || 0.3};
      }
      100% {
        transform: translate(0, 0) scale(0);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

// Thêm smooth scrolling cho các liên kết neo
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});