var mysql = require('mysql');
var info = require('./db_info');

module.exports.getConnection = function () {
    if ((module.exports.connection)
        && (module.exports.connection.socket)
        && (module.exports.connection._socket.readable)
        && (module.exports.connection._socket.writable)) {
        return module.exports.connection;
    }

    /*连接数据库*/
    var connection = mysql.createConnection({
        host : info.mysqlInfo.host,
        port : info.mysqlInfo.port,
        user : info.mysqlInfo.user,
        password : info.mysqlInfo.password,
        database : info.mysqlInfo.database,
        charset : 'utf8'
    });
    
    connection.connect(function (err) {
        if (err) {
            console.log("SQL CONNECT ERROR :", err);
        } else {
            console.log("SQL CONNECT SUCCESSFUL.")
        }
    });
    connection.on("close", function(err) {
        console.log("SQL CONNECTION CLOSED.");
    });
    connection.on("error", function(err) {
        console.log("SQL CONNECTION ERROR :", err);
    });

    module.exports.connection = connection;
    return module.exports.connection;
}