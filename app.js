/**
 * Created by tigran on 1/30/15.
 */

var express = require('express');

// Making app available from everywhere without "var"
app = express();
mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1/oneday', function (error) {
    if (error) {
        console.log(error);
    }
});

// Application Configurations
app.set('view engine', 'ejs');

require("./routes");

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port)
});