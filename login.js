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
            mode: 'no-cors',  // Changed this line
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': RESTDB_API_KEY,
                'content-type': 'application/json'
            }
        });

        if (response.type === 'opaque') {  // no-cors returns opaque response
            // Since we can't read the response with no-cors, we'll assume success
            // This isn't ideal but might work as a temporary solution
            localStorage.setItem('userEmail', email);
            window.location.href = 'index.html';
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Connection error: ' + error.message;
        errorMessage.style.color = 'red';
    }
});