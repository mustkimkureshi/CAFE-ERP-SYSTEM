document.addEventListener('DOMContentLoaded', function () {
    const orderTableBody = document.getElementById('order-table').querySelector('tbody');
    const totalAmountElement = document.getElementById('total-amount');
    const orderForm = document.getElementById('order-form');
    let order = [];

    // Add event listeners to "Add to Order" buttons
    document.querySelectorAll('.add-to-order').forEach(button => {
        button.addEventListener('click', function () {
            const itemElement = this.closest('.item');
            const itemName = itemElement.getAttribute('data-name');
            const itemOptions = itemElement.querySelector('.item-options');
            const selectedOption = itemOptions.value;
            const itemPrice = JSON.parse(itemElement.getAttribute('data-price'))[selectedOption];

            // Check if item is already in the order
            const existingItem = order.find(item => item.name === itemName && item.option === selectedOption);
            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.total = existingItem.quantity * existingItem.price;
            } else {
                order.push({
                    name: itemName,
                    option: selectedOption,
                    price: itemPrice,
                    quantity: 1,
                    total: itemPrice
                });
            }

            updateOrderTable();
        });
    });

    // Update the order table
    function updateOrderTable() {
        orderTableBody.innerHTML = '';
        let totalAmount = 0;

        order.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.option}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${item.total}</td>
                <td><button class="remove-item" data-name="${item.name}" data-option="${item.option}">Remove</button></td>
            `;
            orderTableBody.appendChild(row);

            totalAmount += item.total;
        });

        totalAmountElement.textContent = totalAmount;

        // Add event listeners to "Remove" buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const itemName = this.getAttribute('data-name');
                const itemOption = this.getAttribute('data-option');
                order = order.filter(item => !(item.name === itemName && item.option === itemOption));
                updateOrderTable();
            });
        });
    }

    // Handle place order form submission
    orderForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (order.length === 0) {
            alert('No items in the order.');
            return;
        }

        const customerName = document.getElementById('customer-name').value;
        const formData = new FormData();
        formData.append('customerName', customerName);
        formData.append('order', JSON.stringify(order));

        // Send place order request using fetch (AJAX)
        fetch('php/place_order.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text()) // Get response as text
            .then(text => {
                try {
                    const data = JSON.parse(text); // Parse JSON response
                    if (data.status === 'success') {
                        alert('Order placed successfully!');
                        order = [];
                        updateOrderTable();
                        orderForm.reset();
                    } else {
                        alert(data.message);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    console.error('Response text:', text);
                    alert('Something went wrong, please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Something went wrong, please try again.');
            });
    });
});