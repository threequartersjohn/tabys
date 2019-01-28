//jello

//funções para oclocar conteúdo dinâmico

const saveComentario = (id_publicacao, desc_comentario)=>{
    let data= {
        id_publicacao: id_publicacao,
        desc_comentario: desc_comentario,
    };

    console.log(data);

    $.ajax({
    type: "post",
    url: "/save/comentario",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: (result) => {
        if(result.success == true) alert("Publicação guardada com sucesso!"), loadPublicacoes();
        else if(result.success== false) alert("Erro ao guardar publicação!");
    }

    })
}

const loadPublicacoes = () => {
    $.ajax({
        type: "get",
        url: "/load/publicacoes/byproposta",
        contentType: "application/json",
        success: (result) => {
            console.log(result);
            if (result.success == false) alert("Erro com carregamento de publicacoes!");
            else {
                var txt = "";

                result.publicacoes.reverse();
                result.comentarios.reverse();
                result.publicacoes.forEach((row) => {

                    //ciar publicação

                    txt += "<li style='box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.2);background-color:whitesmoke;margin-bottom:4%'>";
                    txt += "<div class='panel-body'>";
                    txt += "<p><span id='data'>" + row.data_post + "</span> <span id='nome-autor'>" + row.email_user + "</span></p>";
                    txt += "<p>" + row.desc_texto + "</p>";
                    txt += "<a data-toggle='collapse' style='float:right' data-target='#collapse-comment"+row.id_publicacao+"'>Comentários</a></div>";
                    txt += "<div class='panel-footer collapse' id='collapse-comment"+row.id_publicacao+"' style='padding-bottom:3%'>";

                    result.comentarios.forEach((comment) => {
                        //ciar comentarios dentro do html da publicação em row

                        if(comment.id_publicacao == row.id_publicacao) {
                            txt += "<div id='comment' style='background-color:white;border:solid 0.2px #e6e6e6'>";
                            // txt += "<div id='comment-header'><div id='comment-autor'>" + comment.email_user + "</div>";
                            txt += "<div id='comment-body' >" + comment.desc_comentario + "</div>";
                            txt += "<div id='comment-footer'><div id='comment-data'>" + comment.email_user +'<br>'+comment.data_comentario + "</div></div></div>";
                        }
                        // txt += "</span>";
                    })
                    txt += "<center><textarea style='border:solid 1px #e59f89;width:96%;margin-bottom:-1.5%;' rows='2' wrap='hard' name='comentario' maxlength='150' id="+row.id_publicacao+"></textarea>"
                        txt += "<button type='button' name='comentar' id="+row.id_publicacao+" class='btn btn-block' style='width:96%;'>Comentar</button></center>";
                      txt += "</div> </li>";
                })
                 $("#ul-publicacoes").html(txt);


                 //novo comentário
                $("button[name=comentar").click((e)=>{
                    console.log(e.currentTarget.id);
                    if($("textarea[id="+e.currentTarget.id+"]").val()==""){
                        alert("Comentário vazio!");
                        return;
                    }
                    saveComentario(e.currentTarget.id, $("textarea[id="+e.currentTarget.id+"]").val())
                })

            }
        }

    })
}

const savePublicacao = (se_privada, texto)=>{

    let data= {
        se_privada: se_privada,
        desc_texto: texto,
    };

    console.log(data);

    $.ajax({
    type: "post",
    url: "/save/publicacao",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: (result) => {
        if(result.success == true) alert("Publicação guardada com sucesso!"), loadPublicacoes();
        else if(result.success== false) alert("Erro ao guardar publicação!");
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

    $("#link-publicacoes").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/orientador/orientador.publicacoes.view.html");
    });
    $("#link-contactos").click((e)=>{
        $("#main-cont").html($.parseHTML("Loading..."));
        $("#main-cont").load("/view/partials/contactos.view.html");
    });
});

