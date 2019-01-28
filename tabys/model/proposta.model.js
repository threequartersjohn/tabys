const Sequelize = require("sequelize");
const database = require("../assets/scripts/connect.js");



//Tabela Propostas
const Proposta= database.connection.define("Proposta", {
    id_proposta:    {type: Sequelize.INTEGER(10), field: "id_proposta", primaryKey: true},
    titulo:         {type: Sequelize.STRING(50), field: "titulo"},
    desc_trabalho:  {type: Sequelize.STRING(3000), field: "desc_trabalho"},
    desc_resultado: {type: Sequelize.STRING(500), field: "desc_resultado"},
    desc_outro:     {type: Sequelize.STRING(500), field: "desc_outro"},
    desc_plano:     {type: Sequelize.STRING(1000), field: "desc_plano"},
    desc_perfil:    {type: Sequelize.STRING(500), field: "desc_perfil"},
    desc_recursos:  {type: Sequelize.STRING(500), field: "desc_recursos"},
    desc_empresa:   {type: Sequelize.STRING(45), field: "desc_empresa"},

    tutor_nome:     {type: Sequelize.STRING(50), field: "tutor_nome"},
    tutor_cargo:    {type: Sequelize.STRING(50), field: "tutor_cargo"},
    tutor_email:    {type: Sequelize.STRING(50), field: "tutor_email"},
    tutor_num:      {type: Sequelize.STRING(50), field: "tutor_num"},

    se_estagio:     {type: Sequelize.TINYINT(1), field: "se_estagio"},
    se_validada:    {type: Sequelize.TINYINT(1), field: "se_validada"},
    se_atribuida:   {type: Sequelize.TINYINT(1), field: "se_atribuida"},
    se_recusada:    {type: Sequelize.TINYINT(1), field: "se_recusada"},
    mensagem_recuso:{type: Sequelize.STRING(1000), field: "mensagem_recuso"},

    email_aluno:    {type: Sequelize.STRING(200), field: "email_aluno"},
    email_empresa:  {type: Sequelize.STRING(200), field: "email_empresa"},
    email_orientador: {type: Sequelize.STRING(200), field: "email_orientador"},

}, {timestamps : false,
    freezeTableName: true,});

module.exports = {Proposta: Proposta};