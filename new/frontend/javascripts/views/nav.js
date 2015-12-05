/**
 * Created by manas on 03-12-2015.
 */

var Backbone = require("backbone");
var $ = require("jquery");
var swig = require("swig");

var NavView = Backbone.View.extend({
    el: "#nav",
    template: $("#nav-template").html(),
    initialize: function () {
        var self = this;

        $(window).on("hashchange", function () {
            self.selectActiveTab(window.location.hash);
        });
    },
    render: function () {
        //var compiledTemplate = swig.render(this.template, {locals: {user: authController.getUserFromCache()}});
        var compiledTemplate = swig.render(this.template);
        this.$el.html(compiledTemplate);

        // select active tab before any hash change event occurs
        this.selectActiveTab(window.location.hash);
    },
    selectActiveTab: function (hash) {
        var self = this;

        var tabs = self.$el.find(".nav-tab");
        tabs.each(function (index) {
            var $tab = $(tabs[index]);

            if ($tab.attr("href") == hash) {
                $tab.parent("li").addClass("active");
            } else {
                $tab.parent("li").removeClass("active");
            }
        });
    }
});

module.exports = new NavView();