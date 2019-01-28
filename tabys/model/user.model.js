//MODEL USERS
//Model que contêm estruturas de, e associadas, a users


const Sequelize = require("sequelize");
const database = require("../assets/scripts/connect.js");

//Tabela Users
const User = database.connection.define("User", {
    email:          {type: Sequelize.STRING(100), field: "email", primaryKey: true},
    nome:           {type: Sequelize.STRING(200), field: "nome"},
    password:       {type: Sequelize.STRING(100), field: "password"},
    id_tipo_user:   {type: Sequelize.TINYINT(4), field: "id_tipo_user"},
    primeiro_login: {type: Sequelize.TINYINT(4), field: "primeiro_login"},

}, {timestamps : false,             //Para não ter tabela de timestamp, porque a nossa tabela tb não tem e não quero mudar a nossa base de dados
    freezeTableName: true,});       //Para usar o nome "User", porque por defeito o sequelize transforma os nomes em plurais, e.g. "User" => "Users" e isso é parvo? Não percebo pq por isso fica desligado


//Tabela Tipo Users
const Tipo_user = database.connection.define("Tipo_user", {
    id_tipo_user:   {type: Sequelize.TINYINT(4), field: "id_tipo_user", primaryKey: true},
    desc_tipo_user: {type: Sequelize.STRING(100), field: "desc_tipo_user"},

}, {timestamps : false,
    freezeTableName: true,});


//Tabela Contactos
const Contacto = database.connection.define("Contacto", {
    id_contacto:   {type: Sequelize.INTEGER(10), field: "id_contacto", primaryKey: true},
    desc_contacto: {type: Sequelize.STRING(50), field: "desc_contacto"},
    desc_nome:     {type: Sequelize.STRING(200), field: "desc_nome"},
    id_tipo_contacto: {type: Sequelize.INTEGER(10), field: "id_tipo_contacto"},
    email_user:    {type: Sequelize.STRING(200), field: "email_user"},

}, {timestamps : false,
    freezeTableName: true,});

    //Tabela Tipo Users
const Tipo_contacto = database.connection.define("Tipo_contacto", {
    id_tipo_contacto: {type: Sequelize.INTEGER(10), field: "id_tipo_contact", primaryKey: true},
    desc_tipo_contacto: {type: Sequelize.STRING(50), field: "desc_tipo_contacto"},

}, {timestamps : false,
    freezeTableName: true,});

//Tabela Documentos
const Documento = database.connection.define("Documento", {
    id_documento:   {type: Sequelize.INTEGER(10), field: "id_documento", primaryKey: true},
    email_user:    {type: Sequelize.STRING(200), field: "email_user"},
    id_tipo_documento: {type: Sequelize.INTEGER(10), field: "id_tipo_documento"},
    desc_documento: {type: Sequelize.STRING(200), field: "desc_documento"},

}, {timestamps : false,
    freezeTableName: true,});

const Tipo_documento = database.connection.define("Tipo_documento", {
    id_tipo_documento: {type: Sequelize.INTEGER(10), field: "id_tipo_documento", primaryKey: true},
    desc_tipo_documento: {type: Sequelize.STRING(50), field: "desc_tipo_documento"},

}, {timestamps : false,
    freezeTableName: true,});

const Media = database.connection.define("Media", {
    email:  {type: Sequelize.STRING(200), field: "email", primaryKey: true},
    media:  {type: Sequelize.INTEGER(11), field: "media"},

}, {timestamps : false,
    freezeTableName: true,});

const Preferencia = database.connection.define("Preferencia", {
    email_user:  {type: Sequelize.STRING(200), field: "email_user", primaryKey: true},
    id_proposta:  {type: Sequelize.INTEGER(10), field: "id_proposta"},
    nivel_preferencia:  {type: Sequelize.INTEGER(10), field: "nivel_preferencia"},
}, {timestamps : false,
    freezeTableName: true,});



module.exports = {
    User: User,
    Tipo_user: Tipo_user,
    Contacto: Contacto,
    Tipo_contacto: Tipo_contacto,
    Documento: Documento,
    Tipo_documento: Tipo_documento,
    Media: Media,
    Preferencia: Preferencia,
};