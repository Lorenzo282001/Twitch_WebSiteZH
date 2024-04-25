function setOptionUser(nome, cognome, eta, citta, dataNascita) {  

    // Recupero i dati
    fetch(`http://localhost:3000/optUserInfo?username=${localStorage.getItem("userBank")}&nome=${nome}&cognome=${cognome}&eta=${eta}&citta=${citta}&dataNascita=${dataNascita}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(() => {
        
        modifyOptionUser();

    })
    .catch(error => {
        console.error('Si è verificato un errore durante l\'invio del messaggio di login al backend:', error);
        // Potresti gestire eventuali errori qui, se necessario
    });


}

function modifyOptionUser() {  
    // Aggiornare i nuovi dati in HomePage!
    fetch(`http://localhost:3000/checkUserDb?username=${localStorage.getItem("userBank")}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {

        if (data && data.messages && data.messages.length > 0) {
            
                        // Modifico le impostazioni!
            let ok = true;
            for (let v in data.messages[0]){
                if (data.messages[0][v] === null){
                    ok = false;
                    break;
                }
            }

            if (ok){

                if ($('.inputSettings').length) { // Non esiste l'elemento -- quindi tolgo il bottone SALVA
                    $('#salvaImpostazioniProfilo').css("display", "none");
                }

                if (data.messages[0].nome !== null || data.messages[0].nome !== "undefind")
                    nome = $('#liImpostazioniNome').html(`<span>Nome</span><div><span>${data.messages[0].nome}</span><span><span class = 'modificaOpt' id = 'modificaOptNome'><button class = 'buttonModifyOpt' id = 'modificaOptNomeButton'>Modifica</button></span></div>`);
                if (data.messages[0].cognome !== null || data.messages[0].cognome !== "undefind")
                    cognome = $('#liImpostazioniCognome').html(`<span>Cognome</span><div><span>${data.messages[0].cognome}</span><span><span class = 'modificaOpt' id = 'modificaOptCognome'><button class = 'buttonModifyOpt' id = 'modificaOptCognomeButton'>Modifica</button></span></div>`);
                if (data.messages[0].eta !== null || data.messages[0].eta !== "undefind")    
                    eta = $('#liImpostazioniEta').html(`<span>Età</span><div><span>${data.messages[0].eta}</span><span><span class = 'modificaOpt' id = 'modificaOptEta'><button class = 'buttonModifyOpt' id = 'modificaOptEtaButton'>Modifica</button></span></div>`);
                if (data.messages[0].citta !== null || data.messages[0].citta !== "undefind")
                    citta = $('#liImpostazioniCitta').html(`<span>Città</span><div><span>${data.messages[0].citta}</span><span><span class = 'modificaOpt' id = 'modificaOptCitta'><button class = 'buttonModifyOpt' id = 'modificaOptCittaButton'>Modifica</button></span></div>`);
                if (data.messages[0].data_di_nascita !== null || data.messages[0].data_di_nascita !== "undefind")
                    dataNascita = $('#liImpostazioniDataNascita').html(`<span>Data di Nascita</span><div><span>${data.messages[0].data_di_nascita.split("T")[0]}</span><span><span class = 'modificaOpt' id = 'modificaOptDataNascita'><button class = 'buttonModifyOpt' id = 'modificaOptDataNascitaButton'>Modifica</button></span></div>`);             
            }
        }


    })
    .catch(error => {
        console.error('Si è verificato un errore nel backend:', error);
    });
}

