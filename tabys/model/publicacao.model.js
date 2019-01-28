const Sequelize = require("sequelize");
const database = require("../assets/scripts/connect.js");

//Tabela Publicações
const Publicacao= database.connection.define("Publicacao", {
    id_publicacao:    {type: Sequelize.INTEGER(10), field: "id_publicacao", primaryKey: true},
    desc_texto:       {type: Sequelize.STRING(15000), field: "desc_texto"},
    data_post:        {type: Sequelize.DATE, field: "data_post"},
    se_privada:       {type: Sequelize.TINYINT(1), field: "se_privada"},
    id_proposta:      {type: Sequelize.INTEGER(10), field: "id_proposta"},
    email_user:    {type: Sequelize.STRING(200), field: "email_user"},

}, {timestamps : false,
    freezeTableName: true,});

//Tabela Comentários
const Comentario = database.connection.define("Comentario", {
    id_comentario:    {type: Sequelize.INTEGER(10), field: "id_comentario", primaryKey: true},
    data_comentario:  {type: Sequelize.DATE, field: "data_comentario"},
    id_publicacao:    {type: Sequelize.INTEGER(10), field: "id_publicacao"},
    email_user:       {type: Sequelize.STRING(200), field: "email_user"},
    desc_comentario:  {type: Sequelize.STRING(10000), field: "desc_comentario"},

}, {timestamps : false,
    freezeTableName: true,});


module.exports = {
    Publicacao: Publicacao,
    Comentario: Comentario,
};