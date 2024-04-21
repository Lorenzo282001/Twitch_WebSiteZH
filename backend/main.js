// Server Node per entrare nel database
const nodemon = require('nodemon');

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();


// Middleware to parse JSON and form data
app.use(cors()); // Use the cors middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'twitchbank_db',
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
});

app.post('/newUserBank', (req, res) => {

  const {} = req.body; // mettere in ordine quello che esce dal body

  const query = '';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      res.status(500).json({ error: 'Errore durante la query al database' });
      return;
    }
    
    // Invia i risultati della query come risposta JSON
    res.json(results); 
    console.log("A new users has been registred!");
  })

});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});