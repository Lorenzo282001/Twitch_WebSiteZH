-- PER RECUPERARE DATI DA utentibanca IN  banca
SELECT b.* FROM banca AS b JOIN utentibanca AS u ON b.utente_id = u.id WHERE u.utente_id = ?


// Endpoint per gestire l'aggiornamento del saldo
app.post('/aggiornaSaldo', async (req, res) => {
  try {
    const { nuovoSaldo, username } = req.body; // Supponendo che username sia incluso nel body della richiesta
    // Esegui la query per aggiornare il saldo nel database
    const query = `UPDATE banca AS b 
                   JOIN utentibanca AS u ON b.utente_id = u.id 
                   SET b.saldo = b.saldo + ? 
                   WHERE u.username = ?`;
    await db.query(query, [nuovoSaldo, username]);
    
    res.status(200).send('Saldo aggiornato con successo!');
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del saldo:', error);
    res.status(500).send('Si è verificato un errore durante l\'aggiornamento del saldo');
  }
});

--------------

