# vendy
A web application designed for Temasek Polytechnic Vending Machine Admin to create, retrieve, update and delete information regarding vending machines in Temasek Polytechnic.

## Overview
Fullstack functional admin vending machine website created for Temasek Polytechnic Y1S2 ADEV/DBAV Project 2.

## Key Features
1) **Admin dashboard quick view**
- Quick view of total vending machines
- Vending machine locations
- Utilises CRUD to retrieve information regarding the information per vending machine such as full location, payment method, items available within the vending machine, machine status and vendor name)
     
2) **Manage vending machines**
  - Able to manage per vending machine
  - Edit machine status (available, out of order, maintenance, decomissioned)
  - Edit the quantity and availability of items
  - Ability to remove items from a specific vending machine
    
3) **Add New Item to Database**
  - Admin is able to add item name, cost and image (usage of multer) of the refreshment.
  - System checks existing items in database (displays the image, name and cost of the existing refreshments)
  - System will check if an existing item already exists in the database (case-sensitive)
  - Will warn the user if there is an existing item

4) **Adding Items to specific vending machines**
- User selects a vending machine
- When the vending machine is selected, the website will display current number of items in the vending machine out of the total items in the database. Example below:
     ![image](https://github.com/user-attachments/assets/d8c39317-c11c-4154-85aa-a0435001dc8c)
- Add item (user cannot add item unless vending machine is selected)
- Input the quantity
- Click "Add to Machine"
- Items will be shown the next time in manage vending machines page
  
5) **Logs function**
- Each CRUD action is logged into the database
- Logs will show the operation, machine ID affected, item ID affected (if any), quantity and timestamp.
- Useful for the admin to track which actions have been performed

## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js with express
- MySQL for backend/database

## Setup and Installation
1. Clone the repository
```
git clone https://github.com/Troaxx/vendy.git
```
2. Run the sql script in MySQL `init.sql`
3. Type `npm install` in terminal
4. Replace your credentials in `db-connections.js`
5. Type `node server.js` in terminal to start the website 
6. Open `localhost:8080/dashboard.html` in your web browser to view the website
- _Note: You can replace the port number in `server.js` under `const PORT =` line. 8080 is just a placeholder._

## Project Structure
- `public` - Whole project folder
- `css` - Stylesheets
- `database` - Initialization of database and populating mock data for the website to be functional
- `images` - Mock images of items 
- `js` - JavaScript files for website functionality and behavior 
- `server.js` - API Routes
- `db-connections.js` - To connect frontend to backend

## License
This project is licensed under the MIT License - see the LICENSE file for details.
  
