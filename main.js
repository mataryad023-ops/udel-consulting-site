/* ======================================================
   UDEL CONSULTING — JavaScript partagé
   ====================================================== */

(function () {
  'use strict';

  /* ---------- Header sticky shadow ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Intersection Observer pour animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Carousel témoignages (index) ---------- */
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dotsWrap = carousel.querySelector('.carousel-dots');
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    let idx = 0;
    let autoTimer = null;

    // dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = 'carousel-dot';
      b.setAttribute('aria-label', 'Aller au témoignage ' + (i + 1));
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('.carousel-dot'));

    function goTo(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dots.forEach((d, k) => d.classList.toggle('active', k === idx));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(idx - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(idx + 1); resetAuto(); });

    function startAuto() { autoTimer = setInterval(() => goTo(idx + 1), 7000); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    goTo(0);
    startAuto();

    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', startAuto);
  }

  /* ---------- Validation formulaire contact ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^[+()\s\d-]{7,}$/;

    const setError = (field, isError, msg) => {
      const group = field.closest('.form-group');
      if (!group) return;
      group.classList.toggle('error', isError);
      const err = group.querySelector('.form-error');
      if (err && msg) err.textContent = msg;
    };

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-group').classList.contains('error')) {
          validateField(field);
        }
      });
    });

    function validateField(field) {
      const value = (field.value || '').trim();
      if (field.hasAttribute('required') && !value) {
        setError(field, true, 'Ce champ est requis.');
        return false;
      }
      if (field.type === 'email' && value && !emailRegex.test(value)) {
        setError(field, true, 'Veuillez entrer un email valide.');
        return false;
      }
      if (field.type === 'tel' && value && !phoneRegex.test(value)) {
        setError(field, true, 'Veuillez entrer un numéro de téléphone valide.');
        return false;
      }
      setError(field, false, '');
      return true;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('input, select, textarea').forEach((field) => {
        if (!validateField(field)) ok = false;
      });
      if (!ok) {
        const firstErr = form.querySelector('.form-group.error');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      const success = document.querySelector('.form-success');
      if (success) {
        success.classList.add('active');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }

  /* ---------- Année dynamique du footer ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
