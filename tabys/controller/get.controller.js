const sequelize = require("sequelize");
const path = require("path");
const users = require("../model/user.model.js");
const propostas = require("../model/proposta.model.js");
const seriacao = require("../model/seriacao.model.js");
const publicacoes = require("../model/publicacao.model.js")



//USERS

//Encontrar todos os users
const findAllUsers = (req, res) => {
    users.User.findAll().then((result) => {
        let users = new Array();

        result.forEach((user) => {
            users.push(user.dataValues);
        });
        res.json(users);

    }).catch((error) => {
        res.json({ success: false });
    });
};

//Encontrar users de um certo tipo de user
const findUsersByType = (req, res) => {
    let tipo = req.query.tipo;

    users.Tipo_user.findOne({ where: { desc_tipo_user: tipo } }).then((result) => {
        let id_tipo = result.dataValues.id_tipo_user;

        users.User.findAll({ where: { id_tipo_user: id_tipo }, attributes: ["email", "nome"] }).then((result) => {
            let post = {}
            post.users = result;

            if (tipo == "Aluno") {

                users.Media.findAll().then((result) => {

                    //copiar resultado para médias
                    post.media = result;

                    //para enviar o atributo média junto do user que lhe corre
                    //para cada user, ver cada média e verificar se lhe pertence
                    post.users.forEach((user) => {
                        post.media.forEach((media) => {

                            //se lhe pertence, passar o atributo para o user
                            if (media.dataValues.email == user.dataValues.email) user.dataValues.media = media.dataValues.media;
                        });
                    });

                    res.json(post.users)

                }).catch((error) => {
                    console.log(error);
                    res.send({ success: false });
                })
            }

            else {
                res.json(result)
            }
        }).catch((error) => {
            console.log(error);
            res.send({ success: false });
        })
    })
}

//Encontrar apenas um user por email
const findUserByEmail = (req, res) => {
    let email = req.query.email;
    users.User.findOne({ where: { email: email } }).then((result) => {
        res.json(result);
    }).catch((error) => {
        console.log(error)
        res.json({ success: false });
    });
};

//Encontrar user com contactos
const findUserWithContactos = (req, res) => {
    let email = req.query.email;
    let post = {};


    users.User.findOne({ where: { email: email }, attributes: ["email", "id_tipo_user", "nome"]})
        .then((result) => {

            post.data = result;
            users.Contacto.findAll({ where: { email_user: email } })
                .then((result) => {
                    post.contactos = result;
                    res.json(post);
                })
                .catch((error) => {
                    console.log(error);
                    res.json({ success: false });
                });
        })
        .catch((error) => {
            console.log(error);
            res.json({ success: false });
        });
};

//Função que agrega toda a informação de um user específico
const findUserAllInfo = (req, res) => {
    let email = req.query.email;

    let post = {};

    //encontrar user
    users.User.findOne({ where: { email: email } }).then((result) => {

        post.user = result;

        //encontrar média
        users.Media.findOne({ where: { email: email } }).then((result) => {

            if (result) post.media = result;

            //encontrar Contactos
            users.Contacto.findAll({ where: { email_user: email } }).then((result) => {
                if (result) post.contactos = result;

                //encontrar Documentos
                users.Documento.findAll({ where: { email_user: email } }).then((result) => {
                    if (result) post.documentos = result;

                    //enviar resultados!
                    res.json(post);
                }).catch((error) => {
                    console.log(error)
                    res.send({ success: false });
                });
            }).catch((error) => {
                console.log(error)
                res.send({ success: false });
            });
        }).catch((error) => {
            console.log(error)
            res.send({ success: false });
        });
    }).catch((error) => {
        console.log(error)
        res.send({ success: false });
    });

};

