/**
 * Created by tigran on 1/30/15.
 */

var Schema = mongoose.Schema;

var CitySchema = new Schema({
    region: String,
    country: String,
    population: String,
    slug: String,
    name: String,
    lat: String,
    lng: String
});

mongoose.model('city', CitySchema);