//jello

let propostaEliminar = 0;

//Explicar localização de funções ajax:
//Funções que existam em cdc.view.html têm de ser declaradas aqui
//Porque conteúdo que é carregado por jQuery load fica com escopo desta página
//E fazer load da mesma página mais de uma vez implica importar funções que na verdade já existem em escopo
//E isso é mau, por isso temos de guarantir que qualquer função que é chamada em qualquer página desta view
//(e é melhor usar funções parametrizadas do que repetir código localmente)

//
let propostaEstagio = 0;

//var para saber qual o novo user a criar
var tipoNovoUser = "";

const novoUser = (email, nome, tipo, media)=>{

    let data = {};
    data.email = email;
    data.nome = nome;
    data.tipo = tipo;
    console.log(media)



    if (media) data.media = media;
    console.log(data);

    $.ajax({
        type: "post",
        url: "/save/user",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            console.log(result)
            if(result.success == false) alert("Erro com inserção de novo user!");
            else if(result.success == true) alert("User criado com sucesso!"), loadUsers();
        }

    })

}

const updateDatas = (data_inicio, data_fim) => {
    let data = {};
    data.data_inicio = data_inicio;
    data.data_fim = data_fim;


    $.ajax({
        type: "put",
        url: "/update/datas",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            if(result.success != false) alert("Datas alteradas!");
        }

    })

}

const validarProposta = (id)=>{

    let data = {id:id}

    $.ajax({
        type: "put",
        url: "/update/proposta/validar",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            if(result.success != false) {
                alert("Proposta validada!");
                loadAllPropostas();
            }
            else alert("Erro ao validar proposta!")
        }

    })

}

const recusarProposta = (id, msg)=>{

    let data = {
        id: id,
        msg: msg,
    }

    $.ajax({
        type: "put",
        url: "/update/proposta/recusar",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            if(result.success != false) {
                alert("Proposta recusada!");
                loadAllPropostas();

            }
            else alert("Erro ao recusar proposta!")
        }

    })

}

const atribuirProposta = (id, email)=>{

    let data = {
        id: id,
        email:email,
    }

    $.ajax({
        type: "put",
        url: "/update/proposta/atribuir",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            if(result.success != false) {
                alert("Proposta atribuida!");
                loadAllPropostas();

            }
            else alert("Erro ao stribuir proposta!")
        }

    })

}

const estagioProposta = (id, email)=>{
    let data = {
        id: id.toString(),
    }

    $.ajax({
        type: "put",
        url: "/update/proposta/estagio",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            if(result.success != false) {
                alert("Proposta formalizada!!");
                loadAllPropostas();

            }
            else alert("Erro ao formalizar proposta!")
        }

    })
}

const loadOrientadores = ()=>{
    let tipo = "Orientador";

    $.ajax({
        type: "get",
        url: "/load/users/all/bytype",
        data: {tipo:tipo},
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro a carregar orientadores");
            else {
                let html = "";
                result.forEach((orientador)=>{
                    html += '<tr><td>'+orientador.nome+'</td>'
                         + '<td><a href="#" name="atribuir" id="'+orientador.email+'">Atribuir</a></td></tr>'
                })

                $("#orientador-aluno").html(html);

                $("a[name='atribuir']").click((e)=>{
                    console.log("atribuirrrrrr")

                    let id = propostaEstagio;
                    let email_orientador = e.currentTarget.id;

                    estagioProposta(id, email_orientador);
                    loadAllPropostas();
                })

            }
        }
    })
}

const loadPreferenciasOfUser = ()=>{
    let email = $("#email-user").html()

    $.ajax({
        type: "get",
        url: "/load/preferencia/ofuser",
        data: {email: email},
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro ao carregar preferências!");
            else{
                console.log(result);
                let html = "";
                let num = 0;

                result.forEach((preferencia)=>{
                    num++;
                    html += '<tr><th scope="row">'+num+'</th>'
                        +'<td>'+preferencia.nome+'</td>'
                        +'<td><a href="#" name="atribuir" id="'+preferencia.id_proposta+'">Atribuir</a></td></tr>'
                });

                $("#preferencias-aluno").html(html);

                $("a[name='atribuir']").click((e)=>{

                    let id = e.currentTarget.id;
                    let email = $("#email-user").html();

                    atribuirProposta(id, email);
                })
            }
        }
    })
}

