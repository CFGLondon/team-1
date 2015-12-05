/**
 * Created by manas on 03-12-2015.
 */

var Backbone = require("backbone");
var $ = window.$;
var homeView = require("./views/home");
var navView = require("./views/nav");
var loginView = require("./views/login");
var createAccountView = require("./views/create_account");
var meView = require("./views/me");
var authController = require("./network/auth_controller");
var pageNotFoundView = require("./views/page_not_found");

window.$ = window.jQuery = require("jquery"); // needed in order to make bootstrap's javascript work

var AppRouter = Backbone.Router.extend({
    routes: {
        "home": "showHome",
        "login": "showLogin",
        "logout": "logout",
        "create-account": "showCreateAccount",
        "me": "showMe",
        "*any": "show404"
    },
    showMe: function () {
        if (authController.isAuthenticated()) {
            meView.render();
        } else {
            this.navigate("login", true);
        }
    },
    showHome: function () {
        homeView.render();
    },
    showLogin: function () {
        if (authController.isAuthenticated()) {
            this.navigate("home", true);
        } else {
            loginView.render();
        }
    },
    showCreateAccount: function () {
        if (authController.isAuthenticated()) {
            this.navigate("home", true);
        } else {
            createAccountView.render();
        }
    },
    logout: function () {
        if (authController.isAuthenticated()) {
            authController.logout();
        } else {
            this.navigate("login", true);
        }
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