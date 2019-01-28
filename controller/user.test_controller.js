//jello

let whatever;

//conteúdo dos menus
let sidebar = "<p>Bem Vindo!</p><p>Isto é um teste!</p>"

$(document).ready((e)=>{
    
    //função que carrega as médias
    $("#loadMedias").click((e)=>{
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/load/media_with_name',
            success: (data) => {
                
                var txt = "";
                txt += "<table class='table' style='padding:10px; width:20%; margin:0% 15% 0% 15%'>";
                txt += "<thead style='background-color:#607d8b; color:white '>";
                txt += "<tr><th>Nome</th><th>Email</th><th>Média</th></tr></thead><tbody>";
                data.forEach(function(row) {
                    txt += "<tr><td style='text-align:right'>" + row.nome  
                        + "</td><td>" + row.email
                        + "</td><td>" + row.media
                        + "</td></tr>";
                });
                txt += "</tbody></table>";
                $("#content").html(txt);
            }
        });
        
        
    })
    
    //Função que carrega todos os users
    $("#loadUsers").click((e)=>{
        e.preventDefault();
        
        $.ajax({
            type: 'GET',
            url: '/load/users',
            success: (data) => {
                var txt = "";
                txt += "<table class='table' style='padding:10px; width:20%; margin:0% 15% 0% 15%'>";
                txt += "<thead style='background-color:#607d8b; color:white '>";
                txt += "<tr><th>Nome</th><th>Email</th><th>Tipo</th></tr></thead><tbody>";
                data.forEach(function(row) {
                    txt += "<tr><td style='text-align:right'>" + row.nome  
                        + "</td><td>" + row.email
                        + "</td><td>" + row.id_tipo_user
                        + "</td></tr>";
                });
                txt += "</tbody></table>";
                $("#content").html(txt);
            }
        });
    })
    
    //função que carrega as propostas
    $("#loadPropostas").click((e)=>{
        e.preventDefault();
        
        $.ajax({
            type: 'GET',
            url: '/load/propostas',
            success: (data) => {
                
                var txt = "";
                txt += "<table class='table' style='padding:10px; width:20%; margin:0% 15% 0% 15%'>";
                txt += "<thead style='background-color:#607d8b; color:white '>";
                txt += "<tr><th>Título</th><th>Responsável</th><th>Estado</th></tr></thead><tbody>";
                data.forEach(function(row) {
                    
                    
                    let responsavel = "";
                    let estado = "";
                    
                    //aqui estamos a variar o estado da proposta consoante os valores que vêm da base de dados
                    if (row.se_estagio)       estado = "Estágio";
                    else if(row.se_atribuida) estado = "Atribuída";
                    else if(row.se_recusada)  estado = "Recusada";
                    else if(row.se_validada)  estado = "Validada";
                    else                      estado = "Por Validar";
                    
                    
                    
                    //aqui vamos alternar qual o email que vai ser mostrado como responsável
                    if (!row.se_estagio){                       //se não for um estágio...
                        if (row.email_aluno){                   //verificar se existe algum email de aluno associado
                             responsavel = row.email_aluno;     //isto porque, se uma proposta não for estágio e tem um email de aluno associade, então foi proposta por um aluno
                        }
                        else {                                  //mas se não tiver...
                            responsavel = row.email_empresa;    //quer dizer que foi proposta por uma empresa
                        }
                    }
                    
                    else {                                      //se for um estágio...
                        responsavel = row.email_empresa;        //assumir que a empresa é a responsável pela proposta
                    }
                    
                    txt += "<tr><td style='text-align:right'>" + row.titulo 
                        + "</td><td>" + responsavel
                        + "</td><td>" + estado
                        + "</td><td>"
                        + "<button class='btn' type='submit' id='val" + row.id_proposta + "'>Validar Proposta</button>"
                        + "<button class='btn' type='submit' id='rec" + row.id_proposta + "'>Recusar Proposta</button>"
                        + "<button class='btn' type='submit' id='reset" + row.id_proposta + "'>Reset Proposta</button>"
                        + "<button class='btn' type='submit' id='load" + row.id_proposta + "'>Ver Proposta</button>"
                        + "</td></tr>";
                });
                txt += "</tbody></table>";
                $("#content").html(txt);
                
                
                //a partir daqui vamos lidar com as acções dos botões de validar, recusar e fazer reset
                //este selector jquery procura todos os butões cujo id contênha a palavra val
                $("button[id *= 'val']").click((item, e)=> {

                    //aqui vamos buscar o id do botão em específico que foi carregado
                    let post = {id: item.currentTarget.id.slice(3)};
                    
                    $.ajax({
                        type: 'POST',
                        url: '/save/validar_proposta',
                        data: JSON.stringify(post),
                        contentType: 'application/json',
                        success: function(result) {
                            
                            if (result.status == 200) {
                                alert("submitted with success");
                            }
                        },
                        error: function(data) { console.log(data) }
                     });
                    
                });
                
                $("button[id *= 'rec']").click((item, e)=> {
                    
                    let post = {id: item.currentTarget.id.slice(3)};
                    
                    $.ajax({
                        type: 'POST',
                        url: '/save/recusar_proposta',
                        data: JSON.stringify(post),
                        contentType: 'application/json',
                        success: function(result) {
                            
                            if (result.status == 200) {
                                alert("submitted with success");
                            }
                        },
                     });
                    
                });
                
                $("button[id *= 'reset']").click((item, e)=> {
                    
                    let post = {id: item.currentTarget.id.slice(5)};
                    
                    $.ajax({
                        type: 'POST',
                        url: '/save/reset_proposta',
                        data: JSON.stringify(post),
                        contentType: 'application/json',
                        success: function(result) {
                            
                            if (result.status == 200) {
                                alert("submitted with success");
                            }
                        },
                     });
                    
                });
            }
        });
    });
    
    
    
    $("#login").click((e)=>{
         
         
        e.preventDefault();
        
        
        var txt = "<form id='formLogin'><div class='form-group'>";
        txt += "<input type = 'email'  class='form-control' id='email'  placeholder= 'Email' required>";
        txt += "<input type = 'password' class='form-control' id='password' placeholder= 'Password' required>";
        txt += "</div>";
        txt += "<button class='btn' type='submit' id='login'>Login</button>";
        txt += "</form>";
        $("#content").html(txt);
        
        $("#formLogin").on("submit", (e) => {
            if (e.isDefaultPrevented()) console.log("alguma coisa correu mal");
            
            e.preventDefault();
            
        
            
            //buscar variáveis
            let data = {};
            data.email = $("#email").val();
            data.password = $("#password").val();
            
            $.ajax({
                type: 'POST',
                url: '/login/all',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(result) {
                    if (jQuery.isEmptyObject(result)) { alert("Esse user não existe!")}
                    else                             { alert("Bem vindo " + result[0].nome + "!")}
                    },
                error: function(data) { console.log(data) }
            });
        
        })
        
        
            
    });
    
    $("#novoUser").click((e)=>{
         
         
        e.preventDefault();
        
        
        var txt = "<form id='formNovoUser'><div class='form-group'>";
        txt += "<input type = 'text'  class='form-control' id='nome'  placeholder= 'Nome' required>";
        txt += "<input type = 'email' class='form-control' id='email' placeholder= 'Email' required>";
        txt += "<select class='form-control' id='tipoUser'>"+
                    "<option>Aluno</option>" + 
                    "<option>Empresa</option>" +
                    "<option>Orientador</option>" + 
               "</select>";
        txt += "<input type = 'number' class='form-group' id='media' placeholder= 'Média' value= 0, required>";
        txt += "</div>";
        txt += "<button class='btn' type='submit' id='submitNovoUser'>Submeter</button>";
        txt += "</form>";
        $("#content").html(txt);
        
        $("#tipoUser").on("change", ()=>{
            if ($("#tipoUser option:selected").text() != "Aluno") $("#media").prop("disabled", true), $("#media").val(null);
            else                                                  $("#media").prop("disabled", false);
        })
        
        $("#formNovoUser").on("submit", (e) => {
            if (e.isDefaultPrevented()) console.log("alguma coisa correu mal")
            
            e.preventDefault();
            
            
            //buscar variáveis
            let data = {};
            data.nome = $("#nome").val();
            data.email = $("#email").val();
            data.tipoUser = $("#tipoUser option:selected").text();
            data.media = $("#media").val();
            
            $.ajax({
                type: 'POST',
                url: '/save/user',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(result) {
                    
                    if (result.status == 200) {
                        alert("submitted with success");
                    }
                    else if (result.indexOf("Duplicate")>=0){
                        
                        alert("Já existe uma conta com esse email!")
                    }
                },
                error: function(data) { console.log(data) }
            });
        
        })
            
    });
    
    $("#novaProposta").click((e)=>{
        e.preventDefault();
        
        var txt = "<form id='formNovaProposta'><div class='form-group'>";
            txt += "<input type = 'text'  class='form-control' id='titulo'  placeholder= 'Título' required>";
            txt += "<textarea class='form-control' id='descTrabalho'  placeholder= 'Descrição de trabalho' required></textarea>";
            txt += "<textarea class='form-control' id='descResultado'  placeholder= 'Resultados esperados' required></textarea>";
            txt += "<textarea class='form-control' id='descOutros'  placeholder= 'Outras informações' ></textarea>";
            txt += "<textarea class='form-control' id='descPlano'  placeholder= 'Plano de Trabalho' required></textarea>";
            txt += "<textarea class='form-control' id='descPerfil'  placeholder= 'Perfil do Candidato' ></textarea>";
            txt += "<textarea class='form-control' id='descRecursos'  placeholder= 'Recursos a utilizar' required></textarea>";
            txt += "<textarea class='form-control' id='descEmpresa'  placeholder= 'Empresa (só se for um aluno a preencher)' ></textarea>";
            txt += "<input type = 'text'  class='form-control' id='tutorNome'  placeholder= 'Nome do tutor' required>";
            txt += "<input type = 'text'  class='form-control' id='tutorCargo'  placeholder= 'Cargo do tutor' required>";
            txt += "<input type = 'text'  class='form-control' id='tutorEmail'  placeholder= 'Email do tutor' required>";
            txt += "<input type = 'text'  class='form-control' id='tutorNum'  placeholder= 'Nº Contacto do tutor' required>";
            txt += "</div>";
            txt += "<div>";
            txt += "<p>Colocar o email de quem vai inserir a proposta</p>";
            txt +="<input type = 'text'  class='form-control' id='email'  placeholder= 'Email do aluno'>";
            txt += "<select class='form-control' id='tipoUser'>"+
                    "<option>Aluno</option>" + 
                    "<option>Empresa</option>" +
               "</select></div>";
            txt += "<button class='btn' type='submit' id='submitNovoUser'>Submeter</button>";
            txt += "</form>";
            $("#content").html(txt);
            
            $("#formNovaProposta").on("submit", (e) => {
            if (e.isDefaultPrevented()) console.log("alguma coisa correu mal")
            
            e.preventDefault();
            
            
            //buscar variáveis
            let data = {};
            data.titulo = $("#titulo").val();
            data.descTrabalho = $("#descTrabalho").val();
            data.descResultado = $("#descResultado").val();
            data.descoutros = $("#descOutros").val();
            data.descPlano = $("#descPlano").val();
            data.descPerfil = $("#descPerfil").val();
            data.descRecursos = $("#descRecursos").val();
            data.descEmpresa = $("#descEmpresa").val();
            data.tutorNome = $("#tutorNome").val();
            data.tutorCargo = $("#tutorCargo").val();
            data.tutorEmail = $("#tutorEmail").val();
            data.tutorNum = $("#tutorNum").val();
            data.email = $("#email").val();
            data.tipoUser = $("#tipoUser option:selected").text();
            
            $.ajax({
                type: 'POST',
                url: '/save/proposta',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(result) {
                    
                    if (result.status == 200) {
                        alert("submitted with success");
                    }
                    else if (result.indexOf("Duplicate")>=0){
                        
                        alert("Já existe uma conta com esse email!")
                    }
                },
                error: function(data) { console.log(data) }
            });
        
        })
            
        
        
    })
    
    
    
    
});