//Função que envia users com média
const findAllUsersWithMedia = (req, res) => {

    //JSON onde são enviados os dados
    let post = {};

    //procurar todos os users
    users.User.findAll().then((result) => {

        //copiar resultado para post
        post.users = result;

        //procuar todas as médias
        users.Media.findAll().then((result) => {

            //copiar resultado para médias
            post.media = result;

            //para enviar o atributo média junto do user que lhe corre
            //para cada user, ver cada média e verificar se lhe pertence
            post.users.forEach((user) => {
                post.media.forEach((media) => {

                    //se lhe pertence, passar o atributo para o user
                    if (media.dataValues.email == user.dataValues.email) user.dataValues.media = media.dataValues.media;
                });
            });

            //depois da operação não precisamos de enviar as médias, tornam-se redundantes
            delete post.media;

            //enviar JSON!
            res.json(post.users);

        }).catch((error) => {
            res.send({ success: false });
        });

    }).catch((error) => {
        res.send({ success: false });
    });

};

//mudar password


//Contactos

//Encontrar contactos de um user com tipo de contacto
const findContactosByUser = (req, res) => {
    let email = req.query.email;
    let post = {}

    //encontrar contactos
    users.Contacto.findAll({ where: { email_user: email } }).then((result) => {

        post.contactos = result;

        users.Tipo_contacto.findAll().then((result) => {
            post.tipo_contactos = result;

            post.contactos.forEach((contacto) => {
                post.tipo_contactos.forEach((tipo) => {
                    if (tipo.dataValues.id_tipo_contacto == contacto.dataValues.id_tipo_contacto) contacto.dataValues.tipo_contacto = tipo.dataValues.desc_tipo_contacto;
                })
            })

            delete post.tipo_contactos;
            res.json(post.contactos)
        });
    });
};

//Encontrar contactos do user em sessão!
const findContactosOfUserInSession = (req, res) => {
    let email = req.session.user.email;
    let post = {}

    //encontrar contactos
    users.Contacto.findAll({ where: { email_user: email } }).then((result) => {

        post.contactos = result;

        users.Tipo_contacto.findAll().then((result) => {
            post.tipo_contactos = result;

            post.contactos.forEach((contacto) => {
                post.tipo_contactos.forEach((tipo) => {
                    if (tipo.dataValues.id_tipo_contacto == contacto.dataValues.id_tipo_contacto) contacto.dataValues.tipo_contacto = tipo.dataValues.desc_tipo_contacto;
                })
            })

            delete post.tipo_contactos;
            res.json(post.contactos)
        });
    });
};

//Propostas
const findAllPropostas = (req, res) => {
    // propostas.Proposta.findAll().then((result) => {
    //     res.json(result);
    // }).catch((error)=>{
    //     console.log(error);
    //     res.send({success: false});
    // })

    propostas.Proposta.findAll().then((result)=>{
        let propostas = result;
        users.User.findAll({attributes: ["email", "nome"]}).then((result)=>{
            result.forEach((user)=>{
                propostas.forEach((proposta)=>{
                    if (user.dataValues.email == proposta.dataValues.email_empresa) proposta.dataValues.responsavel = user.dataValues.nome;
                    else if (user.dataValues.email == proposta.dataValues.email_aluno) proposta.dataValues.responsavel = user.dataValues.nome;
                })
            })

            res.json(propostas);
        })

    }).catch((error)=>{
        console.log(error);
        res.send({success: false});
    })
}

const findPropostasByEmpresa = (req, res) => {
    let email_empresa = req.session.user.email;

    propostas.Proposta.findAll({ where: { email_empresa: email_empresa } }).then((result) => {
        res.json(result);
    }).catch((error)=>{
        console.log(error);
        res.send({success:false})
    })
}

const findPropostasByAluno = (req, res) => {
    let email_aluno = req.query.email_aluno;

    propostas.Proposta.findOne({ where: { email_empresa: email_aluno } }).then((result) => {
        res.json(result);
    })
}

const findPropostasByID = (req, res) => {
    let id_proposta = req.query.id;

    propostas.Proposta.findOne({ where: { id_proposta: id_proposta } }).then((result) => {
        res.json(result);
    }).catch((error)=>{
        console.log(error);
        res.send({success: false});
    })
}

