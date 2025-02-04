const products = [
    {
        title: "2020 Toyota Camry SE",
        price: "$18,500",
        location: "San Francisco",
        timeAgo: "2d ago",
        category: "Vehicle",
        timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
        title: "Mountain Bike",
        price: "$450",
        location: "Seattle",
        timeAgo: "3d ago",
        category: "Bicycle",
        timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
        title: "Coffee Table Set",
        price: "$299",
        location: "Portland",
        timeAgo: "6h ago",
        category: "Furniture",
        timestamp: Date.now() - (6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
        title: "Electric Bicycle",
        price: "$899",
        location: "Austin",
        timeAgo: "12h ago",
        category: ["Bicycle","Electronics"],
        timestamp: Date.now() - (12 * 60 * 60 * 1000) // 12 hours ago
    },
    {
        title: "Potted Monstera Plant",
        price: "$45",
        location: "Denver",
        timeAgo: "4h ago",
        category: "Plants",
        timestamp: Date.now() - (4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
        title: "iPhone 13 Pro - 256GB",
        price: "$799",
        location: "New York",
        timeAgo: "Just now",
        category: "Electronics",
        timestamp: Date.now() // Just now
    },
    {
        title: "Modern Sofa Set",
        price: "$1,200",
        location: "Chicago",
        timeAgo: "1w ago",
        category: "Furniture",
        timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000) // 1 week ago
    },
    {
        title: "Gaming Laptop",
        price: "$1,499",
        location: "Boston",
        timeAgo: "5d ago",
        category: "Electronics",
        timestamp: Date.now() - (5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
        title: "Smart Watch Series 8",
        price: "$279",
        location: "Houston",
        timeAgo: "1h ago",
        category: ["Electronics", "Accessories"],
        timestamp: Date.now() - (1 * 60 * 60 * 1000) // 1 hour ago
    },
    {
        title: "Premium Toiletries Set",
        price: "$89",
        location: "Las Vegas",
        timeAgo: "30m ago",
        category: "Toiletries",
        timestamp: Date.now() - (30 * 60 * 1000) // 30 min ago30
    },
    {
        title: "Vintage Watch",
        price: "$299",
        location: "Miami",
        timeAgo: "1d ago",
        category: "Accessories",
        timestamp: Date.now() - (24 * 60 * 60 * 1000) // 1 day ago
    }
];

function createListingCard(product) {
    const categories = Array.isArray(product.category) ?
        product.category.join(',') : product.category;

    return `
        <div class="listing-card" data-category="${categories}" data-timestamp="${product.timestamp}">
            <div class="listing-image"></div>
            <div class="listing-content">
                <h3 class="listing-title">${product.title}</h3>
                <div class="listing-price">${product.price}</div>
                <div class="listing-meta">${product.location} - ${product.timeAgo}</div>
            </div>
        </div>
    `;
}

// Function to execute the methods
function makeListings() {
    // top products section
    const topListingsScroll = document.querySelector('.top-listings .listings-scroll');
    topListingsScroll.innerHTML = products.map(product => createListingCard(product)).join('');

    // recent products section with sorted products
    const recentProducts = [...products].sort((a, b) => b.timestamp - a.timestamp);
    const recentListingsScroll = document.querySelector('.recent-listings .listings-scroll');
    recentListingsScroll.innerHTML = recentProducts.map(product => createListingCard(product)).join('');
}

// Function to filter listings by category  
function filterListings(category) {
    const listingCards = document.querySelectorAll('.top-listings .listing-card');

    listingCards.forEach(card => {
        const cardCategories = card.dataset.category.split(',');  // Split the categories string
        if (category === 'all' || cardCategories.includes(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// category buttons
function makeCategoryButtons() {
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

            // Filter listings in both sections
            const category = e.target.textContent === 'All' ? 'all' : e.target.textContent;
            filterListings(category);
        });
    });
}

// Add styles for active button and sections
const style = document.createElement('style');
style.textContent = `
    .product-button.active {
        background-color: #00a400;
        color: white;
    }
    .section-title {
        color: black;
        font-size: 20px;
        margin-bottom: 1rem;
        font-weight: 600;
        letter-spacing: -0.01em;
    }
    .listings-section {
        margin-bottom: 2rem;
    }
`;
document.head.appendChild(style);

// Create the sections in the DOM
function createListingSections() {
    const mainContent = document.querySelector('.main-content');
    const existingListings = document.querySelector('.listings-container');

    // Create container for both sections
    const sectionsContainer = document.createElement('div');
    sectionsContainer.className = 'listings-sections';

    // Create Top Products section
    const topSection = document.createElement('div');
    topSection.className = 'listings-section top-listings';
    topSection.innerHTML = `
        <div class="listings-container">
            <div class="listings-scroll"></div>
        </div>
    `;

    // Create Recent Products section
    const recentSection = document.createElement('div');
    recentSection.className = 'listings-section recent-listings';
    recentSection.innerHTML = `
        <div class="section-title">Recent Listings</div>
        <div class="listings-container">
            <div class="listings-scroll"></div>
        </div>
    `;

    // Replace existing listings with new sections
    sectionsContainer.appendChild(topSection);
    sectionsContainer.appendChild(recentSection);
    existingListings.replaceWith(sectionsContainer);
}

// Run needed methods when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createListingSections();
    makeListings();
    makeCategoryButtons();
});