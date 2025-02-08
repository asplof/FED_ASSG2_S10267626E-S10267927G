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

    // Get form data
    const formData = {
        category: document.getElementById('category').value,
        condition: document.getElementById('condition').value,
        title: document.getElementById('title').value,
        price: document.getElementById('price').value.replace(/[$,]/g, ''),
        details: document.getElementById('details').value
    };

    // Validate form
    if (!validateForm(formData)) {
        return;
    }

    // Show loading state
    const submitButton = document.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        // Handle image
        const imageFile = document.getElementById('image').files[0];
        const base64Image = await convertImageToBase64(imageFile);

        // Prepare data for RestDB
        const listingData = {
            listingname: formData.title,
            listingdescription: formData.details,
            listingimage: base64Image,
            listingcat: formData.category,
            listingprice: formData.price,
            listingcondition: formData.condition,
            created: new Date().toISOString()
        };

        // Send to RestDB
        const response = await fetch('https://contact-43ef.restdb.io/rest/listings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': '80624ddb6222e495518b2236f2a0413e50465',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(listingData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result && result._id) {
            alert('Your listing has been submitted successfully!');
            window.location.href = 'index.html';
        } else {
            throw new Error('Failed to get confirmation from database');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your listing. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'SUBMIT';
    }
});

// Helper functions
function validateForm(formData) {
    const errors = [];

    if (!formData.category) errors.push('Please select a category');
    if (!formData.condition) errors.push('Please select item condition');
    if (!formData.title.trim()) errors.push('Please enter a title');
    if (!formData.price.trim()) errors.push('Please enter a price');
    if (!formData.details.trim()) errors.push('Please enter item details');
    if (!document.getElementById('image').files[0]) errors.push('Please upload an image');

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }
    return true;
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}