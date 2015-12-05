var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var companySchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    type: String,
    description: String
});

companySchema.methods.hashPassword = function (callback) {
    var self = this;

    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return callback(err);

        bcrypt.hash(self.password, salt, null, function (err, hash) {
            if (err)
                return callback(err);

            self.password = hash;

            return callback(null);
        });
    });
};

module.exports = mongoose.model("Company", companySchema);