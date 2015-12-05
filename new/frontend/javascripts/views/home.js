/**
 * Created by manas on 03-12-2015.
 */

var Backbone = require("backbone");
var $ = require("jquery");

var HomeView = Backbone.View.extend({
    el: "#content",
    template: $("#home-template").html(),
    render: function () {
        this.$el.html(this.template);
    }
});

module.exports = new HomeView();