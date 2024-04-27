-- PER RECUPERARE DATI DA utentibanca IN  banca
SELECT b.* FROM banca AS b JOIN utentibanca AS u ON b.utente_id = u.id WHERE u.utente_id = ?
