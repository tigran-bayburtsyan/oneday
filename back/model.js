/**
 * Created by tigran on 7/20/15.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/oneday');

var Country = mongoose.model("Country", {
    name: String,
    code: String,
    // TODO: Add some additional fields to describe country
});

var City = mongoose.model('City', {
    short: String,
    name: String,
    latitude: Number,
    longitude: Number,
    country: { type: Schema.Types.ObjectId, ref: 'Country' }
});

var Token = mongoose.model('Token', {
    social: String,     // Name of social network: Using as a Key
    token_data: Object  // Custom data for specific social network
});

var SocialUser = mongoose.model("SocialUser", {
    user_id: String,        // User Social ID
    username: String,
    name: String,           // First Name and Lats Name combination
    photo: String,          // Profile Photo URL
    social_name: String,    // Name for social network
    url: String             // Profile URL
});

var SocialPost = mongoose.model('SocialPost', {
    content: String,
    user: { type: Schema.Types.ObjectId, ref: 'SocialUser' },
    post_id: String,
    url: String,
    image: String  // Url of image in post
});