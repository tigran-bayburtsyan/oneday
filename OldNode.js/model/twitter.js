/**
 * Created by tigran on 1/30/15.
 */

var Schema = mongoose.Schema;

var TwitterSchema = new Schema({
    index: String,
    locationHash: String,
    dateStr: String,
    tweets: [{
        id: String,
        link: String,
        text: String,
        retweets: Number,
        favorites: Number,
        user: {
            username: String,
            fullname: String,
            id: String,
            photo: String
        }
    }]
});

module.exports = mongoose.model('twitter', TwitterSchema);