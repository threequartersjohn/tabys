//jello
// const Sequelize = require("sequelize");
// const database = require=("../assets/scripts/connect.js")

//este ficheiro apenas define a estrutura da base de dados

//e.g., estrutura da nossa tabela de users
//esta estre«utura define a passagem entre a aplicação e a base de dados
// const User = database.connection.define("user", {
//     email:          {type: Sequelize.STRING(100), field: "email", primaryKey: true},
//     nome:           {type: Sequelize.STRING(200), field: "nome"},
//     id_tipo_user:   {type: Sequelize.TINYINT(4), field: "id_tipo_user"},
//     primeiro_login: {type: Sequelize.TINYINT(4), field: "primeiro_login"}
// });







//USERS---------------------

//função de leitura de todos os users
function readAllUsers(callback){

    global.connection.con.query("select * from User;", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT: ", err);
        else {
            console.log("read all users com sucesso")

            callback(null, rows);
        }
    });
}

//função para encontrar user por email
function findUserByEmail(email, password, callback){
    global.connection.con.query("select * from User where email like '" + email + "' and password = '" + password  + "'", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT: ", err);
        else callback(null, rows);
    });
}

//função de leitura de aluno por email e password
function findAlunoByEmail(email, password, callback){

    global.connection.con.query("select * from User where email like '" + email + "' and id_tipo_user = 1 and password = '" + password  + "'", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT: ", err);
        else callback(null, rows);
    });
}

//função de leitura de empresa por email e password
function findEmpresaByEmail(email, password, callback){

    global.connection.con.query("sselect * from User where email like '" + email + "' and id_tipo_user = 2 and password = '" + password + "'", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT: ", err);
        else callback(null, rows);
    });
}

//função de leitura de Orientador por email e password
function findOrientadorByEmail(email, password, callback){

    global.connection.con.query("select * from User where email like '" + email + "' and id_tipo_user = 3 and password = '" + password + "'", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT: ", err);
        else callback(null, rows);
    });
}

//função de leitura de alunos por proposta (para ver quem tem preferência numa dada proposta)
function findAlunosByPreferencia(id_proposta, callback) {

    global.connection.con.query("select * from User where email like (select email_user from Preferencia where id_proposta like '" + id_proposta + "'", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT: ", err);
        else callback(null, rows);
    });
}

//função de leitura de users com tipo_user
function findUserByEmailAndTipo(email, tipo_user, callback){

    let id_tipo_user;

    switch(tipo_user){
        case("Aluno"): id_tipo_user = 0;
        case("Empresa"): id_tipo_user = 1;
        case("Orientador"): id_tipo_user = 2;
    }

    global.connection.con.query("sselect * from User where email like '" + email + "' and id_tipo_user like '" + id_tipo_user + "'", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT: ", err);
        else callback(null, rows);
    });
}

//função para alterar aluno para estagiário
function changeAlunoToEstagiario(email, callback){

    global.connection.con.query("update User set id_tipo_user = 5 where email = '" + email +  "'", (error, result) => {
        if (error) callback(error), console.log("Error on INSERT: ", error);
        else callback(null),        console.log("Success on INSERT");
    });
}

//função de leitura de alunos que são estagiários
function findAllEstagiario(callback){

    global.connection.con.query("select * from User where id_tipo_user = 5", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT: ", err);
        else callback(null, rows);
    });
}

//função de leitura de alunos que ainda não fizeram login

//função de gravação de Users
function saveUser(email, nome, media, tipoUser, password, callback){

    let id_tipo_user;

    switch(tipoUser){
        case("Aluno"): id_tipo_user = 1;
        case("Empresa"): id_tipo_user = 2;
        case("Orientador"): id_tipo_user = 3;
    }

    let post = {email:email,
                nome: nome,
                id_tipo_user: id_tipo_user,
                password: password};

     let query = global.connection.con.query("insert into User set ?", post, (error, result)=> {
         console.log("INSERT: ", query.sql);

         if (error){
              callback(error.sqlMessage);
              console.log("Error on INSERT: ", error);
         }
         else if (media!=null){

             let post2 = {email:email,
                          media:media
             }
             global.connection.con.query("insert into Media set ?", post2, (error, result) =>{
                 if (error){
                     callback(error.sqlMessage);
                     console.log("Erro: ", error)
                 }
             })
         }
    });
}

