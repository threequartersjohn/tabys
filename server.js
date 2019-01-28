var express = require("express");
var mustache = require("mustache-express");
var port = process.env.PORT;
var validator = require("express-validator");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");


//bibliotecas globais
global.mysql = require("mysql");
global.bodyParser = require("body-parser");
global.fs = require("fs");
global.passport = require("passport");

global.cookieParser = require("cookie-parser");
var session = require("express-session");


//inicar aplicação
global.app = express();

//usar mustache
global.app.engine("html", mustache());
global.app.set("view engine", "html");
global.app.set("views", __dirname + "/view")
//usar validator
global.app.use(validator());

//usar Flash
global.app.use(flash());

//usar bodyParser
global.app.use(global.bodyParser.json(), global.bodyParser.urlencoded({extended:true}));

//usar session
global.app.set("trust proxy", 1)
global.app.use(session({
    secret: "tabys",
    resave:true,
    saveUninitialized: true,
    // cookie: {secure:true},
    httpOnly: true,
}));

//iniciar passport
const localPassport = require("passport-local").Strategy;
const sequelize = require("sequelize");
const users = require("./model/user.model.js");

global.app.use(global.passport.initialize());
global.app.use(global.passport.session());


global.passport.use('local', new localPassport({
        usernameField:"email",
        passwordField:"password"
    }, (username, password, done)=>{

        const isValidPassword = (userPassword, password)=>{
            return bcrypt.compareSync(password, userPassword);
        }

        users.User.findOne({where: {email: username}}).then((user)=>{

            if(!user) return done(null, false, {message: "Utilizador não existe!"})

            console.log(isValidPassword(user.password, password))

            if(!isValidPassword(user.password, password)) return done(null, false, {message: "Password errada!"})

            let userInfo = user.get();

            return done(null, userInfo);

        }).catch((error)=>{console.log(error), done(error)})
    }
));


//definir rotas estáticas para ficheiros

//controllers
global.app.use("/controller", express.static("controller"));

//scripts
global.app.use("/assets", express.static("assets"));

//views
global.app.use("/view", express.static("view"));

//definir globais nossas
global.routesUser = require("./controller/routes.js");
global.rndPass =    require("./assets/scripts/rndPass.js");

//aplicação a ouvir
global.app.listen(port, ()=> console.log("app listening on ", port));


let docGen = require("./assets/scripts/docGen.js");


let data = {
    empresa_nome: "a",
    empresa_nif: 12,
    empresa_morada: "b",
    empresa_representante: "v",
    empresa_representante_cargo: "a",
    aluno_nome: "s",
    aluno_num: 21,
    aluno_num_tel: 21,
    aluno_email: "9191919",
    orientador_nome: "asd",
    orientador_email: "aaa",
    tutor_nome: "???",
    tutor_cargo: "ssa",
    tutor_email:"je sais pa",
    proposta_nome: "proposta",
}

// docGen.docGen(data);