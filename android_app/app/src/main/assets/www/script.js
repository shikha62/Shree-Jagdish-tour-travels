/* =====================================================
   SHREE JAGDISH TOUR & TRAVELS -- script.js
   Complete interactive functionality
   ===================================================== */

(function () {
  'use strict';

  /* ---- Utility ---- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ===========================================
     HAMBURGER MENU
     =========================================== */
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close on nav link click
    $$('a', navLinks).forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ===========================================
     STICKY HEADER
     =========================================== */
  const header = $('#header');
  window.addEventListener('scroll', function () {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
  }, { passive: true });

  /* ===========================================
     ACTIVE NAV LINK ON SCROLL
     =========================================== */
  const sections    = $$('section[id], div[id]');
  const allNavLinks = $$('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (sec) {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.id;
      }
    });
    allNavLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ===========================================
     SCROLL TO TOP
     =========================================== */
  const scrollBtn = $('#scrollTopBtn');
  window.addEventListener('scroll', function () {
    if (scrollBtn) {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }
  }, { passive: true });
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===========================================
     SET MIN DATE FOR DATE INPUTS
     =========================================== */
  const today = new Date().toISOString().split('T')[0];
  ['#travelDate', '#returnDate', '#cDate'].forEach(function (sel) {
    const el = $(sel);
    if (el) el.setAttribute('min', today);
  });

  /* ===========================================
     BOOKING FORM — TRIP TYPE
     =========================================== */
  window.selectTripType = function (type) {
    const returnGroup = $('#returnDateGroup');
    const tripOneWay  = $('#tripOneWay');
    const tripRound   = $('#tripRound');
    const returnInput = $('#returnDate');

    if (type === 'oneway') {
      tripOneWay.classList.add('active');
      tripRound.classList.remove('active');
      if (returnGroup) returnGroup.style.display = 'none';
      if (returnInput) returnInput.required = false;
    } else {
      tripRound.classList.add('active');
      tripOneWay.classList.remove('active');
      if (returnGroup) returnGroup.style.display = 'block';
      if (returnInput) returnInput.required = true;
    }
  };

  /* ===========================================
     BOOKING FORM — VALIDATION & SUBMIT
     =========================================== */
  const bookingForm = $('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateBookingForm()) {
        showBookingSuccess();
      }
    });
  }

  function showError(id, msg) {
    const el = $(id);
    if (el) { el.textContent = msg; }
  }
  function clearError(id) {
    const el = $(id);
    if (el) { el.textContent = ''; }
  }

  function validateBookingForm() {
    let valid = true;

    // Pickup city must be Indore
    const pickup = $('#pickupCity');
    if (pickup && pickup.value.trim().toLowerCase() !== 'indore') {
      $('#cityErrorMsg').style.display = 'flex';
      valid = false;
    } else {
      const errMsg = $('#cityErrorMsg');
      if (errMsg) errMsg.style.display = 'none';
    }

    // Destination
    const dest = $('#destination');
    if (!dest || !dest.value.trim()) {
      showError('#destError', 'Please enter your destination.');
      valid = false;
    } else {
      clearError('#destError');
    }

    // Travel Date
    const date = $('#travelDate');
    if (!date || !date.value) {
      showError('#dateError', 'Please select a travel date.');
      valid = false;
    } else {
      clearError('#dateError');
    }

    // Return date (if round trip active)
    const isRound = $('#tripRound') && $('#tripRound').classList.contains('active');
    if (isRound) {
      const retDate = $('#returnDate');
      if (!retDate || !retDate.value) {
        showError('#returnDateError', 'Please select a return date.');
        valid = false;
      } else if (date && retDate.value < date.value) {
        showError('#returnDateError', 'Return date must be after travel date.');
        valid = false;
      } else {
        clearError('#returnDateError');
      }
    }

    // Pickup location
    const loc = $('#pickupLocation');
    if (!loc || !loc.value.trim()) {
      showError('#locationError', 'Please enter your pickup location in Indore.');
      valid = false;
    } else {
      clearError('#locationError');
    }

    // Full Name
    const name = $('#fullName');
    if (!name || name.value.trim().length < 2) {
      showError('#nameError', 'Please enter your full name.');
      valid = false;
    } else {
      clearError('#nameError');
    }

    // Mobile
    const mob = $('#mobile');
    if (!mob || !/^[6-9][0-9]{9}$/.test(mob.value.trim())) {
      showError('#mobileError', 'Please enter a valid 10-digit mobile number.');
      valid = false;
    } else {
      clearError('#mobileError');
    }

    return valid;
  }

  function showBookingSuccess() {
    const form    = $('#bookingForm');
    const success = $('#formSuccess');
    const typeSel = $('#tripTypeSelector');
    if (form)    form.style.display    = 'none';
    if (typeSel) typeSel.style.display = 'none';
    if (success) success.style.display = 'block';
    success && success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ===========================================
     CONTACT FORM
     =========================================== */
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nameEl  = $('#cName');
      const phoneEl = $('#cPhone');
      const destEl  = $('#cDest');
      let ok = true;

      if (!nameEl || !nameEl.value.trim()) { ok = false; nameEl && nameEl.focus(); }
      if (!phoneEl || !/^[6-9][0-9]{9}$/.test(phoneEl.value.trim())) { ok = false; phoneEl && phoneEl.focus(); }

      if (ok) {
        contactForm.style.display = 'none';
        const succ = $('#contactSuccess');
        if (succ) succ.style.display = 'block';
      }
    });
  }

  /* ===========================================
     FAQ ACCORDION
     =========================================== */
  $$('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      $$('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ===========================================
     TESTIMONIAL CAROUSEL
     =========================================== */
  const track  = $('#testimonialTrack');
  const cards  = track ? $$('.testimonial-card', track) : [];
  const dotsEl = $('#tDots');
  let current  = 0;
  let autoSlide;

  function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    cards.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 't-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsEl.appendChild(dot);
    });
  }

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    if (track) {
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
    }
    $$('.t-dot', dotsEl).forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoSlide = setInterval(function () { goTo(current + 1); }, 5000);
  }
  function stopAuto() {
    clearInterval(autoSlide);
  }

  if (cards.length > 0) {
    renderDots();
    startAuto();

    const prev = $('#tPrev');
    const next = $('#tNext');
    if (prev) prev.addEventListener('click', function () { stopAuto(); goTo(current - 1); startAuto(); });
    if (next) next.addEventListener('click', function () { stopAuto(); goTo(current + 1); startAuto(); });

    // Touch/swipe support
    if (track) {
      let startX = 0;
      track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', function (e) {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          stopAuto();
          goTo(diff > 0 ? current + 1 : current - 1);
          startAuto();
        }
      }, { passive: true });
    }
  }

  /* ===========================================
     STATS COUNTER ANIMATION
     =========================================== */
  function animateCounters() {
    $$('.stat-number').forEach(function (el) {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start    = Date.now();

      function step() {
        const elapsed  = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }

  /* ===========================================
     INTERSECTION OBSERVER — ANIMATIONS & COUNTERS
     =========================================== */
  if ('IntersectionObserver' in window) {
    // Scroll-triggered animations
    const animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Animate cards & sections
    $$('.service-card, .why-card, .fleet-card, .dest-card, .step-card, .faq-item, .testimonial-card, .rt-card').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      animObserver.observe(el);
    });

    // Re-use visible class
    const visObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          visObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    $$('.service-card, .why-card, .fleet-card, .dest-card, .step-card, .faq-item, .testimonial-card, .rt-card').forEach(function (el) {
      visObserver.observe(el);
    });

    // Stats counter
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const statsBar = $('.stats-bar');
    if (statsBar) statsObserver.observe(statsBar);
  } else {
    // Fallback: show all
    $$('.service-card, .why-card, .fleet-card, .dest-card, .step-card, .faq-item, .testimonial-card, .rt-card').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    animateCounters();
  }

  /* ===========================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     =========================================== */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id     = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ===========================================
     DESTINATION CARD CLICKS → BOOKING FORM
     =========================================== */
  $$('.dest-card').forEach(function (card) {
    card.addEventListener('click', function () {
      const destName = card.querySelector('.dest-name');
      const destInput = $('#destination');
      if (destInput && destName) {
        const name = destName.textContent.trim();
        if (name !== 'Other Destinations') {
          destInput.value = name;
        }
      }
      const bookingSection = $('#booking');
      if (bookingSection) {
        const headerH = header ? header.offsetHeight : 72;
        const top = bookingSection.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
        if (destInput) {
          setTimeout(function () { destInput.focus(); }, 600);
        }
      }
    });
  });

  /* ===========================================
     RETURN DATE: must be >= travel date
     =========================================== */
  const travelDate = $('#travelDate');
  const returnDate = $('#returnDate');
  if (travelDate && returnDate) {
    travelDate.addEventListener('change', function () {
      returnDate.setAttribute('min', travelDate.value);
      if (returnDate.value && returnDate.value < travelDate.value) {
        returnDate.value = '';
      }
    });
  }

  /* ===========================================
     MOBILE NUMBER — allow only digits
     =========================================== */
  const mobileInput = $('#mobile');
  if (mobileInput) {
    mobileInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
  }
  const cPhoneInput = $('#cPhone');
  if (cPhoneInput) {
    cPhoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
  }

  /* ===========================================
     ROUTE CHIPS — click to populate destination
     =========================================== */
  $$('.route-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      const text  = chip.textContent.trim();
      const arrow = text.indexOf('→');
      if (arrow !== -1) {
        const dest      = text.slice(arrow + 1).trim();
        const destInput = $('#destination');
        if (destInput && dest && dest !== 'Other Destinations') {
          destInput.value = dest;
        }
      }
      const bookSection = $('#booking');
      if (bookSection) {
        const headerH = header ? header.offsetHeight : 72;
        const top = bookSection.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ===========================================
     TOPBAR HIDE ON SCROLL DOWN
     =========================================== */
  const topbar = $('#topbar');
  let lastScroll = 0;
  window.addEventListener('scroll', function () {
    const currentScroll = window.scrollY;
    if (topbar) {
      if (currentScroll > 100 && currentScroll > lastScroll) {
        topbar.style.display = 'none';
      } else if (currentScroll < lastScroll) {
        topbar.style.display = '';
      }
    }
    lastScroll = currentScroll;
  }, { passive: true });

  /* ===========================================
     PICKUP CITY VALIDATION (live)
     =========================================== */
  // Already locked to Indore — but intercept any JS change attempts
  const pickupCity = $('#pickupCity');
  if (pickupCity) {
    pickupCity.addEventListener('input', function () {
      pickupCity.value = 'Indore';
    });
  }

  console.log('%c[Shree Jagdish Tour & Travels] Website loaded. Pickup: Indore only.', 'color:#F47B20;font-weight:bold;font-size:13px;');
})();
