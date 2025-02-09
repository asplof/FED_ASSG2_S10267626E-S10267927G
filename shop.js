async function fetchListings() {
    try {
        const response = await fetch('YOUR_RESTDB_ENDPOINT', {
            headers: {
                'x-apikey': 'YOUR_API_KEY',
                'cache-control': 'no-cache'
            }
        });
        const data = await response.json();
        return transformListings(data);
    } catch (error) {
        console.error('Error fetching listings:', error);
        return [];
    }
}

// Transform RestDB data to match our format
function transformListings(data) {
    return data.map(item => ({
        title: item.listingname,
        price: `$${item.listingprice.toFixed(2)}`,
        location: 'Location',  // Add default location or get from RestDB
        timeAgo: 'Just now',   // Calculate based on timestamp if available
        category: item.listingcat,
        condition: item.listingcondition,
        image: item.listingimage,
        timestamp: Date.now()  // Use actual timestamp if available from RestDB
    }));
}

function createListingCard(product) {
    return `
        <div class="listing-card" data-category="${product.category}" data-timestamp="${product.timestamp}">
            <div class="listing-image">
                ${product.image ? `<img src="${product.image}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
            </div>
            <div class="listing-content">
                <h3 class="listing-title">${product.title}</h3>
                <div class="listing-price">${product.price}</div>
                <div class="listing-meta">${product.location} - ${product.timeAgo}</div>
            </div>
        </div>
    `;
}

// Function to get unique categories from listings
function getUniqueCategories(listings) {
    const categories = new Set(listings.map(listing => listing.category));
    return ['All', ...Array.from(categories)];
}

// Function to create category buttons
function createCategoryButtons(categories) {
    const buttonContainer = document.querySelector('.product-buttons');
    buttonContainer.innerHTML = ''; // Clear existing buttons

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'product-button';
        button.textContent = category;
        if (category === 'All') {
            button.classList.add('active');
        }
        buttonContainer.appendChild(button);
    });
}

// Function to filter listings by category
function filterListings(category) {
    const listingCards = document.querySelectorAll('.listing-card');
    listingCards.forEach(card => {
        if (category === 'All' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to create the listing sections
function createListingSections() {
    const mainContent = document.querySelector('.main-content');
    const existingListings = document.querySelector('.listings-container');

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

    sectionsContainer.appendChild(topSection);
    sectionsContainer.appendChild(recentSection);
    existingListings.replaceWith(sectionsContainer);
}

// Initialize the page
async function initializePage() {
    createListingSections();
    
    // Fetch and display listings
    const listings = await fetchListings();
    
    // Create and display category buttons
    const categories = getUniqueCategories(listings);
    createCategoryButtons(categories);
    
    // Display listings in both sections
    const topListingsScroll = document.querySelector('.top-listings .listings-scroll');
    const recentListingsScroll = document.querySelector('.recent-listings .listings-scroll');
    
    // Sort listings by timestamp for recent listings
    const recentListings = [...listings].sort((a, b) => b.timestamp - a.timestamp);
    
    topListingsScroll.innerHTML = listings.map(product => createListingCard(product)).join('');
    recentListingsScroll.innerHTML = recentListings.map(product => createListingCard(product)).join('');
    
    // Add event listeners to category buttons
    const buttons = document.querySelectorAll('.product-button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            buttons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.textContent === 'All' ? 'All' : e.target.textContent;
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);