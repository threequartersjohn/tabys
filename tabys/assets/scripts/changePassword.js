$(document).ready(()=>{

    //assim que página estiver pronta, buscar parâmetros do url
    //não é meu
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    //buscar chave de user
    var key = getUrlParameter('key');

    $("#btnEntrar").click((e)=>{
        e.preventDefault()

        if($("#txtNovaPassword1").val() != $("#txtNovaPassword2").val()) {
            alert("As Passwords são differentes!");
            return;
        }

        let password = $("#txtNovaPassword2").val();

        let data ={
            link: key,
            novaPassword: password
        }

        console.log("data criada")

        console.log("a tentar ajax...")
        $.ajax({
            type: 'PUT',
            url: '/update/password/withlink',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(result) {
                if (result.message) alert(result.message);
                if (result.success == true) alert("Concluído!"), window.location.href = "/login";
                console.log(result);
            },
            error: function(data) { console.log(data) }
        });
    })

    //

})