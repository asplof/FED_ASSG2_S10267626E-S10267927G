// cost of the vouchers
const voucherCosts = {
    '$5 Discount': 500,
    'Free Shipping': 750,
    '20% Off': 1000
};

// make sure to change status of all buttons
function updateAllVoucherButtons(currentCoins) {
    document.querySelectorAll('.voucher-card').forEach(card => {
        const button = card.querySelector('.redeem-btn');
        const voucherName = card.querySelector('h3').textContent;
        const cost = voucherCosts[voucherName];

        if (currentCoins < cost) {
            button.classList.add('disabled');
            button.textContent = 'Not Enough Coins';
        }
    });
}

document.querySelectorAll('.redeem-btn').forEach(button => {
    if (!button.classList.contains('disabled')) {
        button.addEventListener('click', function () {
            const voucherCard = this.closest('.voucher-card');
            const voucherName = voucherCard.querySelector('h3').textContent;
            const coinsCost = voucherCosts[voucherName];

            // check for the current coins
            const currentCoins = parseInt(document.querySelector('.coins-amount .amount').textContent.replace(',', ''));

            if (currentCoins >= coinsCost) {
                // coins updated
                const newCoins = currentCoins - coinsCost;
                document.querySelector('.coins-amount .amount').textContent = newCoins.toLocaleString();
                alert(`Successfully redeemed ${voucherName}!`);

                // Update the other vouchers
                updateAllVoucherButtons(newCoins);
            }
        });
    }
});

// TODO:
// 1. Fetch user profile data
// 2. Track coins balance
// 3. Handle voucher redemption
// 4. Store voucher codes