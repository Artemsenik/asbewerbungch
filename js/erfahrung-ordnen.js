(function () {
  'use strict';

  // All answers live in this document only. The helpers compose entered text;
  // they do not infer competence, assess suitability or contact any service.
  const AREAS = Object.freeze({
    technik: {
      label: 'Technik & Anlagen',
      requirementHint: 'Zum Beispiel: technische Änderungen bis zur Umsetzung koordinieren.',
      evidenceHint: 'Welches System oder Projekt? Welche Entscheidung lag bei Ihnen? Wie wurde die Lösung geprüft, und welches Ergebnis können Sie zeigen?',
      example: {
        requirement: 'Technische Änderungen nachvollziehbar umsetzen.',
        evidence: 'Bei einer Änderung an einer Baugruppe habe ich die betroffenen Zeichnungen abgeglichen, offene Punkte mit der Entwicklung geklärt und den freigegebenen Stand für die Fertigung dokumentiert.',
        status: 'Konkreter Beleg',
        question: 'Welche Änderungsprozesse und Systeme nutzt das neue Unternehmen?'
      }
    },
    software: {
      label: 'Software & digitale Systeme',
      requirementHint: 'Zum Beispiel: Softwareänderungen durch geeignete Tests absichern.',
      evidenceHint: 'Welche Funktion oder Infrastruktur? Was haben Sie selbst entwickelt oder entschieden? Welche Tests, Reviews oder Betriebsdaten belegen das Ergebnis?',
      example: {
        requirement: 'Softwareänderungen durch Tests absichern.',
        evidence: 'Für eine geänderte Schnittstelle habe ich Testfälle aus den Anforderungen abgeleitet, automatisierte Prüfungen ergänzt und die gefundenen Fehler mit dem Entwicklungsteam nachvollzogen. Die Ergebnisse sind im Testbericht dokumentiert.',
        status: 'Konkreter Beleg',
        question: 'Welche Testumgebung wird in der ausgeschriebenen Rolle verwendet?'
      }
    },
    qualitaet: {
      label: 'Qualität & regulierte Prozesse',
      requirementHint: 'Zum Beispiel: Abweichungen untersuchen und Massnahmen nachverfolgen.',
      evidenceHint: 'Welche Abweichung, Prüfung oder Änderung? Was war Ihr eigener Beitrag? Welche Dokumentation, Freigabe oder Nachverfolgung zeigt das Ergebnis?',
      example: {
        requirement: 'Abweichungen und Massnahmen nachvollziehbar bearbeiten.',
        evidence: 'Bei einer internen Abweichung habe ich die vorhandenen Prüfunterlagen zusammengetragen, die Ursachenklärung mit Produktion und Entwicklung koordiniert und die vereinbarten Massnahmen bis zur dokumentierten Prüfung nachverfolgt.',
        status: 'Konkreter Beleg',
        question: 'Welche regulatorischen Kenntnisse werden für diese konkrete Aufgabe vorausgesetzt?'
      }
    },
    einkauf: {
      label: 'Einkauf & Lieferkette',
      requirementHint: 'Zum Beispiel: Liefertermine abstimmen und Lieferfähigkeit absichern.',
      evidenceHint: 'Welche Beschaffung oder Lieferstörung? Was haben Sie selbst verhandelt, geprüft oder koordiniert? Welche Termine, Entscheidungen oder Ergebnisse sind dokumentiert?',
      example: {
        requirement: 'Lieferfähigkeit durch Abstimmung mit Lieferanten absichern.',
        evidence: 'In der Auftragsabwicklung habe ich Lieferengpässe gesammelt, Termine mit Lieferanten abgeglichen und die betroffenen internen Teams über bestätigte Änderungen informiert. Die Abstimmungen sind in den Auftragsunterlagen festgehalten.',
        status: 'Übertragbare Erfahrung',
        question: 'Für strategische Lieferantenauswahl war ich bisher nicht verantwortlich. Wie gross ist dieser Anteil in der neuen Rolle?'
      }
    },
    produktion: {
      label: 'Produktion & Verbesserung',
      requirementHint: 'Zum Beispiel: Fertigungsabläufe verbessern und Änderungen dokumentieren.',
      evidenceHint: 'Welche Anlage, welcher Ablauf oder welche Störung? Was haben Sie selbst verändert? Woran wurde das Ergebnis geprüft? Falls passend: Welche Verantwortung hatten Sie für Team, Kapazitäten oder Verbesserungen?',
      example: {
        requirement: 'Arbeitsabläufe in der Fertigung verbessern.',
        evidence: 'Für einen wiederkehrenden Montageschritt habe ich die einzelnen Handgriffe erfasst, gemeinsam mit der Schichtleitung eine geänderte Reihenfolge erprobt und den freigegebenen Ablauf in der Arbeitsanweisung festgehalten.',
        status: 'Konkreter Beleg',
        question: 'Ein Zeitgewinn wurde damals nicht gemessen. Welche anderen Ergebnisse kann ich nachvollziehbar belegen?'
      }
    },
    kommunikation: {
      label: 'Fachkommunikation & Schnittstellen',
      requirementHint: 'Zum Beispiel: Fachinhalte für Anwender, interne Kommunikation oder Schulungen verständlich aufbereiten.',
      evidenceHint: 'Welche Zielgruppe, welches Dokument, welche interne Kommunikation oder Schulung? Was haben Sie selbst strukturiert, vermittelt oder abgestimmt? Welche Prüfung oder Rückmeldung zeigt den Nutzen?',
      example: {
        requirement: 'Komplexe technische Abläufe verständlich dokumentieren.',
        evidence: 'Für eine Serviceanleitung habe ich technische Angaben mit Fachpersonen geprüft, Handlungsschritte neu geordnet und offene Punkte im Review geklärt. Die freigegebene Anleitung und die Review-Rückmeldungen zeigen meinen Beitrag.',
        status: 'Konkreter Beleg',
        question: 'Welche Zielgruppen, Freigaben und Redaktionssysteme gehören zur neuen Aufgabe?'
      }
    }
  });

  const STANDS = Object.freeze({
    konkret: {
      label: 'Konkreter Beleg',
      nextStep: 'Prüfen Sie, ob Ihr eigener Anteil und ein nachvollziehbares Ergebnis klar erkennbar sind. Bereiten Sie das Beispiel für Ihren Lebenslauf oder das Gespräch vor.'
    },
    uebertragbar: {
      label: 'Übertragbare Erfahrung',
      nextStep: 'Benennen Sie, was an Ihrer bisherigen Aufgabe vergleichbar ist und was sich in der neuen Stelle unterscheidet. Klären Sie, welche zusätzliche Erfahrung oder Einarbeitung nötig wäre.'
    },
    offen: {
      label: 'Noch zu klären',
      nextStep: 'Prüfen Sie den genauen Wortlaut der Anforderung. Suchen Sie einen passenden Beleg oder formulieren Sie die fachliche Lücke und eine konkrete Frage für das Gespräch.'
    }
  });

  const clean = value => typeof value === 'string' ? value.trim() : '';
  const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  function validArea(value) {
    return owns(AREAS, value) ? value : 'technik';
  }

  function areaFromSearch(search) {
    const values = new URLSearchParams(search || '').getAll('bereich');
    return values.length === 1 ? validArea(values[0]) : 'technik';
  }

  function emptyItems() {
    return Array.from({ length: 3 }, () => ({ requirement: '', evidence: '', status: 'offen', question: '' }));
  }

  function entryHasContent(item) {
    return Boolean(clean(item.requirement) || clean(item.evidence) || clean(item.question) || item.status !== 'offen');
  }

  function hasContent(items) {
    return items.some(entryHasContent);
  }

  function validateRequirements(items) {
    const errors = [];
    items.forEach((item, index) => {
      const requirement = clean(item.requirement);
      if (!requirement && entryHasContent(item)) {
        errors.push({ step: 1, field: 'match-requirement-' + index, message: 'Für Eintrag ' + (index + 1) + ' sind noch Angaben hinterlegt. Ergänzen Sie die Anforderung oder leeren Sie den gesamten Eintrag.' });
      }
      if (requirement.length > 500) {
        errors.push({ step: 1, field: 'match-requirement-' + index, message: 'Kürzen Sie Anforderung ' + (index + 1) + ' auf höchstens 500 Zeichen.' });
      }
    });
    if (!items.some(item => clean(item.requirement)) && errors.length === 0) {
      errors.push({ step: 1, field: 'match-requirement-0', message: 'Tragen Sie mindestens eine konkrete Anforderung aus Ihrer Stellenanzeige ein.' });
    }
    return errors;
  }

  function validateEvidence(items) {
    const errors = [];
    items.forEach((item, index) => {
      if (!clean(item.requirement)) return;
      if (!owns(STANDS, item.status)) {
        errors.push({ step: 2, field: 'match-status-' + index, message: 'Wählen Sie für Eintrag ' + (index + 1) + ' eine der drei Selbsteinschätzungen.' });
      }
      if ((item.status === 'konkret' || item.status === 'uebertragbar') && !clean(item.evidence)) {
        errors.push({ step: 2, field: 'match-evidence-' + index, message: 'Beschreiben Sie Ihre Erfahrung zu Eintrag ' + (index + 1) + ' oder wählen Sie «Noch zu klären».' });
      }
      if (clean(item.evidence).length > 2400) {
        errors.push({ step: 2, field: 'match-evidence-' + index, message: 'Kürzen Sie den Beleg zu Eintrag ' + (index + 1) + ' auf höchstens 2400 Zeichen.' });
      }
      if (clean(item.question).length > 600) {
        errors.push({ step: 2, field: 'match-question-' + index, message: 'Kürzen Sie die offene Frage zu Eintrag ' + (index + 1) + ' auf höchstens 600 Zeichen.' });
      }
    });
    return errors;
  }

  function createSummary(state) {
    const errors = validateRequirements(state.items).concat(validateEvidence(state.items));
    if (errors.length) return { ok: false, errors: errors };
    return {
      ok: true,
      area: AREAS[validArea(state.area)].label,
      entries: state.items.map((item, index) => ({
        number: index + 1,
        requirement: clean(item.requirement),
        evidence: clean(item.evidence) || 'Noch kein Beleg eingetragen.',
        status: STANDS[item.status].label,
        question: clean(item.question) || 'Keine offene Frage eingetragen.',
        nextStep: STANDS[item.status].nextStep
      })).filter(item => item.requirement)
    };
  }

  function toText(summary) {
    if (!summary.ok) throw new Error('Bitte zuerst die Angaben vervollständigen.');
    const sections = [
      'WELCHE ERFAHRUNG PASST ZUR STELLE?',
      'Bereich: ' + summary.area,
      'Eigene Angaben und Selbsteinschätzung. Die nächsten Schritte sind feste Hinweise zum gewählten Stand.'
    ];
    summary.entries.forEach(item => {
      sections.push([
        'ANFORDERUNG ' + item.number,
        item.requirement,
        '',
        'MEIN BELEG',
        item.evidence,
        '',
        'MEIN STAND · SELBST EINGESCHÄTZT',
        item.status,
        '',
        'OFFENE FRAGE',
        item.question,
        '',
        'NÄCHSTER SCHRITT · HINWEIS ZUM GEWÄHLTEN STAND',
        item.nextStep
      ].join('\n'));
    });
    return sections.join('\n\n');
  }

  // A small read-only interface allows isolated tests without a browser or DOM.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Object.freeze({ areaFromSearch, validArea, emptyItems, entryHasContent, hasContent, validateRequirements, validateEvidence, createSummary, toText });
  }
  if (typeof document === 'undefined') return;

  function initialise() {
    const app = document.getElementById('match-app');
    if (!app) return;

    const form = document.getElementById('match-form');
    const areaSelect = document.getElementById('match-area');
    const errorSummary = document.getElementById('match-error-summary');
    const live = document.getElementById('match-live');
    const results = document.getElementById('match-results');
    const copyButton = document.getElementById('match-copy');
    const copyPanel = document.getElementById('match-copy-panel');
    const copyText = document.getElementById('match-copy-text');
    const itemRefs = [];
    const state = { area: areaFromSearch(window.location.search), items: emptyItems(), step: 1 };
    let unloadProtection = false;

    function bindField(fragment, kind, index) {
      const field = fragment.querySelector('[data-match-field="' + kind + '"]');
      const label = fragment.querySelector('[data-match-label="' + kind + '"]');
      const hint = fragment.querySelector('[data-match-hint="' + kind + '"]');
      const error = fragment.querySelector('[data-match-error="' + kind + '"]');
      field.id = 'match-' + kind + '-' + index;
      label.htmlFor = field.id;
      error.id = field.id + '-error';
      const describedBy = [error.id];
      if (hint) {
        hint.id = field.id + '-hint';
        describedBy.unshift(hint.id);
      }
      field.setAttribute('aria-describedby', describedBy.join(' '));
      return field;
    }

    for (let index = 0; index < 3; index += 1) {
      const requirementCard = document.getElementById('match-requirement-template').content.firstElementChild.cloneNode(true);
      const evidenceCard = document.getElementById('match-evidence-template').content.firstElementChild.cloneNode(true);
      const requirement = bindField(requirementCard, 'requirement', index);
      const evidence = bindField(evidenceCard, 'evidence', index);
      const status = bindField(evidenceCard, 'status', index);
      const question = bindField(evidenceCard, 'question', index);
      const requirementLabel = requirementCard.querySelector('[data-match-label="requirement"]');
      requirementLabel.textContent = 'Anforderung ' + (index + 1) + (index > 0 ? ' (optional)' : '');
      evidenceCard.querySelector('[data-match-legend]').textContent = 'Anforderung ' + (index + 1);
      const clearButton = requirementCard.querySelector('[data-match-clear]');
      clearButton.setAttribute('aria-label', 'Anforderung ' + (index + 1) + ' und alle zugehörigen Angaben leeren');
      clearButton.addEventListener('click', () => clearEntry(index));
      itemRefs.push({ requirement, evidence, status, question, requirementCard, evidenceCard, clearButton });
      document.getElementById('match-requirement-fields').appendChild(requirementCard);
      document.getElementById('match-evidence-fields').appendChild(evidenceCard);
    }

    areaSelect.value = state.area;

    function readInputs() {
      state.area = validArea(areaSelect.value);
      state.items = itemRefs.map(ref => ({
        requirement: ref.requirement.value,
        evidence: ref.evidence.value,
        status: ref.status.value,
        question: ref.question.value
      }));
    }

    function announce(message) {
      live.textContent = message;
    }

    function beforeUnload(event) {
      readInputs();
      if (!hasContent(state.items)) return;
      event.preventDefault();
      event.returnValue = '';
    }

    function updateContentState() {
      state.items.forEach((item, index) => { itemRefs[index].clearButton.hidden = !entryHasContent(item); });
      const protect = hasContent(state.items);
      if (protect && !unloadProtection) window.addEventListener('beforeunload', beforeUnload);
      if (!protect && unloadProtection) window.removeEventListener('beforeunload', beforeUnload);
      unloadProtection = protect;
    }

    function updateHints() {
      const area = AREAS[state.area];
      itemRefs.forEach(ref => {
        ref.requirement.placeholder = area.requirementHint.replace('Zum Beispiel: ', 'z. B. ');
        ref.requirementCard.querySelector('[data-match-hint="requirement"]').textContent = area.requirementHint;
        ref.evidenceCard.querySelector('[data-match-hint="evidence"]').textContent = area.evidenceHint;
      });
      ['requirement', 'evidence', 'status', 'question'].forEach(key => {
        document.getElementById('match-example-' + key).textContent = area.example[key];
      });
    }

    function renderEvidence() {
      state.items.forEach((item, index) => {
        const ref = itemRefs[index];
        ref.evidenceCard.hidden = !clean(item.requirement);
        ref.evidenceCard.querySelector('[data-match-requirement-preview]').textContent = item.requirement;
      });
    }

    function showStep(step, moveFocus) {
      state.step = step;
      for (let number = 1; number <= 3; number += 1) {
        document.getElementById('match-step-' + number).hidden = number !== step;
      }
      app.querySelectorAll('[data-match-step]').forEach(button => {
        if (Number(button.dataset.matchStep) === step) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      if (step !== 3) copyPanel.hidden = true;
      if (moveFocus) {
        const heading = document.getElementById('match-heading-' + step);
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    }

    function clearErrors() {
      errorSummary.hidden = true;
      errorSummary.textContent = '';
      form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
      form.querySelectorAll('.match-field-error').forEach(error => {
        error.textContent = '';
        error.hidden = true;
      });
    }

    function showErrors(errors) {
      renderEvidence();
      showStep(errors[0].step, false);
      errors.forEach(error => {
        const field = document.getElementById(error.field);
        const message = document.getElementById(error.field + '-error');
        field.setAttribute('aria-invalid', 'true');
        message.textContent = error.message;
        message.hidden = false;
      });
      errorSummary.textContent = errors[0].message;
      errorSummary.hidden = false;
      const firstField = document.getElementById(errors[0].field);
      firstField.focus({ preventScroll: true });
      firstField.scrollIntoView({ block: 'center', behavior: 'auto' });
      announce('');
    }

    function renderSummary(summary) {
      results.replaceChildren();
      document.getElementById('match-result-area').textContent = summary.area;
      summary.entries.forEach(item => {
        const card = document.getElementById('match-result-template').content.firstElementChild.cloneNode(true);
        card.querySelector('[data-match-result-number]').textContent = 'Anforderung ' + item.number;
        ['requirement', 'evidence', 'status', 'question', 'nextStep'].forEach(key => {
          card.querySelector('[data-match-result="' + key + '"]').textContent = item[key];
        });
        results.appendChild(card);
      });
      copyText.value = toText(summary);
    }

    function goToStep(step) {
      readInputs();
      clearErrors();
      updateContentState();
      if (step > 1) {
        const errors = validateRequirements(state.items);
        if (errors.length) { showErrors(errors); return; }
      }
      if (step === 2) renderEvidence();
      if (step === 3) {
        const summary = createSummary(state);
        if (!summary.ok) { showErrors(summary.errors); return; }
        renderSummary(summary);
        announce('Ihre Übersicht wurde aus Ihren aktuellen Angaben erstellt.');
      } else announce('');
      showStep(step, true);
    }

    function prepareExport() {
      // Read the fields again, including previously hidden steps. This prevents
      // exporting a stale summary after back-navigation, undo or autofill.
      readInputs();
      clearErrors();
      const summary = createSummary(state);
      if (!summary.ok) { showErrors(summary.errors); return null; }
      renderSummary(summary);
      return toText(summary);
    }

    function openManualCopy(text, message) {
      copyText.value = text;
      copyPanel.hidden = false;
      copyText.focus();
      copyText.select();
      copyText.setSelectionRange(0, copyText.value.length);
      announce(message);
    }

    async function copyResult() {
      const text = prepareExport();
      if (text === null) return;
      copyButton.disabled = true;
      copyButton.textContent = 'Wird kopiert …';
      try {
        if (!window.navigator.clipboard || typeof window.navigator.clipboard.writeText !== 'function') {
          openManualCopy(text, 'Automatisches Kopieren ist hier nicht verfügbar. Sie können den vollständigen Text im geöffneten Feld manuell kopieren.');
          return;
        }
        await window.navigator.clipboard.writeText(text);
        copyPanel.hidden = true;
        announce('Die Übersicht wurde in Ihre Zwischenablage kopiert.');
      } catch (error) {
        openManualCopy(text, 'Automatisches Kopieren war nicht möglich. Sie können den vollständigen Text im geöffneten Feld manuell kopieren.');
      } finally {
        copyButton.disabled = false;
        copyButton.textContent = 'Übersicht kopieren';
      }
    }

    function downloadResult() {
      const text = prepareExport();
      if (text === null) return;
      try {
        const blob = new window.Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'as-bewerbung-erfahrung-ordnen.txt';
        anchor.hidden = true;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        announce('Der Download wurde gestartet. Bitte prüfen Sie die Downloads Ihres Geräts.');
      } catch (error) {
        openManualCopy(text, 'Der Download konnte nicht gestartet werden. Kopieren Sie Ihre Übersicht stattdessen aus dem geöffneten Textfeld.');
      }
    }

    function clearEntry(index) {
      readInputs();
      if (entryHasContent(state.items[index]) && !window.confirm('Anforderung ' + (index + 1) + ' und alle zugehörigen Erfahrungen und offenen Fragen löschen?')) return;
      const ref = itemRefs[index];
      ref.requirement.value = '';
      ref.evidence.value = '';
      ref.question.value = '';
      ref.status.value = 'offen';
      readInputs();
      clearErrors();
      updateContentState();
      ref.requirement.focus();
      announce('Eintrag ' + (index + 1) + ' wurde geleert.');
    }

    function resetExercise() {
      readInputs();
      if (hasContent(state.items) && !window.confirm('Alle eingetragenen Anforderungen, Erfahrungen und offenen Fragen löschen und neu beginnen?')) return;
      const area = state.area;
      form.reset();
      areaSelect.value = area;
      copyText.value = '';
      results.replaceChildren();
      document.body.classList.remove('match-print-ready');
      readInputs();
      clearErrors();
      updateHints();
      updateContentState();
      showStep(1, true);
      announce('Die Einträge sind geleert. Sie können neu beginnen.');
    }

    function onEdit(event) {
      readInputs();
      updateContentState();
      document.body.classList.remove('match-print-ready');
      const field = event.target;
      if (field.id && field.hasAttribute('aria-invalid')) {
        field.removeAttribute('aria-invalid');
        const message = document.getElementById(field.id + '-error');
        if (message) { message.textContent = ''; message.hidden = true; }
      }
      errorSummary.hidden = true;
      if (field === areaSelect) {
        updateHints();
        announce('Die Eingabehilfen sind auf ' + AREAS[state.area].label + ' eingestellt. Ihre Einträge bleiben erhalten.');
      }
      if (state.step === 3) {
        const summary = createSummary(state);
        if (summary.ok) renderSummary(summary);
      }
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      goToStep(Math.min(state.step + 1, 3));
    });
    form.addEventListener('input', onEdit);
    form.addEventListener('change', onEdit);
    app.querySelectorAll('[data-match-step]').forEach(button => {
      button.addEventListener('click', () => goToStep(Number(button.dataset.matchStep)));
    });
    app.querySelectorAll('[data-match-back]').forEach(button => {
      button.addEventListener('click', () => goToStep(Number(button.dataset.matchBack)));
    });
    document.getElementById('match-to-evidence').addEventListener('click', () => goToStep(2));
    document.getElementById('match-to-summary').addEventListener('click', () => goToStep(3));
    copyButton.addEventListener('click', copyResult);
    document.getElementById('match-download').addEventListener('click', downloadResult);
    document.getElementById('match-reset').addEventListener('click', resetExercise);
    document.getElementById('match-select-text').addEventListener('click', () => {
      const text = prepareExport();
      if (text !== null) openManualCopy(text, 'Der Text ist markiert. Nutzen Sie jetzt die Kopierfunktion Ihres Geräts.');
    });
    document.getElementById('match-close-copy').addEventListener('click', () => {
      copyPanel.hidden = true;
      copyButton.focus();
    });
    document.getElementById('match-print').addEventListener('click', () => {
      if (prepareExport() === null) return;
      document.body.classList.add('match-print-ready');
      window.print();
    });
    window.addEventListener('beforeprint', () => {
      readInputs();
      const summary = createSummary(state);
      document.body.classList.toggle('match-print-ready', summary.ok);
      if (summary.ok) renderSummary(summary);
    });
    window.addEventListener('afterprint', () => document.body.classList.remove('match-print-ready'));

    updateHints();
    updateContentState();
    showStep(1, false);
    app.hidden = false;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();
}());
