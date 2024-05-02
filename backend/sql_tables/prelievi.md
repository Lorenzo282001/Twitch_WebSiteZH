CREATE TABLE prelievi (

    codice_transazione DECIMAL(38) NOT NULL PRIMARY KEY,
    id_userBanca INT NOT NULL,
    importo FLOAT(2) NOT NULL,
    data_prelievo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_userBanca) REFERENCES banca(id)
); 