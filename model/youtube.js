/**
 * Created by tigran on 1/30/15.
 */

var Schema = mongoose.Schema;

var YoutubeSchema = new Schema({
    index: String,
    locationHash: String,
    dateStr: String,
    videos: [{
        id: String,
        title: String,
        description: String,
        thumb: String
    }]
});

module.exports = mongoose.model('youtube', YoutubeSchema);