const loadUserByEmailWithContacts = (email)=>{
    $("#tabela-contactos-empresa").html("");
    $("#titulo-nome-user").html("A carregar...")  ;
    $("#tipo-user").html("");
    $("#email-user").html("");
    $("#localizacao-user").html("");
    $("#n-telefone-user").html("");
    $("#n-telemovel-user").html("");
    console.log(email);
    $.ajax({
        type: "get",
        url: "/load/users/single/withcontactos",
        data: {email: email},
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro ao carregar user!")
            else console.log(result);

            let empresa = false;

            let User = {
                Nome: result.data.nome,
                Email: result.data.email,
                TipoUser: "",
            }

            switch (result.data.id_tipo_user) {
                case 1: User.TipoUser = "Aluno";
                        let html = '<button type="button" id="btn-preferencias" class="btn btn-default" ">Vêr Preferências</button>';
                        $("#footer-user").html(html);

                        break;
                case 2: User.TipoUser = "Empresa", empresa = true; break;
                case 3: User.TipoUser = "Orientador"; break;
                case 4: User.TipoUser = "Coordenador"; break;
                case 5: User.TipoUser = "Estagiário"; break;
            }


            let Contacto= {
                Email: "",
                EmailSecundario: "",
                Morada: "",
                Telefone: "",
                Telemóvel: "",
                CC: "",
                ContactoPriveligiado: "",
                ContactoPriveligiadoNome: "",
                RepresentanteNome: "",
                RepresentanteCargo:"",
                NIF: "",
            };

            result.contactos.forEach((contacto)=>{
                console.log(contacto.desc_contacto)
                switch(contacto.id_tipo_contacto) {
                    case 1: Contacto.Email = contacto.desc_contacto; break;
                    case 2: Contacto.Localidade = contacto.desc_contacto; break;
                    case 3: Contacto.Telefone = contacto.desc_contacto; break;
                    case 4: Contacto.Telemovel = contacto.desc_contacto; break;
                    case 5: Contacto.CC  = contacto.desc_contacto; break;
                    case 6: {
                        Contacto.ContactoPriveligiado = contacto.desc_contacto;
                        Contacto.ContactoPriveligiadoNome = contacto.desc_nome;
                        break;
                    }
                    case 7: {
                        Contacto.RepresentanteCargo = contacto.desc_contacto;
                        Contacto.RepresentanteNome = contacto.desc_nome;
                        break;
                    }
                    case 8: Contacto.NIF = contacto.desc_contacto; break;
                    case 9: Contacto.EmailSecundario = contacto.desc_contacto; break;
                }
            })

            console.log(User)
            console.log(Contacto);

            //mudar conteúdo de modal
            $("#titulo-nome-user").html(User.Nome)  ;
            $("#tipo-user").html(User.TipoUser);
            $("#email-user").html(User.Email);
            $("#localizacao-user").html(Contacto.Localidade);
            $("#n-telefone-user").html(Contacto.Telefone);
            $("#n-telemovel-user").html(Contacto.Telemovel);
            $("#email-secundario-user").html(Contacto.EmailSecundario);


            if(empresa) {
                let html = '<table class="table"><tr><td scope="row">Contacto Priveligiado</td><td>'+Contacto.ContactoPriveligiadoNome+'</td></tr>'
                          +'<tr><td scope="row"></td><td>'+Contacto.ContactoPriveligiado+'</td></tr>'
                          +'<tr><td scope="row">Representante</td><td>'+Contacto.RepresentanteNome+'</td></tr>'
                          +'<tr><td scope="row">Cargo</td><td>'+Contacto.RepresentanteCargo+'</td></tr></table>'

                $("#tabela-contactos-empresa").html(html);
            }

            console.log("modal alterado")

            $("#btn-preferencias").click((item) => {
                loadPreferenciasOfUser(result.data.email);
                console.log("clicou");
                item.preventDefault();
                $("#modalPreferencias").modal({ backdrop: true });

            });


        }

    })
}

