// ============================================
// Space Background Animation
// ============================================

class SpaceBackground {
  constructor() {
    this.canvas = document.getElementById('space-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.nebulas = [];
    this.time = 0;
    
    this.config = {
      starCount: 200,
      nebulaCount: 3,
      starSpeed: 0.0005,
    };
    
    this.init();
    this.animate();
    this.handleResize();
  }

  init() {
    this.resizeCanvas();
    this.createStars();
    this.createNebulas();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createStars();
    this.createNebulas();
  }

  createStars() {
    this.stars = [];
    for (let i = 0; i < this.config.starCount; i++) {
      const size = Math.random();
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: size < 0.7 ? 0.5 : size < 0.9 ? 1 : 1.5,
        opacity: Math.random() * 0.4 + 0.2,
        twinkleSpeed: Math.random() * 0.01 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: this.getStarColor(),
      });
    }
  }

  getStarColor() {
    const colors = [
      { r: 255, g: 255, b: 255 },
      { r: 200, g: 220, b: 255 },
      { r: 0, g: 212, b: 255 },
      { r: 108, g: 92, b: 231 },
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  createNebulas() {
    this.nebulas = [];
    for (let i = 0; i < this.config.nebulaCount; i++) {
      this.nebulas.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 500 + 400,
        opacity: Math.random() * 0.03 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.0005 + 0.0003,
        color: {
          r: Math.floor(Math.random() * 100) + 100,
          g: Math.floor(Math.random() * 100) + 150,
          b: Math.floor(Math.random() * 100) + 200,
        },
      });
    }
  }

  drawNebulas() {
    this.nebulas.forEach((nebula) => {
      const pulse = Math.sin(this.time * nebula.pulseSpeed + nebula.pulsePhase) * 0.3 + 0.7;
      const currentOpacity = nebula.opacity * pulse;
      
      const gradient = this.ctx.createRadialGradient(
        nebula.x, nebula.y, 0,
        nebula.x, nebula.y, nebula.radius
      );
      
      gradient.addColorStop(0, `rgba(${nebula.color.r}, ${nebula.color.g}, ${nebula.color.b}, ${currentOpacity})`);
      gradient.addColorStop(0.5, `rgba(${nebula.color.r}, ${nebula.color.g}, ${nebula.color.b}, ${currentOpacity * 0.5})`);
      gradient.addColorStop(1, `rgba(${nebula.color.r}, ${nebula.color.g}, ${nebula.color.b}, 0)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawStars() {
    this.stars.forEach((star) => {
      const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinklePhase);
      const opacity = star.opacity + twinkle * 0.2;
      const currentOpacity = Math.max(0.1, Math.min(0.6, opacity));
      
      // Star glow
      const glowRadius = star.radius * 4;
      const glowGradient = this.ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, glowRadius
      );
      
      glowGradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity * 0.8})`);
      glowGradient.addColorStop(0.5, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity * 0.3})`);
      glowGradient.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`);
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Star core
      this.ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  handleResize() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
      }, 250);
    });
  }

  animate() {
    this.time += 1;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawNebulas();
    this.drawStars();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize space background
const spaceBackground = new SpaceBackground();

// ============================================
// Twinkling Stars Background
// ============================================

function createTwinklingStars() {
  const starsContainer = document.getElementById('twinkling-stars');
  if (!starsContainer) return;
  
  const starCount = 150;
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'twinkling-star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (Math.random() * 2 + 2) + 's';
    starsContainer.appendChild(star);
  }
}

// Create twinkling stars on load
createTwinklingStars();

// ============================================
// Shooting Stars Animation
// ============================================

