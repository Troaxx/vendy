
let hasUnsavedChanges = false;
let hasStatusChanged = false;
let originalValues = new Map(); // To track original values


function safeLogOperation(operation, machineId, itemId, quantity) {
    try {
        if (typeof logOperation === 'function') {
            logOperation(operation, machineId, itemId, quantity);
        } else {
            console.log('Logging function not available:', { operation, machineId, itemId, quantity });
        }
    } catch (error) {
        console.error('Logging error:', error);
    }
}

async function fetchMachineStatus(machineId) {
    try {
        const response = await fetch(`/api/vending_machine_details/${machineId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.machine && data.machine.status_id) {
            document.getElementById('machineStatus').value = data.machine.status_id;
        } else {
            console.error('Invalid machine data structure:', data);
        }
    } catch (error) {
        console.error('Error fetching machine status:', error);
        // Set default status if there's an error
        document.getElementById('machineStatus').value = "1";
    }
}

async function updateMachineStatus() {
    const machineId = document.getElementById('vendingMachineDropdown').value;
    const statusId = document.getElementById('machineStatus').value;
    
    try {
        const response = await fetch(`/api/vending-machine/status/${machineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status_id: statusId })
        });

        if (!response.ok) {
            throw new Error('Failed to update machine status');
        }
        
        hasUnsavedChanges = true;
        document.getElementById('saveChangesBtn').disabled = false;
    } catch (error) {
        console.error('Error updating machine status:', error);
        alert('Failed to update machine status');
    }
}

