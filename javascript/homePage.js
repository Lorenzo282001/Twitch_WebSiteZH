function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

$(document).ready(function() {

    // setto un colore randomico all'inizio della pagina al logo
    var lettere = $("#textBankName").text().split('');

    var newText = '';

    for (var i = 0; i < lettere.length; i++)
    {   
        var randomColor = getRandomColor();
        newText += '<span style="color: ' + randomColor + ';">' + lettere[i] + '</span>'
    }

    $("#textBankName").html(newText);

    ////////////////////////////////////////////////////////////////////

});


$("#textBankName").on("mouseover", function () {
    var lettere = this.textContent.split('');

    var newText = '';

    for (var i = 0; i < lettere.length; i++)
    {   
        var randomColor = getRandomColor();
        newText += '<span style="color: ' + randomColor + ';">' + lettere[i] + '</span>'
    }

    this.innerHTML = newText;
});

$("#textBankName").on("mouseout", function () {

    this.textContent = "TWITCH_VAULT BANK";

});
