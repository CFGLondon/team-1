/**
 * Created by manas on 05-12-2015.
 */

var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    userOrCompanyId: {
        type: String
    },
    body: String,
    timestamp: Number,
    accountType: String
});

module.exports = mongoose.model("Comment", commentSchema);