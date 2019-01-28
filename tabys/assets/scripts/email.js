let nodemailer = require("nodemailer");
let fs = require("fs");
let transport = new nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "tabys.plataforma.estagios@gmail.com",
            pass: "tabys2018",
        }
    });


const sendNewUserMail = (email, password)=>{

    let emailText = "A sua password é " + password + "!";

    let mailOptions = {
        from: "me@gmail.com",
        to: email,
        subject: "A sua conta na plataforma TABYS",
        text: emailText,
    }

    transport.sendMail(mailOptions, (error, info)=>{
        if (error) {
            console.log(error);
            return {success: false}
        }

        else {
            console.log("sucesso: ", info)
           return {success: true};
        }
    })
}

const sendChangePasswordMail = (email, link)=>{

    link = "https://ea4-cfportela.c9users.io/changePassword?key=" + link;

    let emailText = "O seu link de reposição é " + link;

    let mailOptions = {
        from: "me@gmail.com",
        to: email,
        subject: "Alterar Password TABYS",
        text: emailText,
    }

    transport.sendMail(mailOptions, (error, info)=>{
        if (error) {
            console.log(error);
            return {success: false}
        }

        else {
            console.log("sucesso: ", info)
           return {success: true};
        }
    })

}

const sendDocument = (email, file)=>{

    let emailText = "Foi enviado em anexo a minuta referente à proposta que lhe foi atribuida!"

    let mailOptions = {
        attatchment: [{filename: "Minuta.doc", content: fs.createReadStream(file)}],
        from: "me@gmail.com",
        to: email,
        subject: "Alterar Password TABYS",
        text: emailText,
    }

    transport.sendMail(mailOptions, (error, info)=>{
        if (error) {
            console.log(error);
            return {success: false}
        }

        else {
            console.log("sucesso: ", info)
           return {success: true};
        }
    })

}

module.exports = {
    sendNewUserMail: sendNewUserMail,
    sendChangePasswordMail: sendChangePasswordMail,
}