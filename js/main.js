// MIG Pacific V2 — Main JS (Bold Industrial)

const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-mobile');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.style.color = '#D4A017';
    link.style.fontWeight = '700';
  }
});

// Shop filter buttons (demo — no actual filter logic)
document.querySelectorAll('.shop-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.shop-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Add to Cart button (demo)
document.querySelectorAll('.shop-card .btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    const orig = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = '#388E3C';
    btn.style.borderColor = '#388E3C';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 1800);
    const badge = document.querySelector('.nav-cart-badge');
    if (badge) badge.textContent = parseInt(badge.textContent || 0) + 1;
  });
});

// Contact form
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '✓ Enquiry Sent!';
    btn.style.background = '#388E3C';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Send Enquiry'; btn.style.background = ''; btn.disabled = false; contactForm.reset(); }, 3000);
  });
}

// Scroll animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
}, { threshold: 0.1 });
document.querySelectorAll('.product-card, .testimonial-card, .shop-card, .project-card').forEach(el => {
  el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});
