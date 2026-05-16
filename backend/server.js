const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

let pool;

async function initDB() {
  try {
    // Kumonekta sa default XAMPP MySQL
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    // Gumawa ng Database kung wala pa
    await connection.query("CREATE DATABASE IF NOT EXISTS magic_reader_db");
    
    // Gumawa ng connection pool para sa ginawang database
    pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'magic_reader_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Gumawa ng tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        score INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lagyan ng initial data kapag walang laman
    const [lessonRows] = await pool.query('SELECT COUNT(*) as count FROM lessons');
    if (lessonRows[0].count === 0) {
      await pool.query("INSERT INTO lessons (title, status) VALUES ('Introduction to Vowels', 'Published'), ('Consonants Basics', 'Published'), ('The Magic E', 'Draft')");
    }

    const [userRows] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      await pool.query("INSERT INTO users (name, email, score) VALUES ('Juan Dela Cruz', 'juan@example.com', 1250), ('Maria Clara', 'maria@example.com', 980), ('Pedro Penduko', 'pedro@example.com', 1500)");
    }

    console.log("MySQL Database 'magic_reader_db' is Ready!");
  } catch (error) {
    console.error("Hindi maka-konekta sa MySQL. Paki-siguradong naka-START ang MySQL sa XAMPP mo.", error.message);
  }
}

initDB();

// --- API ROUTES FOR LESSONS ---

app.get('/api/lessons', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM lessons ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lessons', async (req, res) => {
  const { title, status } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO lessons (title, status) VALUES (?, ?)', [title, status]);
    res.json({ id: result.insertId, title, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/lessons/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  try {
    await pool.query('UPDATE lessons SET title = ?, status = ? WHERE id = ?', [title, status, id]);
    res.json({ id, title, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/lessons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM lessons WHERE id = ?', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API ROUTES FOR USERS ---

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User banned/deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [lessons] = await pool.query('SELECT COUNT(*) as count FROM lessons WHERE status="Published"');
    res.json({
      totalUsers: users[0].count,
      activeLessons: lessons[0].count,
      recentLogins: 89 // placeholder
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
});
