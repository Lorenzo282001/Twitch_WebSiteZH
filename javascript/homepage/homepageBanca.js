// QUI CARICO GLI SCRIPT CHE GESTISCONO IN HOMEPAGE
// TUTTO QUELLO CHE RIGUARDA LA BANCA

let saldo = 0;
let transazioniArray = [];

let deposito = $("#transazioniDeposito");
let prelievo = $("#transazioniPrelievo");
let cronologia = $("#transazioniCronologia");

// Metodo per formattare il saldo, in modo che appena trova un gruppo 
// di 3 cifre inserisce una virgola
function formattaNumero(numero) {
    // Converti il numero in una stringa
    let numeroStringa = numero.toString();
    
    // Dividi la parte intera e la parte decimale
    let parti = numeroStringa.split('.');
    
    // Formatta la parte intera con separatori delle migliaia
    parti[0] = parti[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // <--
    
    // Ricostruisci il numero con la parte intera e la parte decimale
    return parti.join('.');
}

function getMoney() {
    // Prendo i soldi da username
    fetch(`http://localhost:3000/bankGetMoney?username=${localStorage.getItem("userBank")}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.messages && data.messages.length > 0) {
            saldo = data.messages[0].saldo;
            $("#moneySection").html(`<span style = "margin-right:20px;">Saldo</span> €` + formattaNumero(saldo));
        }
    })
    .catch(error => {
        console.error('Si è verificato un errore nel backend:', error);
        window.location.href = 'index.html';
    });
}

function addMoneyDeposito(nuovoSaldo) {  
    if (nuovoSaldo != ""){

        pinInput = $("#pinInputDeposito").val();
        
        fetch(`http://localhost:3000/getUserPinBank?username=${localStorage.getItem('userBank')}`, { // Controllo il PIN prima del deposito
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }    
        })
        .then(response => response.json())
        .then(  data => {
            // Verifio se data esiste, e se il pin è corretto!
            if (data && data.getPin && data.getPin.length > 0) {
                if (data.getPin[0].pin === parseInt(pinInput)) {
                    fetch(`http://localhost:3000/aggiornaSaldo?nuovoSaldo=${nuovoSaldo}&username=${localStorage.getItem('userBank')}`, { // Aggiungo +1 utente al backend!
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }    
                        })
                        .then(() => {
                            $("#saldoDepositoToAdd").val('');
                            location.reload();
                        })
                        .catch(error => {
                            console.error('Si è verificato un errore duran  te l\'invio del messaggio di login al backend:', error);
                            // Potresti gestire eventuali errori qui, se necessario
                        });
                }
                else { // Pin Errato
                    $("#messaggioPinDeposito").css('color', "red");
                    $("#messaggioPinDeposito").text("Pin inserito errato!");
                    
                    setTimeout(() => {
                        $("#messaggioPinDeposito").text('');
                        $("#pinInputDeposito").val('');
                        $("#saldoDepositoToAdd").val('');
                    }, 2000);
                }
            }
        })
        .then(() => {
            // Invia il messaggio di login al backend
            fetch(`http://localhost:3000/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ testo: "[BankOperation] - Username: " + localStorage.getItem("userBank") + " ha effettuato un'operazione bancaria!"}),
            })
            .catch(error => {
                console.error('Si è verificato un errore durante l\'invio del messaggio di login al backend:', error);
                // Potresti gestire eventuali errori qui, se necessario
            });
        })
        .catch(error => {
            console.error('Si è verificato un errore duran  te l\'invio del messaggio di login al backend:', error);
            // Potresti gestire eventuali errori qui, se necessario
        });
    }
};

function takeMoneyPrelievo(saldoToTake) {

    if (saldoToTake != "")
    {
        pinInput = $("#pinInputPrelievo").val();

        fetch(`http://localhost:3000/getUserPinBank?username=${localStorage.getItem('userBank')}`, { // Controllo il PIN prima del deposito
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }    
        })
        .then(response => response.json())
        .then(  data => {
            // Verifio se data esiste, e se il pin è corretto!
            if (data && data.getPin && data.getPin.length > 0) {
                if (data.getPin[0].pin === parseInt(pinInput)) {
                    fetch(`http://localhost:3000/bankGetMoney?username=${localStorage.getItem("userBank")}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.messages && data.messages.length > 0) {
                            saldo = data.messages[0].saldo;
                            
                            if (parseFloat(saldo) >= parseFloat(saldoToTake)){
                                // Ho messo un meno (-) davanti al nuovSaldo per far capire che si sta effettuando un prelievo!
                                fetch(`http://localhost:3000/aggiornaSaldo?nuovoSaldo=-${saldoToTake}&username=${localStorage.getItem('userBank')}`, { // Aggiungo +1 utente al backend!
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                }    
                                })
                                .then(() => {
                                    $("#saldoPrelievoToRemove").val('');
                                    location.reload();
                                })
                            }
                            else {
                                $("#messaggioPinPrelievo").css('color', "red");
                                $("#messaggioPinPrelievo").text("Saldo insufficiente!");
                                
                                setTimeout(() => {
                                    $("#messaggioPinPrelievo").text('');
                                    $("#pinInputPrelievo").val('');
                                    $("#saldoPrelievoToRemove").val('');
                                }, 2000);   
                            }
                        }
                    })
                }
                else { // Pin Errato
                    $("#messaggioPinPrelievo").css('color', "red");
                    $("#messaggioPinPrelievo").text("Pin inserito errato!");
                    
                    setTimeout(() => {
                        $("#messaggioPinPrelievo").text('');
                        $("#pinInputPrelievo").val('');
                        $("#saldoPrelievoToRemove").val('');
                    }, 2000);
                }
            }
        })
        .then(() => {
            // Invia il messaggio di login al backend
            fetch(`http://localhost:3000/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ testo: "[BankOperation] - Username: " + localStorage.getItem("userBank") + " ha effettuato un'operazione bancaria!"}),
            })
            .catch(error => {
                console.error('Si è verificato un errore durante l\'invio del messaggio di login al backend:', error);
                // Potresti gestire eventuali errori qui, se necessario
            });
        })
        .catch(error => {
            console.error('Si è verificato un errore duran  te l\'invio del messaggio di login al backend:', error);
            // Potresti gestire eventuali errori qui, se necessario
        });

    }

}

function getTransazioni() {  

    fetch(`http://localhost:3000/getAllTransactions?username=${localStorage.getItem('userBank')}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Errore durante la richiesta GET /getAllTransactions');
        }
        return response.json();
    })
    .then(data => {
        if (data)
        {
            data = data.messages;

            let combinedArray = [];

            // Verifica se l'array depositi contiene elementi
            if (data.depositi && data.depositi.length > 0) {
                combinedArray = combinedArray.concat(data.depositi);
            }   

        
            // Verifica se l'array prelievi contiene elementi
            if (data.prelievi && data.prelievi.length > 0) {
                combinedArray = combinedArray.concat(data.prelievi);
            }
            

            // Ordina l'array combinato solo se contiene elementi
            if (combinedArray.length > 0) {
                // combinedArray.sort((a, b) => new Date(a.data_deposito) - new Date(b.data_prelievo));
                combinedArray.sort((a, b) => new Date(a.data_deposito || a.data_prelievo) - new Date(b.data_deposito || b.data_prelievo));
                transazioniArray = combinedArray;

                for (let x = combinedArray.length - 1; x >= 0; x--) {
                    let rowData = '';
                    
                    if (combinedArray[x].data_deposito) {
                        rowData += `<div class="columnTableTransazioni"><span class='depositoPiu'>+</span></div>`;
                        rowData += `<div class="columnTableTransazioni">€ ${formattaNumero(combinedArray[x].importo)}</div>`;
                        rowData += `<div class="columnTableTransazioni">${combinedArray[x].codice_transazione}</div>`;
                        rowData += `<div class="columnTableTransazioni">${new Date(combinedArray[x].data_deposito).toUTCString()}</div>`;
                    }
                    
                    if (combinedArray[x].data_prelievo) {
                        rowData += `<div class="columnTableTransazioni"><span class='prelievoMeno'>-</span></div>`;
                        rowData += `<div class="columnTableTransazioni">€ ${formattaNumero(combinedArray[x].importo)}</div>`;
                        rowData += `<div class="columnTableTransazioni">${combinedArray[x].codice_transazione}</div>`;
                        rowData += `<div class="columnTableTransazioni">${new Date(combinedArray[x].data_prelievo).toUTCString()}</div>`;
                    }
                    
                    $('#tabellaTransazioni').append(`<div class="rowTableTransazioni borderBottomDark rowTableTransazioniLayout allTransazioni">${rowData}</div>`);
                }
            }             
        }
    })
    .then(() => {
        // Carico il numero di transazioni totali nella pagina TRANSAZIONI
        fetch(`http://localhost:3000/getTransazioniTotali?username=${localStorage.getItem("userBank")}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.messages && data.messages.length > 0) {
                numeroTransazioniTotali = data.messages[0].numero_transazioni;
                $("#transazioniTotaliPage").html("Numero Transazioni: " + numeroTransazioniTotali);
            }
        })
        .catch(error => {
            console.error('Si è verificato un errore nel backend:', error);
            window.location.href = 'index.html';
        });
    })
    .catch(error => {
        console.error('Si è verificato un errore:', error);
    });



};

// on document ready
$(document).ready(function () {

    // carico il saldo
    getMoney();

    // carico le transazioni
    getTransazioni();

    /* FORM DEPOSITO SEND MONEY */
    $("#formInputDeposito form").on("click", function (event) {
        event.preventDefault();
    });

    $("#addMoney").on("click", function (event) {
        event.preventDefault();
        addMoneyDeposito($("#saldoDepositoToAdd").val());
    });
    /* */ 

    /* FORM PRELIEVO TAKE MONEY */
    $("#formInputPrelievo form").on("click", function (event) {
        event.preventDefault();
    });

    $("#takeMoney").on("click", function (event) {
        event.preventDefault();
        takeMoneyPrelievo($("#saldoPrelievoToRemove").val());
    });

    /* */
    
    /* Section main top right */
    $("#moneySection").on("click", function () {
        $(".tiraSu").slideUp(750);
    });
    
    $("#profiloUtente").on("click", function () {

        if ($("#profiloUtenteContainer").css("display") === "none"){
            $(".tiraSu").slideUp(750);
            $("#profiloUtenteContainer").slideDown(750);
        }else {
            $("#profiloUtenteContainer").slideUp(750);
        }
        
    });

    $("#Transazioni").on("click", function () {

        if ($("#TransazioniContainer").css("display") === "none"){
            $(".tiraSu").slideUp(0);
            $("#TransazioniContainer").slideDown(750);
            $("#transazioniCronologiaMain").slideDown(750);
            $("#TransazioniContainer").css("display", "flex");
        }else {
            $("#TransazioniContainer").slideUp(750);
        }
        
    });

    $("#Prestiti").on("click", function () {

        if ($("#PrestitiContainer").css("display") === "none"){
            $(".tiraSu").slideUp(0);
            $("#PrestitiContainer").slideDown(750);
        }else {
            $("#PrestitiContainer").slideUp(750);
        }
        
    });

    $("#Bonifici").on("click", function () {

        if ($("#BonificiContainer").css("display") === "none"){
            $(".tiraSu").slideUp(0);
            $("#BonificiContainer").slideDown(750);
        }else {
            $("#BonificiContainer").slideUp(750);
        }
        
    });

    $("#transazioniCronologiaMain").slideDown(750); // Al caricamento della pagina scendo giù le transazioni totali dell'utente!

    /* CLICK SUI TASTI LATERALI DI TRANSAZIONI */
    deposito.on("click", function () {  

        if ($("#transazioniPrelievoMain").css('display') === 'none' && $("#transazioniCronologiaMain").css('display') === 'none')
        {
            if ($("#transazioniDepositoMain").css("display") === "none")
                $("#transazioniDepositoMain").slideDown(750);
        }
        else {
            $("#transazioniPrelievoMain").hide();
            $("#transazioniCronologiaMain").hide();
            $("#transazioniDepositoMain").slideDown(750);
        }
        
    });

    prelievo.on("click", function () {  
        if ($("#transazioniDepositoMain").css('display') === 'none' && $("#transazioniCronologiaMain").css('display') === 'none'){
            if ($("#transazioniPrelievoMain").css("display") === "none")
                $("#transazioniPrelievoMain").slideDown(750);
        }
        else{
            $("#transazioniDepositoMain").hide();
            $("#transazioniCronologiaMain").hide();
            $("#transazioniPrelievoMain").slideDown(750);
        }
       

    });

    cronologia.on("click", function () {  
        if ($("#transazioniPrelievoMain").css('display') === 'none' && $("#transazioniDepositoMain").css('display') === 'none') {
            if ($("#transazioniCronologiaMain").css("display") === "none")
                $("#transazioniCronologiaMain").slideDown(750);
        }
        else {
            $("#transazioniDepositoMain").hide();
            $("#transazioniPrelievoMain").hide();
            $("#transazioniCronologiaMain").slideDown(750);
        }
    });

    /** */

    // On click deposito in transazioni
    $("#depoisitiPage").on("click", function () {  

        if ($(".allTransazioni").css("display") !== "none"){
            $(".allDeposito").remove();
            $(".allPrelievi").remove();
            $(".allTransazioni").hide();

            $("#depoisitiPage").css("background-color", "blueviolet");

            for (let x = transazioniArray.length - 1; x >= 0; x--) {
                let rowData = '';
                
                if (transazioniArray[x].data_deposito) {
                    rowData += `<div class="columnTableTransazioni"><span class='depositoPiu'>+</span></div>`;
                    rowData += `<div class="columnTableTransazioni">€ ${formattaNumero(transazioniArray[x].importo)}</div>`;
                    rowData += `<div class="columnTableTransazioni">${transazioniArray[x].codice_transazione}</div>`;
                    rowData += `<div class="columnTableTransazioni">${new Date(transazioniArray[x].data_deposito).toUTCString()}</div>`;
                }
                
                $('#tabellaTransazioni').append(`<div class="rowTableTransazioni borderBottomDark rowTableTransazioniLayout allDeposito">${rowData}</div>`);
            }

        }
        else {
            $(".allDeposito").remove();
            $(".allPrelievi").remove();
            $("#depoisitiPage").css("background-color", "");
            $("#prelieviPage").css("background-color", "");
            $(".allTransazioni").show();

        }

    });

    $("#prelieviPage").on("click", function () {  

        if ($(".allTransazioni").css("display") !== "none"){
            $(".allDeposito").remove();
            $(".allPrelievi").remove();
            $(".allTransazioni").hide();

            $("#prelieviPage").css("background-color", "blueviolet");


            for (let x = transazioniArray.length - 1; x >= 0; x--) {
                let rowData = '';
                
                if (transazioniArray[x].data_prelievo) {
                    rowData += `<div class="columnTableTransazioni"><span class='prelievoMeno'>-</span></div>`;
                    rowData += `<div class="columnTableTransazioni">€ ${formattaNumero(transazioniArray[x].importo)}</div>`;
                    rowData += `<div class="columnTableTransazioni">${transazioniArray[x].codice_transazione}</div>`;
                    rowData += `<div class="columnTableTransazioni">${new Date(transazioniArray[x].data_prelievo).toUTCString()}</div>`;
                }
                
                $('#tabellaTransazioni').append(`<div class="rowTableTransazioni borderBottomDark rowTableTransazioniLayout allPrelievi">${rowData}</div>`);
            }

        }
        else {
            $(".allDeposito").remove();
            $(".allPrelievi").remove();
            $("#depoisitiPage").css("background-color", "");
            $("#prelieviPage").css("background-color", "");
            $(".allTransazioni").show();


        }

    });


});

