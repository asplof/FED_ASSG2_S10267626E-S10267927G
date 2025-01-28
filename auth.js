
const AuthChecker = {
    isLoggedIn() {
        const userEmail = localStorage.getItem('userEmail');
        return userEmail !== null;
    },
    getCurrentUser() {
        return localStorage.getItem('userEmail');
    },
    login(email) {
        localStorage.setItem('userEmail', email);
    },
    logout() {
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    },
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// Checks authentication
document.addEventListener('DOMContentLoaded', () => {
    AuthChecker.requireAuth();
});