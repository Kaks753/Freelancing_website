/* ============================================================
   NeuroDesk - Main JavaScript
   Intelligence at Your Service
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     PAGE LOADER
  ============================================================ */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 600);
    });
  }

  /* ============================================================
     NAVBAR - Scroll behavior + Active state
  ============================================================ */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Hamburger menu toggle — right-side drawer
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose   = document.getElementById('mobile-close');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close button inside the drawer header
    if (mobileClose) {
      mobileClose.addEventListener('click', closeMenu);
    }

    // Overlay click closes drawer
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMenu);
    }

    // Close on nav link click (not on CTA buttons, those navigate anyway)
    mobileMenu.querySelectorAll('.navbar__mobile-links a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click (safety net)
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html') || href === './' + currentPage) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     HERO TYPING ANIMATION
  ============================================================ */
  const typingEl = document.querySelector('.hero__typing');
  if (typingEl) {
    const words = ['Data Scientist', 'ML Engineer', 'Web Developer', 'Academic Writer', 'Research Expert', 'Data Analyst'];
    let wordIndex = 0;
    let charIndex  = words[0].length; // start fully typed
    let isDeleting = false;
    let isPaused   = false;

    typingEl.textContent = words[0]; // show first word immediately

    function type() {
      if (isPaused) return;
      const current = words[wordIndex];

      if (isDeleting) {
        charIndex--;
        typingEl.textContent = current.substring(0, charIndex);
      } else {
        charIndex++;
        typingEl.textContent = current.substring(0, charIndex);
      }

      let speed = isDeleting ? 55 : 95;

      if (!isDeleting && charIndex === current.length) {
        // Fully typed — pause then start deleting
        isPaused = true;
        setTimeout(() => { isPaused = false; isDeleting = true; setTimeout(type, speed); }, 2200);
        return;
      } else if (isDeleting && charIndex === 0) {
        // Fully deleted — move to next word
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
        speed      = 320;
      }

      setTimeout(type, speed);
    }

    // Start the cycle after a short initial pause
    setTimeout(type, 2200);
  }

  /* ============================================================
     COUNTER ANIMATION
  ============================================================ */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const suffix = el.getAttribute('data-suffix') || '';
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px 0px 0px' });

    counters.forEach(el => counterObserver.observe(el));

    // Fallback: if counters are already in viewport on load (above fold),
    // fire them after a short delay so the reveal animation plays first
    setTimeout(() => {
      counters.forEach(el => {
        if (!el.classList.contains('counted')) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('counted');
            animateCounter(el);
          }
        }
      });
    }, 600);
  }

  /* ============================================================
     SCROLL REVEAL ANIMATION
  ============================================================ */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ============================================================
     SKILL BAR ANIMATION
  ============================================================ */
  const skillBars = document.querySelectorAll('.skill-bar__fill');
  if (skillBars.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillBars.forEach(el => skillObserver.observe(el));
  }

  /* ============================================================
     FAQ ACCORDION
  ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(i => {
          i.classList.remove('open');
          const a = i.querySelector('.faq-answer');
          if (a) a.classList.remove('open');
        });
        // Open clicked if was closed
        if (!isOpen) {
          item.classList.add('open');
          answer.classList.add('open');
        }
      });
    }
  });

  /* ============================================================
     PORTFOLIO FILTER
  ============================================================ */
  const filterBtns = document.querySelectorAll('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ============================================================
     CONTACT FORM — Web3Forms (real delivery, free tier)
  ============================================================ */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      const formData = new FormData(contactForm);
      // Web3Forms public key — free tier, no backend needed
      // ⚠️ REPLACE THIS KEY: get your free key at https://web3forms.com (takes 1 minute)
      formData.append('access_key', 'YOUR_WEB3FORMS_KEY_HERE');
      formData.append('subject', 'New NeuroDesk Inquiry: ' + (formData.get('service') || 'General'));
      formData.append('from_name', 'NeuroDesk Website');

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (data.success) {
          btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
          btn.style.background = 'linear-gradient(135deg, #00E5A0, #00B87D)';
          showToast('✓ Message sent — we\'ll reply within 24 hours.');
          contactForm.reset();
        } else {
          throw new Error('Send failed');
        }
      } catch {
        btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Try WhatsApp';
        btn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
        showToast('⚠ Form error — please WhatsApp us directly.');
      }

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
      }, 5000);
    });
  }

  /* ============================================================
     TOAST NOTIFICATION — compact, no heavy box
  ============================================================ */
  function showToast(message) {
    // Remove any existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
  window.showToast = showToast;

  /* ============================================================
     SCROLL TO TOP
  ============================================================ */
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     PRICING CALCULATOR (if on pricing page)
  ============================================================ */
  const calcForm = document.querySelector('#price-calculator');
  if (calcForm) {
    const serviceSelect   = calcForm.querySelector('#calc-service');
    const complexitySelect= calcForm.querySelector('#calc-complexity');
    const deadlineSelect  = calcForm.querySelector('#calc-deadline');
    const resultDiv       = calcForm.querySelector('#calc-result');
    const pagesGroup      = calcForm.querySelector('#calc-pages-group');
    const pagesInput      = calcForm.querySelector('#calc-pages');
    const urgencyNotice   = calcForm.querySelector('#calc-urgency-notice');
    const urgencyText     = calcForm.querySelector('#calc-urgency-text');
    const pageMinus       = calcForm.querySelector('#calcPageMinus');
    const pagePlus        = calcForm.querySelector('#calcPagePlus');

    // Essay per-page rates:
    //   Basic & Standard are ALWAYS fixed — no urgency surcharge.
    //   Premium is $15 normally; rises to $17 for rush (24-48h) only.
    const PAGE_RATES = { basic: 5, standard: 10, premium: 15, premium_rush: 17 };

    // Fixed base prices for all other (non-essay) services
    const basePrices = {
      'data-analysis':  { basic: 30,  standard: 80,  premium: 200 },
      'ml-model':       { basic: 80,  standard: 200, premium: 500 },
      'dashboard':      { basic: 50,  standard: 120, premium: 300 },
      'dissertation':   { basic: 60,  standard: 150, premium: 350 },
      'research-paper': { basic: 40,  standard: 100, premium: 250 },
      'website':        { basic: 80,  standard: 200, premium: 500 },
      'landing-page':   { basic: 40,  standard: 100, premium: 200 },
    };

    // Urgency multiplier applies to non-essay services only
    const deadlineMultiplier = {
      'flexible': 1.0,
      'standard': 1.2,
      'urgent':   1.6,
      'rush':     2.0,
    };

    // Show/hide pages field based on service selection
    function togglePagesField() {
      const isEssay = serviceSelect && serviceSelect.value === 'essay';
      if (pagesGroup) pagesGroup.style.display = isEssay ? 'block' : 'none';
    }

    // For essays: only show an informational banner on rush — no auto-escalation
    function updateUrgencyNotice(service, deadline, complexity) {
      if (!urgencyNotice) return;
      if (service !== 'essay') {
        urgencyNotice.style.display = 'none';
        return;
      }
      if (deadline === 'rush' && complexity === 'premium') {
        urgencyNotice.style.display = 'block';
        urgencyText.textContent = 'Rush (24–48 hrs): Premium rate increases to $17/page to prioritise your order.';
      } else if (deadline === 'rush') {
        urgencyNotice.style.display = 'block';
        urgencyText.textContent = 'Rush (24–48 hrs): Basic & Standard rates stay fixed. Premium upgrades to $17/page.';
      } else {
        urgencyNotice.style.display = 'none';
      }
    }

    function calcEstimate() {
      const service    = serviceSelect    ? serviceSelect.value    : '';
      const deadline   = deadlineSelect   ? deadlineSelect.value   : 'standard';
      const complexity = complexitySelect ? complexitySelect.value : 'standard';

      if (!service) { if (resultDiv) resultDiv.style.display = 'none'; return; }

      updateUrgencyNotice(service, deadline, complexity);

      let estimate, estimateMax, priceLabel, noteExtra = '';

      if (service === 'essay') {
        const pages = parseInt(pagesInput ? pagesInput.value : 5) || 5;
        // Basic & Standard: always flat. Premium: $17 on rush, $15 otherwise.
        let perPage;
        if (complexity === 'basic')         perPage = PAGE_RATES.basic;
        else if (complexity === 'standard') perPage = PAGE_RATES.standard;
        else                                perPage = (deadline === 'rush') ? PAGE_RATES.premium_rush : PAGE_RATES.premium;

        estimate    = pages * perPage;
        estimateMax = Math.round(estimate * 1.15); // tight ±15% band — keeps it affordable-looking
        priceLabel  = `$${estimate} – $${estimateMax}`;
        noteExtra   = `${pages} page${pages > 1 ? 's' : ''} × $${perPage}/page`;
        if (complexity === 'premium' && deadline === 'rush') noteExtra += ' (rush rate)';
      } else {
        const multiplier = deadlineMultiplier[deadline] || 1;
        const base = (basePrices[service] || {})[complexity] || (basePrices[service] || {})['basic'] || 50;
        estimate     = Math.round(base * multiplier);
        estimateMax  = Math.round(estimate * 1.4);
        priceLabel   = `$${estimate} – $${estimateMax}`;
      }

      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="calc-result-inner">
            <div class="calc-result-label">Estimated Range</div>
            <div class="calc-result-price">${priceLabel}</div>
            ${noteExtra ? `<div class="calc-result-note" style="margin-bottom:4px;color:var(--color-accent-cyan);font-weight:600;">${noteExtra}</div>` : ''}
            <div class="calc-result-note">Final price depends on specific requirements. <a href="pages/contact.html" class="text-cyan">Get exact quote →</a></div>
          </div>
        `;
        resultDiv.style.display = 'block';
      }
    }

    // Page counter buttons
    if (pageMinus) pageMinus.addEventListener('click', () => {
      const v = parseInt(pagesInput.value) || 1;
      if (v > 1) { pagesInput.value = v - 1; calcEstimate(); }
    });
    if (pagePlus) pagePlus.addEventListener('click', () => {
      const v = parseInt(pagesInput.value) || 1;
      if (v < 100) { pagesInput.value = v + 1; calcEstimate(); }
    });
    if (pagesInput) pagesInput.addEventListener('input', calcEstimate);

    if (serviceSelect) serviceSelect.addEventListener('change', () => {
      togglePagesField();
      calcEstimate();
    });
    [complexitySelect, deadlineSelect].forEach(el => {
      if (el) el.addEventListener('change', calcEstimate);
    });

    togglePagesField();
  }

  /* ============================================================
     SMOOTH HOVER EFFECTS — Service Cards
  ============================================================ */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.4,0,0.2,1)';
    });
  });

  /* ============================================================
     PARALLAX for Hero orbs (subtle)
  ============================================================ */
  const orbs = document.querySelectorAll('.hero__orb');
  if (orbs.length) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.5;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

  /* ============================================================
     INIT NAVBAR STATE
  ============================================================ */
  if (window.scrollY > 20 && navbar) {
    navbar.classList.add('scrolled');
  }

});

/* ============================================================
   NAVBAR HTML GENERATOR (shared)
============================================================ */
function generateNavbar(activePage) {
  return `
  <div class="page-loader"><div class="page-loader__logo">NeuroDesk</div></div>

  <nav class="navbar" id="navbar">
    <div class="navbar__inner">
      <a href="../index.html" class="navbar__logo">
        <div class="navbar__logo-icon">🧠</div>
        <div class="navbar__logo-text">Neuro<span>Desk</span></div>
      </a>

      <div class="navbar__links">
        <a href="../index.html" ${activePage==='home'?'class="active"':''}>Home</a>
        <a href="../pages/services.html" ${activePage==='services'?'class="active"':''}>Services</a>
        <a href="../pages/portfolio.html" ${activePage==='portfolio'?'class="active"':''}>Portfolio</a>
        <a href="../pages/pricing.html" ${activePage==='pricing'?'class="active"':''}>Pricing</a>
        <a href="../pages/about.html" ${activePage==='about'?'class="active"':''}>About</a>
        <a href="../blog/index.html" ${activePage==='blog'?'class="active"':''}>Blog</a>
        <a href="../pages/faq.html" ${activePage==='faq'?'class="active"':''}>FAQ</a>
      </div>

      <div class="navbar__cta">
        <a href="../pages/contact.html" class="btn btn-primary btn-sm">
          <i class="fas fa-paper-plane"></i> Hire Me
        </a>
      </div>

      <div class="navbar__hamburger" id="hamburger">
        <span></span><span></span><span></span>
      </div>
    </div>
  </nav>

  <div class="navbar__mobile" id="mobile-menu">
    <a href="../index.html" ${activePage==='home'?'class="active"':''}><i class="fas fa-home"></i> Home</a>
    <a href="../pages/services.html" ${activePage==='services'?'class="active"':''}><i class="fas fa-layer-group"></i> Services</a>
    <a href="../pages/portfolio.html" ${activePage==='portfolio'?'class="active"':''}><i class="fas fa-briefcase"></i> Portfolio</a>
    <a href="../pages/pricing.html" ${activePage==='pricing'?'class="active"':''}><i class="fas fa-tags"></i> Pricing</a>
    <a href="../pages/about.html" ${activePage==='about'?'class="active"':''}><i class="fas fa-user"></i> About</a>
    <a href="../blog/index.html" ${activePage==='blog'?'class="active"':''}><i class="fas fa-pen-nib"></i> Blog</a>
    <a href="../pages/faq.html" ${activePage==='faq'?'class="active"':''}><i class="fas fa-question-circle"></i> FAQ</a>
    <div class="navbar__mobile-cta">
      <a href="../pages/contact.html" class="btn btn-primary" style="width:100%;justify-content:center">
        <i class="fas fa-paper-plane"></i> Hire Me Now
      </a>
      <a href="https://wa.me/254740624253?text=Hi%20NeuroDesk!%20I'd%20like%20to%20discuss%20a%20project." class="btn btn-whatsapp" style="width:100%;justify-content:center" target="_blank">
        <i class="fab fa-whatsapp"></i> WhatsApp
      </a>
    </div>
  </div>
  `;
}
