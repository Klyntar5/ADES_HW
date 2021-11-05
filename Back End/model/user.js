//How Zu Kang Adam DIT/FT/1B/03 p2026677
console.log("---------------------------------");
console.log(" p2026677_AdamHow_1B03_BEDProject > model > foodMenu.js");
console.log("---------------------------------");

//-----------------------------------
// imports
//-----------------------------------
var db = require('./databaseConfig.js');
var config=require('../config.js'); 
var jwt=require('jsonwebtoken');

//-----------------------------------
// objects / functions
//-----------------------------------
var user = {

    getUser: function (id, callback) {
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `SELECT 
                                name,password
                            FROM 
                                week1
                            WHERE
                                id = ?`;

                conn.query(sql, [id], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    getAll: function (callback) {
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'SELECT name,password FROM week1';

                conn.query(sql, [], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    addUser: function (name, address, password, callback) {
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                    INSERT IGNORE INTO
                        ades.week1(name, address, password)
                    VALUES
                        (?,?,?);
                    `;

                conn.query(sql, [name, address, password], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    edit: function (id, user, callback) {
        var name = user.name;
        var password = user.password;
        var address = user.address;

        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `
                        UPDATE
                            week1
                        SET
                            name = ?,
                            password = ?,
                            address = ?
                        WHERE
                            id = ?;
                    `;

                conn.query(sql, [name, password, address, id], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    delete: function (id, callback) {
        // get a connection to the database
        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = `DELETE FROM 
                                week1
                            WHERE
                                id = ?`;

                conn.query(sql, [id], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    loginUser: function (name, password, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null, null);
            }
            else {
                console.log("Connected!");

                var sql = 'select id,name,address from week1 where name = ? and password = ?';

                conn.query(sql, [name, password], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null, null);

                    } else {
                        // no results at all
                        if (result.length == 0) {
                            return callback(null,null,null);
                        }
                        // it must be that we have ONE result here,
                        // since the email is Unique
                        else {
                            // it must be that we have ONE result here,
                            // since the email is unique

                            //confirm if we have the key
                            console.log("Secret Key: " + config.key);
                            console.log(result[0]);
                            //generate the token

                            var token = jwt.sign(
                                    // (1) Payload
                                {
                                    userid : result[0].userid,
                                    type : result[0].type
                                },
                                    // (2) Secret Key
                                    config.key,
                                    // (3) Lifretime of token
                                {
                                    //expires in 24 hrs
                                    expiresIn: 86400
                                }
                            );

                            return callback(null, token, result);
                        }
                    }
                });

            }

        });
    },
}


//-----------------------------------
// exports
//-----------------------------------
module.exports = user;