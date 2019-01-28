//jello

let seriacao = false;


//verificar se seriação é possivel
(()=>{
    $.ajax({
        type: "get",
        url: "/load/preferencia/possible",
        contentType: "application/json",
        success: (result)=>{
            if(result.success == true) seriacao = true;
        }
    });
})()

//carregar propostas que tenham sido validadas
const loadPropostasValidadas = ()=>{
    $.ajax({
        type: "get",
        url: "/load/propostas/validadas",
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro ao carregar propostas!");
            else{
                let html  = "";
                let num = 0

                result.forEach((proposta)=>{
                    num++;
                    html += '<tr id="'+proposta.id_proposta+'" data-toggle="modal" data-target="#myModal">'
                            +'<th scope="row">'+num+'</th>'
                            +'<td>'+proposta.titulo+'</td>'
                            +'<td>'+proposta.empresa+'</td>'
                            +'<td>Ativa</td></tr>'
                });
                $("#tabela-propostas-aluno").html(html);

                //função para ver info de empresa
                $("#tabela-propostas-aluno tr").click((e)=>{
                    loadPropostaByID(e.currentTarget.id);

                })
            }
        }
    })
}

const loadPreferenciasByEmail = ()=>{

    $.ajax({
        type: "get",
        url: "/load/preferencia/byemail",
        contentType: "application/json",
        success: (result)=>{
             console.log(result);
            if(result.success == false) alert("Erro ao carregar propostas!");
            else{
                let html = "";
                let num = 0;
                result.forEach((preferencia)=>{
                    num++;
                    html += '<tr><th scope="row">'+num+'</th>'
                        +'<td>'+preferencia.proposta+'</td>'
                        +'<td><a id="'+preferencia.id_proposta+'" href=""><img src="../assets/images/delete.png"alt="" height="13" width="13" data-dismiss="modal" data-toggle="modal"></a></td></tr>'
                });

                $("#preferencias-aluno").html(html);
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

            $("#footer-aluno").html('<button type="button" id="btn-accept" name="'+result.id_proposta+'" class="btn btn-default" data-dismiss="modal">Aceitar</button>')
            $("#btn-accept").click((e)=>{
                console.log("???")
                if(seriacao) savePreferencia(e.currentTarget.name);
                else alert("Seriação de preferências não está disponível!")
            })

        }

    })
}

const savePreferencia = (id)=>{
    let data = {id_proposta: id}
    $.ajax({
        type: "post",
        url: "/save/preferencia",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro ao guardar preferência!");
            else alert("Proposta guardada com sucesso!")
        }

    })
}


const savePropostaByAluno = (proposta)=>{

    $.ajax({
        type: "post",
        url: "/save/proposta",
        data: JSON.stringify(proposta),
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro ao guardar Preferência!");
            else alert("Preferência guardada com sucesso!")
        }

    })

}

$(document).ready((e)=>{

    //load de sobre ao iniciar
    $("#main-cont").html($.parseHTML("Loading..."));
    $("#main-cont").load("/view/partials/sobre.view.html");

    $("#link-inicio").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/sobre.view.html");
    });

    $("#link-perfil").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/aluno/aluno.perfil.view.html");
    });

    $("#link-propostas").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/aluno/aluno.propostas.view.html");
    });
    $("#link-contactos").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/contactos.view.html");
    });

});