async function fetchVendingMachineItems(vendingMachineId) {
    try {
        originalValues.clear(); // Clear the stored values
        const saveBtn = document.getElementById('saveChangesBtn');
        if (saveBtn) saveBtn.style.display = 'block';
        
        const response = await fetch(`/api/vending_machines/${vendingMachineId}/items`);
        const data = await response.json();
        
        const itemsContainer = document.getElementById('itemsContainer');
        itemsContainer.innerHTML = '';
        
        if (data.length === 0) {
            itemsContainer.innerHTML = '<p class="no-items">No items in this machine. Add items from the database page.</p>';
            return;
        }
        
        data.forEach(item => {
            const itemDiv = createItemElement(item, vendingMachineId);
            itemsContainer.appendChild(itemDiv);
        });
        
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

function createItemElement(item, vendingMachineId) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.dataset.itemId = item.item_id;

    // Stored original values when creating element
    originalValues.set(item.item_id, {
        quantity: item.item_quantity,
        availability: item.availability === 1 ? 'Available' : 'Out of Stock'
    });

    const imageUrl = `/images/${item.item_image}`;
    const isAvailable = item.availability === 1;

    itemDiv.innerHTML = `
        <div class="image-container">
            <img src="${imageUrl}" alt="${item.item_name}" onerror="this.src='placeholder.png'">
        </div>
        <h3>${item.item_name}</h3>
        <p>Price: $${item.item_cost}</p>
        <div class="item-controls">
            <div class="control-group">
                <label>Quantity:</label>
                <input type="number" 
                       id="quantity-${item.item_id}" 
                       value="${item.item_quantity}" 
                       min="0" 
                       onchange="updateItemQuantity(${item.item_id}, this.value)">
            </div>
            <div class="control-group">
                <label>Availability:</label>
                <select id="availability-${item.item_id}"
                        onchange="updateItemAvailability(${item.item_id}, this.value)">
                    <option value="Available" ${isAvailable ? 'selected' : ''}>Available</option>
                    <option value="Out of Stock" ${!isAvailable ? 'selected' : ''}>Out of Stock</option>
                </select>
            </div>
            <button onclick="removeItem(${item.item_id}, ${vendingMachineId})" class="remove-button">
                Remove Item
            </button>
        </div>
    `;

    return itemDiv;
}


function updateItemQuantity(itemId, newQuantity) {
    const original = originalValues.get(itemId);
    if (original && parseInt(newQuantity) !== original.quantity) {
        hasUnsavedChanges = true;
        document.getElementById('saveChangesBtn').disabled = false;
    }
}

function updateItemAvailability(itemId, newAvailability) {
    const original = originalValues.get(itemId);
    if (original && newAvailability !== original.availability) {
        hasUnsavedChanges = true;
        document.getElementById('saveChangesBtn').disabled = false;
    }
}

async function saveAllChanges() {
    const machineId = document.getElementById('vendingMachineDropdown').value;
    const statusId = document.getElementById('machineStatus').value;
    const items = document.querySelectorAll('.item');
    const saveBtn = document.getElementById('saveChangesBtn');
    
    try {
        saveBtn.disabled = true;
        
        // Update machine status if changed
        if (hasStatusChanged) {
            const statusResponse = await fetch(`/api/vending-machine/status/${machineId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_id: statusId })
            });

            if (statusResponse.ok) {
                await logOperation('StatusUpdate', machineId, null, statusId);
            }
        }

        // Process item updates
        for (const item of items) {
            const itemId = parseInt(item.dataset.itemId);
            const originalValue = originalValues.get(itemId);
            
            if (!originalValue) continue;

            const newQuantity = parseInt(item.querySelector(`#quantity-${itemId}`).value);
            const newAvailability = item.querySelector(`#availability-${itemId}`).value;
            
            // Only update if there are changes
            if (newQuantity !== originalValue.quantity || newAvailability !== originalValue.availability) {
                const itemResponse = await fetch(`/api/update-item/${itemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        item_quantity: newQuantity,
                        availability: newAvailability === 'Available' ? 1 : 0,
                        vending_machine_id: machineId
                    })
                });

                if (itemResponse.ok) {
                    // Log updates
                    if (newQuantity !== originalValue.quantity) {
                        await logOperation('UpdateItem', machineId, itemId, newQuantity);
                    }
                    
                    // Update stored original values
                    originalValues.set(itemId, {
                        quantity: newQuantity,
                        availability: newAvailability
                    });
                }
            }
        }

        alert('All changes saved successfully!');
        hasUnsavedChanges = false;
        hasStatusChanged = false;
        saveBtn.disabled = true;
        
        // Refresh the display
        await fetchVendingMachineItems(machineId);
        await fetchMachineStatus(machineId);
        
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Error saving changes. Please try again.');
        saveBtn.disabled = false;
    }
}


async function removeItem(itemId, vendingMachineId) {
    if (!confirm('Are you sure you want to remove this item from the vending machine?')) {
        return;
    }

    try {
        const response = await fetch(`/api/vending-machine-items/${vendingMachineId}/${itemId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.title); 
            safeLogOperation('Delete', vendingMachineId, itemId, 0);
            await fetchVendingMachineItems(vendingMachineId);
        } else {
            throw new Error(data.error || 'Failed to remove item');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error removing item: ${error.message}`);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveChangesBtn');
    const dropdown = document.getElementById('vendingMachineDropdown');
    const statusSelect = document.getElementById('machineStatus');
    const itemsContainer = document.getElementById('itemsContainer');

    // Machine selection handler
    dropdown.addEventListener('change', async (event) => {
        const machineId = event.target.value;
        if (machineId && machineId !== 'none') {
            // Reset change tracking when switching machines
            hasStatusChanged = false;
            hasUnsavedChanges = false;
            
            await fetchVendingMachineItems(machineId);
            await fetchMachineStatus(machineId);
            saveBtn.style.display = 'block';
            saveBtn.disabled = true; // Disabled until changes are made
        } else {
            saveBtn.style.display = 'none';
            itemsContainer.innerHTML = '';
        }
    });

    // Status change handler
    statusSelect.addEventListener('change', () => {
        hasStatusChanged = true;
        hasUnsavedChanges = true;
        saveBtn.disabled = false;
    });

    // Save button handler
    saveBtn.addEventListener('click', async () => {
        if (hasUnsavedChanges) {
            await saveAllChanges();
        }
    });

    // Initialize with current machine if one is selected
    const initialMachineId = dropdown.value;
    if (initialMachineId && initialMachineId !== 'none') {
        fetchVendingMachineItems(initialMachineId);
        fetchMachineStatus(initialMachineId);
    }

    // Window beforeunload handler for unsaved changes
    window.addEventListener('beforeunload', (event) => {
        if (hasUnsavedChanges) {
            event.preventDefault();
            return event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });
});