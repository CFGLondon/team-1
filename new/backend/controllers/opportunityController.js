var express = require("express");
var router = express.Router();
var Opportunity = require("../models/opportunity");
var Comment = require("../models/comment");

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

router.post("/opportunities/:opportunity_id/comments", function (req, res) {
    var userOrCompanyId = req.body.userOrCompanyId;
    var body = req.body.body;
    var timestmamp = req.body.timestamp;
    var accountType = req.body.accountType;

    var comment = new Comment({
        userOrCompanyId: userOrCompanyId,
        body: body,
        timestamp:timestmamp,
        accountType: accountType
    });

    Opportunity.findById(req.params.opportunity_id, function (err, op) {
        op.comments.push(comment);
        op.save(function (err) {
           return res.sendOk();
        });
    });
});

module.exports = router;
