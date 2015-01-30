/**
 * Created by tigran on 1/30/15.
 */

var Schema = mongoose.Schema;

var InstagramSchema = new Schema({
    id: String,
    link: String,
    standard: {
        width: Number,
        height: Number,
        url: String
    },
    thumb: {
        width: Number,
        height: Number,
        url: String
    },
    small: {
        width: Number,
        height: Number,
        url: String
    },
    user: {
        username: String,
        fullname: String,
        id: String,
        photo: String
    }
});

module.exports = mongoose.model('instagram', InstagramSchema);