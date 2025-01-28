document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Make error message visible by default
    errorMessage.style.display = 'block';

    // Show what's being submitted
    console.log('Attempting login with:', { email, password });

    const RESTDB_URL = 'https://contact-43ef.restdb.io/rest/userinfo';
    const RESTDB_API_KEY = '80624ddb6222e495518b2236f2a0413e50465';

    try {
        // First, let's try to get all users to see what's in the database
        const response = await fetch(RESTDB_URL, {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': RESTDB_API_KEY,
                'content-type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('All users in database:', data);

        // Now check if there's a matching user
        const matchingUser = data.find(user => 
            user.email === email && user.password === password
        );

        if (matchingUser) {
            console.log('Login successful!');
            errorMessage.textContent = 'Login successful! Redirecting...';
            errorMessage.style.color = 'green';
            localStorage.setItem('userEmail', email);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            console.log('No matching user found');
            errorMessage.textContent = 'Invalid email or password';
            errorMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Detailed error:', error);
        errorMessage.textContent = 'Error: ' + error.message;
        errorMessage.style.color = 'red';
    }
});