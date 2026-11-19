/* 主题切换：深空蓝（默认）/ 浅色 */
(function () {
  'use strict';
  var KEY = 'future-atlas-theme';

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme, persist) {
    var t = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    if (persist !== false) {
      try { localStorage.setItem(KEY, t); } catch (e) {}
    }
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', t === 'light' ? '切换到深色主题' : '切换到浅色主题');
      btn.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
      var icon = btn.querySelector('img');
      if (icon) icon.src = 'assets/icons/' + (t === 'light' ? 'ui-moon.svg' : 'ui-sun.svg');
    });
    document.dispatchEvent(new CustomEvent('atlas:themechange', { detail: { theme: t } }));
  }

  function toggle() { apply(current() === 'light' ? 'dark' : 'light'); }

  document.addEventListener('DOMContentLoaded', function () {
    apply(current(), false);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggle);
    });
  });

  window.AtlasTheme = { current: current, apply: apply, toggle: toggle, KEY: KEY };
})();