$(document).ready(function () {
    modifyOptionUser();

    $(document).on("click", ".buttonModifyOpt", function (event) {
        event.preventDefault();
        $('#salvaImpostazioniProfilo').css('display', 'block');
    });

    $(document).on("click", "#modificaOptNomeButton", function () {
        $('#liImpostazioniNome').html(`<span>Nome</span><input class="inputSettings" id="settingsNome" type="text" name="nome" placeholder="Lascia vuoto per non modificare" style="width:8em">`);
    });

    $(document).on("click", "#modificaOptCognomeButton", function () {
        $('#liImpostazioniCognome').html(`<span>Cognome</span> <input class="inputSettings" id="settingsCognome" type="text" name="cognome" placeholder="Lascia vuoto per non modificare" style="width:8em">`);

    });

    $(document).on("click", "#modificaOptEtaButton", function () {
        $('#liImpostazioniEta').html(`<span>Età</span> <input class="inputSettings" id="settingsEta" type="number" name="eta" placeholder="Lascia vuoto per non modificare" style="width:8em">`);
    });

    $(document).on("click", "#modificaOptCittaButton", function () {
        $('#liImpostazioniCitta').html(`<span>Città</span> <input class="inputSettings" id="settingsCitta" type="text" name="citta" placeholder="Lascia vuoto per non modificare" style="width:8em">`);
    });

    $(document).on("click", "#modificaOptDataNascitaButton", function () {
        $('#liImpostazioniDataNascita').html(`<span>Data di Nascita</span> <input class="inputSettings" id="settingsDataNascita" type="date" min="10" name="data_nascita" placeholder="Lascia vuoto per non modificare" style="width:8em">`);             
 
    });

    fetch(`http://localhost:3000/admin?username=${localStorage.getItem("userBank")}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    )
    .then(response => response.json())
    .then(data => {
        
        if (data && data.messages && data.messages.length > 0) {
            // Se ci sono messaggi nella risposta
            if (data.messages[0].admin === 1) {
                localStorage.setItem("userBankAdmin", "si");
                $(".user").css('color',"gold");
                $(".user").css('background-color',"rebeccapurple");
            }
            else {
                localStorage.setItem("userBankAdmin", "no");   
            }

            if (localStorage.getItem("userBankAdmin") === "si")
                $(".user").html("Direttore: "+ localStorage.getItem("userBank"));
            else 
                $(".user").html(localStorage.getItem("userBank"));
        }
        else {
            window.location.href = 'index.html';
        }


    })
    .catch(error => {
        
        $('#alreadyRegister').text("[SERVER DB OFF]");
        $('#alreadyRegister').css("border" , "1px solid rebeccapurple");
        $('#alreadyRegister').css("border-radius", "20px"); 
        setTimeout(() => {
            $('#alreadyRegister').text("");
            window.location.href = 'index.html';
        }, 500)    

        // Aggiungi questo controllo per ottenere ulteriori dettagli sulla risposta dell'errore
        if (error && error.response) {
        console.log('Risposta dell\'errore:', error.response);
        }
    });

    // Save new settings for userBank in HomePage
    $('#salvaImpostazioniProfilo').on("click", function (event) {  

        event.preventDefault();

        let nome = $('#settingsNome').val();
        let cognome = $('#settingsCognome').val();
        let eta = $('#settingsEta').val();
        let citta = $('#settingsCitta').val();
        let dataNascita = $('#settingsDataNascita').val(); // Parsificare la data nel mondo corretto [Restituisce aaaa-mm-gg]

        // Non verifico se il dato è vuoto o pieno perchè automaticamente la query nel backend
        // se nota che la stringa è vuota , semplicemte imposta il valore nuovo a NULL!
        setOptionUser(nome, cognome, eta,citta,dataNascita);
    });

    // Se clicco il botton modifica, riappare Salva ma al posto di modifica!
    $(".modificaOpt").on("click", function (event) {  
        event.preventDefault();
    });

    // On click exit -> esce dall'account!
    $(".exitAccount").on("click", function () {  

        // Invia il messaggio di login al backend
        fetch(`http://localhost:3000/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ testo: "[LOGOUT] - UserBank: " + localStorage.getItem("userBank") + " in log-out!"}),
        })
        .then(() => {
            fetch(`http://localhost:3000/logoutSuccess`, { // Rimuovo (-)1 utente al backend!
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ testo: "" + localStorage.getItem("userBank")}),
            })
        }) 
        .then(() => {
            localStorage.setItem("userBank", ".");
            localStorage.setItem("userBankAdmin", ".");
    
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000)
        })
        .catch(error => {
            console.error('Si è verificato un errore durante l\'invio del messaggio di login al backend:', error);
            // Potresti gestire eventuali errori qui, se necessario
        });
    

    });

    $('#main').on("click", function () {

        if ($(window).width() >= 550)
        {
            $("#activeBarre").slideUp(500);
            $("#toggleBarre").html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><rect width="100" height="5" y="30" fill="rgb(32,32,32)"/><rect width="100" height="5" y="60" fill="rgb(32,32,32)"/><rect width="100" height="5" y="90" fill="rgb(32,32,32)"/></svg>');
        }
    });

    $('#containerWebSite').on("click", function () {

        $("#containerProfile").slideUp(750); // Quando modifico la dimensione della pagina, tolgo le impostazioni del profilo automaticamente!
        $("#containerWebSite").css("margin-top", "0em");
    });

    $("#textBankName").on("click", function(e) {
        e.preventDefault(); // Prevent the default behavior of the anchor element
        location.reload(); // Refresh the page
    });
    
    
    $("#top").mouseleave(function () { 
        $("#textBankName").html('<a href="index.html">TWITCH_VAULT BANK</a>');
        $("#textBankName").css("color", "black");
    });
    
    $(".searchBar").blur(function () {  // Elimino il contenuto della searchbar quando si esce dalla searchbar!
        
        this.value = "";

    });

    // Verifico se il bottone per aprire il menu nella sezione top sia stato premuto o meno!
    $("#toggleBarre").on("click", function () {

        var displayValue = $("#activeBarre").css("display");

        if ($("#containerProfile").css("display") !== "none") {
            $("#containerProfile").fadeOut(500);
            $("#containerProfile").css("display", "inline-flex")
        }

        if (displayValue === 'none')
        {
            $("#activeBarre").slideDown(500); // Toggle the display with sliding animation
            $("#toggleBarre").html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>');
            $("#containerWebSite").css("margin-top", "15em");
        }
        else {
            $("#activeBarre").slideUp(500); // Toggle the display with sliding animation
            $("#toggleBarre").html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><rect width="100" height="5" y="30" fill="rgb(32,32,32)"/><rect width="100" height="5" y="60" fill="rgb(32,32,32)"/><rect width="100" height="5" y="90" fill="rgb(32,32,32)"/></svg>');
            $("#containerWebSite").css("margin-top", "0em");
        }

    });

    /* Settings Profile - Main */
    $(".user").on("click", function () {   // On click user Name in top open settings profile!

        modifyOptionUser();
        
        if ($("#containerProfile").css("display") === "none") {

            if ($("#activeBarre").css("display") !== "none")
            {
                $("#activeBarre").slideUp(500);
            }

            $("#containerProfile").slideDown(750); // Toggle the display with sliding animation
            $("#containerProfile").css("display", "inline-flex")
            $("#containerWebSite").css("margin-top", "0em");

        
        } else {
            $("#containerProfile").slideUp(750); // Toggle the display with sliding animation
        }
        
    });

    $(window).resize(function() {
        $("#main").css("margin-top", "0em");
        $("#containerWebSite").css("margin-top", "0em");
        $("#toggleBarre").html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><rect width="100" height="5" y="30" fill="rgb(32,32,32)"/><rect width="100" height="5" y="60" fill="rgb(32,32,32)"/><rect width="100" height="5" y="90" fill="rgb(32,32,32)"/></svg>');


        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        // Ottieni le dimensioni dello schermo
        var screenWidth = screen.width;
        var screenHeight = screen.height;

        // Verifica se le dimensioni della finestra coincidono con le dimensioni dello schermo
        if (windowWidth === screenWidth && windowHeight === screenHeight) {
            $("#activeBarre").slideUp(500); // Ripristino lo stato iniziale !
            $("#toggleBarre").html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><rect width="100" height="5" y="30" fill="rgb(32,32,32)"/><rect width="100" height="5" y="60" fill="rgb(32,32,32)"/><rect width="100" height="5" y="90" fill="rgb(32,32,32)"/></svg>');
            return;
        }

        if (windowWidth <= 550) {
            $("#containerWebSite").css("margin-top", "15em");
            $("#activeBarre").slideDown(500);
        }
        else {
            $("#activeBarre").slideUp(500); // Ripristino lo stato iniziale !
        }

        if ($("#containerProfile").css('display') !== "none")
            $("#containerProfile").slideUp(750); // Quando modifico la dimensione della pagina, tolgo le impostazioni del profilo automaticamente!

        
     
        
    });
 
})





