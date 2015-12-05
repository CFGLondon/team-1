/**
 * Created by manas on 05-12-2015.
 */

var mongoose = require("mongoose");

var opportunitySchema = new mongoose.Schema({
    companyId: {
        type: String
    },
    description: {
        type: String
    },
    type: String,
    division: String,
    location: String
});

module.exports = mongoose.model("Opportunity", opportunitySchema);