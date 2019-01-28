let propostas = require("../model/proposta.model.js");

const deleteProposta = (req, res)=>{
    let id_proposta = req.body.id;
    console.log("??? ")

    propostas.Proposta.destroy({where: {id_proposta: id_proposta}}).then((result)=>{
        res.send({success:true});
    }).catch((error)=>{
        console.log(error);
        res.send({success: false});
    });
};

module.exports={
    deleteProposta:deleteProposta,
}