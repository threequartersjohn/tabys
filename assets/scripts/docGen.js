const jszip = require("jszip");
const docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

const docGen = (data, email)=>{


    //carregar ficheiros template
    let template = fs.readFileSync("./assets/templates/template_minuta.docx", "binary");
    let zip = jszip(template);
    let doc= new docxtemplater();
    doc.loadZip(zip);

    doc.setData(data);

    try {
        doc.render();
    }

    catch (error) {
        let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        };

        console.log(JSON.stringify({error: e}));
    }

    let buffer = doc.getZip().generate({type: "nodebuffer"});

    email.sendDocument(email, buffer)
    console.log("terminado!");
}

module.exports = {docGen: docGen}
