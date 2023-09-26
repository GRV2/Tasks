Task Management API
This is a Node.js application that provides a RESTful API for managing tasks. It uses a MySQL database to store task information and allows you to perform CRUD (Create, Read, Update, Delete) operations on tasks. Additionally, it provides a metrics API to get task statistics based on their status.


Usage
Starting the Application
To start the application, run the following command:

npm start


The server will start running on port 3000 by default.

API Endpoints
Create a Task: POST /tasks

Create a new task by sending a POST request with JSON data.
Update a Task: PUT /tasks/:id

Update an existing task by sending a PUT request with JSON data and specifying the task ID in the URL.
Get All Tasks (Paginated): GET /tasks

Retrieve a list of tasks with optional pagination by sending a GET request.
Get Task Metrics: GET /metrics

Retrieve task metrics including the count of open, in-progress, and completed tasks.

## Installation

Install my-project with npm

```bash
Before running the application, ensure you have the following installed:

Node.js: Download and install Node.js from https://nodejs.org/.
Getting Started
1 Clone the repository or download the source code to your local machine.

2 Navigate to the project directory in your terminal:
cd task-management-api

3 Install the required Node.js packages using npm:
npm install
```
    
    
## Configuration

 - Open the app.js file and configure the database connection by modifying the following lines
 - const pool = mysql.createPool({
 - host: 'localhost',
 - user: 'user',          // Replace with your MySQL username
 - password: 'password',  // Replace with your MySQL password
 - database: 'database',
 - connectionLimit: 10,
});

Replace 'Admin' and 'Abcd@1234' with your MySQL username and password.


## Example Requests
-Create a Task:
curl -X POST -H "Content-Type: application/json" -d '{
  "title": "Complete project",
  "description": "Finish the Node.js and MySQL project",
  "status": "inprogress"
}' http://localhost:3000/tasks


Update a Task:
curl -X PUT -H "Content-Type: application/json" -d '{
  "status": "completed"
}' http://localhost:3000/tasks/1

Get Task Metrics:

curl http://localhost:3000/metrics
## Authors

- Gourav kumar sharma
