//jello

const loadPropostasOfEmpresa = ()=>{
    $.ajax({
        type: "get",
        url: "/load/propostas/empresa",
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro ao carregar propostas!");
            else {
                console.log(result)
                let html;
                let estado;
                let num = 0;

                console.log("Funciona ou não??")

                result.forEach((proposta)=>{
                    num++;

                    //Avaliar estado da Proposta
                    if (proposta.se_estagio) estado = "Estágio";
                    else if (proposta.se_atribuida) estado = "Atribuída";
                    else if (proposta.se_recusada) estado = "Recusasa";
                    else if (proposta.se_validada) estado = "Validada";
                    else  estado = "Por Validar";

                    html += '<tr id='+proposta.id_proposta+' data-toggle="modal" data-target="#myModal"><td>'+num+'</td>'
                              +'<td>'+proposta.titulo+'</td>'
                              +'<td>'+estado+'</td></tr>'
                })


                $("#tabela-propostas-empresa").html(html);

                $("#tabela-propostas-empresa tr").click((e)=>{
                    e.preventDefault();
                    loadPropostaByID(e.currentTarget.id);
            });
            }
        }

    })
}

const loadPropostaByID = (id)=>{
    $.ajax({
        type: "get",
        url: "/load/propostas/byid",
        data: {id: id},
        contentType: "application/json",
        success: (result)=>{
            console.log(result);

            $("#titulo-proposta").html(result.titulo);
            $("#desc_trabalho").html(result.desc_trabalho);
            $("#desc_resultado").html(result.desc_resultado);
            $("#desc_plano").html(result.desc_plano);
            $("#desc_recursos").html(result.desc_recursos);
            $("#desc_perfil").html(result.desc_perfil);
            $("#desc_outro").html(result.desc_outro);
            $("#tutor_nome").html(result.tutor_nome);
            $("#tutor_cargo").html(result.tutor_cargo);
            $("#tutor_email").html(result.tutor_email);
            $("#tutor_contacto").html(result.tutor_num);

            $("#footer-empresa").html('<button type="button" id="btn-eliminar" name="'+result.id_proposta+'" class="btn btn-default" data-dismiss="modal">Eliminar</button>')
            $("#btn-eliminar").click((e)=>{
                console.log(e.currentTarget.name);
                deleteProposta(e.currentTarget.name);

            })
        }

    })
}

const deleteProposta = (id)=>{
    let data= {id:id};
    $.ajax({
        type: "delete",
        url: "/delete/propostabyid",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro ao eliminar proposta!");
            else alert("Proposta eliminada com sucesso!")
            loadPropostasOfEmpresa()
        }

    })
}

const savePropostaByEmpresa = (proposta)=>{

    $.ajax({
        type: "post",
        url: "/save/proposta",
        data: JSON.stringify(proposta),
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro ao guardar proposta!");
            else alert("Proposta guardada com sucesso!")
            loadPropostasOfEmpresa()
        }

    })

}

$(document).ready((e)=>{

    $("#main-cont").html($.parseHTML("Loading..."));
    $("#main-cont").load("/view/partials/sobre.view.html");

    $("#link-inicio").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/sobre.view.html");
    });

    $("#link-perfil").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/perfil.view.html");
    });

    $("#link-propostas").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/empresa/empresa.propostas.view.html");
    });
    $("#link-contactos").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/contactos.view.html");
    });
});

