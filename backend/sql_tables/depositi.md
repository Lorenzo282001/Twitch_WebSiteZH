CREATE TABLE depositi (

    id INT AUTO_INCREMENT PRIMARY KEY,
    id_userBanca INT NOT NULL,
    codice_transazione INT NOT NULL,
    importo FLOAT(2) NOT NULL,
    data_deposito TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_userBanca) REFERENCES banca(id)
); 