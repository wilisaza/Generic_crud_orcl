const {config} = require('./crudOrclConfig');
const {sentences} = require('./crudOrclSentences');
const {functions} = require('./crudOrclFunctions');

const oracledb = require('oracledb');


//const lowerKeys = require('lowercase-keys-object');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

let connection;

let resWords = ['pags', 'offset', 'numrows', 'orderby']; //Array de palabras reservadas para ser excluidas del WHERE

const orclApi = {
    async getAll(table) {
        try {
            //console.info(config.dborcl);
            connection = await oracledb.getConnection(config.dborcl);
            const sql = `SELECT * FROM ${table}`;
            const res = await connection.execute(sql);
            return functions.arrayKeysToLowerCase(res.rows) || [];
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }

    },

    async getOne(table, where) {
        try {
            connection = await oracledb.getConnection(config.dborcl);
            const sql = sentences.filterString(table, where, resWords);
            const res = await connection.execute(sql);
            return res.rows ? functions.keysToLowerCase(res.rows[0]) : null;
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async getFiltered(table, where) {
        try {
            connection = await oracledb.getConnection(config.dborcl);
            const sql = functions.paginationString(sentences.filterString(table, where, resWords),connection, where);
            const res = await connection.execute(sql);
            return functions.arrayKeysToLowerCase(res.rows) || [];
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async insertOne(table, data) {
        let colums;
        let info
        try {
            connection = await oracledb.getConnection(config.dborcl);
            const sql = sentences.insertString(table, data);
            const res = await connection.execute(sql);
            //return res.rows ? res.rows[0] : null;
            return this.getOne(table, data);
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }

    },
////////////////////////////////////////////////////////////////////////////
    async insertOneBody(data) {
        let convData = functions.keysToLowerCase(data);
        let objname = convData.table_name;
        let objdata = functions.extractItem(convData,'table_name');
        let idData = convData.id;
        //console.info('previo',objname, objdata, convData);
        try {
            try {
                connection = await oracledb.getConnection(config.dborcl);
            } catch (error) {
                console.log(error);
            }
            const sql = sentences.insertString(objname, objdata);
            console.info(sql);
            const res = await connection.execute(sql);
            return this.getOneId(objname, idData);
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }

    },

    async insertOneRec(data) {
        let convData = functions.keysToLowerCase(data);
        let objName = convData.table_name;
        let objData = functions.extractItem(convData,'table_name');
        let idData = convData.id;
        let eraseData = [];
        let n = 0;
        let i = 0;
        let otherData;
        for(let colum in objData){
            if (Array.isArray(objData[colum])){
                n = objData[colum].length;
                i = 0;
                while (i < n) {
                    otherData = await this.insertOneRec(objData[colum][i]);
                    i++;
                }
                eraseData.push(colum) ;
            }
        }
        i=0;
        while (i < eraseData.length){
            objData = await functions.extractItem(objData,eraseData[i]);    
            i++;
        }
        try {
            try {
                connection = await oracledb.getConnection(config.dborcl);
            } catch (error) {
                console.log(error);
            }
            const sql = sentences.insertString(objName, objData);
            console.info(sql);
            const res = await connection.execute(sql);
            return this.getOneId(objName, idData);
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }

    },

    async getOneId(table, id) {
        try {
            connection = await oracledb.getConnection(config.dborcl);
            const sql = `SELECT * FROM ${table} WHERE ID=${id}`;
            const res = await connection.execute(sql);
            return res.rows ? functions.keysToLowerCase(res.rows[0]) : null;
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },
/////////////////////////////////////////////////////////////////////////////////
    async updateFiltered(table, data, where) {
        try {
            connection = await oracledb.getConnection(config.dborcl);
            const sql = sentences.updateString(table, data, where)
            //console.info('SQL', sql);
            const res = await connection.execute(sql);
            return this.getFiltered(table, where);
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async deleteFiltered(table, where) {
        try {
            let data = this.getFiltered(table, where);
            connection = await oracledb.getConnection(config.dborcl);
            const sql = sentences.deleteString(table, where)
            const res = await connection.execute(sql);
            return data;
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async getFunction(nomFunction, params) {
        try {
            connection = await oracledb.getConnection(config.dborcl);
            const sql = sentences.functionString(nomFunction, params);
            const res = await connection.execute(sql);
            return res.rows ? functions.keysToLowerCase(res.rows[0]) : null;
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async getCustomSelect(table, field, where) {
        try {
            connection = await oracledb.getConnection(config.dborcl);
            const sql = functions.paginationString(sentences.customSelectString(table, field, where, resWords),connection, where);
            //console.info('SQL', sql, connection.oracleServerVersion);
            const res = await connection.execute(sql);
            return functions.arrayKeysToLowerCase(res.rows) || [];
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async getProcedure(nomProcedure, params) {
        try {
            connection = await oracledb.getConnection(config.dborcl);
            const sql = sentences.procedureString(nomProcedure, params);
            const bindVars = sentences.procedureBind(params);
            const res = await connection.execute(sql, bindVars);
            return res.outBinds || [];
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },
   
    //Para manejo de contratos HC

    async getContratoHc(numDocumento, idPeriodo, headParams) {
        try {
            let where ={
                usuario: headParams.usr,
                password: headParams.pwd,
                nit_compania: `${headParams.nitcompania}`,
            };
            let res2;
            connection = await oracledb.getConnection(config.dborcl);
            let sql = sentences.filterStringCount('usuarios_ws', where, resWords);
            let res = await connection.execute(sql);
            //return res.rows ? functions.keysToLowerCase(res.rows[0]) : null;
            if (res.rows[0].CANT > 0){
                where ={
                    nit_compania: headParams.nitcompania,
                    tercero: numDocumento,
                    id_periodo: idPeriodo,
                };
                let fields ={
                    id_contrato: '',
                    tercero: '',
                    nom_tercero: '',
                    estado: '',
                    id_categoria: '',
                    nom_categoria: '',
                    fecha_ini: '',
                    fecha_fin: '',
                    fecha_firma: '',
                };
                sql = sentences.customSelectString('v_u_contrato_docente', fields, where, resWords);
                res = await connection.execute(sql);

                // DETALLE CONTRATO (ASIGNATURAS)
                console.info('tamaño',res.rows.length);
                fields = {
                    id_asignatura: '',
                    nom_asignatura: '',
                    grupo: '',
                    nom_programa: '',
                    id_categoria: '',
                    nom_categoria: '',
                    fecha_ini: '',
                    fecha_fin: '',
                    horas_semana: '',
                };
                for (let i=0; i<res.rows.length; i++){
                    console.info('Var',i);
                    where ={
                        nit_compania: headParams.nitcompania,
                        id_contrato : res.rows[i].ID_CONTRATO,
                    };
                    sql = sentences.customSelectString('v_u_contrato_detalle', fields, where, resWords);
                    res2 = await connection.execute(sql);
                    res.rows[i].ASIGNATURAS = functions.arrayKeysToLowerCase(res2.rows) || [];
                    console.info('Q2',res2.rows);
                }
                return functions.arrayKeysToLowerCase(res.rows) || [];
            }
            else{
                let output ={
                    msgerror: 'Usuario no validado',
                };
                return output;
            }
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async insertContratoHcMod(evento, data, headParams) {
        try {
            let where ={
                usuario: headParams.usr,
                password: headParams.pwd,
                nit_compania: `${headParams.nitcompania}`,
            };
            let data1;
            connection = await oracledb.getConnection(config.dborcl);
            let sql = sentences.filterStringCount('usuarios_ws', where, resWords);
            let res = await connection.execute(sql);
            if (res.rows[0].CANT > 0){
                //Validar 'horas' o 'traslados'
                if (evento === 'horas'){
                    where ={
                        nit_compania: headParams.nitcompania,
                        id_contrato: data.id_contrato,
                        id_asignatura: data.id_asignatura,
                        grupo: data.grupo,
                        periodo: data.periodo_nom,
                    };
                    sql = sentences.filterStringCount('u_descuento_horas', where, resWords);
                    res = await connection.execute(sql);
                    if (res.rows[0].CANT > 0){ //existe
                        data1 = {
                            descuento_horas: data.ajuste < 0 ? data.ajuste*(-1) : data.ajuste,
                            descuento: data.ajuste < 0 ? 'S' : 'N',
                        };
                        sql = sentences.updateString('u_descuento_horas', data1, where);
                        res = await connection.execute(sql);
                        return this.getFiltered('u_descuento_horas', where);
                    }
                    else{
                        where.descuento_horas = data.ajuste < 0 ? data.ajuste*(-1) : data.ajuste;
                        where.descuento = data.ajuste < 0 ? 'S' : 'N';
                        sql = sentences.insertString('u_descuento_horas', where);
                        res = await connection.execute(sql);
                        return this.getFiltered('u_descuento_horas', where);
                    }
                }
                else  if (evento === 'traslados'){
                    where ={
                        nit_compania: headParams.nitcompania,
                        id_contrato: data.id_contrato,
                        periodo: data.periodo_nom,
                    };
                    sql = sentences.filterStringCount('u_descuento_traslado', where, resWords);
                    res = await connection.execute(sql);
                    if (res.rows[0].CANT > 0){ //existe
                        data1 = {
                            ajuste: data.ajuste < 0 ? data.ajuste*(-1) : data.ajuste,
                            descuento: data.ajuste < 0 ? 'S' : 'N',
                        };
                        sql = sentences.updateString('u_descuento_traslado', data1, where);
                        res = await connection.execute(sql);
                        return this.getFiltered('u_descuento_traslado', where);
                    }
                    else{
                        where.ajuste = data.ajuste < 0 ? data.ajuste*(-1) : data.ajuste;
                        where.descuento = data.ajuste < 0 ? 'S' : 'N';
                        sql = sentences.insertString('u_descuento_traslado', where);
                        res = await connection.execute(sql);
                        return this.getFiltered('u_descuento_traslado', where);
                    }
                }
                else{
                    let output ={
                        msg: 'Evento no válido',
                    };
                    return output;
                }
            }
            else{
                let output ={
                    msgerror: 'Usuario no validado',
                };
                return output;
            }
        } catch (error) {
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }

    },
    /*
    async insertGeneric(data) {
        try{

        } catch(error){
            return error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    return error;
                }
            }
        }
    },*/

}

module.exports = {orclApi};