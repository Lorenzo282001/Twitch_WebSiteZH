function checkRedirectLogOut() {
    fetch('http://localhost:3000/logoutAll')
      .then(response => response.json())
      .then(data => {
        const { redirectUrl_logOut } = data;
        if (redirectUrl_logOut) {
            console.log(redirectUrl_logOut);
            window.location.href = redirectUrl_logOut; // Effettua il reindirizzamento
        }
      })
      .catch(error => {
        console.error('Errore durante il controllo dell\'URL di reindirizzamento:', error);
    });
}


$(document).ready(function () {
    setInterval(checkRedirectLogOut, 1000); // Effettua il controllo ogni secondo


    $("#btn_Register").on("click", function (event) {

        // Disabilito possibilità di modificare il testo quando si preme sul bottone
        var username = $("#UsernameRegister").val();
        $('#UsernameLogin').prop('disabled', true);
        var email = $("#emailRegister").val();
        $('#emailRegister').prop('disabled', true);
        var password = $("#pwdRegister").val();
        $('#pwdRegister').prop('disabled', true);
        var confirm_password = $("#confPwdRegister").val();
        $('#confPwdRegister').prop('disabled', true);


        if (username !== undefined && email !== undefined && password !== undefined && confirm_password !== undefined)
        {
            if (username !== "" && email !== "" && password !== "" && confirm_password !== "")
            {   
                if (password === confirm_password) {

                    let alreadyRegistred = false;
                    
                    // check if a user is already registred;
                    
                    fetch(`http://localhost:3000/checkUserDb?username=${username}`, {
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
                            if (data.messages[0].username === username) {
                                alreadyRegistred = true;
                            }
                        }

                        // fetch the new register gui                        
                        if (!alreadyRegistred) {
                            event.preventDefault();

                            const newUser = {
                                username : username,
                                email : email,
                                password : password
                            }
                        
                            fetch('http://localhost:3000/newUserBank', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(newUser)
                                }
                            )
                            .then(response => response.json())
                            .then(data => {
                                // Mandare l'utente alla pagina di HomePage
                                $('#alreadyRegister').text("Registrazione effettuata con successo!");
                                $('#alreadyRegister').css("color" , "green");
                                $('#alreadyRegister').css("border" , "1px solid green");
                                $('#alreadyRegister').css("border-radius", "20px"); 
                                setTimeout(() => {
                                    $('#alreadyRegister').text("");
                                    $('#alreadyRegister').css("border" , "none");
                                    window.location.href = 'index.html';
                                }, 1500)      
                            })
                            .catch(error => {
                                console.error('Errore -> [PROBABILE SERVER DB OFF]:', error);
                            
                                // Aggiungi questo controllo per ottenere ulteriori dettagli sulla risposta dell'errore
                                if (error && error.response) {
                                console.log('Risposta dell\'errore:', error.response);
                                }
                            });

                            
                        }
                        else {

                            // Qui se l'utente è già registrato in banca!
                            $('#alreadyRegister').text("Utente già registrato!");
                            $('#alreadyRegister').css("border" , "1px solid rebeccapurple");
                            $('#alreadyRegister').css("border-radius", "20px"); 
                            setTimeout(() => {
                                $('#alreadyRegister').text("");
                                window.location.href = 'index.html';
                            }, 1500)                            
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

                    event.preventDefault();
                }
                else {
                    // Password e Confirm Password diverse
                    $('#alreadyRegister').text("Le password non coincidono!");
                    $('#alreadyRegister').css("border" , "1px solid rebeccapurple");
                    $('#alreadyRegister').css("border-radius", "20px"); 
                    setTimeout(() => {
                        $('#alreadyRegister').text("");
                        $('#alreadyRegister').css("border" , "none");
                        window.location.href = 'register.html';
                    }, 1500)  

                    event.preventDefault();
                }
            }
            else {  // 1px solid rebeccapurple;
                $('#alreadyRegister').text("Non hai inserito alcuni dati!");
                $('#alreadyRegister').css("border" , "1px solid rebeccapurple");
                $('#alreadyRegister').css("border-radius", "20px"); 
                setTimeout(() => {
                    $('#alreadyRegister').text("");
                    $('#alreadyRegister').css("border" , "none");
                    window.location.href = 'register.html';
                }, 1500)  
                event.preventDefault();
            }
        }
        else {
            event.preventDefault();
        }
        
    });


});
