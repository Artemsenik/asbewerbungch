// Gemeinsame Komponenten für alle Seiten

const NAV_HTML = `
<nav class="site-nav" role="navigation" aria-label="Hauptnavigation">
  <div class="container nav-inner">
    <a href="index.html" class="nav-logo"><img src="assets/img/logo-vogel.png" alt="" width="600" height="600" class="nav-mark" aria-hidden="true"><span>AS-Bewerbung.ch</span></a>
    <ul class="nav-links" role="list">
      <li><a href="angebote.html">Angebote</a></li>
      <li><a href="ratgeber.html">Ratgeber</a></li>
      <li><a href="ueber-artem.html">Über Artem</a></li>
    </ul>
    <a href="interview-check.html" class="btn btn-primary nav-cta">Kostenlos starten</a>
    <button class="nav-toggle" id="nav-toggle" aria-label="Menü öffnen">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation">
  <div class="mobile-menu-header">
    <a href="index.html" class="nav-logo"><img src="assets/img/logo-vogel.png" alt="" width="600" height="600" class="nav-mark" aria-hidden="true"><span>AS-Bewerbung.ch</span></a>
    <button class="mobile-menu-close" id="mobile-close" aria-label="Menü schliessen">✕</button>
  </div>
  <nav>
    <a href="index.html">Startseite</a>
    <a href="angebote.html">Angebote &amp; Preise</a>
    <a href="diagnose.html">2-Minuten-Diagnose (kostenlos)</a>
    <a href="antwort.html">Antwort-Werkstatt (kostenlos)</a>
    <a href="ratgeber.html">Ratgeber</a>
    <a href="ueber-artem.html">Über Artem Senik</a>
    <a href="faq.html">FAQ</a>
  </nav>
  <a href="interview-check.html" class="btn btn-primary">Kostenlose Ersteinschätzung erhalten</a>
</div>
`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo"><img src="assets/img/logo-vogel-weiss.png" alt="" width="600" height="600" class="footer-mark" aria-hidden="true"><span>AS-Bewerbung.ch</span></div>
        <p>Bewerbungsarchitekt für Menschen 40+ in der Schweiz. Online. Klar strukturiert.</p>
      </div>
      <div class="footer-col">
        <h4>Angebote</h4>
        <ul>
          <li><a href="angebote.html">Alle Angebote &amp; Preise</a></li>
          <li><a href="vorstellungsgespraech.html">Vorstellungsgespräch 40+</a></li>
          <li><a href="interview-sicherheit.html">Interview-Sicherheit 40+</a></li>
          <li><a href="bewerbungsprozess.html">Bewerbungsprozess 40+</a></li>
          <li><a href="bewerbungsunterlagen.html">Bewerbungsunterlagen 40+</a></li>
          <li><a href="workbook.html">Workbook 40+ (49 CHF)</a></li>
          <li><a href="kurs.html">Interview-Kurs 40+ (bald)</a></li>
          <li><a href="interview-check.html">Interview-Check (kostenlos)</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Informationen</h4>
        <ul>
          <li><a href="ueber-artem.html">Über Artem Senik</a></li>
          <li><a href="ratgeber.html">Ratgeber</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="interview-check.html">Kontakt</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Rechtliches</h4>
        <ul>
          <li><a href="impressum.html">Impressum</a></li>
          <li><a href="datenschutz.html">Datenschutz</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 AS-Bewerbung.ch – Artem Senik</span>
      <span>Schweiz · Online · Deutsch</span>
    </div>
  </div>
</footer>

<div class="sticky-mobile-cta">
  <a href="tel:+41795148276" class="sticky-call">Anrufen</a>
  <a href="interview-check.html" class="sticky-main">Kostenlose Ersteinschätzung</a>
</div>
`;

// Komponenten einfügen
document.addEventListener('DOMContentLoaded', function () {
  const navTarget = document.getElementById('nav-placeholder');
  if (navTarget) navTarget.innerHTML = NAV_HTML;

  const footerTarget = document.getElementById('footer-placeholder');
  if (footerTarget) footerTarget.innerHTML = FOOTER_HTML;
});
