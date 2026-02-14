// Theme handling for Tailwind's class-based dark mode.
// Values:
// - 'system': follow OS preference (prefers-color-scheme)
// - 'light'
// - 'dark'

const STORAGE_KEY = 'gaia:theme';

export function getStoredTheme() {
    if (typeof window === 'undefined') {
        return 'system';
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
        return raw;
    }

    return 'system';
}

export function getSystemTheme() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme) {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;
    const resolved = theme === 'system' ? getSystemTheme() : theme;

    root.classList.toggle('dark', resolved === 'dark');
    root.dataset.theme = theme;
}

export function setStoredTheme(theme) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
}

export function initTheme() {
    if (typeof window === 'undefined') {
        return;
    }

    applyTheme(getStoredTheme());

    // Keep in sync with OS preference while in 'system' mode.
    if (typeof window.matchMedia !== 'function') {
        return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
        if (getStoredTheme() === 'system') {
            applyTheme('system');
        }
    };

    if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handler);
    } else if (typeof media.addListener === 'function') {
        media.addListener(handler);
    }
}
