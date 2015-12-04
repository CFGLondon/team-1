/**
 * Created by manas on 03-12-2015.
 */

var Backbone = require("backbone");
var $ = window.$;
var homeView = require("./views/home");
var navView = require("./views/nav");
var loginView = require("./views/login");
var pageNotFoundView = require("./views/page_not_found");

window.$ = window.jQuery = require("jquery"); // needed in order to make bootstrap's javascript work

var AppRouter = Backbone.Router.extend({
    routes: {
        "home": "showHome",
        "login": "showLogin",
        "*any": "show404"
    },
    showHome: function () {
        homeView.render();
    },
    showLogin: function () {
        loginView.render();
    },
    show404: function () {
        pageNotFoundView.render();
    }
});

module.exports = {
    init: function () {
        navView.render();

        new AppRouter();
        Backbone.history.start();
    }
};