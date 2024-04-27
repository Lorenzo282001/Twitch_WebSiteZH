function checkRedirectLogOut() {
    fetch('http://localhost:3000/logoutAll')
      .then(response => response.json())
      .then(data => {
        const { redirectUrl_logOut } = data;
        if (redirectUrl_logOut) {
            window.location.href = redirectUrl_logOut; // Effettua il reindirizzamento
        }
      })
      .catch(error => {
        console.error('Errore durante il controllo dell\'URL di reindirizzamento:', error);
    });
}

$(document).ready(function () {
    setInterval(checkRedirectLogOut, 1000); // Effettua il controllo ogni secondo

    $("#loginButton").on("click", function (event) {  

        // Disabilito possibilità di modificare il testo quando si preme sul bottone
        var username = $("#UsernameLogin").val();
        $('#UsernameLogin').prop('disabled', true);
        var password = $("#pwdLogin").val();
        $('#pwdLogin').prop('disabled', true);

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
                                    $('#failedLogin').text("Login in corso...");
                                    $('#failedLogin').css("color" , "green");
                                    $('#failedLogin').css("border" , "1px solid green");
                                    $('#failedLogin').css("border-radius", "20px"); 

                                    setTimeout(() => {
                                        // Invia il messaggio di login al backend
                                        fetch(`http://localhost:3000/message`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ testo: "[LOGIN] - Username: " + username + " login effettuato con successo!"}),
                                        })
                                        .then(() => {
                                            fetch(`http://localhost:3000/loginSuccess`, { // Aggiungo +1 utente al backend!
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({testo: "" + username}),
                                            })
                                            .then(() => {
                                                // Reindirizza l'utente alla pagina di homepage
                                                localStorage.setItem("userBank", username);
                                                window.location.href = 'homepage.html';
                                        
                                            })
                                        })
                                        .catch(error => {
                                            console.error('Si è verificato un errore durante l\'invio del messaggio di login al backend:', error);
                                            // Potresti gestire eventuali errori qui, se necessario
                                        });

                                    }, 1500);
                                    
                                }
                            }
                            else {
                                $('#failedLogin').text("Credenziali incorrette !");
                                $('#failedLogin').css("border" , "1px solid rebeccapurple");
                                $('#failedLogin').css("border-radius", "20px"); 

                                setTimeout(() => {
                                    
                                    $('#failedLogin').text("");
                                    $('#failedLogin').css("border" , "none");

                                    // Invia il messaggio di login al backend
                                    fetch(`http://localhost:3000/message`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ testo: "[LOGIN] - Username: " + username + " credenziali errate!"}),
                                    })
                                    .then(() => {
                                        // Reindirizza l'utente alla pagina di homepage
                                        window.location.href = 'login.html';
                                    })
                                    .catch(error => {
                                        console.error('Si è verificato un errore durante l\'invio del messaggio di login al backend:', error);
                                        // Potresti gestire eventuali errori qui, se necessario
                                    });


                                }, 1500);
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