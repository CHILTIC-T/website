document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', currentTheme);
    themeToggleBtn.textContent = currentTheme === 'dark' ? 'Claro' : 'Oscuro';

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-bs-theme', newTheme);

        themeToggleBtn.textContent = newTheme === 'dark' ? 'Claro' : 'Oscuro';
        localStorage.setItem('theme', newTheme);
    });
});
