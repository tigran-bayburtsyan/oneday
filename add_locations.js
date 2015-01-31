/**
 * Created by tigran on 1/30/15.
 */

mongoose = require("mongoose");
require("./model/city");
var config = require("./config")
    , options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 10 } }};

var city_json = require("./geonames_dump.json")
    , async = require("async");

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
    var cities = [], tmp = [], k=0;
    for(var i=0; i<= 20; i++)
    {
        k++;
        if(city_json[k]["model"] != "cities.city") {
            i--;
            continue;
        }
        tmp.push(city_json[i]);
        console.log(tmp[i]);
    }
    async.forEach(tmp, function (cc, callback){
        if(cc["model"] != "cities.city") {
            callback();
            return;
        }
        var region = GetField("cities.region", cc["fields"]["region"]);
        if(!region || !("fields" in region && "country" in region["fields"]) || !("fields" in region && "name" in region["fields"])) {
            callback();
            return;
        }
        var country = GetField("cities.country", region["fields"]["country"]);
        if(!country || !("fields" in country && "name" in region["fields"])) {
            callback();
            return;
        }
        var locs = cc["fields"]["location"].replace("POINT (", "").replace(")", "").split(" ");

        if(!region || !country) {
            callback();
            return;
        }
        var City = mongoose.model('city');
        var c = new City({
            region: region["fields"]["name"],
            country: country["fields"]["name"],
            population: cc["fields"]["population"],
            slug: cc["fields"]["slug"],
            name: cc["fields"]["name"],
            lat: locs[0],
            lng: locs[1]
        });

        cities.push(c);
        console.log(c.name);
        callback();
    }, function(err) {
        var save = function() {
            var c = cities.pop();
            if (typeof c == "undefined") return;
            c.save(function (err) {
                if (err) throw err;
                save();
            });
        };
        save();
    });
});
