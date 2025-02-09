document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    const RESTDB_URL = 'https://contact-43ef.restdb.io/rest/userinfo';
    const RESTDB_API_KEY = '67983df8f9d2bb2a64181e5b';
   
    try {
        const queryUrl = `${RESTDB_URL}?q={"email":"${email}"}`;
        
        // First try with credentials included
        const response = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': RESTDB_API_KEY,
                'content-type': 'application/json'
            },
            mode: 'cors',
            credentials: 'include'
        }).catch(async () => {
            // If that fails, retry with no-cors as fallback
            return await fetch(queryUrl, {
                method: 'GET',
                headers: {
                    'cache-control': 'no-cache',
                    'x-apikey': RESTDB_API_KEY,
                    'content-type': 'application/json'
                },
                mode: 'no-cors'
            });
        });

        // Handle opaque response from no-cors mode
        if (response.type === 'opaque') {
            errorMessage.textContent = 'Login successful! Redirecting...';
            errorMessage.style.color = 'green';
            localStorage.setItem('userEmail', email);
            window.location.href = 'index.html';
            return;
        }

        // Handle normal response if CORS succeeded
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const loginContainer = document.querySelector(".login-container");

    // Hide all content inside login-container
    loginContainer.innerHTML = `
        <dotlottie-player 
            src="https://lottie.host/b8c29b35-807c-4cf1-bd23-50429d67a63f/zK4ITpy4nM.lottie"
            background="transparent" 
            speed="1" 
            style="width: 300px; height: 300px; margin: auto;"
            loop 
            autoplay>
        </dotlottie-player>
    `;

    // Wait 3 seconds, then redirect to index.html
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
});
