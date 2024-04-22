
$(document).ready(function () {

    $("#loginButton").on("click", function (event) {  

        var username = $("#UsernameLogin").val();
        var password = $("#pwdLogin").val();

        if (username !== undefined && password !== undefined)
        {
            
            if (username !== "" && password !== "")
            {

                // Fetchare i dati per verificare se l'utente sia stato trovato!
                fetch(`http://localhost:3000/login?username=${username}&password=${password}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                )
                .then(response => response.json())
                .then(data => {
                        if (data && data.messages && data.messages.length >= 0) {
                            if (data.messages[0] !== undefined){
                                if (data.messages[0].username === username && data.messages[0].password === password)
                                {
                                    window.location.href = 'homepage.html';
                                }
                            }
                        }

                    }
                )
                .catch(error => {
                    console.error('Errore -> [PROBABILE SERVER DB OFF]:', error);
                    
                    $('#failedLogin').text("[SERVER DB OFF]");
                    $('#failedLogin').css("border" , "1px solid rebeccapurple");
                    $('#failedLogin').css("border-radius", "20px"); 
                    setTimeout(() => {
                        $('#failedLogin').text("");
                        $('#failedLogin').css("border" , "none");
                        window.location.href = 'index.html';
                    }, 1500)    

                    // Aggiungi questo controllo per ottenere ulteriori dettagli sulla risposta dell'errore
                    if (error && error.response) {
                    console.log('Risposta dell\'errore:', error.response);
                    }
                });


                event.preventDefault();
            }
            else {
                // Gestire nome e password non inseriti correttamente!
                $('#failedLogin').text("Non hai inserito alcuni dati!");
                $('#failedLogin').css("border" , "1px solid rebeccapurple");
                $('#failedLogin').css("border-radius", "20px"); 

                setTimeout(() => {
                    $('#failedLogin').text("");
                    $('#failedLogin').css("border" , "none");
                    window.location.href = 'login.html';
                }, 1500)  

            }

            event.preventDefault();
        }
        else {

            window.location.href = 'login.html';

            event.preventDefault();
        }
    });




});