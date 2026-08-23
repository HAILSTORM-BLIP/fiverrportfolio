/* sc.js — Jishan.dev 2026 interactions */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Navbar scroll state ── */
  var navbar = document.getElementById('navbar');
  var onScroll = function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  var menuBtn = document.getElementById('menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  function openMenu() { mobileMenu.classList.add('open'); menuBtn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileMenu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  if (menuBtn) menuBtn.addEventListener('click', function () { mobileMenu.classList.contains('open') ? closeMenu() : openMenu(); });
  mobileLinks.forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mobileMenu.classList.contains('open')) { closeMenu(); menuBtn.focus(); } });

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var el = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); history.pushState(null, '', id); }
    });
  });

  /* ── Scroll reveal ── */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); revealObs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  /* ── Active nav link ── */
  var navLinks = document.querySelectorAll('#nav-links a');
  var sections = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute('href');
    if (id && id.startsWith('#')) {
      var sec = document.querySelector(id);
      if (sec) sections.push({ id: id, el: sec, link: a });
    }
  });
  function updateActive() {
    var scrollY = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (s) { if (s.el.offsetTop <= scrollY) current = s; });
    navLinks.forEach(function (a) { a.classList.remove('active'); });
    if (current) current.link.classList.add('active');
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* ── Hero mouse parallax ── */
  var stage = document.getElementById('stage');
  if (stage && !REDUCED) {
    var depthEls = stage.querySelectorAll('[data-depth]');
    var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    var stageRect;
    var lerp = 0.08;
    var maxShift = 14;
    function onMove(e) {
      stageRect = stageRect || stage.getBoundingClientRect();
      var x = (e.clientX - stageRect.left) / stageRect.width - 0.5;
      var y = (e.clientY - stageRect.top) / stageRect.height - 0.5;
      targetX = x * maxShift;
      targetY = y * maxShift;
    }
    function onLeave() { targetX = 0; targetY = 0; }
    stage.addEventListener('mousemove', onMove, { passive: true });
    stage.addEventListener('mouseleave', onLeave, { passive: true });
    stage.addEventListener('pointerenter', function () { stageRect = null; });
    function tick() {
      mouseX += (targetX - mouseX) * lerp;
      mouseY += (targetY - mouseY) * lerp;
      depthEls.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-depth')) || 0;
        el.style.translate = (mouseX * d / 30).toFixed(2) + 'px ' + (mouseY * d / 30).toFixed(2) + 'px';
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ── Scroll-driven hero recession ── */
  if (!REDUCED) {
    var heroLeft = document.querySelector('.hero-content');
    var sceneWrap = document.querySelector('.hero-scene-wrap');
    if (heroLeft && sceneWrap) {
      var maxScroll = 600;
      function heroRecede() {
        var scrollY = window.scrollY;
        if (scrollY > maxScroll) return;
        var t = scrollY / maxScroll;
        var ease = t * t;
        heroLeft.style.opacity = (1 - ease * 0.6).toFixed(3);
        heroLeft.style.transform = 'translateY(' + (ease * -40) + 'px)';
        sceneWrap.style.transform = 'scale(' + (1 - ease * 0.06).toFixed(4) + ') translateY(' + (ease * -20) + 'px)';
        sceneWrap.style.opacity = (1 - ease * 0.45).toFixed(3);
      }
      window.addEventListener('scroll', heroRecede, { passive: true });
      heroRecede();
    }
  }

})();
