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