document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        helpType: document.querySelector('select').value,
        name: document.querySelector('input[placeholder="Example: Roger Velazquez"]').value,
        subject: document.querySelector('input[type="text"]:not([placeholder])').value,
        details: document.querySelector('textarea').value
    };
 
    try {
        const response = await fetch('https://contact-43ef.restdb.io/rest/contactus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': '80624ddb6222e495518b2236f2a0413e50465',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(formData)
        });
 
        if(response.ok) {
            window.location.href = 'Index.html';
        }
    } catch(error) {
        console.error('Error:', error);
    }
 });
 