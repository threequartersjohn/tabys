//Limpar contactos para empresa por defeito!
$("#tabela-contactos-empresa").html("");
$("#email-user").html("");
$("#localizacao-user").html("");
$("#n-telefone-user").html("");
$("#n-telemovel-user").html("");


const loadContactosInSession = ()=>{

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

    $.ajax({
        type: "get",
        url: "/load/contactos/all/bySession",
        contentType: "application/json",
        success: (result)=>{
            console.log(result)
            if(result.success == false) alert("Erro com procura de contactos!!");
            else{
                result.forEach((contacto)=>{
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
                    case 9: Contacto.EmailSecundario = contacto.desc_contacto; break
                }
                })

                //mudar conteúdo de
                $("#localizacao-user").html(Contacto.Localidade);
                $("#n-telefone-user").html(Contacto.Telefone);
                $("#n-telemovel-user").html(Contacto.Telemovel);
                $("#email-secundario-user").html(Contacto.EmailSecundario);


                if(window.location.href.includes("/empresa")) {
                    let html = '<table class="table"><tr><td scope="row">Contacto Priveligiado</td><td>'+Contacto.ContactoPriveligiadoNome+'</td></tr>'
                              +'<tr><td scope="row"></td><td>'+Contacto.ContactoPriveligiado+'</td></tr>'
                              +'<tr><td scope="row">Representante</td><td>'+Contacto.RepresentanteNome+'</td></tr>'
                              +'<tr><td scope="row">Cargo</td><td>'+Contacto.RepresentanteCargo+'</td></tr></table>'

                    $("#tabela-contactos-empresa").html(html);
                }
            }

        }

    })
}

const loadDocumentos = ()=>{

    $.ajax({
        type: "get",
        url: "/load/documentos/byemail",
        contentType: "application/json",
        success: (result)=>{
            if(result.success == false) alert("Erro ao carregar documentos!");
            else {
                result.forEach((item)=>{
                    switch (item.id_tipo_documento){
                        case 1: $("#doc-curriulo").html("<a id='"+item.id_documento+"' name='link-documento' href='/load/documento/byid?id_documento="+item.id_documento+"'>" +item.desc_documento + "</a>"); break;
                        case 2: $("#doc-portfolio").html("<a id='"+item.id_documento+"' name='link-documento' href='/load/documento/byid?id_documento="+item.id_documento+"'>" +item.desc_documento + "</a>"); break;
                        case 3: $("#doc-outro").html("<a id='"+item.id_documento+"' name='link-documento' href='/load/documento/byid?id_documento="+item.id_documento+"'>" +item.desc_documento + "</a>"); break;
                    }
                })
            }

        }

    })
}

const novoContacto = (desc, tipo, nome)=>{

    let data={};

    data.desc = desc;
    data.tipo = tipo;

    console.log(data);

    if (nome) desc.nome = nome;

    $.ajax({
        type: "post",
        url: "/save/contacto",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            if(result.success != false) alert("Contacto Inserido!"), loadContactosInSession();
            else alert("Erro ao inserir contacto!");
        }

    })

}

const updatePassword = (password, novaPassword)=>{

    let data={};

    data.password = password;
    data.nova_password = novaPassword;

    console.log(data);

    $.ajax({
        type: "put",
        url: "/update/password",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (result)=>{
            if(result.success != false) alert("Password alterada!");
            else alert("Erro ao alterar password!");
        }

    })

}

const novoDocumento = (file, tipo)=>{
    let formData = new FormData();
    formData.append("tipo_documento", tipo);
    formData.append("file", file);

    $.ajax({
        type: "post",
        url: "/save/documento",
        data: formData,
        processData: false,
        contentType: false,
        success: (result)=>{
            if(result.success != false) alert("Documento carregado com sucesso!"), loadDocumentos();
            else alert("Erro ao inserir documento!");
        }

    })


}
