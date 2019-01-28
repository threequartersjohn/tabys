const Sequelize = require("sequelize");
const database = require("../assets/scripts/connect.js");

const Seriacao = database.connection.define("Seriacao", {
    id_data:      {type: Sequelize.INTEGER(10), field: "id_data", primaryKey: true},
    data_inicio:  {type: Sequelize.DATE, field: "data_inicio"},
    data_fim:     {type: Sequelize.DATE, field: "data_fim"},

}, {timestamps : false,
    freezeTableName: true,});


module.exports = {Seriacao: Seriacao};