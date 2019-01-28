const sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const reposicao = require("../model/reposicao.model.js");
const seriacao = require("../model/seriacao.model.js");
const propostas = require("../model/proposta.model.js");
const users = require("../model/user.model.js");
const docGen = require("../assets/scripts/docGen.js");

const isValidPassword = (userPassword, password)=>{
        return bcrypt.compareSync(password, userPassword);
    };

const updateDatas = (req, res)=>{
    let data_inicio = req.body.data_inicio
    let data_fim = req.body.data_fim
    console.log(data_inicio ," -- ",data_fim)

    seriacao.Seriacao.findOne({where: {id_data: 1}}).then((result)=>{
       result.updateAttributes({data_inicio: data_inicio, data_fim:data_fim}).then(()=>{
           seriacao.Seriacao.findOne({where: {id_data: 1}}).then((result)=>{
               res.json(result);
           });
       }).catch((error)=>{
           console.log(error);
           res.send({success: false});
       });
    }).catch((error)=>{
           console.log(error);
           res.send({success: false});
       });
};

const validarProposta = (req, res)=>{
    let id = req.body.id;

    propostas.Proposta.findOne({where: {id_proposta: id}}).then((result)=>{
        result.updateAttributes({se_validada: 1}).then(()=>{
            res.send({success: true})
        }).catch((error)=>{
            console.log(error);
            res.send({success:false});
        })
    })
};

const recusarProposta = (req, res)=>{
    let id = req.body.id;
    let msg = req.body.msg;

    propostas.Proposta.findOne({where: {id_proposta: id}}).then((result)=>{
        result.updateAttributes({se_recusada: 1, mensagem_recuso:msg}).then(()=>{
            res.send({success: true})
        }).catch((error)=>{
            console.log(error);
            res.send({success:false});
        })
    })
};

const atribuirProposta = (req, res)=>{
    let id_proposta = req.body.id;
    let email_aluno = req.body.email;
    let email_orientador = req.body.email_orientador;

    propostas.Proposta.findOne({where: {id_proposta: id_proposta}}).then((result)=>{
        let proposta = result;
        users.Users.findOne({where: {email: email_aluno}}).then((result)=>{
            let user = result;
            users.Contacto.findAll({where: {email_user: email_aluno}}).then((result))
                let userContactos = result;
                users.Contact.findAll({where: {email_user: proposta.dataValues.email_empresa}}).then((result)=>{
                    let empresaContactos = result;
                    users.User.findOne({where: {email: proposta.dataValues.email_orientador}}).then((result)=>{
                        let orientador = result;
                        users.User.findOne({where: {email: proposta.dataValues.email_empresa}}).then((result)=>{
                            let empresa = result;
                            result.updateAttributes({se_atribuida: 1, email_aluno:email_aluno, email_orientador: email_orientador}).then(()=>{
                            let data = {
                                empresa_nome: empresa.dataValues.nome,
                                aluno_nome: user.dataValues.nome,
                                aluno_numero: user.dataValues.email.slice(0,7),
                                proposta_nome: proposta.dataValues.titulo,
                                aluno_email: user.dataValues.email,
                                tutor_cargo: proposta.dataValues.tutor_cargo,
                                tutor_nome: proposta.dataValues.tutor_nome,
                                tutor_email: proposta.dataValues.tutor_email,

                            }

                            userContactos.forEach((contacto)=>{
                                if (contacto.dataValues.id_tipo_contacto==4) data.aluno_numero_tel = contacto.dataValues.desc_contacto;
                            })

                            empresaContactos.forEach((contacto)=>{
                                if (contacto.dataValues.id_tipo_contacto==8) data.empresa_nif = contacto.dataValues.desc_contacto;
                                if (contacto.dataValues.id_tipo_contacto==7) {
                                    data.empresa_representante = contacto.dataValues.desc_nome;
                                    data.empresa_representante_cargo = contacto.dataValues.desc_contacto;
                                };
                                if (contacto.dataValues.id_tipo_contacto==2) data.empresa_morada = contacto.dataValues.desc_contacto;
                            })

                            docGen.docGen(data, email_aluno)
                            res.send({success: true});
                        }).catch((error)=>{
                            console.log(error);
                            res.send({success:false});
                        });
                        })
                    })
                })
        })
    }).catch((error)=>{
        console.log(error);
        res.send({success: false});
    });
};

const estagioProposta = (req, res)=>{
    let id = req.body.id;
    let email_orientador = req.body.email_orientador;

    propostas.Proposta.findOne({where: {id_proposta: id}}).then((result)=>{
        let email_aluno = result.dataValues.email_aluno;
        result.updateAttributes({se_estagio: 1, email_orientador: email_orientador}).then(()=>{
            users.User.findOne({where: {email: email_aluno}}).then((result)=>{
                result.updateAttributes({id_tipo_user: 5});
                res.send({success: true});
            })
        }).catch((error)=>{
            console.log(error);
            res.send({success:false});
        })
    })
}

const updatePassword = (req, res)=>{
    let email = req.session.user.email;
    let password = req.body.password;
    let novaPassword = req.body.nova_password;



    users.User.findOne({where: {email: email}}).then((result)=>{
        if (isValidPassword(result.password, password)) {
            return result.updateAttributes({password: bcrypt.hashSync(novaPassword, 10, ((error, hash)=>{ if(!error) return hash }))}).then((data)=>{
                res.send({success: true});
            });
        }

        else {
            res.send({message: "Password errada!"});
        }
    }).catch((error)=>{
        console.log(error);
        res.send({success:false});
    });

};

const updatePasswordWithLink = (req, res)=>{
    let link = req.body.link;
    let novaPassword = req.body.novaPassword;

    reposicao.Reposicao.findOne({where: {link: link}}).then((result)=>{
        console.log(result);
        let email = result.dataValues.email_user;
        console.log("Email: " + email)

        users.User.findOne({where: {email: email}}).then((result)=>{

            result.updateAttributes({password: bcrypt.hashSync(novaPassword, 10, ((error, hash)=>{ if(!error) return hash }))}).then((data)=>{
                res.send({success: true});
            }).catch((error)=>{
                console.log(error);
                res.send({success: false});
            });
        }).catch((error)=>{
                console.log(error);
                res.send({success: false});
        });
    });

};

module.exports = {
    updateDatas: updateDatas,
    updatePassword: updatePassword,
    updatePasswordWithLink: updatePasswordWithLink,
    estagioProposta: estagioProposta,
    atribuirProposta: atribuirProposta,
    recusarProposta: recusarProposta,
    validarProposta: validarProposta,
};