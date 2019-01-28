$(document).ready(()=>{

    $("#btnEntrar").click((e)=>{
        e.preventDefault();

        if($("#txtNovaPassword2").val() != $("#txtNovaPassword").val()) {
            alert("Passwords diferentes!");
            return;
        }
        let data = {};

        data.password = $("#txtPassword").val();
        data.novaPassword = $("#txtNovaPassword").val();


        //se existirem, verificar dados de empresa
        if ($("#txtEmail")) {
            data.emailSecundario = $("#txtEmail").val();
            data.contactoNome = $("#txtUser").val();
            data.contactoNum = $("#txtContacto").val();
            data.representanteNome = $("#txtRepresentante").val();
            data.representanteCargo = $("#txtRepCargo").val();
            data.NIF = $("#txtNIF").val();
        }

        console.log("data agregada")
        console.log("a tentar ajax.........");

        console.log(data);

        $.ajax({type: 'POST',
            url: '/save/user/addinfo',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(result) {
                if (result.message) alert (result.message)
                else {
                    alert("Concluído!")
                    window.location.href="/logout";
                }
            },
            error: function(data) { console.log(data) }
        })

    })
})
