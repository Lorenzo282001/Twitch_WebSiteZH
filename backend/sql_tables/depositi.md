CREATE TABLE depositi (

    codice_transazione DECIMAL(38) NOT NULL PRIMARY KEY,
    id_userBanca INT NOT NULL,
    importo FLOAT(2) NOT NULL,
    data_deposito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_userBanca) REFERENCES banca(id)
); 