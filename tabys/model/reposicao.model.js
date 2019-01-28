const Sequelize = require("sequelize");
const database = require("../assets/scripts/connect.js");

const Reposicao = database.connection.define("Reposicao", {
    id_reposicao:     {type: Sequelize.INTEGER(10), field: "id_reposicao", primaryKey: true},
    link:             {type: Sequelize.STRING(100), field: "link"},
    email_user:       {type: Sequelize.STRING(200), field: "email_user"},

}, {timestamps : false,
    freezeTableName: true,});


module.exports = {Reposicao: Reposicao};