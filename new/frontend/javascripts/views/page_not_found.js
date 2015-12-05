/**
 * Created by manas on 03-12-2015.
 */

var Backbone = require("backbone");
var $ = require("jquery");
var swig = require("swig");

var PageNotFoundView = Backbone.View.extend({
    el: "#content",
    template: $("#404-template").html(),
    render: function () {
        var compiledTemplate = swig.render(this.template);
        this.$el.html(compiledTemplate);
    }
});

module.exports = new PageNotFoundView();