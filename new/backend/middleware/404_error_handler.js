module.exports = function (req, res) {
    req.statusCode = 404;
    return res.sendError(404, "The requested URL was not found.");
};