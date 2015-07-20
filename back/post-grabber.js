/**
 * Created by tigran on 7/20/15.
 */

require("./model");

var mongoose = require("mongoose")
    , City = mongoose.model("City")
    , Country = mongoose.model("Country")
    , Token = mongoose.model("Token");