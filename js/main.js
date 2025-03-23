// ===== Main JavaScript for Portfolio =====

document.addEventListener('DOMContentLoaded', () => {
  // Add animation for skill progress bars when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
          const width = bar.parentElement.parentElement.querySelector('.skill-name span:last-child').textContent;
          bar.style.width = width;
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
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a nav link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
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
});