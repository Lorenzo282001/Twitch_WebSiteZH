// VARIABILI
let opt_input = ['opt', 'online', 'quit'];

let countRighe = 1;
let server = "\t[SERVER] -> ";
let utente = "\t[USER] -> ";

let loginNow = 0;
let loginPeople = [];

/////////

const readline = require('readline'); // Scrivere in console...

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funzione per leggere l'input con la console!
function askQuestion() {
  rl.question("> ", (input) => {
    
    switch(input) {
      case 'opt':
        countRighe++;
        console.log(countRighe + server + " Comandi da console:");
        for (let i in opt_input) {
          countRighe++;
          console.log(countRighe + "\t\t\t- " + opt_input[i]);
        }
        break;
    
      case 'online':
        countRighe++;
        console.log(countRighe + server + "Ci sono " + loginNow + " utenti nei propri conti!");
        if (loginPeople.length > 0) {
          for (let p in loginPeople) {
            countRighe++;
            console.log(countRighe + "\t\t- " + loginPeople[p]);
          }
        }
        break;
      case 'quit':
          // Invia una richiesta di logout totale al server
          fetch('http://localhost:3000/logoutAllUsers', { method: 'POST' })
            .then(response => {
              if (response.ok) {
                console.log('Richiesta di logout inviata a tutti gli utenti.');
                // Chiudi la connessione al database
                connection.end((err) => {
                  if (err) {
                    console.error('Errore durante la chiusura della connessione al database:', err);
                  }

                  // Reindirizza tutti gli utenti alla pagina principale
                  res.status(302).json({ redirect: 'index.html' });
                });
              } else {
                console.error('Errore durante l\'invio della richiesta di logout:', response.statusText);
                // Se c'è un errore, termina il server comunque
                console.log("Il server si spegne.");
                process.exit(); // Termina il processo Node.js
              }
            })
          .catch(error => {
            console.error('Errore durante l\'invio della richiesta di logout:', error);
            // Se c'è un errore, termina il server comunque
            console.log("Il server si spegne.");
            process.exit(); // Termina il processo Node.js
          });
        break;
    }
    
    
 
    askQuestion(); // Richiamo la funzione per continuare a chiedere l'input
  });
}

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
      countRighe++;
      console.error('Error connecting to MySQL:', err);
      return;
    }

    countRighe++;
    console.log(countRighe + '\tConnected to MySQL database\n');

    countRighe++;
    console.log(countRighe + server + "--  Scrivi opt per i comandi -- \n");

    // Avvia il processo di input console!
    askQuestion();
});


app.get('/checkUserDb', (req, res) => {
  const username = req.query.username;
  const sql = "SELECT * FROM utentibanca WHERE username = '" + username + "'";

  connection.query(sql, [username], (err, result) => {
    if (err) {
      countRighe++;
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
      countRighe++;
      console.error('Errore durante l\'esecuzione della query SQL:', err);
      res.status(500).json({ success: false, error: 'Errore del server' });
    } else {
      res.json({ success: true, messages: result });
      countRighe++;
      console.log("\n"  + countRighe + server + "\t[LOGIN] - Richiesta Login da username -> " + username);
    }
  });
})

app.get('/admin', (req, res) => {
  const {username} = req.query;
  
  const sql = "SELECT * FROM utentibanca WHERE username = '" + username + "'";

  connection.query(sql, [username], (err, result) => {
    if (err) {
      countRighe++;
      console.error('Errore durante l\'esecuzione della query SQL:', err);
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
      countRighe++;
      console.error('Errore durante la query al database:', err);
      res.status(500).json({ error: 'Errore durante la query al database' });
      return;
    }
    
    // Invia i risultati della query come risposta JSON
    res.json(results); 
    countRighe++;
    console.log("\n" + countRighe + server + "\t[REGISTRAZIONE] - Username: " + username + " has been registred!" + "\n\t\tEmail: " + email);
  })

});

// RICEZIONE MESSAGGI DA PARTE DEL FRONTEND
app.post('/message', (req, res) => {

  const message = req.body.testo;
  countRighe++;
  console.log("\n" + countRighe + server + "\t"+ message);

  res.status(200).send('Ricevuto');
});

//Ricezione login/logout success
app.post('/loginSuccess', (req, res) => {

  const username = req.body.testo;

  loginNow++;
  loginPeople.push(username);
  res.status(200).send('Ricevuto');
});

app.post('/logoutSuccess', (req, res) => {
  const username = req.body.testo;
  let indiceUsername = loginPeople.indexOf(username);

  if (indiceUsername !== -1)
  {
    loginPeople.splice(indiceUsername, 1);
  }

  if (loginNow>0)
    loginNow--;
  res.status(200).send('Ricevuto');
});

// Allo spegnimento del server node (quit)
app.post('/logoutAllUsers', (req, res) => {
  // Invia una richiesta di logout a tutti gli utenti connessi
  // Ad esempio, puoi usare WebSockets o un altro metodo per comunicare con il frontend
  // In questo esempio, si invia una risposta JSON al frontend
  res.json({ message: 'Richiesta di logout inviata a tutti gli utenti' });

  // Chiudi la connessione SQL
  connection.end((err) => {
    if (err) {
      console.error('Errore durante la chiusura della connessione al database:', err);
    }
    
    // Termina il server Node.js
    countRighe++;
    console.log(countRighe + "\t[SERVER] -> Connessione SQL terminata. Il server si spegne.");
    process.exit(); // Termina il processo Node.js
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(countRighe + `\tServer running on http://localhost:${port}`);
});