const loadUsers = (tipo) => {

    let aluno = false;
    if (tipo == "Aluno") aluno = true;

    // let data = {};
    // data.tipo = tipo
    // console.log(JSON.stringify(data));

    $.ajax({
        type: 'GET',
        url: '/load/users/all/bytype',
        data: { tipo: tipo },
        contentType: 'application/json',
        success: function(result) {
            if (result.success == false) alert("Erro ao carregar users!");
            else {
                let numero = "";
                let html = "";

                if (aluno) {

                    html += '<table id="table-users" class="table table-condensed">' +
                        '<thead>' +
                        '<tr>' +
                        '<th scope="col">Nº</th>' +
                        '<th scope="col">Nome</th>' +
                        '<th scope="col">Média</th>' +
                        '<th scope="col">Email</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody >';
                }

                else {
                    html += '<table id="table-users" class="table table-condensed">' +
                        '<thead>' +
                        '<tr>' +
                        '<th scope="col">Nome</th>' +
                        '<th scope="col">Email</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody >';
                }


                result.forEach((row) => {
                    if (aluno) {
                        numero = row.email.substr(0, row.email.indexOf("@"))
                        html += '<tr data-toggle="modal" data-target="#modalVerUser" id="' + row.email + '">' +
                            '<td>' + numero + '</td>' +
                            '<td>' + row.nome + '</td>' +
                            '<td>' + row.media + '</td>' +
                            '<td>' + row.email + '</td>' +
                            '</tr>';
                    }

                    else {
                        html += '<tr data-toggle="modal" data-target="#modalVerUser" id="' + row.email + '">' +
                            '<td>' + row.nome + '</td>' +
                            '<td>' + row.email + '</td>' +
                            '</tr>';
                    }

                });

                $("#table-users").html(html)


                //---------Porquê que há funções aqui------------
                //Antes de colocar este conteúdo na página (porque ele apenas existe quando a função de load users é carregada, não quando cdc.users.view.html é carregado)...
                //...não exise nenhum <tr> (por exemplo, para a função de ver info de user), por isso o jQuery não está à espera de aceder a elementos que ainda não existem.
                //Pelo menos acho que é isso que acontece.
                //Por isso, funções que trabalhem com conteúdo que é colocado dinâmicamente precisam de ser declaradas quando esse conteúdo é colocado.

                //Função para ver info de user
                $("#table-users tr").click((e)=>{
                    e.preventDefault();
                    loadUserByEmailWithContacts(e.currentTarget.id);
            });
            }

        },
        error: function(data) { console.log(data); }
    });
};

const loadAllPropostas = ()=>{
    $.ajax({
        type: "get",
        url: "/load/propostas/all",
        contentType: "application/json",
        success: (result)=>{
            console.log(result)
            let estado = ""
            let num = 0;
            let html =""



            result.forEach((proposta)=>{
                //Alternar estado da proposta

                if (proposta.se_estagio == 1) estado = "Estágio", console.log(proposta.se_estagio);
                else if (proposta.se_atribuida == 1) estado = "Atribuída";
                else if (proposta.se_recusada == 1) estado = "Recusada";
                else if (proposta.se_validada == 1) estado = "Validada";
                else estado = "Por Validar";

                num++;
                html += '<tr id='+proposta.id_proposta+' data-toggle="modal" data-target="#myModal">'
                       +'<th scope="row">'+num+'</th>'
                       +'<td>'+proposta.titulo+'</td>'
                       +'<td>'+proposta.responsavel+'</td>'
                       +'<td>'+estado+'</td></tr>'

            })
            $("#tabela-propostas-cdc").html(html);

            $("#tabela-propostas-cdc tr").click((e)=>{
                    e.preventDefault();
                    loadPropostaByID(e.currentTarget.id);
            });
        }

    })
}

const loadPropostasOfEmpresa = ()=>{
    $.ajax({
        type: "get",
        url: "/load/propostas/ofempresa",
        contentType: "application/json",
        success: (result)=>{
            console.log(result);
            let estado = ""
            let num = 0;
            let html =""

            result.forEach((proposta)=>{
                //Alternar estado da proposta

                if (proposta.se_estagio == 1) estado = "Estágio", console.log(proposta.se_estagio);
                else if (proposta.se_atribuida == 1) estado = "Atribuída";
                else if (proposta.se_recusada == 1) estado = "Recusasa";
                else if (proposta.se_validada == 1) estado = "Validada";
                else estado = "Por Validar";

                num++;
                html += '<tr id='+proposta.id_proposta+' data-toggle="modal" data-target="#myModal">'
                       +'<th scope="row">'+num+'</th>'
                       +'<td>'+proposta.titulo+'</td>'
                       +'<td>'+proposta.responsavel+'</td>'
                       +'<td>'+estado+'</td></tr>'

            })
            $("#tabela-propostas-cdc").html(html);

            $("#tabela-propostas-cdc tr").click((e)=>{
                    e.preventDefault();
                    loadPropostaByID(e.currentTarget.id);
            });
        }

    })

}

