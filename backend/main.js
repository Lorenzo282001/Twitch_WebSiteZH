// VARIABILI

let countRighe = 1;
let server = "\t[SERVER] -> ";
let utente = "\t[USER] -> ";

/////////

const readline = require('readline'); // Scrivere in console...

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funzione per leggere l'input con la console!
function askQuestion() {
  rl.question("> ", (input) => {
    
    if (input !== "")  
      console.log(utente + input);

    if (input === '/ciao')
    {
      console.log(server + "Ciao da console!");
    }
 
    askQuestion(); // Richiamo la funzione per continuare a chiedere l'input
  });
}



// Avvia il processo di input console!
askQuestion();

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
      countRighe++;
      return;
    }
    console.log(countRighe + '\tConnected to MySQL database\n');
    countRighe++;
});

app.get('/checkUserDb', (req, res) => {
  const username = req.query.username;
  const sql = "SELECT * FROM utentibanca WHERE username = '" + username + "'";

  connection.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Errore durante l\'esecuzione della query SQL:', err);
      countRighe++;
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
      countRighe++;
      res.status(500).json({ success: false, error: 'Errore del server' });
    } else {
      res.json({ success: true, messages: result });
      console.log("\n"  + countRighe + server + "\t[LOGIN] - Richiesta Login da username -> " + username);
      countRighe++;
    }
  });
})

app.get('/admin', (req, res) => {
  const {username} = req.query;
  
  const sql = "SELECT * FROM utentibanca WHERE username = '" + username + "'";

  connection.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Errore durante l\'esecuzione della query SQL:', err);
      countRighe++;
      res.status(500).json({ success: false, error: 'Errore del server' });
    } else {
      res.json({ success: true, messages: result });
    }
  });
})

app.post('/newUserBank', (req, res) => {

  const {username, email, password} = req.body; // mettere in ordine quello che esce dal body

  const query = `INSERT INTO utentibanca (username, email, password) VALUES ('` + username + `', '` + email + `', '` + password + `')`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      countRighe++;
      res.status(500).json({ error: 'Errore durante la query al database' });
      return;
    }
    
    // Invia i risultati della query come risposta JSON
    res.json(results); 
    console.log("\n" + countRighe + server + "\t[REGISTRAZIONE] - Username: " + username + " has been registred!" + "\n\t\tEmail: " + email);

    countRighe++;
  })

});

// RICEZIONE MESSAGGI DA PARTE DEL FRONTEND
app.post('/message', (req, res) => {

  const message = req.body.testo;

  console.log("\n" + countRighe + server + "\t"+ message);
  countRighe++;

  res.status(200).send('Ricevuto');
});


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(countRighe + `\tServer running on http://localhost:${port}`);
  countRighe++;
});