function createShootingStar() {
  const shootingStars = document.querySelector('.shooting-stars');
  const star = document.createElement('div');
  star.style.position = 'fixed';
  star.style.width = '2px';
  star.style.height = '2px';
  star.style.background = '#ffffff';
  star.style.borderRadius = '50%';
  star.style.boxShadow = '0 0 4px #00f5ff';
  star.style.zIndex = '1';
  star.style.pointerEvents = 'none';
  
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.25;
  const distance = Math.random() * 300 + 200;
  const duration = Math.random() * 2000 + 1500;
  
  star.style.left = startX + 'px';
  star.style.top = startY + 'px';
  
  shootingStars.appendChild(star);
  
  const endX = startX + Math.cos(angle) * distance;
  const endY = startY + Math.sin(angle) * distance;
  
  star.animate([
    {
      transform: 'translate(0, 0) rotate(45deg)',
      opacity: 1
    },
    {
      transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(45deg)`,
      opacity: 0
    }
  ], {
    duration: duration,
    easing: 'linear',
    fill: 'forwards'
  }).onfinish = () => {
    star.remove();
  };
}

// Create shooting stars periodically
setInterval(() => {
  if (Math.random() > 0.7) {
    createShootingStar();
  }
}, 3000);

// ============================================
// Navigation
// ============================================

const spaceNav = document.getElementById('space-nav');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    spaceNav.classList.add('scrolled');
  } else {
    spaceNav.classList.remove('scrolled');
  }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section, .hero-section');
const observerOptions = {
  threshold: 0.3,
  rootMargin: '-100px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// ============================================
// Smooth Scrolling
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// Scroll to Top Button
// ============================================

const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ============================================
// Skill Progress Rings Animation
// ============================================

function animateProgressRing(circle, progress) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progress / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

const skillOrbs = document.querySelectorAll('.skill-orb');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressFill = entry.target.querySelector('.progress-fill');
      if (progressFill) {
        const progress = parseInt(progressFill.getAttribute('data-progress'));
        progressFill.style.strokeDasharray = 283;
        progressFill.style.strokeDashoffset = 283;
        setTimeout(() => {
          animateProgressRing(progressFill, progress);
        }, 100);
      }
    }
  });
}, { threshold: 0.5 });

skillOrbs.forEach(orb => skillObserver.observe(orb));

// ============================================
// Parallax Effect
// ============================================

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  
  // Parallax for planets
  const planets = document.querySelectorAll('.planet');
  planets.forEach((planet, index) => {
    const speed = 0.1 + (index * 0.05);
    const yPos = -(scrolled * speed);
    planet.style.transform = `translateY(${yPos}px)`;
  });
  
  // Parallax for hero visual
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && scrolled < window.innerHeight) {
    heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// ============================================
// Visitor Counter
// ============================================

function updateVisitorCount() {
  const visitsElement = document.getElementById('visits');
  let count = localStorage.getItem('visitorCount') || 0;
  count = parseInt(count) + 1;
  localStorage.setItem('visitorCount', count);
  visitsElement.textContent = count.toLocaleString();
}

updateVisitorCount();

// ============================================
// Card Hover Effects
// ============================================

const cards = document.querySelectorAll('.skill-orb, .project-ship, .blog-pod, .stat-card');
cards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s ease';
  });
});

// ============================================
// Performance Optimization
// ============================================

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

const handleScroll = debounce(() => {
  // Scroll-based animations handled above
}, 10);

window.addEventListener('scroll', handleScroll);

// ============================================
// Weather and Stellarium Buttons
// ============================================

const weatherBtn = document.getElementById('weather-btn');
const stellariumBtn = document.getElementById('stellarium-btn');

if (weatherBtn) {
  weatherBtn.addEventListener('click', () => {
    window.open('https://zoom.earth/#view=0,0,2,live', '_blank');
  });
}

if (stellariumBtn) {
  stellariumBtn.addEventListener('click', () => {
    window.open('https://stellarium-web.org', '_blank');
  });
}

// ============================================
// Console Welcome Message
// ============================================

console.log('%c🚀 Welcome to Space Portfolio!', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
console.log('%cExploring the cosmos of code...', 'color: #8892b0; font-size: 12px;');
console.log('%cBuilt with passion and modern web technologies.', 'color: #00d4ff; font-size: 12px;');

// ============================================
// Scroll Animations for Cards
// ============================================

let scrollDirection = 'down';
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    scrollDirection = 'down';
  } else {
    scrollDirection = 'up';
  }
  lastScrollTop = scrollTop;
});

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.skill-orb, .project-ship, .blog-pod, .stat-card, .contact-item, .resume-pod'
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('scroll-down', 'scroll-up');
      } else {
        entry.target.classList.remove('visible');
        entry.target.classList.remove('scroll-down', 'scroll-up');
        if (scrollDirection === 'down') {
          entry.target.classList.add('scroll-down');
        } else {
          entry.target.classList.add('scroll-up');
        }
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// Initialize on DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Space Portfolio initialized successfully!');
  
  // Ensure all progress rings are initialized
  const progressFills = document.querySelectorAll('.progress-fill');
  progressFills.forEach(circle => {
    circle.style.strokeDasharray = 283;
    circle.style.strokeDashoffset = 283;
  });
  
  // Initialize scroll animations
  initScrollAnimations();
});

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', (e) => {
  console.error('An error occurred:', e.error);
});
