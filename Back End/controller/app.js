//How Zu Kang Adam DIT/FT/2B/03 p2026677
console.log("---------------------------------");
console.log(" ADES > HW > Week 1 > controller > app.js");
console.log("---------------------------------");

//-----------------------------------
// imports
//-----------------------------------

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var user = require('../model/user.js');

//-----------------------------------
// Middleware functions
//-----------------------------------
function printDebugInfo(req, res, next) {
    console.log();
    console.log("----------------[ Debug Info ]-----------------");
    //console.log(`Servicing ${urlPattern}..`);
    console.log("Servicing " + req.url + " ..");

    console.log("> req params:" + JSON.stringify(req.params));
    console.log("> req.body:" + JSON.stringify(req.body));
    // console.log("> req.myOwnDebugInfo:" + JSON.stringify(req.myOwnDebugInfo));

    console.log("----------------[ Debug Info ]-----------------");
    console.log();


    next();
}

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var cors = require('cors');

//-----------------------------------
// MF configurations
//-----------------------------------
app.use(urlencodedParser);
app.use(jsonParser);

app.options('*', cors());
app.use(cors());

//-----------------------------------
// endpoints
//-----------------------------------

//login
app.post('/api/login', function (req, res) {

    var name = req.body.name;
    var password = req.body.password;

    user.loginUser(name, password, function (err, token, result) {
        if (!err) {
            if (!result) {
                // this is matched to callback(null, null, null)
                var message = { "Error": "Invalid Login" };

                res.status(404).send(message);
            }
            else {
                // this is matched to callback(null, not null)

                console.log("token: " + token);

                var message = {
                    "UserData": JSON.stringify(result),
                    "token": token
                }
                res.status(200).send(message);
            }

        } else {
            // this is matched to callaback(not null, null)
            res.status(500);
            res.send(err.statusCode);
        }

    });


});

//default endpoint
app.get('/', (req, res) => {
    console.log("GET > '/' > ADES Week 1 Active");

    res.status(200).send({
        "Result": "GET > '/' > ADES Week 1 Active"
        });
    res.end();
});

//getallusers
app.get('/users',printDebugInfo, function (req, res) {

    user.getAll(function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

//getoneuser
app.get('/users/:id',printDebugInfo, function (req, res) {
    var id = req.params.id;
    
    user.getUser(id, function (err, result) {
        if (!err) {
            res.status(200).send({"Result" : result});
        } else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

//adduser

app.post('/users',printDebugInfo, function (req, res) { 
    var name = req.body.name;
    var address = req.body.address;
    var password = req.body.password;

    user.addUser(name, address, password, function (err, result) {
        if (!err) {
            if (result.affectedRows == 0) {
                res.status(422).send({ "Result:": "Unprocessable Entity" });
            }
            else {
                res.status(201).send({"Result" : result})
            }
        } 
        else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });

});

//edit user

app.put('/users/:id', printDebugInfo, function (req, res) {
    var id = req.params.id;

    if (isNaN(id)) {
        res.status(400).send("Blank ID");
        return;
    }

    var data = {
        name: req.body.name,
        password: req.body.password,
        address: req.body.address
    };

    user.edit(id, data, function (err, result) {
        if (!err) {
            var output = {
                "success": true,
                "affected rows": result.affectedRows,
                "changed rows": result.changedRows
            };
            res.status(200).send(output);
        }
        else {
            res.status(500).send({"Result:":"Internal Server Error"});
        }
    });
});

//delete user
app.delete('/users/:id', printDebugInfo, function (req, res) {
    var id = req.params.id;

    user.delete(id, function (err, result) {
        if (!err) {
            res.status(204).send({"Result" : result});
        } else {
            res.status(500).send({ "Result:": "Internal Server Error" });
        }
    });

});

//-----------------------------------
// exports
//-----------------------------------
module.exports = app;