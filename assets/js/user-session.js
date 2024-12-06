document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const authLinkText = document.getElementById('auth-link-text');
    if (username) {
        authLinkText.textContent = 'Perfil';
        document.getElementById('auth-link').href = 'profile.html';
    } else {
        authLinkText.textContent = 'Sign up';
        document.getElementById('auth-link').href = 'signup.html';
    }
});
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem("userId");
    localStorage.removeItem('username'); 
    window.location.href = "login.html"; 
});