const getController = require("../controller/get.controller.js");
const postController = require("../controller/post.controller.js");
const updateController = require("../controller/update.controller.js");
const deleteController = require("../controller/delete.controller.js");
var test = true;    //variável para fazer testes, com true não há restrições de acesso mas não é estável


//A ordem das rotas é importante, é preciso ter cuidado ao alterar a hierarquia
//log pedidos -> sanitização -> rotas model -> logout -> forçar addinfo -> rotas view -> error handling


//middleware
//middleware para loggar caminhos que são pedidos
//não apanha loads do jQuery por passarem para pastas estáticas definidas antes restas rotas
function logAcess(req){
   console.log("requested:", req.path);
   console.log("access: ", Date().toLocaleString());
   console.log("Neste path, req tem session:", req.session);
}

//usar middleware
global.app.use("/", (req, res, next)=>{
   logAcess(req);
   next();
});

// sanitizar...
//sanitiza apenas body, informação que é passada por form-data não e sanitizada e tem de ser sanitizada independentemente
global.app.use("/", (req, res, next)=>{
   if (req.body) {
      console.log("a sanitizar body...")
      for (var item in req.body) {
          req.sanitize(item).escape();
          console.log(item, " sanitized, became ", req.body[item])
      }
      next();
   }

   else next();
})

//Rotas para model
//Rotas GET
global.app.get("/load/users/all", getController.findAllUsers);
global.app.get("/load/users/all/withmedia", getController.findAllUsersWithMedia);
global.app.get("/load/users/all/bytype", getController.findUsersByType);
global.app.get("/load/users/single/byemail", getController.findUserByEmail);
global.app.get("/load/users/single/withcontactos", getController.findUserWithContactos);
global.app.get("/load/users/single/allinfo", getController.findUserAllInfo);
global.app.get("/load/datas", getController.findDatas);
global.app.get("/load/contactos/all/byUser", getController.findContactosByUser);
global.app.get("/load/contactos/all/bySession", getController.findContactosOfUserInSession);
global.app.get("/load/propostas/all", getController.findAllPropostas);
global.app.get("/load/propostas/empresa", getController.findPropostasByEmpresa);
global.app.get("/load/propostas/aluno", getController.findPropostasByAluno);
global.app.get("/load/propostas/byid", getController.findPropostasByID);
global.app.get("/load/propostas/validadas", getController.findPropostasValidadas);
global.app.get("/load/propostas/ofempresa", getController.findPropostasOfEmpresa);
global.app.get("/load/propostas/ofaluno", getController.findPropostasOfAluno);
global.app.get("/load/publicacoes/byproposta", getController.findPublicacaoesByProposta);
global.app.get("/load/documentos/byemail", getController.findDocumentosByEmail);
global.app.get("/load/documento", getController.getDocumento);
global.app.get("/load/documento/byid", getController.getDocumentoByID);
global.app.get("/load/preferencia/possible", getController.isPreferenciaPossible);
global.app.get("/load/preferencia/byemail", getController.findPreferenciasByEmail);
global.app.get("/load/preferencia/ofuser", getController.findPreferenciasOfUser);
global.app.get("/load/preferencia/byProposta", getController.findPreferenciaByProposta);


//Rotas POST
global.app.post("/save/user", postController.saveUser);
global.app.post("/save/user/addinfo", postController.addInfo);
global.app.post("/save/contacto", postController.saveContacto);
global.app.post("/save/reposicao", postController.saveReposicao);
global.app.post("/save/publicacao", postController.savePublicacao);
global.app.post("/save/comentario", postController.saveComentario);
global.app.post("/save/proposta", postController.saveProposta);
global.app.post("/save/preferencia", postController.savePreferencia);
global.app.post("/save/documento", postController.documentUpload);

//Rotas PUT
global.app.put("/update/proposta/validar", updateController.validarProposta);
global.app.put("/update/proposta/recusar", updateController.recusarProposta);
global.app.put("/update/proposta/atribuir", updateController.atribuirProposta);
global.app.put("/update/proposta/estagio", updateController.estagioProposta);
global.app.put("/update/datas", updateController.updateDatas);
global.app.put("/update/password", updateController.updatePassword);
global.app.put("/update/password/withlink", updateController.updatePasswordWithLink);

//Rotas DELETE
global.app.delete("/delete/propostabyid", deleteController.deleteProposta);

//logout
global.app.get("/logout", (req, res)=>{
   if (req.session.user.nome) {
      let nome = req.session.user.nome;
      console.log(nome, " está a fazer logout!");
      req.session.destroy((error)=>{
         res.redirect("/login");
      })
   }

   else res.redirect("/login");
});


