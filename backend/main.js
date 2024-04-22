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

app.get('/checkUserDb', (req, res) => {
  const username = req.query.username;
  const sql = "SELECT * FROM utentibanca WHERE username = '" + username + "'";

  connection.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Errore durante l\'esecuzione della query SQL:', err);
      res.status(500).json({ success: false, error: 'Errore del server' });
    } else {
      res.json({ success: true, messages: result });
    }
  });
})

app.get('/login', (req, res) => {
  const {username, password} = req.query;
  
  const sql = "SELECT * FROM utentibanca WHERE username = '" + username + "' AND password = '" + password + "'";

  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Errore durante l\'esecuzione della query SQL:', err);
      res.status(500).json({ success: false, error: 'Errore del server' });
    } else {
      res.json({ success: true, messages: result });
      console.log("Login in valutazione da: " + username);
    }
  });
})


app.post('/newUserBank', (req, res) => {

  const {username, email, password} = req.body; // mettere in ordine quello che esce dal body

  const query = `INSERT INTO utentibanca (username, email, password) VALUES ('` + username + `', '` + email + `', '` + password + `')`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      res.status(500).json({ error: 'Errore durante la query al database' });
      return;
    }
    
    // Invia i risultati della query come risposta JSON
    res.json(results); 
    console.log("Username: " + username + " has been registred!" + "\n\tEmail: " + email);
  })

});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});