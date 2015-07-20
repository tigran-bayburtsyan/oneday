/**
 * Created by tigran on 7/20/15.
 */

require("./model");
var fs = require("fs")
    , mongoose = require("mongoose")
    , async = require("async");

var files  = fs.readdirSync("./cities")
    , Country = mongoose.model("Country")
    , City = mongoose.model("City");

async.forEach(files, function (filename, next) {
    var country = new Country({code: filename.replace(".json", "")});
    country.save(function (err) {
        console.log("******* " + country.code);
        if(err)
        {
            next(err);
        }
        else
        {
            var data = require("./cities/" + filename);
            async.forEach(Object.keys(data), function(key, cb){
                var city = new City({country: country._id});
                city.short = data[key]["city"];
                city.name = data[key]["accentcity"];
                city.latitude = data[key]["latitude"];
                city.longitude = data[key]["longitude"];
                city.save(function (er) {
                    if(er)
                    {
                        console.log(er);
                    }
                    console.log("- " + city.name);
                    cb();
                });
            }, function () {
                next();
            });
        }
    });
}, function () {
    console.log("End");
});