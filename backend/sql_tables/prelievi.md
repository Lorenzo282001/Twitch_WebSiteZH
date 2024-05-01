CREATE TABLE prelievi (

    id INT AUTO_INCREMENT PRIMARY KEY,
    id_userBanca INT NOT NULL,
    codice_transazione INT NOT NULL,
    importo FLOAT(2) NOT NULL,
    data_prelievo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_userBanca) REFERENCES banca(id)
); 