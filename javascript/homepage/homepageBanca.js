// QUI CARICO GLI SCRIPT CHE GESTISCONO IN HOMEPAGE
// TUTTO QUELLO CHE RIGUARDA LA BANCA

let saldo = 0;

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



function addMoneyDeposito(nuovoSaldo) {  
    if (nuovoSaldo != ""){
        fetch(`http://localhost:3000/aggiornaSaldo?nuovoSaldo=${nuovoSaldo}&username=${localStorage.getItem('userBank')}`, { // Aggiungo +1 utente al backend!
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }    
        })
        .then(() => {
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
        })
        .catch(error => {
            console.error('Si è verificato un errore durante l\'invio del messaggio di login al backend:', error);
            // Potresti gestire eventuali errori qui, se necessario
            window.location.href = 'homepage.html';
        });
    }
};

// on document ready
$(document).ready(function () {

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

    /* FORM DEPOSITO SEND MONEY */
    $("#formInputDeposito form").on("click", function (event) {
        event.preventDefault();
    });

    $("#addMoney").on("click", function (event) {
        event.preventDefault();
        addMoneyDeposito($(saldoDepositoToAdd).val());
    });
    /* */ 
    
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
            $(".tiraSu").slideUp(750);
            $("#TransazioniContainer").slideDown(750);
            $("#transazioniDepositoMain").slideDown(750);
            $("#TransazioniContainer").css("display", "flex");
        }else {
            $("#TransazioniContainer").slideUp(750);
        }
        
    });

    $("#Prestiti").on("click", function () {

        if ($("#PrestitiContainer").css("display") === "none"){
            $(".tiraSu").slideUp(750);
            $("#PrestitiContainer").slideDown(750);
        }else {
            $("#PrestitiContainer").slideUp(750);
        }
        
    });

    $("#Bonifici").on("click", function () {

        if ($("#BonificiContainer").css("display") === "none"){
            $(".tiraSu").slideUp(750);
            $("#BonificiContainer").slideDown(750);
        }else {
            $("#BonificiContainer").slideUp(750);
        }
        
    });

    /* CLICK SUI TASTI LATERALI DI TRANSAZIONI */
    deposito.on("click", function () {  

        if ($("#transazioniPrelievoMain").css('display') === 'none' && $("#transazioniCronologiaMain").css('display') === 'none')
        {
            if ($("#transazioniDepositoMain").css("display") === "none")
                $("#transazioniDepositoMain").slideDown(750);
            else {
                $("#transazioniDepositoMain").slideUp(750);
            }
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
            else{ 
                $("#transazioniPrelievoMain").slideUp(750);
            }
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
            else{ 
                $("#transazioniCronologiaMain").slideUp(750);
            }
        }
        else {
            $("#transazioniDepositoMain").hide();
            $("#transazioniPrelievoMain").hide();
            $("#transazioniCronologiaMain").slideDown(750);
        }
    });

    /** */

});

