$(document).ready(function () {

    $("#btn_Register").on("click", function (event) {


        var username = $("#UsernameRegister").val();
        var email = $("#emailRegister").val();
        var password = $("#pwdRegister").val();
        var confirm_password = $("#confPwdRegister").val();

        if (username !== undefined && email !== undefined && password !== undefined && confirm_password !== undefined)
        {
            if (username !== "" && email !== "" && password !== "" && confirm_password !== "")
            {   
                if (password === confirm_password) {
                    
                        

                }
                else {
                    event.preventDefault();
                }
            }
            else {
                event.preventDefault();
            }
        }
        else {
            event.preventDefault();
        }
        
    });


});