//teste query encadeada

function test(){
    global.connection.con.query("select * from aluno", (error, result)=>{
        if (error) console.log(error);
        else {

        }
    })
}


//--------------------------


//MEDIAS--------------------
function readMediasWithName(callback){

    global.connection.con.query("select User.nome, User.email, Media.media from User, Media where Media.email = User.email", (error, rows, fields) =>{
        if(error) console.log("error with sql: ", error.sqlMessage)
        else      callback(null, rows);
    })
}
//--------------------------

//PROPOSTAS-----------------

//função de leitura das propostas
function readPropostas(callback){

    global.connection.con.query("select * from Proposta", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT Proposta: ", err);
        else {
            callback(null, rows);
        }
    });

}

//função de leitura de proposta por empresa
function readPropostasByEmpresa(email, callback){

    global.connection.con.query("select * from Proposta where email_empresa = '" + email + "'", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT Proposta: ", err);
        else {
            callback(null, rows);
        }
    });

}

//função de leitura de proposta por id de aluno
function readPropostasByAluno(email, callback){

    global.connection.con.query("select * from Proposta where email_aluno = '" + email + "'", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT Proposta: ", err);
        else {
            callback(null, rows);
        }
    });

}

//função de leitura de proposta que são estágio
function readPropostasIfEstagio(callback){

    global.connection.con.query("select * from Proposta where se_estagio = 1", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT Proposta: ", err);
        else {
            callback(null, rows);
        }
    });

}

//função de recusa de proposta

//função de leitura de id de proposta pelo nome
function readPropostasByID(idProposta, callback){

    global.connection.con.query("select * from Proposta where id_proposta = ?", idProposta, (err, rows, fields) => {
        if (err) console.log("Erro em SELECT Proposta por ID: ", err);
        else {
            callback(null, rows);
        }
    });

}

//função de gravação de proposta
function saveProposta(titulo, descTrabalho, descResultado, descOutro, descPlano, descPerfil, descRecursos, descEmpresa, tutorNome, tutorCargo, tutorEmail, tutorNum, email, tipo_user){

    let post = {titulo: titulo,
                desc_trabalho: descTrabalho,
                desc_resultado: descResultado,
                desc_outro: descOutro,
                desc_plano: descPlano,
                desc_perfil: descPerfil,
                desc_recursos: descRecursos,
                desc_empresa: descEmpresa,
                tutor_nome: tutorNome,
                tutor_cargo: tutorCargo,
                tutor_email: tutorEmail,
                tutor_num: tutorNum,
    }

    switch (tipo_user){
        case "Aluno": post.email_aluno = email;     break;
        case "Empresa": post.email_empresa = email; break;
    }

    global.connection.con.query("insert into Proposta set ?", post, (error, result) => {
        if (error) console.log("Erro:", error);
    })

}

//função para validar uma proposta
function validarProposta(id){

    global.connection.con.query("update Proposta set se_validada = 1, se_recusada = 0, se_estagio=0, se_atribuida = 0 where id_proposta = '" + id + "'", (error, result)=>{
        if (error) console.log(error);
        else console.log(result);
    });
}

//função para recusar uma proposta
function recusarProposta(id){

    global.connection.con.query("update Proposta set se_validada = 0, se_recusada = 1, se_estagio=0, se_atribuida = 0 where id_proposta = '" + id + "'", (error, result)=>{
        if (error) console.log(error);
        else console.log(result);
    });
}

//função para recusar uma proposta
function resetProposta(id){

    global.connection.con.query("update Proposta set se_validada = 0, se_recusada = 0, se_estagio=0, se_atribuida = 0 where id_proposta = '" + id + "'", (error, result)=>{
        if (error) console.log(error);
        else console.log(result);
    });
}