const loadPropostasOfAlunos = ()=>{
    $.ajax({
        type: "get",
        url: "/load/propostas/ofaluno",
        contentType: "application/json",
        success: (result)=>{
            console.log(result);
            let estado = ""
            let num = 0;
            let html =""

            result.forEach((proposta)=>{
                //Alternar estado da proposta

                if (proposta.se_estagio == 1) estado = "Estágio", console.log(proposta.se_estagio);
                else if (proposta.se_atribuida == 1) estado = "Atribuída";
                else if (proposta.se_recusada == 1) estado = "Recusasa";
                else if (proposta.se_validada == 1) estado = "Validada";
                else estado = "Por Validar";

                num++;
                html += '<tr id='+proposta.id_proposta+' data-toggle="modal" data-target="#myModal">'
                       +'<th scope="row">'+num+'</th>'
                       +'<td>'+proposta.titulo+'</td>'
                       +'<td>'+proposta.responsavel+'</td>'
                       +'<td>'+estado+'</td></tr>'

            })
            $("#tabela-propostas-cdc").html(html);

            $("#tabela-propostas-cdc tr").click((e)=>{
                    e.preventDefault();
                    loadPropostaByID(e.currentTarget.id);
            });
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
            let estado = ""

            if (result.se_estagio == 1) {
                estado = "Estágio";
                let html = '<button type="button" id="btn-formalizar" class="btn btn-default" data-dismiss="modal data-toggle="modal" data-target="modalOrientadores">Cancelar</button>'
                $("#footer-proposta").html(html)


            }
            else if (result.se_atribuida == 1) {
                estado = "Atribuída";
                let html = '<button type="button" id="btn-formalizar" name="'+result.id_proposta+'"  class="btn btn-default" data-dismiss="modal">Formalizar</button>'
                $("#footer-proposta").html(html)
            }
            else if (result.se_recusada == 1) {
                estado = "Recusada";
                let html = '<button type="button" id="btn-formalizar" class="btn btn-default" data-dismiss="modal">Cancelar</button>'
                $("#footer-proposta").html(html)
            }
            else if (result.se_validada == 1) {
                estado = "Validada";
                let html = '<button type="button" id="btn-formalizar" class="btn btn-default" data-dismiss="modal">Cancelar</button>'
                $("#footer-proposta").html(html)
            }
            else {
                estado = "Por Validar";
                let html = '<button type="button" id="btn-validate" name="'+result.id_proposta+'" class="btn btn-default" data-dismiss="modal">Validar</button>'
                          +'<button type="button" id="btn-recusar"  class="btn btn-default" data-dismiss="modal" data-toggle="modal" data-target="modalRecusar"> Recusar</button>'
                $("#footer-proposta").html(html)
            }

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

            $("#btn-recusar").click((item) => {
                propostaEliminar = result.id_proposta;
                console.log("clicou");
                // item.preventDefault();
                $("#modalRecusar").modal({ backdrop: true});
            })

            $("#btn-formalizar").click((e)=>{
                propostaEstagio = result.id_proposta;
                console.log(result.id_proposta)
                $("#modalOrientadores").modal({ backdrop: true});
            })

            //função para validar!
            $("#btn-validate").click((e)=>{
                console.log(e.currentTarget.name);
                validarProposta(e.currentTarget.name)
            })

            //função para recusar!
            $("#btn-recusar-proposta").click((e)=>{
                let id = propostaEliminar;
                let msg = $("#recusar-msg").val();

                recusarProposta(id.toString(), msg);

            })
        }

    })
}

$(document).ready((e) => {

    $("#main-cont").html($.parseHTML("Loading..."));
    $("#main-cont").load("/view/partials/sobre.view.html");

    $("#link-inicio").click((e) => {
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/sobre.view.html");
    });

    $("#link-users").click((e) => {

        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/cdc/cdc.users.view.html");
    });

    $("#link-perfil").click((e) => {
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/perfil.view.html");
    });

    $("#link-propostas").click((e) => {
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/cdc/cdc.propostas.view.html");
    });

    $("#link-contactos").click((e) => {
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/contactos.view.html");
    });



});
