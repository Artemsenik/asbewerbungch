// AS-Bewerbung.ch – Interaktionen

document.addEventListener('DOMContentLoaded', function () {

  // --- Mobile Menü ---
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  if (toggle && mobileMenu) {
    let lastFocus = null;
    let previousOverflow = '';
    let inertBackground = [];

    const focusableElements = () => Array.from(mobileMenu.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.closest('[inert]') && el.getClientRects().length > 0);

    function openMenu() {
      if (!mobileMenu.hidden) return;
      lastFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      mobileMenu.hidden = false;
      mobileMenu.inert = false;
      mobileMenu.setAttribute('aria-hidden', 'false');
      mobileMenu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Menü schliessen');
      document.body.style.overflow = 'hidden';
      (mobileClose || mobileMenu).focus();

      // Nur den Dialog erreichbar lassen; bestehende inert-Zustände erhalten.
      let branch = mobileMenu;
      while (branch.parentElement && branch !== document.body) {
        Array.from(branch.parentElement.children).forEach(sibling => {
          if (sibling !== branch && !sibling.hasAttribute('inert')) {
            sibling.inert = true;
            inertBackground.push(sibling);
          }
        });
        branch = branch.parentElement;
      }
    }

    function closeMenu() {
      if (mobileMenu.hidden) return;
      mobileMenu.classList.remove('open');
      mobileMenu.hidden = true;
      mobileMenu.inert = true;
      mobileMenu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Menü öffnen');
      document.body.style.overflow = previousOverflow;
      inertBackground.forEach(el => { el.inert = false; });
      inertBackground = [];
      const returnTarget = lastFocus && lastFocus.isConnected && lastFocus.getClientRects().length
        ? lastFocus : document.querySelector('.site-nav .nav-logo');
      if (returnTarget) returnTarget.focus();
    }

    toggle.addEventListener('click', () => mobileMenu.hidden ? openMenu() : closeMenu());
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    // Auch Logo und Kontakt-Button schliessen das Menü.
    mobileMenu.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', event => {
      if (mobileMenu.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
      } else if (event.key === 'Tab') {
        const items = focusableElements();
        const first = items[0];
        const last = items[items.length - 1];
        if (!first) {
          event.preventDefault();
          mobileMenu.focus();
        } else if (event.shiftKey && (document.activeElement === first || !mobileMenu.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !mobileMenu.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener('focusin', event => {
      if (!mobileMenu.hidden && !mobileMenu.contains(event.target)) {
        (mobileClose || mobileMenu).focus();
      }
    });

    // Beim Wechsel zur Desktopnavigation keinen unsichtbaren Dialog offenlassen.
    const desktopNavigation = window.matchMedia('(min-width: 769px)');
    desktopNavigation.addEventListener('change', event => {
      if (event.matches) closeMenu();
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Alle schliessen
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // --- Kontaktformular (Formspree) ---
  const form = document.getElementById('interview-check-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const success = document.getElementById('form-success');
      const errorBox = document.getElementById('form-error');
      const submitBtn = form.querySelector('[type="submit"]');

      if (errorBox) errorBox.style.display = 'none';

      // Pflichtfelder prüfen
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const action = form.getAttribute('action') || '';

      // Solange noch keine echte Formspree-ID hinterlegt ist: Demo-Verhalten
      if (action.indexOf('IHRE_FORMULAR_ID') !== -1) {
        window.location.assign('danke.html?submitted=1');
        return;
      }

      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Wird gesendet …'; }

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          // Erfolg: Weiterleitung zur Danke-Seite. Die Conversion feuert dort
          // (einzige, eindeutige Quelle – keine Doppelzählung, kein Button-Klick-Tracking).
          window.location.assign('danke.html?submitted=1');
        } else {
          throw new Error('Formspree response not ok');
        }
      } catch (err) {
        if (errorBox) errorBox.style.display = 'block';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      }
    });
  }

  // --- Aktiven Nav-Link setzen ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
    if (currentPage === '' || currentPage === 'index.html') {
      if (href === 'index.html' || href === './') link.classList.add('active');
    }
  });

  // --- Smooth scroll für Anker-Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const fragment = this.getAttribute('href');
      if (!fragment || fragment === '#') return;
      const target = document.getElementById(fragment.slice(1));
      if (target) {
        e.preventDefault();
        if (window.location.hash !== fragment) window.history.pushState(null, '', fragment);
        const temporaryTabIndex = !target.hasAttribute('tabindex');
        if (temporaryTabIndex) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (temporaryTabIndex) {
          target.addEventListener('blur', function () { target.removeAttribute('tabindex'); }, { once: true });
        }
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  //  LESERFÜHRUNG
  // ============================================================
  const hasJS = document.documentElement.classList.contains('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lese-Fortschrittsanzeige
  const bar = document.createElement('div');
  bar.className = 'read-progress';
  document.body.appendChild(bar);

  const scrollCue = (function () {
    if (reduce) return null;
    const heroC = document.querySelector('.hero .container');
    if (!heroC) return null;
    const cue = document.createElement('div');
    cue.className = 'hero-scrollcue';
    cue.setAttribute('aria-hidden', 'true');
    cue.innerHTML = '<span>Weiterlesen</span><i></i>';
    heroC.appendChild(cue);
    return cue;
  })();

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const y = window.scrollY || h.scrollTop;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (scrollCue) scrollCue.classList.toggle('gone', y > 40);
    const nav = document.querySelector('.site-nav');
    if (nav) nav.classList.toggle('nav-scrolled', y > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Geführte Einblendung der Abschnitte
  if (hasJS && !reduce && 'IntersectionObserver' in window) {
    document.querySelectorAll('.section > .container').forEach(c => c.classList.add('reveal-group'));
    document.querySelectorAll('.leitsatz').forEach(c => c.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });

    document.querySelectorAll('.reveal, .reveal-group').forEach(el => io.observe(el));
  }

  // ============================================================
  //  LIGHTBOX – Grafik zum Vergrössern (Klick / Tastatur / Esc)
  // ============================================================
  (function () {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    const lbImg = document.getElementById('lightboxImg');
    const closeBtn = lb.querySelector('.lightbox-close');
    let lastFocus = null;

    function open(src, alt) {
      lastFocus = document.activeElement;
      lbImg.src = src;
      lbImg.alt = alt || '';
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => lb.classList.add('open'));
      closeBtn.focus();
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      const done = () => {
        lb.hidden = true;
        lbImg.src = '';
        lb.removeEventListener('transitionend', done);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      };
      if (reduce) { done(); } else { lb.addEventListener('transitionend', done); }
    }

    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const src = trigger.getAttribute('data-lightbox');
        const img = trigger.querySelector('img');
        open(src, img ? img.alt : '');
      });
    });

    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lb.hidden) close();
    });
  })();

  // --- Conversion 2: Click-to-Call – alle tel:-Links, Link wird nicht blockiert ---
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="tel:"]');
    if (!link) return;
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to':  'AW-16692093930/Q5Z9CI3WjckcEOrHtJc-',
        'value':    1.00,
        'currency': 'CHF',
        'event_callback': function () {}   // kein Redirect-Block nötig bei tel:
      });
    }
    // Link öffnet ganz normal weiter (kein e.preventDefault())
  });

  // ============================================================
  //  HERO-BLICKFÄNGER – Frage → geordnete Antwort (Zyklus)
  // ============================================================
  const sig = document.getElementById('heroSignature');
  if (sig && !reduce) {
    const qEl = document.getElementById('sigQuestion');
    const stepsEl = document.getElementById('sigSteps');

    const data = [
      { pre: 'Wie erkläre ich, ', hi: 'warum ich gekündigt wurde?', steps: [
        ['Was ist passiert?', 'Sachlich, ohne Rechtfertigung.'],
        ['Was bedeutet das heute?', 'Kontext statt Ausrede.'],
        ['Warum passe ich zur Stelle?', 'Passung sichtbar machen.'] ] },
      { pre: 'Was sage ich zu ', hi: 'der Lücke im Lebenslauf?', steps: [
        ['Was war in der Zeit?', 'Ruhig einordnen, nicht ausweichen.'],
        ['Was zählt heute?', 'Den roten Faden zeigen.'],
        ['Warum jetzt diese Stelle?', 'Den nächsten Schritt begründen.'] ] },
      { pre: 'Wie gehe ich mit ', hi: 'der Lohnfrage um?', steps: [
        ['Was ist marktüblich?', 'Eine realistische Spanne kennen.'],
        ['Was ist mein Wert?', 'Erfahrung konkret benennen.'],
        ['Wann nenne ich die Zahl?', 'Das Timing bewusst wählen.'] ] },
      { pre: 'Bin ich nicht ', hi: 'überqualifiziert für die Stelle?', steps: [
        ['Was steckt dahinter?', 'Die echte Sorge erkennen.'],
        ['Was biete ich?', 'Stabilität und Erfahrung.'],
        ['Warum will ich genau das?', 'Die Motivation glaubhaft machen.'] ] }
    ];

    let idx = 0;
    function show(d) {
      qEl.innerHTML = '«' + d.pre + '<span>' + d.hi + '</span>»';
      stepsEl.innerHTML = '<span class="sig-thread"></span>' + d.steps.map((s, i) =>
        '<div class="sig-step"><div class="sig-step-n">' + (i + 1) + '</div>' +
        '<p><strong>' + s[0] + '</strong>' + s[1] + '</p></div>').join('');
      void stepsEl.offsetWidth; // reflow
      qEl.classList.remove('sig-fade-out');
      stepsEl.classList.add('in');
      const steps = stepsEl.querySelectorAll('.sig-step');
      steps.forEach((st, i) => setTimeout(() => st.classList.add('in'), 280 + i * 240));
    }
    function next() {
      if (document.hidden) return;
      qEl.classList.add('sig-fade-out');
      stepsEl.classList.remove('in');
      stepsEl.querySelectorAll('.sig-step').forEach(st => st.classList.remove('in'));
      setTimeout(() => { idx = (idx + 1) % data.length; show(data[idx]); }, 560);
    }
    sig.classList.add('animate');
    show(data[0]);
    setInterval(next, 5200);
  }

  // ============================================================
  //  3D-MAUS-NEIGUNG (nur Zeigegeräte, nicht Touch)
  // ============================================================
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const TILT = '.decision-card, .price-card, .blog-card, .hero-signature';
    document.querySelectorAll(TILT).forEach(card => {
      card.classList.add('tilt-card');
      card.style.transition = 'transform 0.3s var(--ease), box-shadow 0.3s var(--ease)';
      let raf = null;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const max = 4.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform =
            'perspective(950px) rotateX(' + (-py * max).toFixed(2) + 'deg) rotateY(' +
            (px * max).toFixed(2) + 'deg) translateY(-3px)';
        });
      });
      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  // ============================================================
  //  ANFRAGE-HANDOFF – Angebot und vorhandene Beschreibung übernehmen.
  //  a ist eine feste Angebotsauswahl; d/s/u bleiben als bestehende Übergabe erhalten.
  // ============================================================
  var beschreibungEl = document.getElementById('beschreibung');
  if (beschreibungEl) {
    var params = new URLSearchParams(window.location.search);
    var d = params.get('d');
    var s = params.get('s');
    var u = params.get('u');
    var requestedOfferKey = params.get('a');
    var allowedOffers = {
      interview: {
        name: 'Interview-Training 40+',
        price: 'CHF 240',
        situation: 'Interview steht fest',
        intro: 'Schildern Sie kurz Ihre Situation und die Zielstelle. Artem meldet sich persönlich, um Umfang und Termin mit Ihnen abzustimmen.',
        button: 'Interview-Training anfragen'
      },
      basis: {
        name: 'Bewerbungsbasis 40+',
        price: 'CHF 690',
        situation: 'Ich benötige Bewerbungsunterlagen',
        intro: 'Schildern Sie kurz Ihre Zielrolle und Ihre Ausgangslage. Artem meldet sich persönlich, um den Umfang und die benötigten Unterlagen mit Ihnen abzustimmen.',
        button: 'Bewerbungsbasis anfragen'
      }
    };
    var requestedOffer = Object.prototype.hasOwnProperty.call(allowedOffers, requestedOfferKey)
      ? allowedOffers[requestedOfferKey] : null;
    var inquiryCard = document.querySelector('.form-card');
    var inquirySituation = document.getElementById('anliegen');
    if (requestedOffer && inquiryCard) {
      var offerSummary = document.getElementById('angebot-summary');
      var offerContext = document.getElementById('angebot-context');
      var offerField = document.getElementById('angebot');
      var offerLabel = requestedOffer.name + ' · ' + requestedOffer.price;
      if (offerSummary) offerSummary.textContent = offerLabel;
      if (offerContext) offerContext.hidden = false;
      if (offerField) {
        offerField.value = offerLabel;
        offerField.disabled = false;
      }
      var inquiryHeading = inquiryCard.querySelector('h3');
      if (inquiryHeading) inquiryHeading.textContent = requestedOffer.name + ' anfragen';
      var inquiryIntro = inquiryCard.querySelector('.form-intro');
      if (inquiryIntro) inquiryIntro.textContent = requestedOffer.intro;
      var inquiryButton = inquiryCard.querySelector('.form-submit');
      if (inquiryButton) inquiryButton.textContent = requestedOffer.button;
      var inquirySubject = inquiryCard.querySelector('input[name="_subject"]');
      if (inquirySubject) inquirySubject.value = requestedOffer.name + ' – Anfrage über AS-Bewerbung.ch';
      if (inquirySituation && !inquirySituation.value) inquirySituation.value = requestedOffer.situation;
    }
    if (d || s || u) {
      if (d) beschreibungEl.value = d;
      var situationEl = document.getElementById('situation');
      if (s && situationEl) {
        Array.prototype.forEach.call(situationEl.options, function (opt) {
          if (opt.value === s || opt.textContent.trim() === s) situationEl.value = opt.value || opt.textContent.trim();
        });
      }
      var unsicherheitEl = document.getElementById('unsicherheit');
      if (u && unsicherheitEl) {
        Array.prototype.forEach.call(unsicherheitEl.options, function (opt) {
          if (opt.value === u || opt.textContent.trim() === u) unsicherheitEl.value = opt.value || opt.textContent.trim();
        });
      }
      // ============================================================
      //  WORKBOOK-BESTELLUNG: Formularkontext anpassen
      //  Wenn via Workbook-Bestelllink mit Bestelltext im d-Parameter
      // ============================================================
      if (!requestedOffer && d && d.indexOf('Workbook') !== -1 && d.indexOf('bestellen') !== -1) {
        var formCard = document.querySelector('.form-card');
        if (formCard) {
          var h3 = formCard.querySelector('h3');
          if (h3) h3.textContent = 'Workbook bestellen – 49 CHF';
          var intro = formCard.querySelectorAll('.form-intro');
          if (intro[0]) intro[0].textContent = 'Hinterlassen Sie Ihren Namen und Ihre E-Mail-Adresse. Artem sendet Ihnen die Zahlungsangaben (TWINT oder Rechnung) – danach erhalten Sie das PDF in der Regel noch am selben Werktag.';
          if (intro[1]) intro[1].style.display = 'none';
          var submit = formCard.querySelector('.form-submit');
          if (submit) submit.textContent = 'Workbook bestellen';
          var subjectInput = formCard.querySelector('input[name="_subject"]');
          if (subjectInput) subjectInput.value = 'Workbook-Bestellung – AS-Bewerbung.ch';
        }
      }
    }

    // Sichtbare Formularzustände auch nach einer Vorauswahl aktuell halten.
    var dateField = document.getElementById('datumFeld');
    if (inquirySituation && dateField) {
      var updateDateField = function () {
        dateField.hidden = inquirySituation.value !== 'Interview steht fest';
      };
      inquirySituation.addEventListener('change', updateDateField);
      updateDateField();
    }
    var descriptionCount = document.getElementById('beschreibungCount');
    if (descriptionCount) {
      var updateDescriptionCount = function () { descriptionCount.textContent = beschreibungEl.value.length; };
      beschreibungEl.addEventListener('input', updateDescriptionCount);
      updateDescriptionCount();
    }

    if (requestedOffer || d || s || u) {
      var scrollTarget = inquiryCard;
      if (scrollTarget) {
        window.requestAnimationFrame(function () {
          scrollTarget.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        });
      }
    }
  }

});
