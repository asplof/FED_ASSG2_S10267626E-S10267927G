document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    const RESTDB_URL = 'https://contact-43ef.restdb.io/rest/userinfo';
    const RESTDB_API_KEY = '67983df8f9d2bb2a64181e5b';

    try {
        const queryUrl = `${RESTDB_URL}?q={"email":"${email}"}`;
        const response = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': RESTDB_API_KEY,
                'content-type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const user = data[0];
            
            if (user && user.password === password) {
                errorMessage.textContent = 'Login successful! Redirecting...';
                errorMessage.style.color = 'green';
                AuthChecker.login(email);
                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = 'Invalid email or password';
                errorMessage.style.color = 'red';
            }
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Connection error: ' + error.message;
        errorMessage.style.color = 'red';
    }
});