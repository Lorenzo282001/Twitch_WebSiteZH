// Server Node per entrare nel database
const nodemon = require('nodemon');

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const { count } = require('console');

const app = express();

// VARIABILI
let opt_input = ['opt', 'online', 'quit'];
const executedMiddleware = new Set(); // Set per memorizzare i client che hanno già eseguito il middleware

let countRighe = 1;
let server = "\t[SERVER] -> ";
let utente = "\t[USER] -> ";

let loginNow = 0;
let loginPeople = [];

let redirectUrl_logOut = ''; // Memorizza l'URL di reindirizzamento [on logout]
/////////

const readline = require('readline'); // Scrivere in console...

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funzione per leggere l'input con la console!
function askQuestion() {

  rl.question("> ", (input) => {

    if (input !== ""){
      countRighe++;
      console.log(countRighe + utente + input + "\n");
    }

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
        redirectUrl_logOut = 'index.html';

        // Esegui la chiusura della connessione dopo 5 secondi (5000 millisecondi)
        let secondsLeft = 5; // Numero di secondi rimanenti prima della chiusura
        const countdownInterval = setInterval(() => {
          console.log(`Chiusura della connessione tra ${secondsLeft} secondo${secondsLeft !== 1 ? 'i' : ''}...`);
          secondsLeft--;

          // Quando il conto alla rovescia raggiunge 0, chiudi la connessione
          if (secondsLeft === 0) {
            clearInterval(countdownInterval); // Interrompi il countdown
            connection.end((err) => {
              if (err) {
                console.error('Errore durante la chiusura della connessione al database:', err);
              } else {
                console.log('Connessione al database chiusa con successo.');
                executedMiddleware.clear(); // Cancello il set di IP
                rl.close(); // Chiudi l'interfaccia readline
                process.exit(0);
              }
            });
          }
        }, 1000); // Esegui ogni secondo (1000 millisecondi)
        break;
    }
    
    askQuestion(); // Richiamo la funzione per continuare a chiedere l'input
  });
}

// Middleware to parse JSON and form data
app.use(cors()); // Use the cors middleware

app.use((req, res, next) => {
  const clientIP = req.ip; // Ottieni l'indirizzo IP del client
  if (!executedMiddleware.has(clientIP)) {
    // Esegui il middleware solo se il client non lo ha già eseguito
    console.log('Connection IP:', clientIP);
    executedMiddleware.add(clientIP); // Aggiungi l'IP del client al set dei client che hanno eseguito il middleware
  }
  next(); // Passa il controllo al middleware successivo
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

process.on('SIGINT', () => {
  redirectUrl_logOut = 'index.html';
  
  // Esegui la chiusura della connessione dopo 5 secondi (5000 millisecondi)
  let secondsLeft = 5; // Numero di secondi rimanenti prima della chiusura
  const countdownInterval = setInterval(() => {
    console.log(`Chiusura della connessione tra ${secondsLeft} secondo${secondsLeft !== 1 ? 'i' : ''}...`);
    secondsLeft--;

    // Quando il conto alla rovescia raggiunge 0, chiudi la connessione
    if (secondsLeft === 0) {
      clearInterval(countdownInterval); // Interrompi il countdown
      connection.end((err) => {
        if (err) {
          console.error('Errore durante la chiusura della connessione al database:', err);
        } else {
          console.log('Connessione al database chiusa con successo.');
          executedMiddleware.clear(); // Cancello il set di IP
          rl.close(); // Chiudi l'interfaccia readline
          process.exit(0);
        }
      });
    }
  }, 1000); // Esegui ogni secondo (1000 millisecondi)

});

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

  connection.query(query, [username, email, password], (err, results) => {
    if (err) {
      countRighe++;
      console.error('Errore durante la query al database:', err);
      res.status(500).json({ error: 'Errore durante la query al database' });
      return;
    }

    const utenteID = results.insertId; // ID DELL' UTENTE APPENA INSERITO
    
    const queryToBankTable = 'INSERT INTO banca (utente_id, username) VALUES (?, ?)'; 

    connection.query(queryToBankTable, [utenteID, username], (err, result) => {
      if (err) {
        console.error('Errore durante l\'inserimento nella tabella banca:', err);
        res.status(500).send('Errore durante la creazione dell\'utente');
        return;
      }

      res.status(200);
    });

    // Invia i risultati della query come risposta JSON
    res.json(results); 
    countRighe++;
    console.log("\n" + countRighe + server + "\t[REGISTRAZIONE] - Username: " + username + " has been registred!" + "\n\t\tEmail: " + email);
  })

});


// Aggiorno le informazioni di un user!
app.post('/optUserInfo', (req, res) => {

  const {username, nome, cognome, eta, citta, dataNascita} = req.query; // mettere in ordine quello che esce dal body

  // Potrebbero esserci diverse query in base a quale dato viene modificato
  // Questa query viene updata solo se tutti i valori vengono modificati!
  const query = `UPDATE utentibanca SET nome = CASE WHEN '${nome}' != '' AND '${nome}' != 'undefined' THEN '${nome}' ELSE nome END, cognome = CASE WHEN '${cognome}' != '' AND '${cognome}' != 'undefined' THEN '${cognome}' ELSE cognome END, eta = CASE WHEN '${eta}' != '' AND '${eta}' != 'undefined' THEN '${eta}' ELSE eta END, citta = CASE WHEN '${citta}' != '' AND '${citta}' != 'undefined' THEN '${citta}' ELSE citta END, data_di_nascita = CASE WHEN '${dataNascita}' != '' AND '${dataNascita}' != 'undefined' THEN '${dataNascita}' ELSE data_di_nascita END WHERE username = '${username}'`;


  // Nella query se uno dei valori è "" (vuoto) nella connessione viene passato e aggiornato come NULL.

  connection.query(query, [username, nome, cognome, eta, citta, dataNascita],(err, results) => {
    if (err) {  
      countRighe++;
      console.error('Errore durante la query al database:', err);
      res.status(500).json({ error: 'Errore durante la query al database' });
      return;
    }
    
    // Invia i risultati della query come risposta JSON
    res.json(results); 
    countRighe++;
    console.log("\n" + countRighe + server + "\t[IMPOSTAZIONI] - Username: " + username + " change his options!");
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

  // Da pushare solo se non si trova già nell'array
  if (!loginPeople.includes(username)){
    loginPeople.push(username);
    loginNow++;
  }
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
app.get('/logoutAll', (req, res) => {
  // Invia l'URL di reindirizzamento al frontend
  res.json({ redirectUrl_logOut });

  redirectUrl_logOut = '';
  loginPeople = [];
  loginNow = 0;
});

// BANK QUERY CONNECTIONS

app.get('/bankGetMoney', (req, res) => {
  const {username} = req.query;
  
  const sql = `SELECT b.saldo FROM banca AS b JOIN utentibanca AS u ON b.utente_id = u.id WHERE u.username = '${username}'`;

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


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(countRighe + `\tServer running on http://localhost:${port}`);
});