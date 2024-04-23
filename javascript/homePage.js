function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



$(document).ready(function () {

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
        console.error('Errore -> [PROBABILE SERVER DB OFF]:', error);
        
        $('#alreadyRegister').text("[SERVER DB OFF]");
        $('#alreadyRegister').css("border" , "1px solid rebeccapurple");
        $('#alreadyRegister').css("border-radius", "20px"); 
        setTimeout(() => {
            $('#alreadyRegister').text("");
            window.location.href = 'index.html';
        }, 1500)    

        // Aggiungi questo controllo per ottenere ulteriori dettagli sulla risposta dell'errore
        if (error && error.response) {
        console.log('Risposta dell\'errore:', error.response);
        }
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


    if ($(window).width() <= 550)
    {
        $("#main").css("margin-top", "10em");   
    }

    $('#main').on("click", function () {

        if ($(window).width() >= 550)
        {
            $("#activeBarre").slideUp(500);
            $("#main").css("margin-top", "0")
            $("#toggleBarre").html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><rect width="100" height="5" y="30" fill="rgb(32,32,32)"/><rect width="100" height="5" y="60" fill="rgb(32,32,32)"/><rect width="100" height="5" y="90" fill="rgb(32,32,32)"/></svg>');
        }
    
    });

    $("#textBankName").on("click", function(e) {
        e.preventDefault(); // Prevent the default behavior of the anchor element
        location.reload(); // Refresh the page
    });

    $("#textBankName").on("mouseover", function () {

        var lettere = this.textContent.split('');
        var newText = '';
    
        for (var i = 0; i < lettere.length; i++) {   
            newText += '<span style="color: '+ getRandomColor() +';">' + lettere[i] + '</span>';
        }
    
        this.innerHTML = newText;
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

        if (displayValue === 'none')
        {
            $("#activeBarre").slideDown(500); // Toggle the display with sliding animation
            $("#main").css("margin-top", "10em")

            $("#toggleBarre").html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>');
        }
        else {
            $("#activeBarre").slideUp(500); // Toggle the display with sliding animation
            $("#main").css("margin-top", "3em")
            $("#toggleBarre").html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50"><rect width="100" height="5" y="30" fill="rgb(32,32,32)"/><rect width="100" height="5" y="60" fill="rgb(32,32,32)"/><rect width="100" height="5" y="90" fill="rgb(32,32,32)"/></svg>');
        }

    });

    $(window).resize(function() {
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
            $("#activeBarre").slideDown(500);
            $("#main").css("margin-top", "10em");  
        }
        else {
            $("#activeBarre").slideUp(500); // Ripristino lo stato iniziale !
            $("#main").css("margin-top", "0");   
        }

    });

})


