/**
 * Created by tigran on 1/30/15.
 */

mongoose = require("mongoose");
require("./model/city");
var config = require("./config")
    , options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 10 } }};

mongoose.connection.on("error",function(err) {
    console.log(err);
    console.log("Hello from error event! ")
});

function GetField(model, id) {
    for(var i in city_json)
    {
        if(city_json[i]["model"] != model) continue;
        if(city_json[i]["pk"] == id) return city_json[i];
    }
    return false;
}

var db = mongoose.connect(config.MONGO_CONNECTION_STRING, function (error, res) {
    if (error) {
        console.log(error);
    }
});

mongoose.connection.on("open",function(err) {

});

//var city_json = require("./geonames_dump.json")
//    , async = require("async");
//async.eachSeries(city_json, function (cc, callback){
//    if(cc["model"] != "cities.city") {
//        callback();
//        return;
//    }
//    var region = GetField("cities.region", cc["fields"]["region"]);
//    if(!region || !("fields" in region && "country" in region["fields"]) || !("fields" in region && "name" in region["fields"])) {
//        callback();
//        return;
//    }
//    var country = GetField("cities.country", region["fields"]["country"]);
//    if(!country || !("fields" in country && "name" in region["fields"])) {
//        callback();
//        return;
//    }
//    var locs = cc["fields"]["location"].replace("POINT (", "").replace(")", "").split(" ");
//
//    if(!region || !country) {
//        callback();
//        return;
//    }
//    var City = mongoose.model('city');
//    var c = new City({
//        region: region["fields"]["name"],
//        country: country["fields"]["name"],
//        population: cc["fields"]["population"],
//        slug: cc["fields"]["slug"],
//        name: cc["fields"]["name"],
//        lat: locs[0],
//        lng: locs[1]
//    });
//
//    c.save(function(err){
//        console.log(c.name);
//        if(err) console.log(err);
//        callback();
//    });
//}, function(err) {
//    console.log("done");
//});

var fs = require("fs")
    , async = require("async");

var City = mongoose.model('city');
City.find({}, function(err, cities){
    var fCountries = fs.readFileSync('accept_countries.txt').toString().split('\n');
    async.eachSeries(cities, function(city, callback){
        var contains = false;
        for(var i=0; i< fCountries.length; i++)
        {
            if(fCountries[i].indexOf(city.country) == -1 && city.country.indexOf(fCountries[i]) == -1)
            {
                contains = false;
                continue;
            }
            contains = true;
            break;
        }
        if(!contains)
        {
            city.remove(function(err){
                console.log("*****", city.name, city.country);
                setTimeout(function(){
                    callback();
                }, 10);
            });
        }
        else
        {
            console.log("!!", city.name, city.country);
            setTimeout(function(){
                callback();
            }, 10);
        }
    }, function(err){
        console.log("done");
    })
});