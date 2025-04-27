// Notification handling
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Image preview functionality
function previewImage(file) {
    const preview = document.getElementById('imagePreview');
    if (!preview) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.onerror = () => {
        showNotification('Error previewing image', 'error');
    };
    reader.readAsDataURL(file);
}

// Setup tabs functionality
function setupTabs() {
    try {
        const tabs = document.querySelectorAll('.tab-button');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');

                // Hide all content
                contents.forEach(content => content.classList.remove('active'));
                // Show content corresponding to clicked tab
                const targetId = tab.dataset.tab;
                document.getElementById(targetId).classList.add('active');
            });
        });
    } catch (error) {
        console.error('Error setting up tabs:', error);
        showNotification('Error initializing page tabs', 'error');
    }
}

// Database Item Management
async function fetchExistingItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        
        const container = document.getElementById('existingItems');
        container.innerHTML = '';
        
        items.forEach(item => {
            const itemCard = createItemCard(item);
            container.appendChild(itemCard);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        showNotification('Error loading existing items', 'error');
    }
}

function createItemCard(item) {
    try {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const imageUrl = `/images/${item.item_image}`;
        const itemCost = Number(item.item_cost).toFixed(2);
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${item.item_name}" onerror="this.src='placeholder.png'">
            <h4>${item.item_name}</h4>
            <p>$${itemCost}</p>
        `;
        
        return card;
    } catch (error) {
        console.error('Error creating item card:', error);
        return document.createElement('div');
    }
}

// Utility function to debounce API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to check if item exists in database
async function checkItemExists(itemName) {
    try {
        const response = await fetch(`/api/items/check-name/${encodeURIComponent(itemName)}`);
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error('Error checking item name:', error);
        throw new Error('Failed to check item name');
    }
}

// Function to validate item name as user types
const validateItemName = debounce(async (input) => {
    const itemName = input.value.trim();
    const errorMessageElement = document.getElementById('itemNameError');
    
    if (!errorMessageElement) return;
    
    if (itemName) {
        try {
            const exists = await checkItemExists(itemName);
            if (exists) {
                input.setCustomValidity('An item with this name already exists');
                errorMessageElement.textContent = 'This item name already exists. Are you sure you want to proceed?';
                errorMessageElement.style.display = 'block';
                showNotification('This item name already exists', 'error');
            } else {
                input.setCustomValidity('');
                errorMessageElement.style.display = 'none';
            }
        } catch (error) {
            console.error('Error during validation:', error);
            errorMessageElement.textContent = 'Error checking item name';
            errorMessageElement.style.display = 'block';
        }
    } else {
        input.setCustomValidity('');
        errorMessageElement.style.display = 'none';
    }
}, 500);

// Form submission handler for adding to database
async function handleAddToDatabase(event) {
    event.preventDefault();
    
    try {
        const itemName = document.getElementById('itemName').value.trim();
        const itemCost = document.getElementById('itemCost').value;
        const imageFile = document.getElementById('itemImage').files[0];

        // Basic validation
        if (!itemName || !itemCost || !imageFile) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Check for duplicate before proceeding
        const exists = await checkItemExists(itemName);
        if (exists) {
            showNotification('An item with this name already exists', 'error');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('item_name', itemName);
        formData.append('item_cost', itemCost);
        formData.append('item_image', imageFile);

        // Send request
        const response = await fetch('/api/items', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (response.ok) {
            showNotification('Item added successfully', 'success');
            document.getElementById('addItemForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
            await fetchExistingItems();
        } else {
            throw new Error(result.error || 'Failed to add item');
        }
    } catch (error) {
        console.error('Error adding item to database:', error);
        showNotification(error.message, 'error');
    }
}

// Machine item management
async function checkMachineStatus(machineId) {
    try {
        const response = await fetch(`/api/machine-item-status/${machineId}`);
        const status = await response.json();
        
        updateMachineStatus(status);
        await updateItemSelect(machineId);
        
        return status;
    } catch (error) {
        console.error('Error checking machine status:', error);
        showNotification('Error checking machine status', 'error');
    }
}

function updateMachineStatus(status) {
    try {
        const statusElement = document.getElementById('machineItemStatus');
        if (status.allItemsInMachine) {
            statusElement.textContent = 'All available items are already in this machine';
            document.getElementById('itemSelect').disabled = true;
            document.getElementById('quantity').disabled = true;
        } else {
            statusElement.textContent = `Machine has ${status.machineItems} out of ${status.totalItems} possible items`;
            document.getElementById('itemSelect').disabled = false;
            document.getElementById('quantity').disabled = false;
        }
    } catch (error) {
        console.error('Error updating machine status:', error);
    }
}

async function updateItemSelect(machineId) {
    try {
        const itemSelect = document.getElementById('itemSelect');
        itemSelect.innerHTML = '<option value="">Select an item...</option>';
        
        const response = await fetch(`/api/items?machineId=${machineId}`);
        const items = await response.json();
        
        if (!items || items.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No items available for this machine';
            itemSelect.appendChild(option);
            itemSelect.disabled = true;
            return;
        }
        
        itemSelect.disabled = false;
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.item_id;
            const itemCost = Number(item.item_cost).toFixed(2);
            option.textContent = `${item.item_name} ($${itemCost})`;
            itemSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error updating item select:', error);
        showNotification('Error loading available items', 'error');
    }
}

async function handleAddToMachine(event) {
    event.preventDefault();
    
    try {
        const machineId = document.getElementById('vendingMachineSelect').value;
        const itemId = document.getElementById('itemSelect').value;
        const quantity = document.getElementById('quantity').value;

        const response = await fetch('/api/vending-machine-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vending_machine_id: machineId,
                item_id: itemId,
                quantity: quantity
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            await logOperation('AddItem', machineId, itemId, quantity);
            showNotification('Item added to machine successfully', 'success');
            document.getElementById('addToMachineForm').reset();
            await checkMachineStatus(machineId);
        } else {
            throw new Error(result.error || 'Failed to add item to machine');
        }
    } catch (error) {
        console.error('Error adding item to machine:', error);
        showNotification(error.message, 'error');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initial setup
        setupTabs();
        fetchExistingItems();

        // Add form elements
        const addItemForm = document.getElementById('addItemForm');
        const itemNameInput = document.getElementById('itemName');
        const itemImage = document.getElementById('itemImage');

        // Create error message element for item name
        const errorMessageElement = document.createElement('div');
        errorMessageElement.id = 'itemNameError';
        errorMessageElement.className = 'error-message';
        errorMessageElement.style.display = 'none';
        if (itemNameInput?.parentNode) {
            itemNameInput.parentNode.appendChild(errorMessageElement);
        }

        // Add event listeners
        itemNameInput?.addEventListener('input', (e) => validateItemName(e.target));
        
        itemImage?.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                previewImage(e.target.files[0]);
            }
        });

        addItemForm?.addEventListener('submit', handleAddToDatabase);

        // Initialize machine-related event listeners
        const machineSelect = document.getElementById('vendingMachineSelect');
        machineSelect?.addEventListener('change', (e) => {
            if (e.target.value) {
                checkMachineStatus(e.target.value);
            }
        });

        const addToMachineForm = document.getElementById('addToMachineForm');
        addToMachineForm?.addEventListener('submit', handleAddToMachine);

    } catch (error) {
        console.error('Error during initialization:', error);
        showNotification('Error initializing page', 'error');
    }
});