var express = require("express");
var router = express.Router();
var Opportunity = require("../models/opportunity");

router.post("/opportunities", function (req, res) {
    var companyId = req.body.companyId;
    var description = req.body.description;
    var type = req.body.type;
    var division = req.body.division;
    var location = req.body.location;

    var opportunity = new Opportunity({
        companyId: companyId,
        description: description,
        type: type,
        division: division,
        location: location
    });

    opportunity.save(function (err) {
        if (err) return res.sendError(500, err.message);

        res.sendOk()
    });
});

router.get("/opportunities", function (req, res) {
    Opportunity.find({}, function (err, ops) {
        if (err) res.sendError(500, err.message);

        return res.sendOk(ops);
    });
});

router.get("/opportunities/:company_id", function (req, res) {
    Opportunity.find({companyId: req.params.company_id}, function (err, ops) {
        if (err) res.sendError(500, err.message);

        return res.sendOk(ops);
    });
});

module.exports = router;
