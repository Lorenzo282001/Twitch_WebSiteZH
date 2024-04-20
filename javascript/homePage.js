function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$(document).ready(function () {

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
        }
        else {
            $("#activeBarre").slideUp(500); // Toggle the display with sliding animation
            
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
            return;
        }

        if (windowWidth <= 550) {
            $("#activeBarre").slideDown(500);
        }
        else {
            $("#activeBarre").slideUp(500); // Ripristino lo stato iniziale !

        }

    });

})


