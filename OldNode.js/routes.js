/**
 * Created by tigran on 1/30/15.
 */

var path_module = require('path'),
    controllers = require("./autoload")(path_module.join(__dirname, 'controller'));

app.use(function (req, res, next) {
    // Every Request Comes here !!
    next();
});


// GET Routes
app.get('/', controllers["index"]);



// POST Routes