CREATE TABLE utentiBanca (

    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(50),
    cognome VARCHAR(50),
    eta INT,
    citta VARCHAR(255),
    data_di_nascita DATE,
    last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin BOOLEAN DEFAULT 0

);