const {orclApi} = require('../api/crudOrclApi');

const orclCtrl= {

    getAllObjects : async(req, res) => {
        let outdata;
        if (Object.keys(req.query).length === 0){
            //console.info('Header',req.headers);
            outdata = await orclApi.getAll(req.params.object);
        }
        else{
            outdata = await orclApi.getFiltered(req.params.object, req.query);
        }
        res.json({
            outdata
        });
    },

    getOneObject : async(req, res) => {
        let where = {
            [req.params.field] : req.params.val,
        }
        //console.info(Object.keys(req.query).length);
        let outdata = await orclApi.getOne(req.params.object, where);
        res.json({
            outdata,
        });
    },

    postOneObject: async(req, res) => {
        let outdata = await orclApi.insertOne(req.params.object, req.body);
        res.json({
            outdata,
        });
    },

    putObjects: async(req, res) => {
        let outdata = await orclApi.updateFiltered(req.params.object, req.body, req.query);
        res.json({
            outdata,
        });
    },

    deleteObjects: async(req, res) => {
        let outdata = await orclApi.deleteFiltered(req.params.object, req.query);
        res.json({
            outdata,
        });
    },

    getFunctionObject : async(req, res) => {
        let outdata = await orclApi.getFunction(req.params.nomFunction, req.query);
        res.json({
            outdata,
        });
    },

    postAllCustomObjects : async(req, res) => {
        let outdata = await orclApi.getCustomSelect(req.params.object, req.body, req.query);
        res.json({
            outdata,
        });
    },

    getProcedureObject : async(req, res) => {
        let outdata = await orclApi.getProcedure(req.params.nomProcedure, req.query);
        res.json({
            outdata,
        });
    },

    //Para manejo de contratos HC

    getContratoHcObject : async(req, res) => {
        let outdata = await orclApi.getContratoHc(req.params.numDocumento, req.params.idPeriodo, req.headers);
        res.json({
            outdata,
        });
    },

    postContratoHcModObject : async(req, res) => {
        let outdata = await orclApi.insertContratoHcMod(req.params.evento, req.body, req.headers);
        res.json({
            outdata,
        });
    },

    //Para inserción con nombre objeto en req.body
    postOneBody: async(req, res) => {
        let outdata = await orclApi.insertOneRec(req.body);
        res.json({
            outdata,
        });
    },

}

module.exports = orclCtrl;