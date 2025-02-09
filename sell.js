// Image preview functionality
document.getElementById('image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `
                <img src="${e.target.result}" style="max-width: 200px; max-height: 200px; object-fit: contain;">
                <div style="margin-top: 5px;">${file.name}</div>
            `;
        }
        reader.readAsDataURL(file);
    }
});

// Price formatting
document.getElementById('price').addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^\d.]/g, '');
    if (value) {
        const number = parseFloat(value);
        if (!isNaN(number)) {
            e.target.value = '$' + number.toFixed(2);
        }
    }
});

// Form submission
document.getElementById('sellForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Form submission started');

    try {
        // Get form values
        const category = document.getElementById('category').value;
        const condition = document.getElementById('condition').value;
        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value.replace(/[$,]/g, '');
        const details = document.getElementById('details').value;
        const imageFile = document.getElementById('image').files[0];

        // Validate
        if (!category || !condition || !title || !price || !details || !imageFile) {
            alert('Please fill in all fields');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Convert image to base64
        const base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });

        // Prepare the data
        const formData = {
            listingtype: category,
            listingcondition: condition,
            listingname: title,
            listingimage: base64Image,
            listingprice: price,
            listingdescription: details,
            created: new Date().toISOString()
        };

        // Send to RestDB
        const response = await fetch('https://contact-43ef.restdb.io/rest/listing?max=2', {
            method: 'POST',
            mode: 'cors', // Enable CORS
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': '80624ddb6222e495518b2236f2a0413e50465',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Success:', result);
            alert('Listing submitted successfully!');
            window.location.href = 'index.html';
        } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error('Server response was not OK');
        }

    } catch (error) {
        console.error('Submission error:', error);
        alert('Error submitting listing. Please try again.');
    } finally {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.textContent = 'Submit Listing';
        submitBtn.disabled = false;
    }
});