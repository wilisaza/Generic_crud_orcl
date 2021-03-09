require('../server/config/config');

const config = {
    dborcl: {
        user: process.env.USR,
        password: process.env.PWRD,
        connectString: process.env.DBHOST,
    },

}

module.exports = {config};