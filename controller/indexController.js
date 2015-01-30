/**
 * Created by tigran on 1/30/15.
 */

module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want
    module_holder["index"] = handler;
};

function handler(req, res) {
    res.json({"Hello": "Dog !"});
}