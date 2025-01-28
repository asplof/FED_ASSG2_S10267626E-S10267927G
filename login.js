document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    const RESTDB_URL = 'https://contact-43ef.restdb.io/rest/userinfo';
    const RESTDB_API_KEY = '80624ddb6222e495518b2236f2a0413e50465';

    try {
        // Query only for the specific user
        const queryUrl = `${RESTDB_URL}?q={"email":"${email}"}`;
        const response = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': RESTDB_API_KEY,
                'content-type': 'application/json'
            }
        });

        const data = await response.json();
        
        // Check if user exists and password matches
        const user = data[0];
        if (user && user.password === password) {
            errorMessage.textContent = 'Login successful! Redirecting...';
            errorMessage.style.color = 'green';
            localStorage.setItem('userEmail', email);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid email or password';
            errorMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Connection error: ' + error.message;
        errorMessage.style.color = 'red';
    }
});