const oracledb = require('oracledb');
const {functions} = require('./crudOrclFunctions');

const sentences = {

    filterString(table, where, resWords) {
        let sqlString = `SELECT * FROM ${table} WHERE `;
        for (let colum in where) {
            if (!resWords.includes(colum.toLowerCase())){ //Valida que las palabras reservadas no se incluyan en el WHERE
                if (typeof where[colum] === 'string') {
                    sqlString += `${colum} = '${where[colum]}' AND `;
                } else {
                    sqlString += `${colum} = ${where[colum]} AND `;
                }
            }
        }
        sqlString += '*';
        sqlString = sqlString.replace(' AND *', ``);
        return sqlString;
    },

    filterStringCount(table, where, resWords) {
        let sqlString = `SELECT COUNT(*) CANT FROM ${table} WHERE `;
        for (let colum in where) {
            if (!resWords.includes(colum.toLowerCase())){ //Valida que las palabras reservadas no se incluyan en el WHERE
                if (typeof where[colum] === 'string') {
                    sqlString += `${colum} = '${where[colum]}' AND `;
                } else {
                    sqlString += `${colum} = ${where[colum]} AND `;
                }
            }
        }
        sqlString += '*';
        sqlString = sqlString.replace(' AND *', ``);
        return sqlString;
    },

    deleteString(table, where) {
        let sqlString = `DELETE FROM ${table} WHERE `;
        for (let colum in where) {
            if (typeof where[colum] === 'string') {
                sqlString += `${colum} = '${where[colum]}' AND `;
            } else {
                sqlString += `${colum} = ${where[colum]} AND `;
            }
        }
        sqlString += '*';
        sqlString = sqlString.replace(' AND *', ``);
        return sqlString;
    },

    updateString(table, data, where) {
        let dataMod = data;
        let date = new Date();
        let criteria = where;

        //dataMod.date_updated = this.dateToYMD(date);
        let sqlString = `UPDATE ${table} SET `;
        for (let colum in dataMod) {
            if (typeof dataMod[colum] === 'string') {
                sqlString += `${colum} = '${dataMod[colum]}', `;
            } else {
                sqlString += `${colum} = ${dataMod[colum]}, `;
            }
        }

        sqlString += '*';
        sqlString = sqlString.replace(', *', ` WHERE `);
        for (let columw in where) {
            if (typeof where[columw] === 'string') {
                sqlString += `${columw} = '${where[columw]}' AND `;
            } else {
                sqlString += `${columw} = ${where[columw]} AND `;
            }
        }
        sqlString += '*';
        sqlString = sqlString.replace(' AND *', ``);
        return sqlString;
    },

    insertString(table, data) {
        let dataMod = data;
        //let date = new Date();
        //let colum;

        //dataMod.user_updated = dataMod.user_created;
        //dataMod.date_created = this.dateToYMD(date);
        //dataMod.date_updated = dataMod.date_created;
        let sqlString = `INSERT INTO ${table} (`;
        for (let colum in dataMod) {
            if (dataMod[colum] != null) {
                sqlString += `${colum}, `;
            }
        }
        sqlString += `)`;
        sqlString = sqlString.replace(', )', ') VALUES(');
        //VALUES
        for (let colum in dataMod) {
            if (dataMod[colum] != null) {
                if (typeof dataMod[colum] === 'string') {
                    if((dataMod[colum].substring(0,2) == '20') && (parseInt(dataMod[colum].substring(4,6),10) <= 12) && (parseInt(dataMod[colum].substring(6,8),10) <= 31)){
                        sqlString += `TO_TIMESTAMP('${functions.jsonDateCam(dataMod[colum])}','YYYY-MM-DD'), `;
                    }
                    else{
                        sqlString += `'${dataMod[colum]}', `; 
                    }
                    
                } else {
                    sqlString += `${dataMod[colum]}, `;
                }
            }
        }
        sqlString += `)`;
        sqlString = sqlString.replace(', )', ')');
        return sqlString;
    },

    functionString(nomFunction, params) {
        let sqlString = `SELECT ${nomFunction}(`;
        for (let colum in params) {
            if (typeof params[colum] === 'string') {
                sqlString += `${colum} => '${params[colum]}', `;
            } else {
                sqlString += `${colum} => ${params[colum]}, `;
            }
        }
        sqlString += '*';
        sqlString = sqlString.replace(', *', `) RESULT FROM DUAL`);
        return sqlString;
    },

    customSelectString(table, field, where, resWords) {
        let sqlString = `SELECT `;
        for (let colum in field) {
            sqlString += `${colum}, `;
        }
        sqlString += '*';
        sqlString = sqlString.replace(', *', ` FROM ${table} WHERE `);
        for (let columw in where) {
            if (!resWords.includes(columw.toLowerCase())){ //Valida que las palabras reservadas no se incluyan en el WHERE
                if (typeof where[columw] === 'string') {
                    sqlString += `${columw} = '${where[columw]}' AND `;
                } else {
                    sqlString += `${columw} = ${where[columw]} AND `;
                }
            }
        }
        sqlString += '*';
        sqlString = sqlString.replace(' AND *', ``);
        //console.info('SQL', sqlString);
        return sqlString;
    },

    procedureString(nomProcedure, params) {
        let sqlString = `BEGIN ${nomProcedure}(`;
        for (let colum in params) {
            sqlString += `:${colum} , `;
        }
        sqlString += '*';
        sqlString = sqlString.replace(', *', `); END;`);
        return sqlString;
    },

    procedureBind(params) {
        let bindVars = new Object;
        for (let colum in params) {
            if (params[colum]=== 'VARCHAR2') {
                bindVars[colum] = {dir : oracledb.BIND_OUT, type: oracledb.STRING};
            }
            else if (params[colum]=== 'NUMBER') {
                bindVars[colum] = {dir : oracledb.BIND_OUT, type: oracledb.NUMBER};
            }
            else{
                bindVars[colum] = `${params[colum]}`;
            }
        }
        return bindVars;
    },

}

module.exports = {sentences};