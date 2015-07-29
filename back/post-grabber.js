/**
 * Created by tigran on 7/20/15.
 */

require("./model");

var mongoose = require("mongoose")
    , Twitter = require('twitter-node-client').Twitter
    , async = require('async')
    , City = mongoose.model("City")
    , Country = mongoose.model("Country")
    , SocialPost = mongoose.model("SocialPost")
    , SocialUser = mongoose.model("SocialUser")
    , Token = mongoose.model("Token");

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate());
};

var request_index = 0;

Token.find({social: "twitter"}, function (err, twitter_keys) {

    var key_len = twitter_keys.length
        , key_index = 0;

    var getTwitter = function () {
        if (key_index == key_len)
        {
            key_index = 0;
        }
        var config = {
            "consumerKey": twitter_keys[key_index].token_data["consumer_key"],
            "consumerSecret": twitter_keys[key_index].token_data["consumer_secret"],
            "accessToken": twitter_keys[key_index].token_data["access_token"],
            "accessTokenSecret": twitter_keys[key_index].token_data["access_token_secret"]
        };
        key_index++;
        return new Twitter(config);
    };

    async.forever(function (next) {
        City.find({}, function (e, cities) {
            async.eachSeries(cities, function (city, cb) {
                console.log(request_index);
                request_index++;
                var date = new Date();
                // Getting twitter with next API key
                var twitter = getTwitter();
                twitter.getSearch({
                    q: 'since:' + date.toMysqlFormat()
                    , geocode: city.latitude + "," + city.longitude + ",15000mi"
                    , count: 100
                    , result_type: "popular"
                }, function (err, response, body) {
                    console.log('ERROR [%s]', body);
                    setTimeout(function () {
                        cb();
                    }, 2500/key_len);
                }, function (data) {
                    if(typeof data !== 'object')
                    {
                        data = JSON.parse(data);
                    }
                    async.eachSeries(data["statuses"], function (post_data, next_post) {
                        SocialUser.findOne({user_id: post_data["user"]["id_str"]}, function (uerr, user) {
                            if(uerr)
                            {
                                console.log(err);
                                next_post(err);
                            }
                            else
                            {
                                var post_user;
                                var save_post_fn = function () {
                                    SocialPost.find({post_id: post_data["id_str"]}, function (perror, found_posts) {
                                        if (perror)
                                        {
                                            console.log(perror);
                                            next_post(perror);
                                        }
                                        else
                                        {
                                            if (found_posts.length > 0)
                                            {
                                                next_post();
                                            }
                                            else
                                            {
                                                var p = new SocialPost({
                                                    content: post_data["text"],
                                                    user: post_user._id,
                                                    post_id: post_data["id_str"],
                                                    url: post_user.url + "/" + post_data["id_str"]
                                                });
                                                p.save(function () {
                                                    console.log("------ " + p.url);
                                                    next_post();
                                                });
                                            }
                                        }
                                    });
                                };
                                if(user)
                                {
                                    post_user = user;
                                    save_post_fn();
                                }
                                else
                                {
                                    post_user = new SocialUser({
                                        user_id: post_data["user"]["id_str"],
                                        username: post_data["user"]["screen_name"],
                                        name: post_data["user"]["name"],
                                        photo: post_data["user"]["profile_image_url_https"],
                                        social_name: "twitter",
                                        url: "https://twitter.com/" + post_data["user"]["screen_name"]
                                    });
                                    post_user.save(function (save_error) {
                                        console.log("New User: " + post_user.url);
                                        if(save_error)
                                        {
                                            console.log(save_error);
                                            next_post(save_error);
                                        }
                                        else
                                        {
                                            save_post_fn();
                                        }
                                    });
                                }
                            }
                        });
                    }, function (ee) {
                        setTimeout(function () {
                            cb();
                        }, 2500/key_len);
                    });
                });
            }, function () {
                next();
            });
        });
    }, function () {

    });
});