//addInfo primeiro porque tem de apanhar os pedidos antes de eles forçarem ir para addInfo
global.app.get("/addinfo", (req, res)=>{
   console.log("Chegou a addinfo")
   if(!test && !req.session.user) res.redirect("/login");

   let topping =  "<p style='font-weight:bold'>Por se tratar de uma empresa, os dados seguintes são obrigatórios.</p>" +
                    "<label >Email Secundário:</label>" +
                    "<input id='txtEmail' type='text' class='form-control' placeholder='Email' required style='margin-bottom: 5%;'>" +
                    "<label for='txtContacto'>Contacto Priveligiado:</label>" +
                    "<input id='txtUser' type='text' class='form-control' placeholder='Nome' required style='margin-bottom: inherit;'>" +
                    "<input id='txtContacto' type='text' class='form-control' placeholder='Contacto' required style='margin-bottom: 5%;'><br>" +
                    "<label for='txtRepresentante'>Representante:</label>" +
                    "<input id='txtRepresentante' type='text' class='form-control' placeholder='Nome' required style='margin-bottom: inherit;'>" +
                    "<input id='txtRepCargo' type='text' class='form-control' placeholder='Cargo' required style='margin-bottom: 5%;'><br>" +
                    "<label for='txtNIF'>NIF:</label>" +
                    "<input id='txtNIF' type='text' class='form-control' placeholder='NIF' required style='margin-bottom: 5%;'><br>"
   if(req.session.user.id_tipo_user == 2) {
      res.render("addInfo.view.html", {se_empresa: topping})
   }



   else{
      res.render("addInfo.view.html", {se_empresa: " "})
   }

});

//forçar addInfo
global.app.use("/", (req, res, next)=>{

   console.log("a verificar primeiro login...")
   if(req.session.user){
      console.log("user existe, a verificar dados...")
      if (req.session.user.primeiro_login == 1 ){
         console.log("redirecionando para addInfo...")
         res.redirect("/addinfo");
      }
      else next();
   }
   else next();
})


//rota principal
global.app.get("/", (req, res)=>{
   res.redirect("/login");
});

//rota para login html
global.app.get("/login", (req, res) => {
   let html = global.fs.readFileSync("./view/login.html");
   res.end(html);
});

//rota para fazer login geral com passport
global.app.post("/login/all", (req, res, next)=>{

   //passport
   global.passport.authenticate('local', function(error, user, info){
      if (error != null) console.log(error), res.send({success:false});
      else if(info) res.send(info);
      else if(user){
         req.session.user = user;
         console.log(req.session);
         let url = "/";

         switch(user.id_tipo_user){
            case 1:  url = "/aluno"; break;
            case 2:  url = "/empresa"; break;
            case 3:  url = "/orientador"; break;
            case 4:  url = "/cdc"; break;
            case 5:  url = "/estagiario"; break;
         }

         res.send({success: true, url: url});
      }
   })(req, res, next);

});

//rota para mudar de password
global.app.get("/changepassword", (req, res)=>{
   if(req.query.key){
      let html = global.fs.readFileSync("./view/changePassword.view.html");
      res.end(html);
   }

   else{
      res.redirect("/login");
   }
});

//rota para main de aluno
global.app.get("/aluno", (req, res)=>{
   if(!test && req.session.user.id_tipo_user!=1) res.redirect("/logout");
   //RENDER com MUSTACHE!!!! Para aparecer o nome
   res.render("aluno.view.html", {nome: req.session.user.nome});
});

//rota para main de empresa
global.app.get("/empresa", (req, res)=>{
   if(!test && req.session.user.id_tipo_user!=2) res.redirect("/logout");
   //RENDER com MUSTACHE!!!! Para aparecer o nome
   console.log(req.session.user)
   res.render("empresa.view.html", {nome: req.session.user.nome});

});

//rota para main de coordenador
global.app.get("/cdc", (req, res)=>{
   // if(!req.session.user) res.redirect("/login");
   if(!test && req.session.user.id_tipo_user!=4) res.redirect("/logout");

   //RENDER com MUSTACHE!!!! Para aparecer o nome do aluno
   res.render("cdc.view.html", {nome: req.session.user.nome});

});

//rota para main de estagiário
global.app.get("/estagiario", (req, res)=>{
   // if(!test && !req.session.user) res.redirect("/login");
   if(!test && req.session.user.id_tipo_user!=5) res.redirect("/logout");

   //RENDER com MUSTACHE!!!! Para aparecer o nome
   res.render("estagiario.view.html", {nome: req.session.user.nome});
});

//rota para main de orientador
global.app.get("/orientador", (req, res)=>{
   // if(!req.session.user) res.redirect("/login");
   if(!test && req.session.user.id_tipo_user!=3) res.redirect("/logout");

   //RENDER com MUSTACHE!!!! Para aparecer o nome
   res.render("orientador.view.html", {nome: req.session.user.nome});
});

//rota para intro
global.app.get("/intro", (req, res) => {
   let html = global.fs.readFileSync("./view/intro.html");
   res.end(html);
});
// });

// error handling
// global.app.use((error, req, res, next) =>{
//    console.log(error);
//    console.log("error apanhado, redirecionando...")
//    let isAjaxRequest = req.xhr;

//    if (error){
//     if (isAjaxRequest) res.send({success: false});
//     else res.redirect("/login");
//    }
// })