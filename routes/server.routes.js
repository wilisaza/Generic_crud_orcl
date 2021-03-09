const { Router } = require('express');
const router = Router();

const {
    getAllObjects, 
    getOneObject, 
    postOneObject, 
    putObjects, 
    deleteObjects, 
    getFunctionObject, 
    postAllCustomObjects, 
    getProcedureObject, 
    getContratoHcObject, 
    postContratoHcModObject,
    postOneBody,
} = require('../controllers/orcl.controller');

router.get('/', function (req, res) {res.send('Hello World')});

router.get('/contratohc/:numDocumento/:idPeriodo', getContratoHcObject); //Se prioriza esta ruta por orden alfabético y búsqueda de objeto genérico

router.get('/function/:nomFunction', getFunctionObject);

router.get('/procedure/:nomProcedure', getProcedureObject);

router.get('/:object/:field/:val', getOneObject);

router.get('/:object', getAllObjects);

router.post('/contratohc/:evento', postContratoHcModObject);

router.post('/custom/insert', postOneBody);

router.post('/custom/:object', postAllCustomObjects);

router.post('/:object', postOneObject);

router.put('/:object', putObjects);

router.delete('/:object', deleteObjects);

module.exports = router;