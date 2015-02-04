/**
 * Created by tigran on 1/30/15.
 */

var fs = require('fs');
var path_module = require('path');
var module_holder = {};

function LoadModules(path) {
    var stat = fs.lstatSync(path);
    if (stat.isDirectory()) {
        // we have a directory: do a tree walk
        var files = fs.readdirSync(path);
        var f, l = files.length;
        for (var i = 0; i < l; i++) {
            f = path_module.join(path, files[i]);
            LoadModules(f);
        }
    } else {

        // we have a file: load it
        require(path)(module_holder);
    }
}

module.exports = function(dir) {
    LoadModules(dir);
    return module_holder;
};