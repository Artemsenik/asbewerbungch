// Gemeinsame Komponenten für alle Seiten

const NAV_HTML = `
<nav class="site-nav" role="navigation" aria-label="Hauptnavigation">
  <div class="container nav-inner">
    <a href="index.html" class="nav-logo"><img src="assets/img/logo-vogel.png" alt="" width="600" height="600" class="nav-mark" aria-hidden="true"><span>AS-Bewerbung.ch</span></a>
    <ul class="nav-links" role="list">
      <li><a href="fachbereiche.html">Fachbereiche</a></li>
      <li><a href="angebote.html">Leistungen</a></li>
      <li><a href="ratgeber.html">Kostenlos üben</a></li>
      <li><a href="ueber-artem.html">Über Artem</a></li>
    </ul>
    <a href="interview-check.html" class="btn btn-primary nav-cta">Gespräch anfragen</a>
    <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Menü öffnen" aria-expanded="false" aria-controls="mobile-menu" aria-haspopup="dialog">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation" aria-hidden="true" tabindex="-1" hidden inert>
  <div class="mobile-menu-header">
    <a href="index.html" class="nav-logo"><img src="assets/img/logo-vogel.png" alt="" width="600" height="600" class="nav-mark" aria-hidden="true"><span>AS-Bewerbung.ch</span></a>
    <button type="button" class="mobile-menu-close" id="mobile-close" aria-label="Menü schliessen">✕</button>
  </div>
  <nav aria-label="Mobile Hauptnavigation">
    <a href="index.html">Startseite</a>
    <a href="fachbereiche.html">Fachbereiche</a>
    <a href="angebote.html">Leistungen &amp; Preise</a>
    <a href="ratgeber.html">Kostenlos üben</a>
    <a href="erfahrung-ordnen.html">Erfahrung ordnen (kostenlos)</a>
    <a href="ueber-artem.html">Über Artem</a>
  </nav>
  <a href="interview-check.html" class="btn btn-primary">Gespräch anfragen</a>
</div>
`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo"><img src="assets/img/logo-vogel-weiss.png" alt="" width="600" height="600" class="footer-mark" aria-hidden="true"><span>AS-Bewerbung.ch</span></div>
        <p>Bewerbungshilfe für erfahrene Fachkräfte aus Technik und Industrie. Persönlich und online in der Schweiz.</p>
        <ul class="footer-social" role="list">
          <li>
            <a href="https://www.instagram.com/as_bewerbung.ch/" target="_blank" rel="noopener">
              <svg class="social-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"></circle>
              </svg>
              <span>Instagram</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Angebote</h4>
        <ul>
          <li><a href="angebote.html">Alle Angebote &amp; Preise</a></li>
          <li><a href="vorstellungsgespraech.html">Interview-Training 40+</a></li>
          <li><a href="bewerbungsunterlagen.html">Bewerbungsbasis 40+</a></li>
          <li><a href="workbook.html">Workbook 40+ · CHF 49</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Kostenlos</h4>
        <ul>
          <li><a href="erfahrung-ordnen.html">Erfahrung zur Stelle ordnen</a></li>
          <li><a href="antwort.html">Antwort-Werkstatt</a></li>
          <li><a href="ratgeber.html">Ratgeber</a></li>
          <li><a href="interview-check.html">Klarheitsgespräch (kostenlos)</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Kontakt &amp; Infos</h4>
        <ul>
          <li><a href="fachbereiche.html">Fachbereiche</a></li>
          <li><a href="ueber-artem.html">Über Artem</a></li>
          <li><a href="faq.html">Häufige Fragen</a></li>
          <li><a href="interview-check.html">Kontakt</a></li>
          <li><a href="tel:+41795148276">+41 79 514 82 76</a></li>
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
  <a href="interview-check.html" class="sticky-main">Kostenloses Klarheitsgespräch</a>
</div>
`;

// Komponenten einfügen
document.addEventListener('DOMContentLoaded', function () {
  const navTarget = document.getElementById('nav-placeholder');
  if (navTarget) navTarget.innerHTML = NAV_HTML;

  const footerTarget = document.getElementById('footer-placeholder');
  if (footerTarget) footerTarget.innerHTML = FOOTER_HTML;
});
