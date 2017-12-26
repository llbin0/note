var db_conf = require('./db_conf');
var connection = db_conf.getConnection();
var hadLogin = false;
var loginUser = "";
var loginPassword = "";

/**
 * 查询数据
 * @param req
 * @param res
 */
exports.getData = function (req, res) {
    var sql = "select * from tb_user";
    var data = {};  /*新建对象*/

    connection.query(sql, function (err, rows, fields) {
        /*rows为查询出的数据，可通过rows[i].字段 访问数据*/

        // if (err) throw err;

        for (var i = 0; i < rows.length; i++) {
            /*绑定对象*/
            data["user" + i] = {
                User : rows[i].User,
                Password : rows[i].Password
            }
        }
        return res.json(data);
    })
};

/**
 * 添加数据
 * @param req
 * @param res
 * @returns {*}
 */
exports.postData = function (req, res) {
    var sql = "insert into tb_user(User,Password) values('" + req.body.User + "','" + req.body.Password + "')";
    console.log(sql);
    connection.query(sql, function (err, result) {
        // if (err) {
        //     return res.send("ERROR");
        // }
    });
    return res.send(req.body.User + " : " + req.body.Password);
};

exports.getDataByID = function (req, res) {
    return res.send("get data by ID");
}

exports.putData = function (req, res) {

    // console.log(req.params.id);
    var sql = "update tb_user set Password='" + req.body.Password + "' where User='" + req.params.id + "'";
    // console.log(sql);
    connection.query(sql, function (err, result) {
        // if (err) {
        //     return res.send("ERROR:" + err);
        // }
    });
    return res.send("PUT API: " + req.params.id + " : " + req.body.Password);

}

exports.deleteData = function (req, res) {
    var sql = "delete from tb_user where User='" + req.params.id + "'";
    // console.log(sql);
    connection.query(sql, function (err, result) {
        // if (err) {
        //     return res.send("ERROR:" + err);
        // }
    });
    return res.send("DELETE API");
}

exports.signIn = function (req, res, next) {
    console.log(req.body);
    console.log(req.body.User + " : " + req.body.Password);
    var sql = "select * from tb_user where User=" + "'" + req.body.User + "'" + " and Password=" + "'" +req.body.Password + "'";
    console.log(sql);
    var user={};

    if (req.session.user == null) {
        req.session.user={};
        console.log("为空");
        console.log(req.session.user);
    }

    connection.query(sql, function (err, rows, fields) {
        /*rows为查询出的数据，可通过rows[i].字段 访问数据*/
        if (rows.length > 0) {
            // hadLogin = true;
            loginUser = req.body.User;
            loginPassword = req.body.Password;
            // if (req.session.user.length)
            req.session.user[loginUser] = loginPassword;
            console.log(req.session.user);
            return res.send("http://localhost:3000/user/" + req.body.User);
        } else {
            return res.send("账号或密码错误");
        }
    })
}

exports.admin_signIn = function (req, res, next) {
    console.log(req.body);
    console.log(req.body.User + " : " + req.body.Password);
    var sql = "select * from tb_admin where ID=" + "'" + req.body.User + "'" + " and Password=" + "'" +req.body.Password + "'";
    console.log(sql);

    if (req.session.user == null) {
        req.session.user={};
        console.log("为空");
        console.log(req.session.user);
    }

    connection.query(sql, function (err, rows, fields) {
        /*rows为查询出的数据，可通过rows[i].字段 访问数据*/
        if (rows.length > 0) {
            hadLogin = true;
            loginUser = req.body.User;
            req.session.user["admin"] = "admin";
            return res.send("http://localhost:3000/system");
        } else {
            return res.send("账号或密码错误");
        }
    })
}

exports.searchUserByID = function (req, res) {
    var sql = "select * from tb_user where User=" + "'" + req.params.id + "'";
    console.log(sql);
    connection.query(sql, function (err, rows, fields) {
        /*rows为查询出的数据，可通过rows[i].字段 访问数据*/
        if (rows.length) {
            return res.send("1");
        } else {
            return res.send("0");
        }
    })
};

exports.addUser = function (req, res) {
    var sql = "insert into tb_user(User,Password) values('" + req.body.User + "','" + req.body.Password + "')";
    // console.log(sql);
    connection.query(sql, function (err, result) {
        // if (err) {
        //     return res.send("ERROR");
        // }
        return res.send("http://localhost:3000/login");
    });
};

/*上传笔记*/
exports.postNote = function (req, res) {
    console.log(req.body);
    var note = req.body.Note.replace("'","''");
    var sql = "insert into tb_notes(User,Note,Date,Param,state) values('" + req.body.User + "','" + note + "','" + req.body.Date + "'," + req.body.Param +"," + req.body.state+ ")";
    console.log(sql);
    connection.query(sql, function (err, result) {
        // if (err) {
        //     return res.send("ERROR");
        // }
        return res.send("留言成功！");
    });
};

/*查看ID笔记*/
exports.getNoteByID = function (req, res) {
    var sql = "select Date,Note,Param,state from tb_notes where User='" + req.params.id + "' order by Date desc";
    // console.log(sql);
    var data = {};  /*新建对象*/
    var date;
    var getDate;
    connection.query(sql, function (err, rows, fields) {


        for (var i = 0; i < rows.length; i++) {
            date = new Date(rows[i].Date);
            getDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            /*绑定对象*/
            console.log(getDate);
            data[getDate] = {
                Note : rows[i].Note,
                Param : rows[i].Param,
                state : rows[i].state
            }
        }
        // console.log(data);
        return res.json(data);
    });
};

/*查看全部笔记*/
exports.getAllNote = function (req, res) {
    var sql = "select User,Date,Note,Param,state from tb_notes order by Date desc";
    // console.log(sql);
    var data = {};  /*新建对象*/
    var date;
    var getDate;
    connection.query(sql, function (err, rows, fields) {


        for (var i = 0; i < rows.length; i++) {
            date = new Date(rows[i].Date);
            getDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            /*绑定对象*/
            console.log(getDate);
            data[getDate] = {
                User : rows[i].User,
                Note : rows[i].Note,
                Param : rows[i].Param,
                state : rows[i].state
            }
        }
        // console.log(data);
        return res.json(data);
    });
};

/*删除笔记*/
exports.deleteNoteByDate = function (req, res) {
    var sql = "delete from tb_notes where User='" + req.params.id + "' and Date='" + req.params.date + "'";
    console.log(sql);
    connection.query(sql, function (err, result) {
        // if (err) {
        //     return res.send("ERROR");
        // }
        return res.send("删除成功！");
    });
};

/*添加笔记*/
exports.addNoteByDate = function (req, res) {
    var sql = "update tb_notes set state=2" + " where User='" + req.params.id + "' and Date='"+ req.params.date +"'";
    console.log(sql);
    connection.query(sql, function (err, result) {
        // if (err) {
        //     return res.send("ERROR");
        // }
        return res.send("添加成功");
    });
};
//修改笔记状态
exports.changeLoginState = function () {
    hadLogin = false;
    loginUser = "";
}

exports.loginState = function () {
    return hadLogin;
}

exports.loginUser = function () {
    return loginUser;
}