//??
//Não sei o que esta query faz?? Não me lembro porque é que fiz isto :((
const findPropostasOfEmpresa = (req, res) => {
    propostas.Proposta.findAll().then((result) => {
        let post = [];

        result.forEach((item) => {
            if (item.dataValues.email_empresa != null)  post.push(item);        })

        users.User.findAll({attributes: ["email", "nome"]}).then((result)=>{
            result.forEach((user)=>{
                post.forEach((item)=>{
                    if (user.dataValues.email == item.dataValues.email_empresa) item.dataValues.responsavel = user.dataValues.nome;
                    else if (user.dataValues.email == item.dataValues.email_aluno) item.dataValues.responsavel = user.dataValues.nome;
                })
            })

            res.json(post);
        })

    })
}

const findPropostasOfAluno = (req, res) => {
    propostas.Proposta.findAll().then((result) => {
        let post = []

        result.forEach((item) => {
            if (item.dataValues.email_aluno !=null && item.dataValues.email_empresa == null) post.push(item);
        })
        users.User.findAll({attributes: ["email", "nome"]}).then((result)=>{
            result.forEach((user)=>{
                console.log(user.dataValues.email);
                post.forEach((item)=>{
                    if (user.dataValues.email == item.dataValues.email_empresa) item.dataValues.responsavel = user.dataValues.nome;
                    else if (user.dataValues.email == item.dataValues.email_aluno) item.dataValues.responsavel = user.dataValues.nome;
                })
            })

            res.json(post);
        }).catch((error)=>{
            console.log(error);
            res.send({success : false});
        })
    })
}

//Publicações
const findPublicacaoesByProposta = (req, res) => {
    let id_proposta = "";
    let email = req.session.user.email;
    let post = {};

    propostas.Proposta.findOne({where: {email_aluno: email, se_estagio: 1}}).then((result)=>{
        id_proposta = result.id_proposta;
        publicacoes.Publicacao.findAll({ where: { id_proposta: id_proposta } }).then((result) => {
        post.publicacoes = result;

        publicacoes.Comentario.findAll().then((result) => {
            post.comentarios = result;

            post.publicacoes.forEach((publicacao) => {
                publicacao.comentarios = [];
                post.comentarios.forEach((comentario) => {
                    if (comentario.dataValues.id_publicacao == publicacao.dataValues.id_publicacao) publicacao.comentarios.push(comentario);
                });
            });

            res.send(post);
        });

    }).catch((error) => {
        console.log(error);
        res.send({ success: false });
    });
    })

};


//Datas
const findDatas = (req, res) => {
    seriacao.Seriacao.findOne().then((result) => {
        res.json(result);
    })
}

const findDocumentosByEmail= (req, res)=>{
    let email = req.session.user.email;

    users.Documento.findAll({where: {email_user: email}}).then((result)=>{
        res.json(result);
    }).catch((error)=>{
        console.log(error);
        res.send({success:false});
    })
}

const getDocumento = (req, res) => {
    let id_documento = req.query.id_documento;
    let email = req.query.email;

    console.log(id_documento + " --- " + email);

    users.Documento.findOne({ where: { id_documento: id_documento } }).then((result) => {
        let pathToFile = path.join(__dirname, "../assets/documents/", email, result.desc_documento)
        console.log(pathToFile);

        res.download(pathToFile);
    })
}

const getDocumentoByID = (req, res) => {
    let id_documento = req.query.id_documento;
    let email = "";

    users.Documento.findOne({ where: { id_documento: id_documento } }).then((result) => {
        let email = result.email_user;

        let pathToFile = path.join(__dirname, "../assets/documents/", email, result.desc_documento)
        console.log(pathToFile);

        res.download(pathToFile);

    })
}

const isPreferenciaPossible = (req, res) =>{
    var date = new Date();
    var month = date.getUTCMonth() + 1; //months from 1-12
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();

    seriacao.Seriacao.findOne({where: {id_data: "1"}}).then((result)=>{
        let data_inicio = result.data_inicio.split("-");
        let data_fim = result.data_fim.split("-");

        data_inicio.forEach((item)=>{
            item = parseInt(item);
        })

        data_fim.forEach((item)=>{
            item = parseInt(item);
        })

        console.log(data_fim)

        //check values
        if (year < data_inicio[0] || year > data_fim[0]) res.send({success:false});
        else if (month < data_inicio[1]|| month > data_fim[1]) res.send({success:false});
        else if (day < data_inicio[2]|| day > data_fim[2]) res.send({success:false});
        else res.send({success: true})
    })
};

