// Beispiele bleiben ohne JavaScript vollständig lesbar.
// Mit JavaScript entsteht eine per Tastatur bedienbare Auswahl.
document.addEventListener('DOMContentLoaded', function () {
  const tabList = document.querySelector('[data-example-tabs]');
  const examples = document.querySelector('.start-examples');
  if (!tabList || !examples) return;
  const tabs = Array.from(tabList.querySelectorAll('[data-example]'));
  const panels = Array.from(examples.querySelectorAll('[data-example-panel]'));
  if (!tabs.length || tabs.length !== panels.length) return;

  function activate(tab, moveFocus) {
    const selected = tab.dataset.example;
    tabs.forEach(function (button) {
      const active = button === tab;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.dataset.examplePanel !== selected;
    });
    if (moveFocus) tab.focus();
  }

  tabList.setAttribute('role', 'tablist');
  tabs.forEach(function (tab, index) {
    const panel = panels.find(function (p) { return p.dataset.examplePanel === tab.dataset.example; });
    if (!panel) return;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', function () { activate(tab, false); });
    tab.addEventListener('keydown', function (event) {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next], true);
    });
  });
  examples.classList.add('is-enhanced');
  activate(tabs[0], false);
  tabList.hidden = false;
});
