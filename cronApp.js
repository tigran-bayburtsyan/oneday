/**
 * Created by tigran on 1/30/15.
 */

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate());
};

Date.prototype.toRFC_3339 = function() {
    function pad(n){return n<10 ? '0'+n : n}
    return this.getUTCFullYear()+'-'
        + pad(this.getUTCMonth()+1)+'-'
        + pad(this.getUTCDate())+'T'
        + pad(this.getUTCHours())+':'
        + pad(this.getUTCMinutes())+':'
        + pad(this.getUTCSeconds())+'Z';
};


var getYesterday = function(){
    var d = new Date();
    d.setTime(Date.parse(d.toMysqlFormat()) - 86400); // pass 1 day 86400 seconds
    return d;
};
mongoose = require("mongoose");
var config = require("./config")
    , insta = require('instagram-node').instagram()
    , Flickr = require("flickrapi")
    , flickrOptions = {
        api_key: config.FLICKR_API_KEY,
        secret: config.FLICKR_API_SECRET,
        progress: false
    }
    , Twitter = require('twitter')
    , twitter_client = new Twitter({
        consumer_key: config.TWEETER_CONSUMER_KEY,
        consumer_secret: config.TWEETER_CONSUMER_SECRET,
        access_token_key: config.TWEETER_ACCESS_TOKEN,
        access_token_secret: config.TWEETER_ACCESS_TOKEN_SECRET
    })
    , Youtube = require("youtube-api");

Youtube.authenticate({
    type: "key"
    , key: config.YOUTUBE_API_KEY
});

insta.use({ access_token: config.INSTAGRAM_ACCESS_TOKEN });

mongoose.connect(config.MONGO_CONNECTION_STRING, function (error) {
    if (error) {
        console.log(error);
    }
});

function GetInstagram(lat, lng, minTimeStamp, maxTimeStamp, callback)
{
    insta.media_search(lat, lng, {min_timestamp: minTimeStamp
        , max_timestamp: maxTimeStamp
        , distance: 5000 // Max Distance 5000meter
        , count: -1}, function(err, medias, remaining, limit) {

        callback(err, medias);
    });
}
//GetInstagram(37.775, -122.4183333, Math.floor(Date.now() / 1000) - 86000, Math.floor(Date.now() / 1000), function(res) {});

function GetFlickr(lat, lng, minTimeStamp, maxTimeStamp, callback)
{
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
        flickr.photos.search({
            lat: lat,
            lon: lng,
            per_page: 500,
            radius: 32, //Max number is 32km
            min_taken_date: minTimeStamp,
            max_taken_date: maxTimeStamp,
            min_upload_date: minTimeStamp,
            max_upload_date: maxTimeStamp
        }, function(err, result) {
            callback(err, result);
        });
    });
}
//GetFlickr(37.775, -122.4183333, Math.floor(Date.now() / 1000) - 86000, Math.floor(Date.now() / 1000), function(res){
//    console.log(res);
//});

function GetTwitter(lat, lng, mysqlDate, callback)
{
    twitter_client.get("search/tweets", {
        q: "",
        geocode: lat.toString() + "," + lng.toString() +",100km",
        since: mysqlDate,
        count: 100
    }, function (error, tweets, response) {
        callback(error, tweets, response);
    })
}

var y = getYesterday();
console.log(y.toMysqlFormat());
//GetTwitter(37.775, -122.4183333, y.toMysqlFormat(), function (error, tweets, response) {
//
//});

function GetYoutube(lat, lng, datetime_RFC_3339, callback)
{
    Youtube.search.list({
        "part": "snippet",
        "location": lat.toString() + "," + lng.toString(),
        "locationRadius": "1000km",
        "maxResults": 50,
        "order": "date",
        "type": "video",
        "publishedAfter": datetime_RFC_3339
    }, function (err, data) {
        callback(err, data);
    });
}

GetYoutube("37.775", "-122.4183333", y.toRFC_3339(), function (error, data) {
    console.log(error, data["items"].length);
});