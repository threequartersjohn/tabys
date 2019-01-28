const sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const fs = require("fs");

const users = require("../model/user.model.js");
const propostas = require("../model/proposta.model.js");
const reposicao = require("../model/reposicao.model.js");
const publicacoes = require("../model/publicacao.model.js");
const rndPass = require("../assets/scripts/rndPass.js");




let nodemailer =      require("../assets/scripts/email.js");


//Users
//Novo User
const saveUser= (req, res)=>{
    let nome = req.body.nome;
    let email = req.body.email;
    let tipo_user = req.body.tipo;
    let password = rndPass.randomPassword();
    let media = 0;
    if (req.body.media) media = req.body.media;

    users.Tipo_user.findOne({where: {desc_tipo_user: tipo_user}}).then((result)=>{
        let tipo = result.dataValues.id_tipo_user;

        users.User.create({
            email: email,
            nome: nome,
            password: bcrypt.hashSync(password, 10, ((error, hash)=>{ if(!error) return hash })),
            id_tipo_user: tipo,
            primeiro_login: 1,
        }).then((result)=>{

            if (tipo_user == "Aluno") {
                users.Media.create({
                    email: email,
                    media: media,
                }).then((result)=>{
                    nodemailer.sendNewUserMail(email, password);
                    res.send({success: true});
                }).catch((error)=>{
                    console.log(error);
                    res.send({success:false});
                });
            }

            else{
                console.log(result);
                nodemailer.sendNewUserMail(email, password);
                res.send({success: true});
            }

        }).catch((error)=>{
            console.log(error);
            res.send({success: false});
        });
    }).catch((error)=>{
        console.log(error);
        res.send({success: false});
    });
};


const addInfo = (req, res)=>{
    //buscar toda a informação
    let email = req.session.user.email;
    let password = req.body.password;
    let novaPassword = req.body.novaPassword;

    console.log("Email: ", email);
    console.log("password: ", novaPassword);

    //buscar informação secundária de empresa mesmo que não exista, é verificada posteriormente
    let emailSecundario = req.body.emailSecundario;
    let contactoNome = req.body.contactoNome;
    let contactoNum = req.body.contactoNum;
    let representanteNome = req.body.representanteNome;
    let representanteCargo = req.body.representanteCargo;
    let NIF = req.body.NIF;


    //função bcrypt para comparar passwords
    const isValidPassword = (userPassword, password)=>{
        return bcrypt.compareSync(password, userPassword);
    };

    //buscar users
    users.User.findOne({where: {email:email}}).then((result)=>{

        //comparar passwords....
        if (isValidPassword(result.password, password)){
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(novaPassword, salt);

            //é preciso testar se isto funciona pq é possível que result escape o scope deste if
            return result.updateAttributes({password: hash, primeiro_login: 0}).then((data)=>{

                //verificar se foram enviadas informações para empresas...
                if(emailSecundario){

                    //se sim criar contactos obrigatórios para empresa!
                    users.Contacto.bulkCreate([
                        {desc_contacto:emailSecundario, id_tipo_contacto: 1, email_user: email},
                        {desc_contacto: contactoNum, desc_nome: contactoNome, id_tipo_contacto:6, email_user: email},
                        {desc_contacto: NIF, id_tipo_contacto:8, email_user: email},
                        {desc_contacto: representanteCargo, desc_nome:representanteNome, id_tipo_contacto: 7, email_user:email}]).then(()=>{
                            //enviar sucesso!
                            res.send({success:true});
                    });
                }

                //se não for empresa, acabar aqui e enviar resposta de sucesso!
                else res.send({success : true});

            }).catch((error)=>console.log(error));
            }

            else res.send({message: "Password errada!"});

    }).catch((error)=>{console.log(error)});
};


const saveProposta = (req, res)=>{
    let titulo = req.body.titulo;
    let desc_trabalho = req.body.desc_trabalho;
    let desc_resultado = req.body.desc_resultado;
    let desc_outro = req.body.desc_outro;
    let desc_plano = req.body.desc_plano;
    let desc_perfil = req.body.desc_perfil;
    let desc_recursos = req.body.desc_recursos;
    let desc_empresa = req.body.desc_empresa;

    let tutor_nome = req.body.tutor_nome;
    let tutor_cargo = req.body.tutor_cargo;
    let tutor_email = req.body.tutor_email;
    let tutor_num = req.body.tutor_num;

    let se_estagio = 0;
    let se_validada = 0;
    let se_atribuida = 0;
    let se_recusada = 0;
    let mensagem_recuso = 0;

    let email_aluno = null;
    let email_empresa = null;
    let email_orientador = null;



    switch(req.session.user.id_tipo_user){
        case 1: email_aluno= req.session.user.email; console.log("Proposta por Aluno: ", email_aluno); break;
        case 2: email_empresa= req.session.user.email; console.log("Proposta por Empresa: ", email_empresa);break;
    }


    propostas.Proposta.create({
        titulo: titulo,
        desc_trabalho: desc_trabalho,
        desc_resultado: desc_resultado,
        desc_outro: desc_outro,
        desc_plano: desc_plano,
        desc_perfil: desc_perfil,
        desc_recursos: desc_recursos,
        desc_empresa: desc_empresa,

        tutor_nome: tutor_nome,
        tutor_cargo: tutor_cargo,
        tutor_email: tutor_email,
        tutor_num: tutor_num,

        se_estagio: se_estagio,
        se_validada: se_validada,
        se_atribuida: se_atribuida,
        se_recusada: se_recusada,
        mensagem_recuso: mensagem_recuso,

        email_aluno: email_aluno,
        email_empresa: email_empresa,
        email_orientador: email_orientador,
    }).then((result)=>{
        console.log(result);
        res.send({success:true});
    }).catch((error)=>{
        console.log(error);
        res.send({success:false});
    });

};

