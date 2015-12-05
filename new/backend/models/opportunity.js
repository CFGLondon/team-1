var mongoose = require("mongoose");
var Comment = require("../models/comment");

var opportunitySchema = new mongoose.Schema({
    companyId: {
        type: String
    },
    description: {
        type: String
    },
    type: String,
    division: String,
    location: String,
    comments: [Comment.schema]
});

module.exports = mongoose.model("Opportunity", opportunitySchema);