var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var config = require("./config");
var responsesMiddleware = require("./middleware/responses");
var userRouter = require("./controllers/user_controller");
var authRouter = require("./controllers/auth_controller");
var opportunityRouter = require("./controllers/opportunityController");
var companyRouter = require("./controllers/company_controller");
var errorHandlerMiddleware = require("./middleware/404_error_handler");
var generateCompanies = require("./utility/create_mockdata");
var generateOpportunities = require("./utility/create_mockopportunities");


// define express app
var app = express();

var ApiExecutionModeEnum = Object.freeze({
    DEV: "dev",
    TEST: "test"
});

function configure(apiExecutionMode) {
    if (apiExecutionMode !== ApiExecutionModeEnum.DEV && apiExecutionMode !== ApiExecutionModeEnum.TEST) {
        throw new Error("Invalid api execution mode. Allowed values are: " + Object.keys(ApiExecutionModeEnum));
    }

    // use morgan (only in dev execution mode) to log HTTP requests to the console
    if (apiExecutionMode === ApiExecutionModeEnum.DEV) {
        app.use(morgan("dev"));
    }

    // configure body parser, which will let us get data from a POST request
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // allows access from all hosts
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    // connect to db depending on the provided execution mode
    mongoose.connect(apiExecutionMode === ApiExecutionModeEnum.DEV ? config.database.dev : config.database.test);

    // add custom methods for sending API responses to res object
    app.use(responsesMiddleware);

    // Register API routes. All routes will be prefixed with /api.
    app.use("/api", userRouter);
    app.use("/api", authRouter);
    app.use("/api", companyRouter);
    app.use("/api", opportunityRouter);

    app.post("/generatecompanies", function(req, res){
        generateCompanies(100);
        res.sendOk();
    });
    app.post("/generateopportunities", function(req, res){
        generateOpportunities(10);
        res.sendOk();
    });


    // add 404 error handling middleware in order to send custom message when no route matches client's request
    app.use(errorHandlerMiddleware);


}

function start(apiExecutionMode) {
    configure(apiExecutionMode);
    app.listen(config.apiServerPort);
}

module.exports = {
    app: app,
    start: start,
    ApiExecutionModeEnum: ApiExecutionModeEnum
};