const findPropostasOfOrientador = (req, res)=>{
    let orientador = req.session.user.email;

    propostas.Proposta.findAll({where: {email_orientador: orientador}, atributes: ["id_proposta","titulo"]}).then((result)=>{
        res.json(result);
    }).catch((error)=>{
        console.log(error);
        res.send({success: false})
    })


};

const findPropostasValidadas = (req, res)=>{
    propostas.Proposta.findAll({where: {se_validada: 1, se_atribuida: 0, se_recusada: 0, se_estagio: 0, email_aluno: null}}).then((result)=>{
        let propostas = result;
        users.User.findAll({attributes: ["email", "nome"]}).then((result)=>{
            result.forEach((user)=>{
                propostas.forEach((proposta)=>{
                    if (user.dataValues.email == proposta.dataValues.email_empresa) proposta.dataValues.empresa = user.dataValues.nome;
                })
            })

            res.json(propostas);
        })

    }).catch((error)=>{
        console.log(error);
        res.send({success: false});
    })
};

const findPreferenciasOfUser = (req, res)=>{
    let email = req.query.email;

    users.Preferencia.findAll({where: {email_user: email}}).then((result)=>{
        let post = result;

        propostas.Proposta.findAll().then((result)=>{
            result.forEach((item)=>{
                post.forEach((preferencia)=>{
                    if (item.dataValues.id_proposta == preferencia.dataValues.id_proposta) {
                        preferencia.dataValues.nome = item.dataValues.titulo;
                        preferencia.dataValues.id_proposta = item.dataValues.id_proposta;
                    };
                })
            })

            res.json(post);
        }).catch((error)=>{
            console.log(error);
            res.send({success: false})
        })

    }).catch((error)=>{
        console.log(error);
        res.send({success:error});
    })
};

const findPreferenciaByProposta = (req, res)=>{
    let id_proposta = req.query.id;

    users.Preferencia.findAll({where: {id_proposta: id_proposta}}).then((result)=>{
        res.json(result);
    }).catch((error)=>{
        console.log(error);
        res.send({success: false});
    })
}

const findPreferenciasByEmail = (req, res)=>{
    let email = req.session.user.email;

    users.Preferencia.findAll({where: {email_user: email}}).then((result)=>{
        let post = result;
        post;

        propostas.Proposta.findAll().then((result)=>{
            result.forEach((item)=>{
                post.forEach((preferencia)=>{
                    if (item.dataValues.id_proposta == preferencia.dataValues.id_proposta) {
                        preferencia.dataValues.proposta = item.dataValues.titulo;
                    };
                })
            })

            res.json(post);
        }).catch((error)=>{
            console.log(error);
            res.send({success: false})
        })

    }).catch((error)=>{
        console.log(error);
        res.send({success:error});
    })
}

module.exports = {
    findAllUsers: findAllUsers,
    findAllUsersWithMedia: findAllUsersWithMedia,
    findUserByEmail: findUserByEmail,
    findUserWithContactos: findUserWithContactos,
    findUserAllInfo: findUserAllInfo,
    findUsersByType: findUsersByType,
    findContactosByUser: findContactosByUser,
    findContactosOfUserInSession: findContactosOfUserInSession,
    findAllPropostas: findAllPropostas,
    findPropostasByEmpresa: findPropostasByEmpresa,
    findPropostasByAluno: findPropostasByAluno,
    findPropostasByID: findPropostasByID,
    findPropostasOfEmpresa: findPropostasOfEmpresa,
    findPropostasOfAluno: findPropostasOfAluno,
    findPropostasOfOrientador: findPropostasOfOrientador,
    findPropostasValidadas: findPropostasValidadas,
    findPreferenciasByEmail:  findPreferenciasByEmail,
    findPreferenciasOfUser: findPreferenciasOfUser,
    findPreferenciaByProposta: findPreferenciaByProposta,

    findPublicacaoesByProposta: findPublicacaoesByProposta,

    findDatas: findDatas,
    isPreferenciaPossible: isPreferenciaPossible,

    findDocumentosByEmail: findDocumentosByEmail,
    getDocumento: getDocumento,
    getDocumentoByID: getDocumentoByID,
};
