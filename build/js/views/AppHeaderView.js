var AppHeaderView = Backbone.View.extend({
    el: "header",
    events: {
        "click .fob": "togglePanel",
        "click .options > div": "updateFilter",
        "click .prefix": "reset"
    },
    initialize: function () {

    },
    render: function () {

    },
    togglePanel: function () {
        this.$el.find('.options').fadeToggle(150);
    },
    updateFilter: function (e) {
        var $target = $(e.target);
        this.$el.find(".options .selected").removeClass("selected");
        $target.addClass("selected");
        this.$el.find(".current").html($target.html());
        this.$el.find(".options").fadeToggle(100);
        this.$el.trigger("filter:change", $target.data("filter"));
    },
    reset: function () {
        console.log('home');
        window.location.hash = "";
    }
});