const Sequelize = require("sequelize");
const nome="webitclo_EA4",
      user="webitclo_EA4",
      password="po,IdHQD5T+B",
      host="webitcloud.net";


//conecção
const connection = new Sequelize(nome, user, password, {
    host: host,
    dialect: "mysql"
});

//loggar sucesso na connecção
connection.authenticate().then(()=>{
    console.log("Connection sucessful");
}).catch((error)=>{
    console.log("Error: ", error);

});

module.exports = {connection: connection};