// QUI CARICO GLI SCRIPT CHE GESTISCONO IN HOMEPAGE
// TUTTO QUELLO CHE RIGUARDA LA BANCA

let saldo;

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

});

// on window change size 
$(window).resize(function() {



});