$(document).ready(()=>{

    $("#btn-confirmar").click((e)=>{
        e.preventDefault();

        let email = $("#txtEmail").val();

        let data = {
            email: email,
        }

        $.ajax({
            type: 'POST',
            url: '/save/reposicao',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(result) {
                if (result.success == true) alert("Concluído!"), window.location.href = "/login";
                else if (result.message) alert(result.message);
                console.log(result);
            },
            error: function(data) { console.log(data) }
        });

    });


    $("#form-login").on("submit", (e)=>{
        if (e.isDefaultPrevented()) console.log("Erros no formulário!");

        e.preventDefault();

        let email = $("#txtUser").val();
        let password = $("#txtPassword").val();

        console.log("data agregada");

        let data ={
            email: email,
            password: password
        };

        console.log("data criada");

        console.log("a tentar ajax...")
        $.ajax({
            type: 'POST',
            url: '/login/all',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(result) {
                if (result.url) window.location.href = result.url
                if (result.message) alert(result.message);
                console.log(result);
            },
            error: function(data) { console.log(data) }
        });
    })
})