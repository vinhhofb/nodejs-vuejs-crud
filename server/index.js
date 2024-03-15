const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');


// Use cors middleware

const app = express();
app.use(cors());
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Dummy data (in-memory database)
let books = [
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' }
];

// Routes

// Get all books
app.get('/books', (req, res) => {
    connection.query('SELECT * FROM books', (error, results, fields) => {
        if (error) throw error;
        res.json(results);
    });
});

// Get a specific book by ID
app.get('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query('SELECT * FROM books WHERE id = ?', [id], (error, results, fields) => {
        if (error) throw error;
        if (results.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(results[0]);
    });
});

// Create a new book
app.post('/books', (req, res) => {
    console.log(req.body);
    const { title, author } = req.body;
    connection.query('INSERT INTO books (title, author) VALUES (?, ?)', [title, author], (error, results, fields) => {
        if (error) throw error;
        const newBook = { id: results.insertId, title, author };
        res.status(201).json(newBook);
    });
});

// Update a book
app.put('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, author } = req.body;
    connection.query('UPDATE books SET title = ?, author = ? WHERE id = ?', [title, author, id], (error, results, fields) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ id, title, author });
    });
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query('DELETE FROM books WHERE id = ?', [id], (error, results, fields) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.sendStatus(204);
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