const savePublicacao = (req, res) =>{
    let email = req.session.user.email;
    let se_privada = parseInt(req.body.se_privada);
    let desc_texto = req.body.desc_texto;

    let date = new Date();
    let month = date.getUTCMonth() + 1; //months from 1-12
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();
    let data_post = year + "-" + month + "-" + day;
    console.log(desc_texto)
    console.log(data_post);

    //ir buscar proposta a qual estagiário está associado
    propostas.Proposta.findOne({where: {email_aluno: email, se_estagio: 1}}).then((result)=>{
        let id_proposta = result.id_proposta;
        publicacoes.Publicacao.create({
                desc_texto: desc_texto,
                data_post: data_post,
                se_privada: se_privada,
                id_proposta: id_proposta,
                email_user: email,
            }).then((result)=>{
                res.send({success: true});
            }).catch((error)=>{
                console.log(error);
                res.send({success:false});
            })
    }).catch((error)=>{
        console.log(error);
        res.send({success:false});
    })
}

const saveComentario = (req, res)=>{
    let email = req.session.user.email;
    let id_publicacao = req.body.id_publicacao;
    let desc_comentario = req.body.desc_comentario;

    let date = new Date();
    let month = date.getUTCMonth() + 1; //months from 1-12
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();
    let data_comentario = year + "-" + month + "-" + day;

    publicacoes.Comentario.create({
        email_user: email,
        id_publicacao: id_publicacao,
        desc_comentario: desc_comentario,
        data_comentario: data_comentario,
    }).then((result)=>{
        res.send({success: true})
    }).catch((error)=>{
        console.log(error);
        res.send({success:false});
    })
}

const saveReposicao = (req, res)=>{
    let email = req.body.email;
    let link = rndPass.randomPasswordRequestPath();

    console.log("Email de Reposição: ", email);

    users.User.findOne({where: {email: email}}).then((result)=>{
        console.log(result)
        if(result!=null) {
            reposicao.Reposicao.create({
                link: link,
                email_user: email,
            }).then((result)=>{
                nodemailer.sendChangePasswordMail(email, link)
                res.send({success: true});
            }).catch((error)=>{
                console.log(error);
                res.send({success: false});
            })
        }

        else {
            res.send({success: false, message: "Email não encontrado!"})
        }
    })
};

const saveContacto =(req, res)=>{

    console.log(req.session.user)
    console.log(req.session.user)
    let email = req.session.user.email;
    let desc = req.body.desc;
    let tipo = req.body.tipo;
    let nome = "";
    if (req.body.nome) nome = req.body.nome;

    users.Tipo_contacto.findOne({where: {desc_tipo_contacto: tipo}}).then((result)=>{
        let id_tipo = result.id_tipo_contacto;

        users.Contacto.create({desc_contacto: desc, desc_nome: nome, id_tipo_contacto: id_tipo, email_user: email}).then((result)=>{
            res.send({success: true});
        }).catch((error)=>{
            console.log(error);
            res.send({success: false});
        });
    });
};


const documentUpload = (req, res) => {
        console.log("reached post");
        let email = req.session.user.email;
        let tipo = "";

        let form = formidable.IncomingForm();
        form.uploadDir = "./assets/documents"
        form.keepExtensions = true;

        form.parse(req, (error, fields, files)=>{
            console.log(fields);
            console.log(files)
            tipo = fields.tipo_documento;

            let oldpath = files.file.path;
            let newpath = "./assets/documents/" + email + "/"  + files.file.name;

            if (!fs.existsSync("./assets/documents/" + email)) fs.mkdirSync("./assets/documents/" + email);

            fs.rename(oldpath, newpath, (error) => {
                console.log("reached rename");
                if (error) console.log(error), res.send({ success: false });
                else {
                    users.Tipo_documento.findOne({ where: { desc_tipo_documento: tipo } }).then((result) => {
                        let id_tipo_documento = result.id_tipo_documento;

                        users.Documento.create({
                            email_user: email,
                            id_tipo_documento: id_tipo_documento,
                            desc_documento: files.file.name,
                        }).then((result) => {
                            console.log(result);
                            res.send({ success: true });
                    })
                })
                }
            })




        });
}

const savePreferencia = (req, res)=>{
    let email_user = req.session.user.email;
    let id_proposta = req.body.id_proposta;

    users.Preferencia.max("nivel_preferencia", {where: {email_user:email_user}}).then((result)=>{
        console.log(result)
        let nivel;
        if(isNaN(result)) nivel = 1;
        else nivel = result;

        users.Preferencia.create({email_user: email_user, id_proposta: id_proposta, nivel_preferencia: nivel}).then(()=>{
            res.send({success: true});
        }).catch((error)=>{
            console.log(error);
            res.send({success: false});
        })
    })

}

module.exports = {
    saveUser: saveUser,
    saveContacto: saveContacto,
    saveProposta: saveProposta,
    savePreferencia: savePreferencia,
    addInfo: addInfo,
    saveReposicao: saveReposicao,
    savePublicacao: savePublicacao,
    saveComentario: saveComentario,
    documentUpload: documentUpload,
};