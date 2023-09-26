const express = require('express');
const mysql = require('mysql2/promise');
const moment = require('moment');
require('dotenv').config();

const app = express();
app.use(express.json());
console.log(process.env.DB_USER, process.env.DB_PASSWORD);
const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'task',
  connectionLimit: 10,
});

// Create a task
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
      [title, description, status]
    );
    const taskId = result.insertId;
    const task = {
      id: taskId,
      title,
      description,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
      [title, description, status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all tasks (paginated)
app.get('/tasks', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const [rows, fields] = await pool.query(
      'SELECT * FROM tasks LIMIT ? OFFSET ?',
      [limit, (page - 1) * limit]
    );
    const tasks = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get task metrics
app.get('/metrics', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT status, COUNT(*) AS count FROM tasks GROUP BY status'
    );

    const metrics = {
      open_tasks: 0,
      inprogress_tasks: 0,
      completed_tasks: 0,
    };

    rows.forEach((row) => {
      switch (row.status) {
        case 'open':
          metrics.open_tasks = row.count;
          break;
        case 'inprogress':
          metrics.inprogress_tasks = row.count;
          break;
        case 'completed':
          metrics.completed_tasks = row.count;
          break;
      }
    });

    res.json(metrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