//função para tornar proposta um estágio

//--------------------------

//PREFERÊNCIAS--------------

//função de leitura de preferencias
function readPreferencias(callback){

    global.connection.con.query("select * from Preferencia", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT Preferencia: ", err);
        else callback(null, rows);
        });


}

//função de leitura de preferências por id de aluno
function readPreferenciaByAluno(email, callback){
    global.connection.con.query("select * from Preferencia where email_user = '" + email + "'", (err, rows, fields)=>{
        if (err) console.log("readPreferenciaByAluno error: ", err);
        else callback(null, rows);
    });
}

//função de leitura de preferências por id de proposta

//função de leitura de preferências por id de empresa


//função de gravação de preferências
function savePreferencia(numAluno, idProposta, nivelPreferencia){

    let post = {num_aluno: numAluno,
                id_proposta: idProposta,
                nivel_preferencia: nivelPreferencia};

     let query = global.connection.con.query("insert into Preferencia set ?", post, (error, rows, fields)=> {
         if (error) console.log("Error on INSERT: ", error);
         else console.log("Success on INSERT");
    });
}

//--------------------------

//REPOSIÇAO-----------------

//função de leitura de links de reposicao
function readReposicoes(callback){

    global.connection.con.query("select * from Reposicao", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT Reposicao: ", err);
        else callback(null, rows);
    });

}

//função para gerar novo link de reposição
function saveReposicao(email){
    let path = global.rndPass.randomPasswordRequestPath();

    let post = {link: path, email_user: email}


    global.connection.con.query("insert into Reposicao set ?", post, (error, result) => {
        if (error) console.log("Error:", error);
    });

}

//função de leitura de links de reposição por link (retorna id e tipo de user)
function readReposicoesByLink(link, callback){

    global.connection.con.query("select * from Reposicao where link like '" + link + "'", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT Reposicao: ", err);
        else {
            callback(null, rows);
        }
    });

}

//--------------------------

//CONTACTOS-----------------

function readContactos(callback){

    //Contactos é melhor personalizar a query para vir com o tipo de contacto em string tb
    global.connection.con.query("select * from Contacto", (err, rows, fields) => {
        if (err) console.log("Erro em SELECT Contacto: ", err);
        else {
            callback(null, rows);
        }
    });

}

//função para guardar novo contacto
function saveContacto(email, contact, name, tipo_contacto){

    let post = {desc_contacto: contact,
                desc_nome: name,
                id_tipo_contacto: tipo_contacto,
                email_user: email
    };

    global.connection.con.query("insert into Contacto set ?", post, (error, result) => {
        if (error) (console.log("Error:", error));
    });
}

//--------------------------



//exports
module.exports= {
    readAllUsers: readAllUsers,
    readPropostas: readPropostas,
    readPreferencias: readPreferencias,
    readReposicoes: readReposicoes,
    readContactos: readContactos,
    readPropostasByEmpresa: readPropostasByEmpresa,
    readPropostasByAluno: readPropostasByAluno,
    readPropostasIfEstagio: readPropostasIfEstagio,
    readPropostasByID: readPropostasByID,
    readPreferenciaByAluno: readPreferenciaByAluno,
    readReposicoesByLink: readReposicoesByLink,
    readMediasWithName: readMediasWithName,

    saveUser: saveUser,
    savePreferencia: savePreferencia,
    saveProposta: saveProposta,

    findUserByEmail: findUserByEmail,
    findAlunoByEmail: findAlunoByEmail,
    findEmpresaByEmail: findEmpresaByEmail,
    findOrientadorByEmail: findOrientadorByEmail,
    findAlunosByPreferencia: findAlunosByPreferencia,
    findUserByEmailAndTipo: findUserByEmailAndTipo,
    changeAlunoToEstagiario: changeAlunoToEstagiario,
    findAllEstagiario: findAllEstagiario,

    validarProposta: validarProposta,
    recusarProposta: recusarProposta,
    resetProposta: resetProposta,

};