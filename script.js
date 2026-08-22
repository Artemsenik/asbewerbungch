// AS-Bewerbung.ch – Interaktionen

document.addEventListener('DOMContentLoaded', function () {

  // --- Mobile Menü ---
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  // Menü schliessen bei Link-Klick
  document.querySelectorAll('.mobile-menu nav a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu && mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

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
          // Art der Anfrage mitgeben, damit danke.html das passende Ereignis melden kann.
          var artFeld = form.querySelector('[name="anliegen"]');
          var artParam = '';
          if (artFeld && artFeld.value) {
            var aq = new URLSearchParams(window.location.search).get('a');
            var art = aq === 'basis' ? 'basis' : (aq === 'interview' ? 'interview' : 'klarheit');
            artParam = '&art=' + encodeURIComponent(art);
          }
          window.location.assign('danke.html?submitted=1' + artParam);
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
    if (href === currentPage) link.classList.add('active');
    if (currentPage === '' || currentPage === 'index.html') {
      if (href === 'index.html' || href === './') link.classList.add('active');
    }
  });

  // --- Smooth scroll für Anker-Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  //  HANDOFF – prefillt das Freitextfeld auf interview-check.html
  //  aus dem URL-Parameter d (Beschreibung), z. B. aus der Antwort-Werkstatt
  //  oder aus der Workbook-Bestellung.
  // ============================================================
  var beschreibungEl = document.getElementById('beschreibung');
  if (beschreibungEl) {
    var params = new URLSearchParams(window.location.search);
    var d = params.get('d');
    if (d) {
      beschreibungEl.value = d.slice(0, 500);
      var cnt = document.getElementById('beschreibungCount');
      if (cnt) cnt.textContent = beschreibungEl.value.length;
      // ============================================================
      //  WORKBOOK-BESTELLUNG: Formularkontext anpassen
      // ============================================================
      if (d && d.indexOf('Workbook') !== -1 && d.indexOf('bestellen') !== -1) {
        var wbCard = document.querySelector('.form-card');
        if (wbCard) {
          var wbH3 = wbCard.querySelector('h3');
          if (wbH3) wbH3.textContent = 'Workbook bestellen – 49 CHF';
          var wbIntro = wbCard.querySelector('.form-intro');
          if (wbIntro) wbIntro.textContent = 'Hinterlassen Sie Ihren Namen und Ihre E-Mail-Adresse. Artem sendet Ihnen die Zahlungsangaben (TWINT oder Rechnung) – danach erhalten Sie das PDF in der Regel noch am selben Werktag.';
          var wbSubmit = wbCard.querySelector('.form-submit');
          if (wbSubmit) wbSubmit.textContent = 'Workbook bestellen';
          var wbSubject = wbCard.querySelector('input[name="_subject"]');
          if (wbSubject) wbSubject.value = 'Workbook-Bestellung – AS-Bewerbung.ch';
        }
      }

      var scrollTarget = document.querySelector('.form-card');
      if (scrollTarget) {
        window.requestAnimationFrame(function () {
          scrollTarget.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        });
      }

    }
  }

});

/* ============================================================
   KLARHEITSGESPRÄCH-FORMULAR + CONVERSION-EVENTS 2026
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  function ev(name, params) {
    if (typeof gtag === 'function') {
      try { gtag('event', name, params || {}); } catch (e) {}
    }
  }

  // --- offer_view: Angebotssektion wird tatsächlich sichtbar ---
  var offerSection = document.getElementById('angebote');
  if (offerSection && 'IntersectionObserver' in window) {
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !seen) {
          seen = true;
          ev('offer_view', { seite: document.location.pathname.split('/').pop() || 'index.html' });
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(offerSection);
  }

  // --- CTA-Klicks (Event-Delegation, feuert nur bei echtem Klick) ---
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cta]');
    if (!a) return;
    var kind = a.getAttribute('data-cta');
    if (kind === 'interview') ev('cta_interview_click', { angebot: 'interview-training-40plus' });
    else if (kind === 'basis')  ev('cta_basis_click',     { angebot: 'bewerbungsbasis-40plus' });
    else if (kind === 'clarity') ev('clarity_booking_start', { quelle: document.location.pathname.split('/').pop() || 'index.html' });
  });

  // --- Klarheitsformular: bedingtes Datumsfeld, Zähler, form_start ---
  var form = document.getElementById('interview-check-form');
  if (!form) return;

  var anliegen = document.getElementById('anliegen');
  var datumFeld = document.getElementById('datumFeld');
  if (anliegen && datumFeld) {
    var syncDatum = function () {
      var show = anliegen.value === 'Interview steht fest';
      datumFeld.hidden = !show;
      if (!show) { var di = document.getElementById('datum'); if (di) di.value = ''; }
    };
    anliegen.addEventListener('change', syncDatum);
    syncDatum();
  }

  var ta = document.getElementById('beschreibung');
  var counter = document.getElementById('beschreibungCount');
  if (ta && counter) {
    var syncCount = function () { counter.textContent = ta.value.length; };
    ta.addEventListener('input', syncCount);
    syncCount();
  }

  // form_start: einmalig bei erster echter Eingabe
  var started = false;
  form.addEventListener('input', function () {
    if (started) return;
    started = true;
    var isBasis = new URLSearchParams(window.location.search).get('a') === 'basis';
    ev(isBasis ? 'basis_form_start' : 'clarity_form_start');
  });

  // Angebots-Vorauswahl aus ?a=interview / ?a=basis
  var a = new URLSearchParams(window.location.search).get('a');
  if (a && anliegen) {
    var card = document.querySelector('.form-card');
    if (a === 'interview') {
      anliegen.value = 'Interview steht fest';
      anliegen.dispatchEvent(new Event('change'));
      if (card) {
        var h = card.querySelector('h3'); if (h) h.textContent = 'Interview-Training 40+ anfragen';
        var i = card.querySelector('.form-intro'); if (i) i.textContent = 'Schildern Sie kurz Ihre Situation und die Zielstelle. Artem meldet sich mit den möglichen Terminen und den nächsten Schritten – die Zahlung erfolgt erst nach der Terminbestätigung.';
        var s = card.querySelector('.form-submit'); if (s) s.textContent = 'Interview-Training anfragen';
        var su = card.querySelector('input[name="_subject"]'); if (su) su.value = 'Interview-Training 40+ – Anfrage über AS-Bewerbung.ch';
      }
    } else if (a === 'basis') {
      anliegen.value = 'Ich erhalte keine Einladungen';
      anliegen.dispatchEvent(new Event('change'));
      if (card) {
        var h2 = card.querySelector('h3'); if (h2) h2.textContent = 'Bewerbungsbasis 40+ anfragen';
        var i2 = card.querySelector('.form-intro'); if (i2) i2.textContent = 'Schildern Sie kurz Ihre Zielrolle und Ihre Ausgangslage. Artem meldet sich mit den nächsten Schritten und der Liste der benötigten Unterlagen.';
        var s2 = card.querySelector('.form-submit'); if (s2) s2.textContent = 'Bewerbungsbasis anfragen';
        var su2 = card.querySelector('input[name="_subject"]'); if (su2) su2.value = 'Bewerbungsbasis 40+ – Anfrage über AS-Bewerbung.ch';
      }
    }
  }
});
