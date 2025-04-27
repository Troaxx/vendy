const express = require('express');
const db = require('./db-connections'); 
const path = require('path');
const multer = require('multer');
const fs = require('fs');

//for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'images'))
    },
    filename: function (req, file, cb) {
        // Get file extension from original filename
        const ext = path.extname(file.originalname);
        // Create filename: timestamp + original extension
        cb(null, Date.now() + ext)
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Create upload middleware
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

// Make sure the uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
const allowedOrigins = [
    'http://127.0.0.1:5500', // Frontend live server
    ''  // Backend server
];

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));


app.use(express.json());

const PORT = 8080;

// API Routes

//dashboard.html routes
//fetch extra machine information to display when a vending machine is clicked
app.get('/api/vending_machine_details/:machineId', async (req, res) => {
    const { machineId } = req.params;
    try {
        // Get machine details including status, location and vendor
        const machineQuery = `
            SELECT vm.vending_machine_id, vm.vendor_name, vm.status_id,
                   s.status_name, l.school, l.block, l.floor
            FROM vending_machine vm
            JOIN status s ON vm.status_id = s.status_id
            JOIN location l ON vm.location_id = l.location_id
            WHERE vm.vending_machine_id = ?;
        `;

        // Get payment methods
        const paymentQuery = `
            SELECT pm.payment_id, pm.payment_name
            FROM vending_payment vp
            JOIN payment_method pm ON vp.payment_id = pm.payment_id
            WHERE vp.vending_id = ?;
        `;

        // Get items with combined availability logic
        const itemsQuery = `
            SELECT 
                i.item_id,
                i.item_name,
                i.item_cost AS price,
                i.item_image,
                i.availability AS global_availability,
                mi.quantity_of_items as item_quantity,
                CASE 
                    WHEN i.availability = 0 THEN 0
                    WHEN mi.quantity_of_items = 0 THEN 0
                    ELSE 1
                END AS effective_availability,
                CASE 
                    WHEN i.availability = 0 THEN 'Item Discontinued'
                    WHEN mi.quantity_of_items = 0 THEN 'Out of Stock'
                    ELSE 'Available'
                END AS availability_status
            FROM vending_item vi
            JOIN item i ON vi.item_id = i.item_id
            JOIN machine_items mi ON mi.machine_id = vi.vending_machine_id 
                AND mi.item_id = i.item_id
            JOIN vending_machine vm ON vm.vending_machine_id = vi.vending_machine_id
            WHERE vi.vending_machine_id = ?
            ORDER BY i.item_name ASC`;

        const [machineDetails] = await db.query(machineQuery, [machineId]);
        const [paymentMethods] = await db.query(paymentQuery, [machineId]);
        const [items] = await db.query(itemsQuery, [machineId]);

        res.json({
            machine: machineDetails[0],
            paymentMethods,
            items
        });
    } catch (err) {
        console.error('Error fetching machine details:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

//manage-machines.html routes
// Fetching the image path from the database
app.get('/api/get-image-path/:itemId', (req, res) => {
    const { itemId } = req.params;
    const query = 'SELECT item_image FROM item WHERE item_id = ?';

    db.query(query, [itemId], (err, results) => {
        if (err) {
            console.error("Error fetching image path:", err);
            return res.status(500).json({ error: "Error fetching image path." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Item not found." });
        }

        const imagePath = results[0].item_image; // e.g., "coca-cola.png"
        res.json({ imagePath }); // Send image path to the client
    });
});
//available items
app.get('/api/available-items/:machineId', (req, res) => {
    const { machineId } = req.params;
    const query = `
        SELECT DISTINCT i.item_id, i.item_name 
        FROM item i 
        WHERE i.item_id NOT IN (
            SELECT vi.item_id 
            FROM vending_item vi 
            WHERE vi.vending_machine_id = ?
        )
    `;
    
    db.query(query, [machineId], (err, results) => {
        if (err) {
            console.error('Error fetching available items:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

//check if machine id has 'all' items in the database
app.get('/api/total-items/:machineId', (req, res) => {
    const { machineId } = req.params;
    const query = `
        SELECT COUNT(*) as itemCount
        FROM vending_item
        WHERE vending_machine_id = ?
    `;
    
    db.query(query, [machineId], (err, results) => {
        if (err) {
            console.error('Error counting items:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ count: results[0].itemCount });
    });
});

// Fetch items for a specific machine
app.get('/api/vending_machines/:machineId/items', async (req, res) => {
    const machineId = req.params.machineId;
    console.log(`Fetching items for Vending Machine ID: ${machineId}`);

    try {
        const query = `
            SELECT i.item_id, i.item_name, i.item_cost, i.item_image, i.availability,
                   mi.quantity_of_items as item_quantity
            FROM vending_item vi
            JOIN item i ON vi.item_id = i.item_id
            JOIN machine_items mi ON mi.item_id = i.item_id AND mi.machine_id = ?
            WHERE vi.vending_machine_id = ?
        `;

        const [results] = await db.query(query, [machineId, machineId]);
        console.log('Query results:', results);
        res.json(results || []);
    } catch (err) {
        console.error("Error details:", err);
        res.status(500).json({ error: "Failed to fetch items." });
    }
});

// for updating machine status
app.put('/api/vending-machine/status/:machineId', async (req, res) => {
    const { machineId } = req.params;
    const { status_id } = req.body;

    try {
        if (!machineId || !status_id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields. Please enter a status ID and machine ID to continue.' 
            });
        }

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(
                'UPDATE vending_machine SET status_id = ? WHERE vending_machine_id = ?',
                [status_id, machineId],
                (error, result) => {
                    if (error) {
                        return res.status(400).json({ error: error });
                    }
            });

            await connection.commit();
            res.json({title: "Machine status updated successfully!"});
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error updating machine status:', err);
        res.status(500).json({ error: 'Database error:', details: err.message });
    }
});


// Delete item from machine
app.delete('/api/vending-machine-items/:vendingMachineId/:itemId', async (req, res) => {
    const { vendingMachineId, itemId } = req.params;

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Delete from machine_items first (due to foreign key constraint)
            await connection.query(
                'DELETE FROM machine_items WHERE machine_id = ? AND item_id = ?',
                [vendingMachineId, itemId]
            );

            // Then delete from vending_item
            await connection.query(
                'DELETE FROM vending_item WHERE vending_machine_id = ? AND item_id = ?',
                [vendingMachineId, itemId]
            );

            await connection.commit();
            res.json({title: "Item deleted successfully." });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error removing item:', err);
        res.status(500).json({title: "Error removing item:", error: err.message });
    }
});

// Update item
app.put('/api/update-item/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const { item_quantity, availability, vending_machine_id } = req.body;

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Update availability in item table
            await connection.query(
                'UPDATE item SET availability = ? WHERE item_id = ?',
                [availability, itemId]
            );

            // Update quantity in machine_items table
            await connection.query(
                'UPDATE machine_items SET quantity_of_items = ? WHERE machine_id = ? AND item_id = ?',
                [item_quantity, vending_machine_id, itemId]
            );

            await connection.commit();
            res.json({title: "Items have been successfully updated!", success: true });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});


// Add new item to vending machine
app.post('/api/vending-machine-items', async (req, res) => {
    const { vending_machine_id, item_id, quantity } = req.body;
    
    console.log('Received request, adding new items to vending machine:', { vending_machine_id, item_id, quantity });

    if (!vending_machine_id || !item_id || !quantity) {
        return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields. Did you forget to enter a vending machine ID, item ID, and quantity?' 
        });
    }

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // First check if item already exists in machine
            const [existingItem] = await connection.query(
                'SELECT COUNT(*) as count FROM vending_item WHERE vending_machine_id = ? AND item_id = ?',
                [vending_machine_id, item_id]
            );

            if (existingItem[0].count > 0) {
                await connection.rollback();
                return res.status(400).json({ 
                    success: false, 
                    error: 'Item already exists in this machine. Please add another item.' 
                });
            }

            // Get next vending_item_id
            const [maxResult] = await connection.query(
                'SELECT COALESCE(MAX(vending_item_id), 0) + 1 as next_id FROM vending_item'
            );
            const nextId = maxResult[0].next_id;
            console.log('Generated next ID:', nextId);

            // Insert into vending_item
            await connection.query(
                'INSERT INTO vending_item (vending_item_id, vending_machine_id, item_id) VALUES (?, ?, ?)',
                [nextId, vending_machine_id, item_id]
            );
            console.log('Inserted into vending_item');

            // Insert into machine_items
            await connection.query(
                'INSERT INTO machine_items (machine_id, item_id, quantity_of_items) VALUES (?, ?, ?)',
                [vending_machine_id, item_id, quantity]
            );
            console.log('Inserted into machine_items');

            await connection.commit();
            console.log('Transaction committed');
            res.json({title: "Items have been successfully added!", success: true });
        } catch (err) {
            await connection.rollback();
            console.error('Error adding item:', err);
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error adding item:', err);
        res.status(500).json({ 
            success: false, 
            error: err.message || 'Error adding item' 
        });
    }
});

//add-item-data.html api routes
//fetches all items that exist in the entire db
app.get('/api/items', async (req, res) => {
    try {
        // If machineId is provided, get items not in that machine
        if (req.query.machineId) {
            const query = `
                SELECT i.item_id, i.item_name, i.item_cost, i.item_image 
                FROM item i 
                WHERE i.item_id NOT IN (
                    SELECT vi.item_id 
                    FROM vending_item vi 
                    WHERE vi.vending_machine_id = ?
                )
            `;
            const [results] = await db.query(query, [req.query.machineId]);
            res.json(results);
        } else {
            // Get all items if no machineId
            const query = 'SELECT item_id, item_name, item_cost, item_image FROM item';
            const [results] = await db.query(query);
            res.json(results);
        }
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ error: 'Database error' });
    }
});
//debugging for database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("Database test failed:", err);
        res.status(500).json({ error: "Database connection test failed" });
    }
});

// Check if machine has all available items
app.get('/api/machine-item-status/:machineId', async (req, res) => {
    const { machineId } = req.params;
    try {
        // Get total items in database
        const [totalItems] = await db.query('SELECT COUNT(*) as count FROM item');
        
        // Get items in this machine
        const [machineItems] = await db.query(
            'SELECT COUNT(*) as count FROM vending_item WHERE vending_machine_id = ?',
            [machineId]
        );
        
        // Compare counts and get available items
        const allItemsInMachine = totalItems[0].count === machineItems[0].count;
        
        let availableItems = [];
        if (!allItemsInMachine) {
            // Get items not in this machine
            const [items] = await db.query(`
                SELECT i.item_id, i.item_name, i.item_cost
                FROM item i
                WHERE i.item_id NOT IN (
                    SELECT item_id FROM vending_item 
                    WHERE vending_machine_id = ?
                )
            `, [machineId]);
            availableItems = items;
        }
        
        res.json({
            allItemsInMachine,
            totalItems: totalItems[0].count,
            machineItems: machineItems[0].count,
            availableItems
        });
    } catch (err) {
        console.error('Error checking machine items:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// check if item name exists
app.get('/api/items/check-name/:itemName', async (req, res) => {
    try {
        const { itemName } = req.params;
        const [existingItems] = await db.query(
            'SELECT item_name FROM item WHERE LOWER(item_name) = LOWER(?)',
            [itemName]
        );
        res.json({ exists: existingItems.length > 0 });
    } catch (err) {
        console.error('Error checking item name:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

//uploading/inserting new item into database

app.post('/api/items', upload.single('item_image'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const { item_name, item_cost } = req.body;
        const item_image = req.file.filename;

        // Validate inputs
        if (!item_name || !item_cost) {
            // Delete uploaded file if validation fails
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if item with similar name already exists (case insensitive)
        const [existingItems] = await db.query(
            'SELECT item_name FROM item WHERE LOWER(item_name) = LOWER(?)',
            [item_name]
        );

        if (existingItems.length > 0) {
            // Delete uploaded file since we won't be using it
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ 
                error: 'An item with this name already exists in the database. Please choose a different name.'
            });
        }

        const [result] = await db.query(
            'INSERT INTO item (item_name, item_cost, item_image) VALUES (?, ?, ?)',
            [item_name, item_cost, item_image]
        );

        res.json({ 
            success: true,
            item_id: result.insertId,
            message: 'Item added successfully'
        });
    } catch (err) {
        // Delete uploaded file if database operation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error adding item:', err);
        res.status(500).json({ error: 'Failed to add item. Please try again' });
    }
});


// logs.html

//add the log into the database after a CRUD operation has occured
app.post('/api/logs', async (req, res) => {
    const { operation, machineId, itemId, quantity } = req.body;
    
    try {
        const query = `
            INSERT INTO operation_logs (operation, machine_id, item_id, quantity)
            VALUES (?, ?, ?, ?)
        `;
        await db.query(query, [operation, machineId, itemId, quantity]);
        res.json({title: "Operation logged successfully!", success: true });
    } catch (err) {
        console.error('Error logging operation:', err);
        res.status(500).json({ error: 'Failed to log operation' });
    }
});

//fetch all logs

app.get('/api/logs', async (req, res) => {
    try {
        const query = `
            SELECT 
                log_id,
                operation,
                machine_id,
                item_id,
                quantity,
                timestamp
            FROM operation_logs
            ORDER BY timestamp DESC
        `;
        const [logs] = await db.query(query);
        res.json(logs);
    } catch (err) {
        console.error('Error fetching logs:', err);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`API Server is running on http://localhost:${PORT}`);
});
