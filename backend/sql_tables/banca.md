CREATE TABLE banca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utente_id INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    saldo FLOAT(2) DEFAULT 0.0,
    numero_transazioni INT DEFAULT 0,
    pin INT NOT NULL,                                            

    FOREIGN KEY (utente_id) REFERENCES utentibanca(id)
);