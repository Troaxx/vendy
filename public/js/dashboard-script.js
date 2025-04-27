document.addEventListener('DOMContentLoaded', () => {
  console.log("Dashboard Script loaded");
  const locations = document.querySelectorAll('.locations');
  console.log("Locations found:", locations);

  locations.forEach(location => {
    //debugging
      location.addEventListener('click', () => {
          console.log("Location clicked:", location);
          const machineId = location.getAttribute('data-id');
          fetchMachineData(machineId);
      });
  });
});

async function fetchMachineData(machineId) {
    try {
        const response = await fetch(`/api/vending_machine_details/${machineId}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        
        // Update location div status class
        const locationDiv = document.querySelector(`.locations[data-id="${machineId}"]`);
        locationDiv.className = 'locations ' + getStatusClass(data.machine.status_id);
        
        displayMachineInfo(data);
    } catch (error) {
        console.error('Error fetching machine data:', error);
    }
}

function getStatusClass(statusId) {
    // Convert statusId to number to ensure proper comparison
    const status = Number(statusId);
    const statusMap = {
        1: 'status-available',
        2: 'status-out-of-order',
        3: 'status-maintenance',
        4: 'status-decommissioned'
    };
    return statusMap[status] || 'status-available';
}

// Update this function to properly fetch and display the latest status
async function updateMachineStatus(machineId) {
    try {
        const response = await fetch(`/api/vending_machine_details/${machineId}`);
        if (!response.ok) throw new Error('Failed to fetch machine status');
        const data = await response.json();
        
        const locationDiv = document.querySelector(`.locations[data-id="${machineId}"]`);
        if (locationDiv) {
            locationDiv.className = 'locations ' + getStatusClass(data.machine.status_id);
        }
    } catch (error) {
        console.error('Error updating machine status:', error);
    }
}

function displayMachineInfo(data) {
    const infoDisplay = document.getElementById('info-display');
    infoDisplay.innerHTML = `
        <h3>Vending Machine ${data.machine.vending_machine_id}</h3>
        <h4>Location</h4>
        <p>${data.machine.school} - Block ${data.machine.block}, Level ${data.machine.floor}</p>
        <h4>Vendor: ${data.machine.vendor_name}</h4>
        <h4>Status: ${data.machine.status_name}</h4>
        <h4>Payment Methods</h4>
        <ul>
            ${data.paymentMethods.map(method => `<li>${method.payment_name}</li>`).join('')}
        </ul>
        <h4>Items Available</h4>
        <ul>
            ${data.items.map(item => {
                // Convert price to number and handle any potential parsing errors
                const price = Number(item.price);
                const formattedPrice = !isNaN(price) ? price.toFixed(2) : '0.00';
                
                let statusColor;
                switch(item.availability_status) {
                    case 'Available':
                        statusColor = '#22c55e'; // Green
                        break;
                    case 'Out of Stock':
                        statusColor = '#f97316'; // Orange
                        break;
                    case 'Item Discontinued':
                        statusColor = '#ef4444'; // Red
                        break;
                    default:
                        statusColor = '#6b7280'; // Gray
                }
                
                return `
                    <li>
                        ${item.item_name} - ${formattedPrice}
                        (Qty: ${item.item_quantity})
                        <span style="color: ${statusColor}">
                            • ${item.availability_status || (item.availability ? '✓ Available' : '✗ Unavailable')}
                        </span>
                    </li>
                `;
            }).join('')}
        </ul>
    `;
}


