// Server Node per entrare nel database
const nodemon = require('nodemon');

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const { count } = require('console');

const app = express();

// VARIABILI
let firstTime = true; // Variabile per tenere traccia del primo colpo CTRL + C
let opt_input = ['opt', 'online', 'quit', 'ips', 'kick [username]'];

let countRighe = 1;
let server = "\t[SERVER] -> ";
let utente = "\t[USER] -> ";

let loginNow = 0;
let loginPeople = []; // username 
let p_ip_loginUser = {};

let redirectUrl_logOut = ''; // Memorizza l'URL di reindirizzamento [on logout]
let kickByIP = ''; // Kick a User using his IP
/////////

const readline = require('readline'); // Scrivere in console...

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getClientIp(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress.replace(/^.*:/, '');
}

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
          console.log(`Chiusura della connessione tra ${secondsLeft} second${secondsLeft !== 1 ? 'i' : 'o'}.`);
          secondsLeft--;

          // Quando il conto alla rovescia raggiunge 0, chiudi la connessione
          if (secondsLeft === 0) {
            clearInterval(countdownInterval); // Interrompi il countdown
            connection.end((err) => {
              if (err) {
                console.error('Errore durante la chiusura della connessione al database:', err);
              } else {
                console.log('Connessione al database chiusa con successo.');
                rl.close(); // Chiudi l'interfaccia readline
                process.exit(0);
              }
            });
          }
        }, 1000); // Esegui ogni secondo (1000 millisecondi)
        break;
      case 'ips':

        countRighe++;
        console.log(countRighe + server + "Ecco tutti gli utenti online con i loro IP: ");

        for (const chiave in p_ip_loginUser)
        {
          countRighe++;
          console.log(countRighe + "\t\t - Username: " + chiave + " | IP: " + p_ip_loginUser[chiave]);
        }

        break;
    }

    if (input.includes("kick")) 
    {
      let userToKick = input.split(" ")[1];

      for (const chiave in p_ip_loginUser)
      {
        if (chiave === userToKick)
        {
          kickByIP = p_ip_loginUser[chiave];
          break;
        }
      }
    }
    
    askQuestion(); // Richiamo la funzione per continuare a chiedere l'input
  });
}

// Middleware to parse JSON and form data
app.use(cors()); // Use the cors middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

process.on('SIGINT', () => {
  if (firstTime) {
    redirectUrl_logOut = 'index.html';
  
    // Esegui la chiusura della connessione dopo 5 secondi (5000 millisecondi)
    let secondsLeft = 5; // Numero di secondi rimanenti prima della chiusura
    const countdownInterval = setInterval(() => {
      console.log(`Chiusura della connessione tra ${secondsLeft} second${secondsLeft !== 1 ? 'i' : 'o'}.`);
      secondsLeft--;

      // Quando il conto alla rovescia raggiunge 0, chiudi la connessione
      if (secondsLeft === 0) {
        clearInterval(countdownInterval); // Interrompi il countdown
        connection.end((err) => {
          if (err) {
            console.error('Errore durante la chiusura della connessione al database:', err);
          } else {
            console.log('Connessione al database chiusa con successo.');
            rl.close(); // Chiudi l'interfaccia readline
            process.exit(0);
          }
        });
      }
    }, 1000); // Esegui ogni secondo (1000 millisecondi)
    
    firstTime = false; // Imposta il flag a false dopo il primo colpo
  }
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
      console.log("\n"  + countRighe + server + "\t[LOGIN] - Richiesta Login da username -> " + username + " | IP -> " + getClientIp(req));
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

  const {username, email, password, pin} = req.body; // mettere in ordine quello che esce dal body
  const saldo_init = 0;

  const query = `INSERT INTO utentibanca (username, email, password) VALUES ('` + username + `', '` + email + `', '` + password + `')`;

  connection.query(query, [username, email, password], (err, results) => {
    if (err) {
      countRighe++;
      console.error('Errore durante la query al database:', err);
      res.status(500).json({ error: 'Errore durante la query al database' });
      return;
    }

    const utenteID = results.insertId; // ID DELL' UTENTE APPENA INSERITO
    
    const queryToBankTable = 'INSERT INTO banca (utente_id, username, saldo, pin) VALUES (?, ?, ?, ?)'; 

    connection.query(queryToBankTable, [utenteID, username, saldo_init, pin], (err, result) => {
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

// Get PIN
app.get('/getUserPinBank', (req, res) => {  
  const {username} = req.query;
  const sql = `SELECT b.pin FROM banca AS b JOIN utentibanca AS u ON b.utente_id = u.id WHERE u.username = '${username}'`;

  connection.query(sql, [username], (err, result) => {
    if (err) {
      countRighe++;
      console.error('Errore durante l\'esecuzione della query SQL:', err);
      res.status(500).json({ success: false, error: 'Errore del server' });
    } else {
      res.json({ success: true, getPin: result });
    }
  });
})


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

  if (message.includes("kick"))
  {
      let kickName = message.split(" ")[1];

      for (const chiave in p_ip_loginUser)
      {
        if (chiave === kickName)
        {
          delete p_ip_loginUser[chiave];
          
          let indiceUsername = loginPeople.indexOf(kickName);

          if (indiceUsername !== -1)
          {
            loginPeople.splice(indiceUsername, 1);
          }
        
          if (loginNow>0)
            loginNow--;

          break;
        } 
      }    
  }

  res.status(200).send('Ricevuto');
});

//Ricezione login/logout success
app.post('/loginSuccess', (req, res) => {

  const username = req.body.testo;


  p_ip_loginUser[username] = getClientIp(req);

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

  // Elimino dal dizionario l'username col suo ip
  for (const chiave in p_ip_loginUser) {
      if (chiave === username)
      {
        delete p_ip_loginUser[chiave];
        break; 
      }
  }

  if (indiceUsername !== -1)
  {
    loginPeople.splice(indiceUsername, 1);
  }

  if (loginNow>0)
    loginNow--;
  res.status(200).send('Ricevuto');
});

// Return the IP of fronted user
app.get('/getIP', (req, res) => {
  const ipAddress = getClientIp(req);
  res.json({ ipAddress });
});

// Method to kick someone
app.get('/kick', (req, res) => {
  // Invia l'URL di reindirizzamento al frontend
  res.json({ kickByIP });
  kickByIP = '';
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

app.post('/aggiornaSaldo', (req, res) => {
  const { nuovoSaldo, username } = req.query; 
  // Esegui la query per aggiornare il saldo nel database
  const sql = `UPDATE banca AS b JOIN utentibanca AS u ON b.utente_id = u.id SET b.saldo = b.saldo + ${nuovoSaldo} WHERE u.username = '${username}'`;

  connection.query(sql, [nuovoSaldo, username], (err, result) => {
    if (err) {
      countRighe++;
      console.error('Errore durante l\'esecuzione della query SQL:', err);
      res.status(500).json({ success: false, error: 'Errore del server' });
    } else {
      countRighe++;
      console.log(countRighe + server + " Username: " + username + " ha fatto un deposito!");
      res.json({ success: true, messages: result });
    }
  });
  
  res.status(200);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(countRighe + `\tServer running on http://localhost:${port}`);
});