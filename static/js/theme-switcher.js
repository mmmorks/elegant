/*!
 * Color mode toggler for Bootstrap 5.3+
 * Cycles through light, dark, and auto modes with localStorage persistence
 */

(() => {
  'use strict';

  const getStoredTheme = () => localStorage.getItem('theme');
  const setStoredTheme = theme => localStorage.setItem('theme', theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }
    return 'auto';
  };

  const setTheme = theme => {
    if (theme === 'auto') {
      const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-bs-theme', preferredTheme);
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  };

  const getThemeIcon = (theme) => {
    const icons = {
      'light': 'bi bi-sun-fill',
      'dark': 'bi bi-moon-stars-fill',
      'auto': 'bi bi-circle-half'
    };
    return icons[theme];
  };

  const getNextTheme = (currentTheme) => {
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    return themes[nextIndex];
  };

  // Set theme before page renders to avoid flash
  setTheme(getPreferredTheme());

  const updateThemeButton = (theme) => {
    const themeSwitcher = document.querySelector('#bd-theme');
    const themeIcon = document.querySelector('.theme-icon');

    if (!themeSwitcher || !themeIcon) {
      return;
    }

    themeIcon.className = 'theme-icon ' + getThemeIcon(theme);
    themeSwitcher.setAttribute('aria-label', `Toggle theme (${theme})`);
    themeSwitcher.setAttribute('title', `Current theme: ${theme}. Click to cycle.`);
  };

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme();
    if (storedTheme === 'auto') {
      setTheme('auto');
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    const currentTheme = getPreferredTheme();
    updateThemeButton(currentTheme);

    const themeSwitcher = document.querySelector('#bd-theme');
    if (themeSwitcher) {
      themeSwitcher.addEventListener('click', () => {
        const currentTheme = getStoredTheme() || 'auto';
        const nextTheme = getNextTheme(currentTheme);

        setStoredTheme(nextTheme);
        setTheme(nextTheme);
        updateThemeButton(nextTheme);
      });
    }
  });
})();
