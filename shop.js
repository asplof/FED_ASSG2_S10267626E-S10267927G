const products = [
    {
        title: "2020 Toyota Camry SE",
        price: "$18,500",
        location: "San Francisco",
        timeAgo: "2d ago",
        category: "Vehicle"
    },
    {
        title: "iPhone 13 Pro - 256GB",
        price: "$799",
        location: "New York",
        timeAgo: "Just now",
        category: "Electronics"
    },
    {
        title: "Modern Sofa Set",
        price: "$1,200",
        location: "Chicago",
        timeAgo: "1w ago",
        category: "Furniture"
    },
    {
        title: "Mountain Bike",
        price: "$450",
        location: "Seattle",
        timeAgo: "3d ago",
        category: "Bicycle"
    },
    {
        title: "Gaming Laptop",
        price: "$1,499",
        location: "Boston",
        timeAgo: "5d ago",
        category: "Electronics"
    },
    {
        title: "Vintage Watch",
        price: "$299",
        location: "Miami",
        timeAgo: "1d ago",
        category: "Accessories"
    }
];

// Function to create listing cards
function createListingCard(product) {
    return `
        <div class="listing-card" data-category="${product.category}">
            <div class="listing-image"></div>
            <div class="listing-content">
                <h3 class="listing-title">${product.title}</h3>
                <div class="listing-price">${product.price}</div>
                <div class="listing-meta">${product.location} • ${product.timeAgo}</div>
            </div>
        </div>
    `;
}

// Function to initialize the listings
function initializeListings() {
    const listingsScroll = document.querySelector('.listings-scroll');
    listingsScroll.innerHTML = products.map(product => createListingCard(product)).join('');
}

// Function to filter listings by category
function filterListings(category) {
    const listingCards = document.querySelectorAll('.listing-card');

    listingCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize the category buttons
function initializeCategoryButtons() {
    const buttonContainer = document.querySelector('.product-buttons');

    // Add "All" button
    const allButton = document.createElement('button');
    allButton.className = 'product-button active';
    allButton.textContent = 'All';
    buttonContainer.insertBefore(allButton, buttonContainer.firstChild);

    // Add click event listeners to all buttons
    const buttons = document.querySelectorAll('.product-button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            e.target.classList.add('active');

            // Filter listings
            const category = e.target.textContent === 'All' ? 'all' : e.target.textContent;
            filterListings(category);
        });
    });
}

// Add styles for active button
const style = document.createElement('style');
style.textContent = `
    .product-button.active {
        background-color: #00a400;
        color: white;
    }
`;
document.head.appendChild(style);

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeListings();
    initializeCategoryButtons();
});