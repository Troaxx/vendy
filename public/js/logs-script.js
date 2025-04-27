document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('logs.html')) {
        // Try multiple times to find the table body with a small delay
        let attempts = 0;
        const maxAttempts = 5;
        let logsTable = document.querySelector('#logs-table tbody');
        
        while (!logsTable && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            logsTable = document.querySelector('#logs-table tbody');
            attempts++;
        }
        
        if (!logsTable) {
            console.error('Logs table body not found after multiple attempts. Please check HTML structure.');
            return;
        }

        try {
            const response = await fetch('/api/logs');
            if (!response.ok) throw new Error('Failed to fetch logs');
            const logs = await response.json();
            
            if (logs.length === 0) {
                logsTable.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center;">No logs available</td>
                    </tr>
                `;
                return;
            }
            
            // Display logs
            logsTable.innerHTML = logs.map(log => `
                <tr>
                    <td>${log.operation || 'N/A'}</td>
                    <td>${log.machine_id || 'N/A'}</td>
                    <td>${log.item_id || 'N/A'}</td>
                    <td>${log.quantity !== null ? log.quantity : 'N/A'}</td>
                    <td>${new Date(log.timestamp).toLocaleString()}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading logs:', error);
            logsTable.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">Error loading logs. Please try again later.</td>
                </tr>
            `;
        }
    }
});

async function logOperation(operation, machineId, itemId, quantity) {
    try {
        const response = await fetch('/api/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation,
                machineId,
                itemId,
                quantity
            })
        });

        if (!response.ok) {
            throw new Error('Failed to log operation');
        }
        
        // Refresh the logs table if we're on the logs page
        if (window.location.pathname.includes('logs.html')) {
            window.location.reload();
        }
    } catch (error) {
        console.error('Error logging operation:', error);
    }
}